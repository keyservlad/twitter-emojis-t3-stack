import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { RouterOutputs, api } from "~/utils/api";
import Image from "next/image";

const CreatePostWizard = () => {
  const { data: user } = useSession();

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
      />
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
        <span className="">{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;

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
          <div className="flex flex-col">
            {data.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
