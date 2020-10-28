import React, { useState,useCallback } from "react";
import PropTypes from "prop-types";
import Link from 'next/link'
import { useSelector,useDispatch } from "react-redux";
import {logoutRequestAction} from '../reducers/user'
import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import { Layout, Menu, Row,Col,Drawer,Button } from 'antd';
import {UserOutlined,FieldTimeOutlined,CloudOutlined,MenuOutlined} from '@ant-design/icons';
import styled from "styled-components";

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
  dispatch(logoutRequestAction());
}, []);


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
            
            <Menu.Item icon={<UserOutlined />}>
              <Link href='/profile' replace>
              <a>프로필</a>
              </Link>
            </Menu.Item>
            
            <Menu.Item icon={<FieldTimeOutlined />}>
              <Link href='/' replace>
              <a>타임라인</a>
              </Link>
            </Menu.Item>

            <Menu.Item icon={<CloudOutlined />}>
              <Link href='/leafletmap' replace>
              <a>구름이 지도</a>
              </Link>
            </Menu.Item>
          </Menu>
            <div style={{textAlign:'center', marginTop:'100px'}}>
              <Button 
              onClick={onLogOut} 
              loading={logOutIng}>
              로그아웃
              </Button>
            </div>
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
