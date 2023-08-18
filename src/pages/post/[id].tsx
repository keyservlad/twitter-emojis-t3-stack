import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "~/components/loading";
import { api } from "~/utils/api";

import PageLayout from "~/components/layout";
import Image from "next/image";
import { PostView } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: dataSet, isLoading } = api.posts.getById.useQuery({
    id,
  });

  if (isLoading) {
    console.log("loading"); // never hit bc of ssg
    return <LoadingPage />;
  }

  if (!dataSet || typeof dataSet[0] === "undefined") return <div>404</div>;

  const data = dataSet[0];

  return (
    <>
      <Head>
        <title>{`${data.post.content} -  ${data.author.name}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSGHelper();

  const id = context.params?.id as string;

  if (typeof id !== "string") throw new Error("id is not a string");

  await helpers.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePostPage;
