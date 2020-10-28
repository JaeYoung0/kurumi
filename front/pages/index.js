import react, { useEffect} from "react";

import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import AppLayout2 from "../components/AppLayout2";

import PostCard from "../components/PostCard";

import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import Head from 'next/head'

import wrapper from "../store/configureStore";
import { LOAD_POSTS_REQUEST,LOAD_LEAFS_REQUEST } from "../reducers/post";
import { END } from "redux-saga";
import axios from "axios";





const Home = () => {
  
  const { mainPosts, hasMorePost, loadPostIng, retweetError } = useSelector(
    (state) => state.post
  );
  const {logInDone} = useSelector(state => state.user)
  const dispatch = useDispatch();

  // 인피니트 스크롤
  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 400
      ) {
        if (hasMorePost && !loadPostIng) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts, hasMorePost, loadPostIng]);

  useEffect(() => {
    dispatch({
      type:LOAD_MY_INFO_REQUEST
    })
  }, [logInDone])

  // 리트윗 에러 => alert
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  return (
    
    <>
      <Head>
        <title>Timeline | Kurumi</title>
      </Head>

      
      <AppLayout2 menuKey={'2'}>
         {mainPosts.map((post, index) => <PostCard key={post.id} post={post} />)} 
      </AppLayout2>
    </>
  );
};

// Home 컴포넌트보다 먼저 실행되서 SSR로 깜빡임 없이 화면을 구현해주는 ---- getServerSideProps
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    // store로 보낸 dispatch는 HYDRATE가 받는다.
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_LEAFS_REQUEST,
    });

    // redux-saga의 END는 dispatch해서 SUCCESS해가지고 결과를 가져와서 화면에 그리기까지 기다리게 해줌
    context.store.dispatch(END);
    
    await context.store.sagaTask.toPromise();
    // return {props:{data:mainPosts}}
  }
);

export default Home;
