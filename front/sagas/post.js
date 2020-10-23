import axios from "axios";

import {
  delay,
  put,
  takeLatest,
  all,
  fork,
  throttle,
  call,
  takeEvery
} from "redux-saga/effects";
import {
  ADD_REPORT_FAILURE,
  ADD_REPORT_REQUEST,
  ADD_REPORT_SUCCESS,

  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,



  ADD_LEAF_FAILURE,
  ADD_LEAF_REQUEST,
  ADD_LEAF_SUCCESS,

  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,

  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_REQUEST,
  REMOVE_COMMENT_SUCCESS,


  PATCH_POST_FAILURE,
  PATCH_POST_REQUEST,
  PATCH_POST_SUCCESS,
  LOAD_POSTS_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POST_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,

  LOAD_LEAFS_FAILURE,
  LOAD_LEAFS_REQUEST,
  LOAD_LEAFS_SUCCESS,

  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,

  LIKE_COMMENT_FAILURE,
  LIKE_COMMENT_REQUEST,
  LIKE_COMMENT_SUCCESS,
  UNLIKE_COMMENT_FAILURE,
  UNLIKE_COMMENT_REQUEST,
  UNLIKE_COMMENT_SUCCESS,



  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  PATCH_UPLOAD_IMAGES_FAILURE,
  PATCH_UPLOAD_IMAGES_REQUEST,
  PATCH_UPLOAD_IMAGES_SUCCESS,
  RETWEET_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
} from "../reducers/post";

import { ADD_POST_OF_ME, REMOVE_POST_OF_ME } from "../reducers/user";

// POST /post/images
function uploadImagesAPI(data) {
  return axios.post("/post/images", data);
}
function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchUploadImages() {
  yield takeEvery(UPLOAD_IMAGES_REQUEST, uploadImages);
}

// POST /post/images (PatchImagePaths)
function patchUploadImagesAPI(data) {
  return axios.post("/post/images", data);
}
function* patchUploadImages(action) {
  try {
    const result = yield call(patchUploadImagesAPI, action.data);

    yield put({
      type: PATCH_UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: PATCH_UPLOAD_IMAGES_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchPatchUploadImages() {
  yield takeLatest(PATCH_UPLOAD_IMAGES_REQUEST, patchUploadImages);
}

// POST /post
function addPostAPI(data) {
  return axios.post("/post", data);
}
function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);

    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_OF_ME,
      data: result.data.id,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: ADD_POST_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

// DELETE /post/1
function removePostAPI(data) {
  
  return axios.delete(`/post/${data}`);
}
function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);

    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

// PATCH /post/1/
function patchPostAPI(data) {
  return axios.patch(`/post/${data.postId}`,data.formData);
}
function* patchPost(action) {
  try {
    const result = yield call(patchPostAPI, action.data);

    yield put({
      type: PATCH_POST_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: PATCH_POST_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchPatchPost() {
  yield takeLatest(PATCH_POST_REQUEST, patchPost);
}


// POST /post/1/comment
function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}
function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);

    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

// DELETE /post/2/comment/2
function removeCommentAPI(data) {
  return axios.delete(`/post/${data.postId}/comment/${data.itemId}`);
}
function* removeComment(action) {
  try {
    const result = yield call(removeCommentAPI, action.data);

    yield put({
      type: REMOVE_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: REMOVE_COMMENT_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchRemoveComment() {
  yield takeLatest(REMOVE_COMMENT_REQUEST, removeComment);
}

// PATCH /post/1/like
function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}
function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);

    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
    console.log(result.data);
  } catch (error) {
    console.error(error);
    yield put({
      type: LIKE_POST_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}


// DELETE /post/1/like
function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}
function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);

    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

// PATCH /post/1/comment/1/like
function likeCommentAPI(data) {
  return axios.patch(`/post/${data.postId}/comment/${data.itemId}/like`);
}
function* likeComment(action) {
  try {
    const result = yield call(likeCommentAPI, action.data);

    yield put({
      type: LIKE_COMMENT_SUCCESS,
      data: result.data,
    });
    console.log(result.data);
  } catch (error) {
    console.error(error);
    yield put({
      type: LIKE_COMMENT_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchLikeComment() {
  yield takeLatest(LIKE_COMMENT_REQUEST, likeComment);
}

// DELETE /post/1/comment/1/like
function unlikeCommentAPI(data) {
  return axios.delete(`/post/${data.postId}/comment/${data.itemId}/like`);
}
function* unlikeComment(action) {
  try {
    const result = yield call(unlikeCommentAPI, action.data);

    yield put({
      type: UNLIKE_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UNLIKE_COMMENT_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchUnlikeComment() {
  yield takeLatest(UNLIKE_COMMENT_REQUEST, unlikeComment);
}



// POST /post/1/retweet
function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);
}
function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);

    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: RETWEET_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

// GET /post/1
function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}
function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

//GET /posts
function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}
function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.lastId);

    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchLoadPosts() {
  yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}

// GET /hastag/노드
function loadHashtagPostsAPI(data, lastId) {
  return axios.get(
    `/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`
  );
}
function* loadHashtagPosts(action) {
  try {
    console.log("load hashtag 111111111111");
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);

    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
    console.log(`1111111111${result}`)
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

// GET /user/2/posts
function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}
function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId); //action.data = id (동적라우팅)

    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}


//Post /leaf

function addLeafAPI(data) {
  return axios.post(`/leaf`,data);
}
function* addLeaf(action) {
  try {
    const result = yield call(addLeafAPI, action.data); 

    yield put({
      type: ADD_LEAF_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: ADD_LEAF_FAILURE,
      error: error.response.data,
    });
  }
}
function* watchAddLeaf() {
  yield takeLatest(ADD_LEAF_REQUEST, addLeaf);
}

//Get /leaf

function loadLeafsAPI(data) {
  return axios.get(`/leaf`,data);
}
function* loadLeafs(action) {
  try {
    const result = yield call(loadLeafsAPI, action.data); 

    yield put({
      type: LOAD_LEAFS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_LEAFS_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchLoadLeafs() {
  yield takeLatest(LOAD_LEAFS_REQUEST, loadLeafs);
}

//POST /post/report

function addReportAPI(data) {
  return axios.post(`/post/report`,data);
}
function* addReport(action) {
  try {
    const result = yield call(addReportAPI, action.data); 

    yield put({
      type: ADD_REPORT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_REPORT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchAddReport() {
  yield takeLatest(ADD_REPORT_REQUEST, addReport);
}






export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchLoadPosts),
    fork(watchLoadPost),
    fork(watchRemovePost),
    fork(watchRemoveComment),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchLikeComment),
    fork(watchUnlikeComment),
    fork(watchUploadImages),
    fork(watchPatchUploadImages),
    fork(watchRetweet),
    fork(watchPatchPost),
    fork(watchAddLeaf),
    fork(watchLoadLeafs),
    fork(watchAddReport)
  ]);
}
