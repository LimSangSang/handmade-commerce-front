import React, { SetStateAction, useEffect, useState } from "react";
import { useProductItem } from "../../src/product_item/remotes";
import Product from "../../src/product_item/component/Product";
import ProductInfo from "../../src/product_item/component/ProductInfo";
import { ProductType } from "../../src/product_list/interface";
import ProductImage from "../../src/product_item/component/ProductImage";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getProductItem, getAllList } from "../../src/hook/product";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import Container from "../../src/shared/component/Container";
import css from "@emotion/react";
import Head from "next/head";

interface IParams extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths = async () => {
  const { list } = await getAllList(); // page, keyword, all
  const paths = list?.map((x: ProductType) => {
    return {
      params: { id: x.id?.toString() },
    };
  });
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();

  const { id } = context.params as IParams;
  await queryClient.prefetchQuery(["product"], () => getProductItem(id));
  // const data = await getProductItem(id);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id,
      // data,
    },
  };
};

const ProdouctItem = ({
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data } = useProductItem(id);

  return (
    <div>
      <Head>
        <title>{data?.name}</title>
        <meta name="description" content={`${data?.brand} ${data?.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Product>
          <Product.Head>
            <Product.HeadLeft>
              <ProductImage images={data?.detailImg!} />
            </Product.HeadLeft>
            <Product.HeadRight>
              <ProductInfo
                name={data?.name}
                brand={data?.brand}
                base_price={data?.base_price}
                id={data?.id}
                mainImg={data?.mainImg}
              />
            </Product.HeadRight>
          </Product.Head>
          {/* <Product.Body>
          <ProductDetailImage images={data?.detailImg} />
        </Product.Body> */}
        </Product>
      </Container>
    </div>
  );
};

export default ProdouctItem;
