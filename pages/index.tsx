import React, { Suspense, useState } from "react";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { flex_css } from "../shared/styles/shared";
import styles from "../styles/Home.module.css";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import CategoryContent from "../src/product_list/components/CategoryContent";
import Loading from "../src/shared/component/Loading";
import dynamic from "next/dynamic";
import { getPrefetchList } from "../src/product_list/remotes";
import Container from "../src/shared/component/Container";
import { useSearchContext } from "../src/context/SearchContext";
import AsyncBoundary from "../src/shared/async/AsyncBoundary";

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await getPrefetchList();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const ListContent = dynamic(
  () => import("../src/product_list/components/ListContent"),
  {
    suspense: true,
  }
);

const Home: NextPage = () => {
  const { keyword } = useSearchContext();
  return (
    <div>
      <Head>
        <title>너와 나의 HANDMADE</title>
        <meta
          name="description"
          content="개인 브랜드의 옷을 맞춤으로 구매할 수 있는 쇼핑몰 입니다."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main css={[flex_css.flex_row]}>
          {!keyword && <CategoryContent />}
          <AsyncBoundary>
            <ListContent />
          </AsyncBoundary>
        </main>
      </Container>
    </div>
  );
};

export default Home;
