import { HYDRATE } from "next-redux-wrapper";
// 분리한 리듀서 불러오기
import user from "./user";
import post from "./post";
// 리듀서 합치기
import { combineReducers } from "redux";

// (이전상태, 액션)=> 다음상태
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      
      return action.payload;

    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action);
    }
  }
};

export default rootReducer;
