import type { Post } from "@/@type/post";
import { api } from "@/utils/api";
import * as Popover from "@radix-ui/react-popover";
import { useSession } from "next-auth/react";
import { DotsThreeVertical } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Tag } from "./Tag";

type PostProps = {
  data: Post;
  isLast: boolean;
  onDelete?: () => void;
  fetchMore?: () => void;
};

export function Post({ data, isLast, onDelete, fetchMore }: PostProps) {
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

  const { data: session } = useSession();
  const { mutate: deletePost } = api.post.delete.useMutation();
  const { mutate: toggleLike } = api.post.setLikeState.useMutation();
  const [userLiked, setUserLiked] = useState(
    session
      ? data.likes.some((like) => like.authorId === session.user.id)
      : false
  );
  const [likeCount, setLikeCount] = useState(data.likes.length);

  function handleDeleteButtonClick() {
    deletePost({ id: data.id });
    onDelete?.();
  }

  function handleLikeButtonClick() {
    if (!session) {
      return;
    }
    toggleLike({ postId: data.id, liked: !userLiked });
    setLikeCount((oldState) => (userLiked ? (oldState -= 1) : (oldState += 1)));
    setUserLiked((oldState) => !oldState);
  }

  return (
    <div
      ref={postRef}
      className="flex h-fit gap-3 rounded-md border border-zinc-800 p-5"
    >
      <Avatar size={36} source={data.author.image ?? ""} />
      <div className="w-full overflow-hidden break-words">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="w-full font-semibold">
              {data.author.name ?? "Unknown"}
            </p>
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
                  sideOffset={10}
                  className="rounded-md border-zinc-700 bg-zinc-800 text-zinc-300"
                >
                  {session?.user.id === data.authorId ||
                  session?.user.roles.includes("admin") ? (
                    <Button onClick={handleDeleteButtonClick}>Deletar</Button>
                  ) : (
                    <p className="m-3">No Actions</p>
                  )}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="overflow-hidden text-ellipsis text-zinc-300">
            {data.content}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              active={userLiked}
              disabled={!session}
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
