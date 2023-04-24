import type { Post } from "@/@type/post";
import { api } from "@/utils/api";
import { RelativeTime } from "@primer/react";
import * as Popover from "@radix-ui/react-popover";
import { type Session } from "next-auth";
import { DotsThreeVertical, Link } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { DeleteButton } from "./Post/DeleteButton";
import { EditButton } from "./Post/EditButton";
import { Tag } from "./Tag";

type PostProps = {
  data: Post;
  isLast: boolean;
  user: Session["user"] | undefined;
  onDelete?: () => void;
  onEdit?: (content: string) => void;
  fetchMore?: () => void;
};

export function Post({
  data,
  isLast,
  user,
  onDelete,
  onEdit,
  fetchMore,
}: PostProps) {
  const postRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!postRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (isLast && entry?.isIntersecting && fetchMore) {
        fetchMore();
        observer.unobserve(entry.target);
      }
    });

    observer.observe(postRef.current);
  }, [isLast]);

  const { mutate: deletePost } = api.post.delete.useMutation();
  const { mutate: editPost, isLoading: isEditingPost } =
    api.post.edit.useMutation();
  const { mutate: toggleLike } = api.post.setLikeState.useMutation();
  const [_userLiked, setUserLiked] = useState(
    user ? data.likes.some((like) => like.authorId === user.id) : false
  );
  const [likeCount, setLikeCount] = useState(data.likes.length);

  function handleDeleteButtonClick() {
    deletePost({ id: data.id });
    onDelete?.();
  }

  function handleEditButtonClick(content: string) {
    editPost({ id: data.id, content });
    onEdit?.(content);
  }

  function handleLikeButtonClick() {
    if (!user) {
      return;
    }
    toggleLike({ postId: data.id, liked: !_userLiked });
    setLikeCount((oldState) =>
      _userLiked ? (oldState -= 1) : (oldState += 1)
    );
    setUserLiked((oldState) => !oldState);
  }

  const hasDeletePerm =
    user?.id === data.authorId || user?.roles.includes("admin");
  const hasEditPerm = user?.id === data.authorId;

  return (
    <div
      ref={postRef}
      className="flex h-fit w-full gap-3 rounded-md border border-zinc-800 p-5 md:w-[600px]"
    >
      <Avatar size={36} source={data.author.image ?? ""} />
      <div className="w-full overflow-hidden break-words">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex w-max items-center gap-3">
            <p className="font-semibold">{data.author.name ?? "Unknown"}</p>
            <RelativeTime
              className="text-sm text-zinc-500"
              date={data.created_at}
            />
            {data.author.badges.some((badge) => badge.id === "dev") ? (
              <Tag>DEV</Tag>
            ) : null}
          </div>
          <div>
            <Popover.Root>
              <Popover.Trigger>
                <DotsThreeVertical size={20} />
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="right"
                  align="start"
                  sideOffset={10}
                  className="flex flex-col items-end gap-1 text-zinc-300"
                >
                  <Popover.Close className="w-full">
                    <Button
                      fill
                      onClick={() => {
                        navigator.clipboard
                          .writeText(
                            `${document.location.origin}/post/${data.id}`
                          )
                          .catch(console.error);
                      }}
                    >
                      <Link size={24} />
                      <p>Copy Link</p>
                    </Button>
                  </Popover.Close>
                  {hasEditPerm ? (
                    <EditButton
                      content={data.content}
                      isEditingPost={isEditingPost}
                      onEdit={handleEditButtonClick}
                    />
                  ) : null}
                  {hasDeletePerm ? (
                    <DeleteButton onConfirm={handleDeleteButtonClick} />
                  ) : null}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="overflow-hidden text-ellipsis text-zinc-300">
            {data.content}
            {data.edited ? (
              <span className="ml-3 text-sm text-zinc-500">(Edited)</span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              active={_userLiked}
              disabled={!user}
              onClick={handleLikeButtonClick}
            >
              👍 {likeCount}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
