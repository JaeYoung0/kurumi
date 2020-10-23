import React, { useCallback, useMemo,useEffect } from "react";
import { Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";
import useInput from "../hooks/useinput";
import styled from 'styled-components';

const NicknameEditForm = () => {
  const { me,changeNicknameDone } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || "");

  

  const FormStyled = styled(Form)`
  padding: 20px;
  .ant-btn-primary{
    background:#2C57A5;
    border:none;
  }
  
  `

  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    if(nickname.length > 30){
      return Modal.warning({
        content: '닉네임이 너무 깁니다.',
        centered: true
      }) 
    }


    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

useEffect(() => {
  if(changeNicknameDone){
    Modal.success({
      content: '수정완료',
      centered: true
    });
  }
}, [changeNicknameDone])

  return (
    <>
      <FormStyled>
        <Input.Search
          value={nickname}
          onChange={onChangeNickname}
          // addonBefore="닉네임"
          enterButton="수정"
          onSearch={onSubmit}
        />
      </FormStyled>
      {/* 아바타 수정 */}
    </>
  );
};

export default NicknameEditForm;
