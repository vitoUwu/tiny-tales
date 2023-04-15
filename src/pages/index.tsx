import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import type { Post as PostType } from "@/@type/post";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Feed } from "@/components/Feed";
import { TextInput } from "@/components/Inputs/Text";
import { Loading } from "@/components/Loading";
import { Post } from "@/components/Post";
import { api } from "@/utils/api";
import { FileX, PaperPlaneRight } from "phosphor-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);

  const textInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const utils = api.useContext();

  const postInfiniteQuery = api.post.fetch.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { mutateAsync: createPost, isLoading: isCreatingPost } =
    api.post.create.useMutation({
      onError: () => {
        alert("An Error has occured while creating your post");
        utils.post.fetch.invalidate().catch(console.error);
      },
    });

  const addPosts = useCallback((incoming: PostType[]) => {
    setPosts((oldState) => {
      const map = new Map<string, PostType>();
      for (const post of oldState) {
        map.set(post.id, post);
      }
      for (const post of incoming) {
        map.set(post.id, post);
      }

      return [...map.values()].sort((a, b) =>
        a.created_at > b.created_at ? -1 : 1
      );
    });
  }, []);

  async function handleCreatePostButtonClick() {
    if (!textInputRef.current || !textInputRef.current.value) return;
    const post = await createPost({ content: textInputRef.current.value });
    addPosts([post]);
    textInputRef.current.value = "";
  }

  useEffect(() => {
    const posts =
      postInfiniteQuery.data?.pages.flatMap((page) => page.posts) ?? [];
    addPosts(posts);
  }, [postInfiniteQuery.data?.pages, addPosts]);

  return (
    <>
      <Head>
        <title>Tiny Tales</title>
        <meta name="description" content="Generated by create-t3-app" />
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
        <Feed>
          {postInfiniteQuery.isLoading ? (
            <Loading size={64} />
          ) : posts.length ? (
            posts.map((post, index) => (
              <Post
                key={post.id}
                data={post}
                isLast={index === posts.length - 1}
                fetchMore={() => {
                  if (postInfiniteQuery.hasNextPage) {
                    postInfiniteQuery.fetchNextPage().catch(console.error);
                  }
                }}
                onDelete={() => {
                  setPosts((oldState) =>
                    oldState.filter((p) => p.id !== post.id)
                  );
                }}
              />
            ))
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <FileX size={64} />
              <h1 className="text-3xl font-bold">
                Apparently no one created a post yet...
              </h1>
              <p className="text-zinc-400">
                {session.data ? "C" : "Log In and c"}
                reate your first post typing something and hitting the create
                button
              </p>
            </div>
          )}
          {postInfiniteQuery.hasNextPage ? (
            postInfiniteQuery.isFetchingNextPage ? (
              <Loading size={32} />
            ) : null
          ) : posts.length ? (
            <footer className="text-center text-zinc-500">
              <p>🥳 Congratulation! You saw all created posts on Tiny Tales</p>
            </footer>
          ) : null}
        </Feed>
        {session.data ? (
          <div className="flex w-full gap-3">
            <TextInput
              autoComplete="false"
              disabled={isCreatingPost}
              ref={textInputRef}
              placeholder="Criar post..."
              name="createPost"
            />
            <Button
              name="Criar Post"
              disabled={isCreatingPost}
              onClick={() => {
                handleCreatePostButtonClick().catch(console.error);
              }}
            >
              {isCreatingPost ? (
                <Loading size={24} />
              ) : (
                <PaperPlaneRight size={24} />
              )}
            </Button>
          </div>
        ) : null}
      </main>
    </>
  );
}