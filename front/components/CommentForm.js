import React, { useCallback, useEffect } from "react";
import useInput from "../hooks/useinput";
import { Form, Input, Avatar } from "antd";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ADD_COMMENT_REQUEST } from "../reducers/post";

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();

  const id = useSelector((state) => state.user.me?.id);

  const {me} = useSelector((state) => state.user);

  const [commentText, onChangecommentText, setCommentText] = useInput("");

  const { addCommentDone, addCommentIng } = useSelector((state) => state.post);

  useEffect(() => {
    if (addCommentDone) {
      setCommentText("");
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: "relative", margin: 0 }}>
        <Input 
        size="large" 
        placeholder="댓글을 입력하세요..." 
        style={{boxShadow:'2px 2px 5px rgba(0, 0, 0, .2)', border:'0px', padding: '10px 20px'}}
        prefix={<Avatar src={me.Image.src} />}          
        value={commentText}
        onChange={onChangecommentText}
        />
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
