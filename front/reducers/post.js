import { HYDRATE } from "next-redux-wrapper";

import produce from "../util/produce";

export const initialState = {
  leafs:[],
  mainPosts: [],
  singlePost: [],
  imagePaths: [],
  PatchimagePaths: [],
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  loadPostsIng: false,
  loadPostsDone: false,
  loadPostsError: null,
  loadLeafsIng: false,
  loadLeafsDone: false,
  loadLeafsError: null,
  hasMorePost: true,
  addPostIng: false,
  addPostDone: false,
  addPostError: null,

  addLeafLoading: false,
  addLeafDone: false,
  addLeafError: null,

  addReportLoading : false,
  addReportDone : false,
  addReportError : null,

  addCommentIng: false,
  addCommentDone: false,
  addCommentError: null,
  // removeCommentIng: false,
  // removeCommentDone: false,
  // removeCommentError: false,
  removePostIng: false,
  removePostDone: false,
  removePostError: null,
  patchPostIng: false,
  patchPostDone: false,
  patchPostError: null,
  likePostIng: false,
  likePostDone: false,
  likePostError: null,
  unlikePostIng: false,
  unlikePostDone: false,
  unlikePostError: null,
  uploadImagesIng: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetIng: false,
  retweetDone: false,
  retweetError: null,
};

export const addPostRequest = (data) => {
  return {
    type: ADD_POST_REQUEST,
    data: data,
  };
};

export const addCommentRequest = (data) => {
  return {
    type: ADD_COMMENT_REQUEST,
    data: data,
  };
};

//=================action string



export const ADD_REPORT_REQUEST = "ADD_REPORT_REQUEST";
export const ADD_REPORT_SUCCESS = "ADD_REPORT_SUCCESS";
export const ADD_REPORT_FAILURE = "ADD_REPORT_FAILURE";

export const LOAD_LEAFS_REQUEST = "LOAD_LEAFS_REQUEST";
export const LOAD_LEAFS_SUCCESS = "LOAD_LEAFS_SUCCESS";
export const LOAD_LEAFS_FAILURE = "LOAD_LEAFS_FAILURE";



export const LOAD_MY_LEAFS_REQUEST = "LOAD_MY_LEAFS_REQUEST";
export const LOAD_MY_LEAFS_SUCCESS = "LOAD_MY_LEAFS_SUCCESS";
export const LOAD_MY_LEAFS_FAILURE = "LOAD_MY_LEAFS_FAILURE";



export const ADD_LEAF_REQUEST = "ADD_LEAF_REQUEST";
export const ADD_LEAF_SUCCESS = "ADD_LEAF_SUCCESS";
export const ADD_LEAF_FAILURE = "ADD_LEAF_FAILURE";

export const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "LOAD_POST_FAILURE";

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

export const LOAD_ONE_POST_REQUEST = "LOAD_ONE_POST_REQUEST";
export const LOAD_ONE_POST_SUCCESS = "LOAD_ONE_POST_SUCCESS";
export const LOAD_ONE_POST_FAILURE = "LOAD_ONE_POST_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const REMOVE_COMMENT_REQUEST = "REMOVE_COMMENT_REQUEST";
export const REMOVE_COMMENT_SUCCESS = "REMOVE_COMMENT_SUCCESS";
export const REMOVE_COMMENT_FAILURE = "REMOVE_COMMENT_FAILURE";

export const PATCH_POST_REQUEST = "PATCH_POST_REQUEST";
export const PATCH_POST_SUCCESS = "PATCH_POST_SUCCESS";
export const PATCH_POST_FAILURE = "PATCH_POST_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const LIKE_COMMENT_REQUEST = "LIKE_COMMENT_REQUEST";
export const LIKE_COMMENT_SUCCESS = "LIKE_COMMENT_SUCCESS";
export const LIKE_COMMENT_FAILURE = "LIKE_COMMENT_FAILURE";

export const UNLIKE_COMMENT_REQUEST = "UNLIKE_COMMENT_REQUEST";
export const UNLIKE_COMMENT_SUCCESS = "UNLIKE_COMMENT_SUCCESS";
export const UNLIKE_COMMENT_FAILURE = "UNLIKE_COMMENT_FAILURE";

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const PATCH_UPLOAD_IMAGES_REQUEST = "PATCH_UPLOAD_IMAGES_REQUEST";
export const PATCH_UPLOAD_IMAGES_SUCCESS = "PATCH_UPLOAD_IMAGES_SUCCESS";
export const PATCH_UPLOAD_IMAGES_FAILURE = "PATCH_UPLOAD_IMAGES_FAILURE";



export const REMOVE_IMAGE = "REMOVE_IMAGE";

export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";



