import React, { useCallback } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followIng, unfollowIng } = useSelector((state) => state.user);

  const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
  const onClickBtn = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.User.id,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.User.id,
      });
    }
  });

  if (post.User.id === me.id) {
    return null;
  }

  return (
    <Button loading={followIng || unfollowIng} onClick={onClickBtn} shape="round" ghost style={{color:'#2C57A5', border: '1px solid #2C57A5'}}>
      {isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  );
};

export default FollowButton;

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
};
