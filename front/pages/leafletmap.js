import React, { useEffect,useCallback,useState } from "react";
import AppLayout2 from "../components/AppLayout2";
import Head from "next/head";
import FollowList from "../components/FollowList";
import NicknameEditForm from "../components/NicknameEditForm";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
} from "../reducers/user";


import useSWR,{useSWRInfinite} from 'swr'
import axios from 'axios'
import wrapper from "../store/configureStore";
import { LOAD_MY_INFO_REQUEST, SIGN_IN_REQUEST } from "../reducers/user";
import {LOAD_LEAFS_REQUEST,LOAD_POSTS_REQUEST} from '../reducers/post'
import dynamic from 'next/dynamic'
import { END } from "redux-saga";
import PostForm from '../components/PostForm'

// no SSR 
const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/LeafletMapComponent'),
  { ssr: false }
)




const LeafletMap = () => {
  const { me } = useSelector((state) => state.user);
  useEffect(() => {
    if (!me?.id) {
      Router.push("/");
    }
  }, [me?.id]);

  return (
    
    <>
      <Head>
        <title>구름지도 | 구르미</title>
      </Head>
      <AppLayout2 menuKey={'3'}>

        <DynamicComponentWithNoSSR />
        
      </AppLayout2>
      
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
   
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
  
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_LEAFS_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });

  
    context.store.dispatch(END);
    
    await context.store.sagaTask.toPromise();
  }
);

export default LeafletMap;
