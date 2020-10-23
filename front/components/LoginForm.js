import React, { useCallback, useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import styled from "styled-components";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loginRequestAction } from "../reducers/user";

import useInput from "../hooks/useinput";

import {backUrl} from '../config/config'

// 다음엔 리액트 라이브러리 Form으로 간단하게 해결해보기
// 스타일 컴포넌트
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

const LoginForm = () => {
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const dispatch = useDispatch();
  const { logInIng, logInError } = useSelector((state) => state.user);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const onSubmitForm = useCallback(() => {
    //   antd의 Form에서 onFinish에는 이미 preventDeafult가 적용되어있기 때문에 또 쓰면 안된다~
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

// const xycoord = useCallback(()=>{
//   Axios.get('https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?input_coord=WGS84&output_coord=WGS84&x=126.913794&y=37.5043333',
//   {headers:{
//     'Authorization': '6fa9d12e365d1a30a4eb83c8ce8e0b2f',
//     'Access-Control-Allow-Origin': 'https://dapi.kakao.com',
//   }})
// })

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
        {/* <input> 태그의 required 속성은 폼 데이터(form data)가 서버로 제출되기 전 반드시 채워져 있어야 하는 입력 필드를 명시합니다. */}
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
        <Button
        // type="primary"
          style={{marginTop:'10px', borderRadius:'10px', background:'white', float:'right', border:'none', color:'black'}}
          icon={<img 
          src='../googleLogin.png'
          
          style={{width:'17px', verticalAlign:'middle', marginBottom:'4px', marginRight:'5px'}}

          />}
          >
          구글 로그인
      </Button>
      </a>  

        <a href={`${backUrl}/auth/kakao`}>
        <Button
        type="primary"
          style={{marginTop:'10px', borderRadius:'10px', background:'#FEE500', float:'right', border:'none', color:'black'}}
          icon={<img 
          src='../kakao.png'
          
          style={{width:'15px', verticalAlign:'middle', marginBottom:'4px', marginRight:'5px'}}

          />}
          >
          카카오 로그인
      </Button>
      </a>


      {/* <Button onClick={xycoord}>dd</Button> */}

      </ButtonWrapper>
      
     
    </FormStyled>
  );
};

export default LoginForm;
