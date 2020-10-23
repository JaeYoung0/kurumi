import { HYDRATE } from "next-redux-wrapper";
import produce from "../util/produce";

export const initialState = {
  userInfo: null,
  me: null,
  followIng: false, // 팔로우 시도중
  followDone: false,
  followError: null,
  unfollowIng: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,
  logInIng: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  logOutIng: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpIng: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  changeNicknameIng: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,
  loadMyInfoIng: false, // 팔로우 시도중
  loadMyInfoDone: false,
  loadMyInfoError: null,
  loadFollowersIng: false,
  loadFollowersDone: false,
  loadFollowersError: null,
  loadFollowingsIng: false,
  loadFollowingsDone: false,
  loadFollowingsError: null,

  updateAvatarLoading: false,
  updateAvatarDone: false,
  updateAvatarError: null,
};

// Actions string ====================================================

export const UPDATE_AVATAR_REQUEST = "UPDATE_AVATAR_REQUEST";
export const UPDATE_AVATAR_SUCCESS = "UPDATE_AVATAR_SUCCESS";
export const UPDATE_AVATAR_FAILURE = "UPDATE_AVATAR_FAILURE";



export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const CHANGE_NICKNAME_REQUEST = "CHANGE_NICKNAME_REQUEST";
export const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
export const CHANGE_NICKNAME_FAILURE = "CHANGE_NICKNAME_FAILURE";

export const FOLLOW_REQUEST = "FOLLOW_REQUEST";
export const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";
export const FOLLOW_FAILURE = "FOLLOW_FAILURE";

export const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST";
export const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";
export const UNFOLLOW_FAILURE = "UNFOLLOW_FAILURE";

export const ADD_POST_OF_ME = "ADD_POST_OF_ME";
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

export const LOAD_MY_INFO_REQUEST = "LOAD_MY_INFO_REQUEST";
export const LOAD_MY_INFO_SUCCESS = "LOAD_MY_INFO_SUCCESS";
export const LOAD_MY_INFO_FAILURE = "LOAD_MY_INFO_FAILURE";

export const LOAD_FOLLOWERS_REQUEST = "LOAD_FOLLOWERS_REQUEST";
export const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS__SUCCESS";
export const LOAD_FOLLOWERS_FAILURE = "LOAD_FOLLOWERS__FAILURE";

export const LOAD_FOLLOWINGS_REQUEST = "LOAD_FOLLOWINGS_REQUEST";
export const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS";
export const LOAD_FOLLOWINGS_FAILURE = "LOAD_FOLLOWINGS_FAILURE";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

// Action creator =============================================
export const loginRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,
  };
};

export const logoutRequestAction = (data) => {
  return {
    type: LOG_OUT_REQUEST,
  };
};

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {

      case UPDATE_AVATAR_REQUEST:
        draft.updateAvatarLoading = true;
        draft.updateAvatarError = null;
        draft.updateAvatarDone = false;
        break;
      case UPDATE_AVATAR_SUCCESS:
        draft.updateAvatarLoading = false;
        draft.me.Image = action.data;
        draft.updateAvatarDone = true;
        break;
      case UPDATE_AVATAR_FAILURE:
        draft.updateAvatarLoading = false;
        draft.updateAvatarError = action.error;
        break;


      case LOAD_USER_REQUEST:
        draft.loadUserLoading = true;
        draft.loadUserError = null;
        draft.loadUserDone = false;
        break;
      case LOAD_USER_SUCCESS:
        draft.loadUserLoading = false;
        draft.userInfo = action.data;
        draft.loadUserDone = true;
        break;
      case LOAD_USER_FAILURE:
        draft.loadUserLoading = false;
        draft.loadUserError = action.error;
        break;

      case LOG_IN_REQUEST:
        draft.logInIng = true;
        break;
      case LOG_IN_SUCCESS:
        draft.logInIng = false;
        draft.logInDone = true;
        draft.me = action.data;
        break;
      case LOG_IN_FAILURE:
        draft.logInIng = false;
        draft.logInError = action.error;
        break;
      case LOG_OUT_REQUEST:
        draft.logOutIng = true;
        draft.logOutDone = false;
        draft.logOutError = null;
        break;
      case LOG_OUT_SUCCESS:
        draft.logOutIng = false;
        draft.logOutDone = true;
        draft.me = action.data;
        break;
      case LOG_OUT_FAILURE:
        draft.logoutIng = false;
        draft.logOutError = action.error;

        break;

      case SIGN_UP_REQUEST:
        draft.signUpIng = true;
        draft.signUpDone = false;
        draft.signUpError = null;
        break;
      case SIGN_UP_SUCCESS:
        draft.signUpIng = false;
        draft.signUpDone = true;
        draft.me = action.data;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpIng = false;
        draft.signUpError = action.error;
        break;

      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameIng = true;
        draft.changeNicknameError = null;
        draft.changeNicknameDone = false;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.changeNicknameIng = false;
        draft.changeNicknameDone = true;
        draft.me.nickname = action.data.nickname;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameIng = false;
        draft.changeNicknameError = action.error;
        break;

      case ADD_POST_OF_ME:
        draft.me.Posts.unshift(action.data);
        break;
      case REMOVE_POST_OF_ME:
        draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.PostId);
        break;

      case FOLLOW_REQUEST:
        draft.followIng = true;
        break;
      case FOLLOW_SUCCESS:
        draft.followIng = false;
        draft.followDone = false;
        draft.me.Followings.push({ id: action.data.UserId });
        break;
      case FOLLOW_FAILURE:
        draft.followIng = false;
        draft.followError = action.error;
        break;

      case UNFOLLOW_REQUEST:
        draft.unfollowIng = true;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowIng = false;
        draft.unfollowDone = false;
        draft.me.Followings = draft.me.Followings.filter(
          (v) => v.id !== action.data.UserId
        );
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowIng = false;
        draft.unfollowDone = false;
        draft.unfollowError = action.error;
        break;

      case LOAD_MY_INFO_REQUEST:
        draft.loadMyInfoIng = true;
        draft.loadMyInfoDone = false;
        draft.loadMyInfoError = null;
        break;
      case LOAD_MY_INFO_SUCCESS:
        draft.loadMyInfoIng = false;
        draft.me = action.data;
        draft.loadMyInfoDone = true;
        break;
      case LOAD_MY_INFO_FAILURE:
        draft.loadMyInfoIng = false;
        draft.loadMyInfoError = action.error;
        break;

      case LOAD_FOLLOWERS_REQUEST:
        draft.loadFollowersIng = true;
        draft.loadFollowersDone = false;
        draft.loadFollowersError = null;
        break;
      case LOAD_FOLLOWERS_SUCCESS:
        draft.loadFollowersIng = false;
        draft.me.Followers = action.data;
        draft.loadFollowersDone = true;
        break;
      case LOAD_FOLLOWERS_FAILURE:
        draft.loadFollowersIng = false;
        draft.loadFollowersError = action.error;
        break;

      case LOAD_FOLLOWINGS_REQUEST:
        draft.loadFollowingsIng = true;
        draft.loadFollowingsDone = false;
        draft.loadFollowingsError = null;
        break;
      case LOAD_FOLLOWINGS_SUCCESS:
        draft.loadFollowingsIng = false;
        draft.me.Followings = action.data;
        draft.loadFollowingsDone = true;
        break;
      case LOAD_FOLLOWINGS_FAILURE:
        draft.loadFollowingsIng = false;
        draft.loadFollowingsError = action.error;
        break;

      default:
        break;
    }
  });
};

export default reducer;
