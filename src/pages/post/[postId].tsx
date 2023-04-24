import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { DeleteButton } from "@/components/Post/DeleteButton";
import { EditButton } from "@/components/Post/EditButton";
import { Tag } from "@/components/Tag";
import { api } from "@/utils/api";
import { RelativeTime } from "@primer/react";
import * as Popover from "@radix-ui/react-popover";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { DotsThreeVertical } from "phosphor-react";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const session = useSession();

  const { postId } = router.query as { postId: string };
  const postQuery = api.post.fetchById.useQuery(postId);
  const { mutate: deletePost } = api.post.delete.useMutation();
  const { mutate: editPost, isLoading: isEditingPost } =
    api.post.edit.useMutation();
  const { mutate: toggleLike } = api.post.setLikeState.useMutation();
  const [_userLiked, setUserLiked] = useState(
    session.data
      ? postQuery.data?.likes.some(
          (like) => like.authorId === session.data.user.id
        )
      : false
  );
  const [likeCount, setLikeCount] = useState(postQuery.data?.likes.length ?? 0);

  function handleDeleteButtonClick() {
    if (!postQuery.data) {
      return;
    }
    deletePost({ id: postQuery.data.id });
    router.push("/").catch(console.error);
  }

  function handleEditButtonClick(content: string) {
    if (!postQuery.data) {
      return;
    }
    editPost({ id: postQuery.data.id, content });
  }

  function handleLikeButtonClick() {
    if (!session.data || !postQuery.data) {
      return;
    }
    toggleLike({ postId: postQuery.data.id, liked: !_userLiked });
    setLikeCount((oldState) =>
      _userLiked ? (oldState -= 1) : (oldState += 1)
    );
    setUserLiked((oldState) => !oldState);
  }

  const hasEditPerm = session.data?.user.id === postQuery.data?.authorId;
  const hasDeletePerm =
    session.data?.user.id === postQuery.data?.authorId ||
    session.data?.user.roles.includes("admin");

  if (!postQuery.data) {
    return (
      <main className="flex h-screen flex-col gap-4 bg-zinc-900 p-5 text-zinc-200 md:p-10">
        <nav className="sticky flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tiny Tales</h1>
          {session.data ? (
            <Button
              onClick={() => {
                signOut().catch(console.error);
              }}
            >
              {session.data.user.image ? (
                <Avatar size={32} source={session.data.user.image} />
              ) : null}
              <p>{session.data.user.name}</p>
            </Button>
          ) : (
            <Button
              onClick={() => {
                signIn().catch(console.error);
              }}
            >
              Login
            </Button>
          )}
        </nav>
        <div className="flex h-full flex-col items-center justify-center">
          {postQuery.status === "loading" ? (
            <Loading size={80} />
          ) : (
            <h1>An error occured</h1>
          )}
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{postQuery.data.author.name} in Tiny Tales</title>
        <meta name="title" content="vitoo in Tiny Tales" />
        <meta name="description" content={postQuery.data.content} />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tiny-tales.vercel.app/" />
        <meta property="og:title" content="vitoo in Tiny Tales" />
        <meta property="og:description" content={postQuery.data.content} />
        {/* <meta property="og:image" content="" /> */}

        {/* <!-- Twitter --> */}
        {/* <meta property="twitter:card" content="summary_large_image" /> */}
        <meta property="twitter:url" content="https://tiny-tales.vercel.app/" />
        <meta property="twitter:title" content="vitoo in Tiny Tales" />
        <meta property="twitter:description" content={postQuery.data.content} />
        {/* <meta property="twitter:image" content=""></meta> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col gap-4 bg-zinc-900 p-5 text-zinc-200 md:p-10">
        <nav className="sticky flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tiny Tales</h1>
          {session.data ? (
            <Button
              onClick={() => {
                signOut().catch(console.error);
              }}
            >
              {session.data.user.image ? (
                <Avatar size={32} source={session.data.user.image} />
              ) : null}
              <p>{session.data.user.name}</p>
            </Button>
          ) : (
            <Button
              onClick={() => {
                signIn().catch(console.error);
              }}
            >
              Login
            </Button>
          )}
        </nav>
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex h-fit w-full gap-3 rounded-md border border-zinc-800 p-5 md:w-[600px]">
            <Avatar size={36} source={postQuery.data.author.image ?? ""} />
            <div className="w-full overflow-hidden break-words">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex w-max items-center gap-3">
                  <p className="font-semibold">
                    {postQuery.data.author.name ?? "Unknown"}
                  </p>
                  <RelativeTime
                    className="text-sm text-zinc-500"
                    date={postQuery.data.created_at}
                  />
                  {postQuery.data.author.badges.some(
                    (badge) => badge.id === "dev"
                  ) ? (
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
                        {hasEditPerm ? (
                          <EditButton
                            content={postQuery.data.content}
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
                  {postQuery.data.content}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    active={_userLiked}
                    disabled={!session.data}
                    onClick={handleLikeButtonClick}
                  >
                    👍 {likeCount}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
