import { type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Twitter emojis</title>
        <meta name="description" content="twitter but only with emojis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          Profile View
        </div>
      </main>
    </>
  );
};

export default SinglePostPage;
