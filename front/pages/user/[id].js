import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card } from "antd";
import { END } from "redux-saga";
import Head from "next/head";
import { useRouter } from "next/router";
import {backUrl} from '../../config/config'
import axios from "axios";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";
import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import AppLayout2 from "../../components/AppLayout2";

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { mainPosts, hasMorePosts, loadUserPostsLoading } = useSelector(
    (state) => state.post
  );
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadUserPostsLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId:
              mainPosts[mainPosts.length - 1] &&
              mainPosts[mainPosts.length - 1].id,
            data: id,
          });
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length, hasMorePosts, id]);

  return (
    <AppLayout2 menuKey={'2'}>
      {userInfo && (
        <Head>
          <title>
            {userInfo.nickname}
            님의 글
          </title>
          <meta
            name="description"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:title"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:description"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:image"
            content="http://localhost:3060/favicon.ico"
          />
          <meta property="og:url" content={`http://localhost:3060/user/${id}`} />
        </Head>
      )}
      {userInfo ? (
        <Card
          actions={[
            <div>
            
            <span key="twit">
              게시글
              <br />
              {userInfo.Posts.length}
            </span>

            </div>,

            <div key="followings">
            <span >
              팔로잉
              <br />
              {userInfo.Followings.length}
            </span>
            </div>,

            <div key="followers">
            <span >
              팔로워
              <br />
              {userInfo.Followers.length}
            </span>
            </div>
          ]}
        >
          <Card.Meta
            avatar={<Avatar
              size={40}
                    src={`${backUrl}/${userInfo.Image.src}`}
            ></Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : null}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout2>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   async (context) => {
//     const cookie = context.req ? context.req.headers.cookie : "";
//     axios.defaults.headers.Cookie = "";
//     if (context.req && cookie) {
//       axios.defaults.headers.Cookie = cookie;
//     }
//     context.store.dispatch({
//       type: LOAD_USER_POSTS_REQUEST,
//       data: context.params.id,
//     });
//     context.store.dispatch({
//       type: LOAD_MY_INFO_REQUEST,
//     });
//     context.store.dispatch({
//       type: LOAD_USER_REQUEST,
//       data: context.params.id,
//     });
//     context.store.dispatch(END);
//     await context.store.sagaTask.toPromise();
//     console.log("getState", context.store.getState().post.mainPosts);
//     return { props: {} };
//   }
// );

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default User;
