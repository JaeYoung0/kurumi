import React, { useCallback, useEffect } from "react";
import { Form, Input, Button } from "antd";
import styled from "styled-components";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loginRequestAction } from "../reducers/user";

import useInput from "../hooks/useinput";

import {backUrl} from '../config/config'


const ButtonWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .ant-btn{
    margin-left:5px;
  }
`;

const FormStyled = styled(Form)`
  padding: 10px;
  max-width: 450px;
  margin: 0 auto;
`;

const InputStyled = styled(Input)`
margin-bottom: 10px;
border-radius: 10px;
`

const GoogleButtonStyled = styled(Button)`
margin-top:10px;
border-radius:10px;
background:white;
float:right;
border:none;

`

const ImgStyled = styled.img`

width:17px;
vertical-align:middle;
margin-bottom:4px;
margin-right:5px;
`

const KakaoButtonStyled = styled(Button)`
color:black;
margin-top:10px;
border-radius:10px;
background:#FEE500;
float:right;
border:none;
&:hover {
    background:#FEE500;
  }
`

const LoginForm = () => {
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const dispatch = useDispatch();
  const { logInIng, logInError } = useSelector((state) => state.user);

  const onSubmitForm = useCallback(() => {
    //   antd의 Form에서 onFinish에는 이미 preventDeafult가 적용되어있기 때문에 또 쓰면 안된다~
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  return (
    <FormStyled onFinish={onSubmitForm}>
      <div>
        <InputStyled
          name="user-email"
          size='large'
          value={email}
          onChange={onChangeEmail}
          required
          type="email"
          placeholder='이메일'
        />
        {/* <input> 태그의 required 속성은 폼 데이터(form data)가 서버로 제출되기 전 반드시 채워져 있어야 함을 의미 */}
      </div>

      <div>
        <InputStyled
          name="user-password"
          size='large'
          value={password}
          onChange={onChangePassword}
          placeholder='비밀번호'
          required
        />
      </div>

      <ButtonWrapper>

        <Link href="/signup">
          <a>
            <Button type="primary" style={{borderRadius:'10px'}}>
              회원가입
            </Button>
          </a>
        </Link>

        <Button type="primary" htmlType="submit" loading={logInIng}
         style={{borderRadius:'10px',background:'#2C57A5', border:'none'}}>
          로그인
        </Button>

      </ButtonWrapper>

      <ButtonWrapper>
          <a href={`${backUrl}/auth/google`}>
            <GoogleButtonStyled
              icon={<ImgStyled src='../googleLogin.png'/>}
              
              >구글 로그인
            </GoogleButtonStyled>
          </a>  

          <a href={`${backUrl}/auth/kakao`}>
            <KakaoButtonStyled
              // type="primary"
              // ghost          
              icon={<ImgStyled src='../kakao.png'/>}
              >카카오 로그인
            </KakaoButtonStyled>
          </a>
      </ButtonWrapper>
      
    </FormStyled>
  );
};

export default LoginForm;