const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {

//======my leafs

     



 //======leafs

      case LOAD_LEAFS_REQUEST:
        case LOAD_MY_LEAFS_REQUEST:
        draft.loadleafsIng = true;
        draft.loadleafsDone = false;
        draft.loadleafsError = null;
        break;

      case LOAD_LEAFS_SUCCESS:
        case LOAD_MY_LEAFS_SUCCESS:
        draft.loadleafsIng = false;
        draft.loadleafsDone = true;
        draft.leafs = action.data
        break;

      case LOAD_LEAFS_FAILURE:
        case LOAD_MY_LEAFS_FAILURE:
        draft.loadleafsIng = false;
        draft.loadleafsError = action.error;
        break;

 //===

      case LOAD_POST_REQUEST:
        
        draft.loadPostIng = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
        break;
      case LOAD_POST_SUCCESS:
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        draft.singlePost = action.data;
        break;
      

      case LOAD_POST_FAILURE:
        
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;

      // 최초로드===================================================
      case LOAD_POSTS_REQUEST:
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_USER_POSTS_REQUEST:
        draft.loadPostsIng = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;

      case LOAD_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_USER_POSTS_SUCCESS:
        draft.mainPosts = draft.mainPosts.concat(action.data);
        draft.hasMorePost = action.data.length === 10;
        draft.loadPostsIng = false;
        draft.loadPostsDone = true;
        break;

        
      case LOAD_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_USER_POSTS_FAILURE:
        draft.loadPostsIng = false;
        draft.loadPostsError = action.error;
        break;


       
        

      //단일포스트 로드 =========================================
      case LOAD_ONE_POST_REQUEST:
        draft.loadOnePostIng = true;
        draft.loadOnePostDone = false;
        draft.loadOnePostError = null;
        break;

      case LOAD_ONE_POST_SUCCESS:
        draft.singlePost = action.data;

        draft.loadOnePostIng = false;
        draft.loadOnePostDone = true;
        break;

      case LOAD_ONE_POST_FAILURE:
        draft.loadOnePostIng = false;
        draft.loadOnePostError = action.error;
        break;

      // 포스팅===================================================
      case ADD_POST_REQUEST:
        
        draft.addPostIng = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;

      case ADD_POST_SUCCESS:
        draft.addPostIng = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.data)
        draft.imagePaths = [];
        break;

      

      case ADD_POST_FAILURE:
        
        draft.addPostIng = false;
        draft.addPostError = action.error;
        break;

        ///post/leaf ============

      case ADD_LEAF_REQUEST:
        draft.addLeafLoading = true;
        draft.addLeafDone = false;
        draft.addLeafError = null;
        break;
      
      case ADD_LEAF_SUCCESS:
        draft.addLeafLoading = false;
        draft.addLeafDone = true;
        draft.leafs = action.data
        
        break;

      case ADD_LEAF_FAILURE:
        
        draft.addLeafLoading = false;
        draft.addLeafError = action.error;
        break;

        //=====POST //post/report

        case ADD_REPORT_REQUEST:
          draft.addReportLoading = true;
          draft.addReportDone = false;
          draft.addReportError = null;
          break;
        
        case ADD_REPORT_SUCCESS:
          draft.addReportLoading = false;
          draft.addReportDone = true;
          
          break;
  
        case ADD_REPORT_FAILURE:
          draft.addReportLoading = false;
          draft.addReportError = action.error;
          break;

        




      // 포스팅 삭제===================================================
      case REMOVE_POST_REQUEST:
        
        draft.removePostIng = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;

      case REMOVE_POST_SUCCESS:
        draft.mainPosts = draft.mainPosts.filter(
          (v) => v.Comments !== action.data.PostId
        );
        draft.removePostIng = false;
        draft.removePostDone = true;
        break;


      case REMOVE_POST_FAILURE:
        case REMOVE_COMMENT_FAILURE:
        draft.removePostIng = false;
        draft.removePostError = action.error;
        break;
