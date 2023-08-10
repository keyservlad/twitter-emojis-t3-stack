import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { RouterOutputs, api } from "~/utils/api";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { useState } from "react";

const CreatePostWizard = () => {
  const { data: user } = useSession();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutateAsync: createPost, isLoading: isPosting } =
    api.posts.create.useMutation({
      onSuccess: () => {
        setInput("");
        ctx.posts.getAll.invalidate();
      },
    });

  if (!user) return null;

  console.log(user);

  return (
    <div className="flex w-full gap-3">
      {!user.user.image ? (
        <div className="relative h-14 w-14 rounded-full bg-slate-200" />
      ) : (
        <div className="relative h-14 w-14">
          <Image
            src={user.user?.image}
            width={56}
            height={56}
            quality={100}
            alt="user image"
            className="rounded-full"
          />
        </div>
      )}
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        disabled={isPosting}
      />
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => {
          createPost({ content: input });
        }}
      >
        Post
      </button>
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.image}
        width={56}
        height={56}
        quality={100}
        alt="author image"
        className="rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span className="">{`@${author.name}`}</span>
          <span className="font-thin">· {dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: isPostsLoading } = api.posts.getAll.useQuery();

  if (isPostsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { data: sessionData, status: userLoaded } = useSession();

  // start fetching asap
  api.posts.getAll.useQuery();

  // return empty div if user is loading and posts are loading as user thends to load first
  if (userLoaded === "loading") return <div />;

  return (
    <>
      <Head>
        <title>Twitter emojis</title>
        <meta name="description" content="twitter but only with emojis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex justify-center border-b border-slate-400 p-4">
            {sessionData ? (
              <CreatePostWizard />
            ) : (
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={
                  sessionData ? () => void signOut() : () => void signIn()
                }
              >
                {sessionData ? "Sign out" : "Sign in"}
              </button>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
