//rafce

import React, { useEffect} from "react";
import AppLayout2 from "../components/AppLayout2";
import Head from "next/head";

import {useSelector } from "react-redux";
import Router from "next/router";


import UserProfile from '../components/UserProfile';
import axios from 'axios'
import PostCard from '../components/PostCard'

import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { LOAD_POSTS_REQUEST,LOAD_LEAFS_REQUEST } from "../reducers/post";
import { END } from "redux-saga";

const fetcher = (url) => axios.get(url, {withCredentials:true})
.then((result)=>result.data)

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const {mainPosts} = useSelector((state) => state.post);
  const myPosts = me ? mainPosts.filter((v)=> v.UserId === me?.id) : null
  

  

  useEffect(() => {
    if (!me?.id) {
      Router.push("/");
    }
  }, [me?.id]);

  if (!me) {
    return '내 정보 로딩 중...';
  }

  return (
    <>
      <Head>
        <title>Profile | Kurumi</title>
      </Head>
      <AppLayout2 menuKey={'1'}>
        <UserProfile />
        {myPosts.map((post) => <PostCard key={post.id} post={post} />)} 
      </AppLayout2>
    </>
  );
};


export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log("getServerSideProps start");
    console.log(context.req.headers);
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_LEAFS_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    
    context.store.dispatch(END);
    console.log("getServerSideProps end");
    await context.store.sagaTask.toPromise();
    
  }
);

export default Profile;