// PATCH /post/1
        case PATCH_POST_REQUEST:
        draft.patchPostIng = true;
        draft.patchPostDone = false;
        draft.patchPostError = null;
        break;

      case PATCH_POST_SUCCESS:{
        draft.patchPostIng = false;
        draft.patchPostDone = true;
        let post = draft.mainPosts.length !==0 ? draft.mainPosts.find((v)=>v.id === action.data.PostId) : draft.singlePost
        let leaf = draft.leafs.find((v)=> v.id === action.data.PostId)

        
        post.Images = action.data.images
        leaf.Images = action.data.images
        draft.imagePaths=[]
        
        

        if(action.data.content !== null){
          post.content = action.data.content
        }



        
        break;
      }
        // draft.mainPosts.unshift(action.data)

        

      case PATCH_POST_FAILURE:
        draft.patchPostIng = false;
        draft.patchPostError = action.error;
        break;


      // 코멘트===================================================
      case ADD_COMMENT_REQUEST:
        draft.addCommentIng = true;
        draft.addCommentDone = false;
        break;
      case ADD_COMMENT_SUCCESS:
        {
          draft.addCommentIng = false;
          draft.addCommentDone = true;
          const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
          if(draft.mainPosts.length === 0){
            draft.singlePost.Comments.push(action.data)
          } else {
            post.Comments.push(action.data);
          }
        }

        break;

      case ADD_COMMENT_FAILURE:
        draft.addCommentIng = false;
        draft.addCommentError = action.error;
        break;

      //코멘트 삭제 ================================================
      case REMOVE_COMMENT_REQUEST:
        draft.removeCommentIng = true;
        draft.removeCommentDone = false;
        break;

      case REMOVE_COMMENT_SUCCESS:{
          const post = draft.mainPosts.find((v)=>v.id === action.data.PostId)
          post.Comments = post.Comments.concat().filter((c)=> c.id !== action.data.CommentId)
          draft.removePostIng = false;
          draft.removePostDone = true;
          break;
        }
      
      case REMOVE_COMMENT_FAILURE:
        draft.removeCommentIng = false;
        draft.removeCommentError = action.error;
        break;

      //Like====================================================
      case LIKE_POST_REQUEST:
        case LIKE_COMMENT_REQUEST:
        draft.likePostIng = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;

      case LIKE_POST_SUCCESS:
        {
          draft.likePostIng = false;
          draft.likePostDone = true;

          let post = draft.mainPosts.find((v) => v.id === action.data.PostId);
          if(draft.mainPosts.length === 0){
            draft.singlePost.PostLikers.push({ id: action.data.UserId });
          } else {
            post.PostLikers.push({ id: action.data.UserId });
          }
          break;  
        }

      case LIKE_COMMENT_SUCCESS:
        {
          draft.likePostIng = false;
          draft.likePostDone = true;

          if(draft.mainPosts.length ===0){
            const comment = draft.singlePost.Comments.find((v)=>v.id === action.data.CommentId)
            comment.CommentLikers.push({id:action.data.UserId})
          } else{
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            const comment = post.Comments.find((v)=>v.id === action.data.CommentId)
            comment.CommentLikers.push({id:action.data.UserId})
            
          }
        }

        

      case LIKE_POST_FAILURE:
        case LIKE_COMMENT_FAILURE:
        draft.likePostIng = false;
        draft.likePostError = action.error;
        break;

      //UNLIKE=============================================================

      case UNLIKE_POST_REQUEST:
        case UNLIKE_COMMENT_REQUEST:
        draft.unlikePostIng = true;
        draft.unlikePostDone = false;
        draft.unlikePostError = null;
        break;

      case UNLIKE_POST_SUCCESS:
        {
          draft.unlikePostIng = false;
          draft.unlikePostDone = true;

          let post = draft.mainPosts.find((v) => v.id === action.data.PostId);
          if(draft.mainPosts.length === 0){
            draft.singlePost.PostLikers = draft.singlePost.PostLikers.concat().filter((v) => v.id !== action.data.UserId);
            
          } else{
            post.PostLikers = post.PostLikers.filter((v) => v.id !== action.data.UserId);
          }
          break;  
        }
      
        

        case UNLIKE_COMMENT_SUCCESS:
        {
          draft.unlikePostIng = false;
          draft.unlikePostDone = true;

          if(draft.mainPosts.length ===0){
            const comment = draft.singlePost.Comments.find((v)=>v.id === action.data.CommentId)
            comment.CommentLikers = comment.CommentLikers.concat().filter((v)=>v.id !== action.data.UserId)
          } else{
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            const comment = post.Comments.find((v)=>v.id === action.data.CommentId)  
            comment.CommentLikers = comment.CommentLikers.concat().filter((v)=>v.id !== action.data.UserId)
            
          }
        }

        

      case UNLIKE_POST_FAILURE:
        case UNLIKE_COMMENT_FAILURE:
        draft.unlikePostIng = false;
        draft.unlikePostError = action.error;
        break;

      //======================Image Upload

      case UPLOAD_IMAGES_REQUEST:
      // case PATCH_UPLOAD_IMAGES_REQUEST:
        draft.uploadImagesIng = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;

      case UPLOAD_IMAGES_SUCCESS:
        draft.imagePaths = draft.imagePaths.concat(action.data)
        draft.uploadImagesIng = false;
        draft.uploadImagesDone = true;
        break;

        // case PATCH_UPLOAD_IMAGES_SUCCESS:
        // draft.PatchimagePaths = action.data;
        // draft.uploadImagesIng = false;
        // draft.uploadImagesDone = true;
        // break;

      case UPLOAD_IMAGES_FAILURE:
      case PATCH_UPLOAD_IMAGES_FAILURE:
        draft.uploadImagesIng = false;
        draft.uploadImagesError = action.error;
        break;

      //=====================미리보기 이미지 삭제 ======================

      case REMOVE_IMAGE:
        draft.imagePaths = draft.imagePaths.filter((v, i) => v.image!==null && (v.key !== action.data))
        // draft.PatchimagePaths = draft.PatchimagePaths.filter((v, i) => v.key !== action.data);
        // draft.uploadImagesIng = false
        draft.removePostDone=true
        break;

      //====================리트윗==========================

      case RETWEET_REQUEST:
        draft.retweetIng = true;
        draft.retweetDone = false;
        draft.retweetError = null;
        break;

      case RETWEET_SUCCESS:
        draft.retweetIng = false;
        draft.retweetDone = true;
        draft.mainPosts.unshift(action.data);
        break;

      case RETWEET_FAILURE:
        draft.retweetIng = false;
        draft.retweetError = action.error;
        break;

      default:
        break;
    }
  });
};

export default reducer;
