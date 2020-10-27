import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppLayout from '../components/AppLayout'
import { Form, Input, Checkbox, Button,Upload,Modal } from "antd";
import Head from "next/head";
import useInput from "../hooks/useinput";
import Router from "next/router";
import styled from "styled-components";
import UploadImages from '../components/UploadImages'

import {
  ADD_POST_REQUEST,
} from "../reducers/post";
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import axios from "axios";
import { END } from "redux-saga";

const ErrorMessage = styled.div`
  color: red;
`;
const InputStyled = styled(Input)`
margin-bottom: 10px;
border-radius: 10px;
`




const signup = () => {
  const { imagePaths } = useSelector(
    (state) => state.post
  );

  const dispatch = useDispatch();
  const { signUpIng, signUpDone, signUpError, me } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (signUpDone) {
      Modal.success({
        content: '회원가입 완료',
        centered: true
      })
      Router.replace("/");
    }
  }, [signUpDone]);

  useEffect(() => {
    if (me?.id) {
      Router.replace("/");
    }
  }, [me?.id]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [nickname, onChangeNickname] = useInput("");

  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const [term, setTerm] = useState("");
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(e.target.checked === false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    if(imagePaths.length !== 1){
     return Modal.error({
        content: '프로필 사진을 1개 올려주세요.',
        centered: true
      })
    }

    const formData = new FormData();
    formData.append("email", email)
    formData.append("password", password);
    formData.append("nickname", nickname);
    imagePaths.forEach((p) => {
      formData.append("image", p.image); // req.body.image
    });

    dispatch({
      type: SIGN_UP_REQUEST,
      data: formData,
    });
  }, [email, password, passwordCheck, term,imagePaths,nickname]);

  
  

  

   


  return (
    <>
      <Head>
        <title>Sign Up | Kurumi</title>
      </Head>
      <AppLayout>
        <Form onFinish={onSubmit}
        style={{padding:'10px'}}
        encType="multipart/form-data"
        >
          <br />
       
                 
            <InputStyled
              name="user-email"
              size='large'
              valaue={email}
              required
              onChange={onChangeEmail}
              type="email"
              placeholder='이메일을 입력해주세요.'
            />
          
            <InputStyled
              name="user-nick"
              size='large'
              valaue={nickname}
              required
              onChange={onChangeNickname}
              placeholder='닉네임을 입력해주세요.'
            />
         
            <InputStyled
              name="user-password"
              size='large'
              type="password"
              valaue={password}
              required
              onChange={onChangePassword}
              placeholder='비밀번호를 입력해주세요.'
            />

            <InputStyled
              name="user-password-check"
              size='large'
              type="password"
              valaue={passwordCheck}
              required
              onChange={onChangePasswordCheck}
              placeholder='비밀번호를 다시 입력해주세요.'
            />
            {passwordError && (
              <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
            )}

            <UploadImages />
          

          <div style={{marginTop:'10px'}}>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            해시태그 많이 활용해주세요~
            </Checkbox>
            {termError && <ErrorMessage>동의해주세요!!</ErrorMessage>}
          </div>
          


          <div style={{ marginTop: 10 , float:'right'}}>
            <Button type="primary" htmlType="submit" loading={signUpIng}
            style={{borderRadius:'10px'}}
            >
              가입하기
            </Button>
          </div>
        </Form>
      </AppLayout>
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
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END);
    console.log("getServerSideProps end");
    await context.store.sagaTask.toPromise();
  }
);

export default signup;
