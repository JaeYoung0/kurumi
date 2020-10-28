import React, { useState,useCallback,useEffect } from "react";
import PropTypes from "prop-types";
import Link from 'next/link'
import styled from "styled-components";
import { useSelector,useDispatch } from "react-redux";
import useInput from '../hooks/useinput'
import { logoutRequestAction } from "../reducers/user";
import LoginForm from "../components/LoginForm";
import Router from 'next/router'
import { Layout, Menu, Row,Col,Input,Drawer,Button, Modal} from 'antd';
import {
  UserOutlined,
  FieldTimeOutlined,
  CloudOutlined,
  MenuOutlined,
  LogoutOutlined,
  CreditCardOutlined,
  HighlightOutlined
} from '@ant-design/icons';

const RowStyled = styled(Row)`
background: white;
display: flex;
justify-content: space-between;
align-items:'center';
padding:15px 20px;
border: 1px solid #DBDBDB;
height:80px;
position:sticky;
z-index:999;
`

const SearchStyled = styled(Input.Search)`
background:#F0F2F5;
.ant-input{
  background:#F0F2F5
}
`

const AppLayout = ({ children }) => {
  const { me ,logOutIng} = useSelector((state) => state.user);



  const [menuVisible, setMenuVisible] = useState(false)

  const dispatch = useDispatch()

  const { Header, Content, Footer} = Layout;

  

  const onCloseMenu = useCallback(()=>{
    setMenuVisible(false)
  },[menuVisible])
  
  const onShowMenu = useCallback(()=>{
    setMenuVisible(true)
  },[menuVisible])

  const onLogOut = useCallback(() => {

    if(me === null){
      return Modal.error({
        content: '로그인 해주세요.',
        centered: true
        
      })
    } else{
      dispatch(logoutRequestAction());
    }
    
  }, [me]);

  const [searchInput, onChangeSearchInput] = useInput('')

  const onSearch = useCallback(()=>{
  Router.push(`/hashtag/${searchInput}`)
  },[searchInput])


  return (
    <>
    <Layout style={{ minHeight: '100vh'}}>
          <RowStyled>
            <Col>
              <Link href='/' replace>
              <a>
              <img src="happy.png" alt="nav__icon" style={{width:'40px'}}/>
              <img src="makes.png" alt="nav__icon" style={{width:'80px', marginLeft:'16px'}}/>
              </a>
              </Link>
            </Col>
            
            <Col>
              <Button 
              onClick={onShowMenu} 
              style={{
                border:'1px white solid', 
                }}>
              <MenuOutlined style={{color:'#2C57A5', fontSize:'25px'}}/>
              </Button>
            </Col>

          <Drawer
          placement="left"
          closable={false}
          onClose={onCloseMenu}
          visible={menuVisible}
          bodyStyle={{background:'#001529'}}
          >
            <Menu mode= 'vertical' theme="dark">
            
            <Menu.Item key='1' icon={<UserOutlined />}>
                    <Link href='/profile' replace>
                    <a>프로필</a>
                    </Link>
                  </Menu.Item>
                  
                  <Menu.Item key='2' icon={<FieldTimeOutlined />}>
                    <Link href='/' replace>
                    <a>타임라인</a>
                    </Link>
                  </Menu.Item>

                  <Menu.Item key='3' icon={<CloudOutlined />}>
                    <Link href='/leafletmap' replace>
                    <a>구름지도</a>
                    </Link>
                  </Menu.Item>
            
                  <Menu.Item key='4' icon={<CreditCardOutlined />}>
                    <a
                    target="_blank"
                    href='https://smartstore.naver.com/kurumishop'
                    >굿즈구매
                    </a>
                  </Menu.Item>

                  <Menu.Item key='6' icon={<HighlightOutlined />}>
                    <Button
                    ghost={true}
                    style={{border:'transparent', padding: 0, color:'#A6ADB4'}}
                    >
                    <a 
                    target="_blank"
                    href={'https://docs.google.com/forms/d/e/1FAIpQLSd0G1BTJ5jpkZhr1AxGKe5Us3Oacc-G9OIYhTB9EKNwz5S21g/viewform?usp=sf_link'}>
                    사용자 피드백
                    </a>
                    </Button>
                  </Menu.Item>

                  <Menu.Item key='5' icon={<LogoutOutlined />}>
                    <Button
                    ghost={true}
                    style={{border:'transparent', padding: 0, color:'#A6ADB4'}}
                    onClick={onLogOut}
                    loading={logOutIng}
                    >
                    로그아웃
                    </Button>
                  </Menu.Item>

                  

                  <Menu.Item>
                    <SearchStyled
                    value={searchInput}
                    onChange={onChangeSearchInput}
                    onSearch={onSearch}
                    placeholder='게시글 검색'
                    />
                  </Menu.Item>

                  <Menu.Item>
                    <div style={{textAlign:'center'}}>베타버전입니다.</div>
                  </Menu.Item>




          </Menu>
            
          </Drawer>  
          </RowStyled>  

        <Layout className="site-layout" style={{ background: '#F0F2F5'}}>
          <Header className="site-layout-background" style={{ padding: 0 , background: '#F0F2F5'}} />
          <Content>            
            <div className="site-layout-background" style={{ padding: 0, minHeight: 360 , background: '#F0F2F5'}}>            
            <Row gutter={50} >
              <Col xs={24} sm={24} md={24} lg={8}>
                {me ? <UserProfile /> : <LoginForm />}
              </Col>
              <Col xs={24} sm={24} md={24} lg={16}>
                {children}
              </Col>
            </Row>              
            </div>
          </Content>       
        </Layout>
      </Layout>
    </>
  )  
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
