import React, { useState,useCallback } from "react";
import PropTypes from "prop-types";
import Link from 'next/link'
import styled from "styled-components";
import { useSelector,useDispatch } from "react-redux";
import {logoutRequestAction} from '../reducers/user'

import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import Router from 'next/router'
import { Layout, Menu, Row,Col,Input,Drawer,Button } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  FieldTimeOutlined,
  SearchOutlined,
  CloudOutlined,
  MenuOutlined
} from '@ant-design/icons';



const AppLayout = ({ children }) => {
  const { me ,logOutIng} = useSelector((state) => state.user);
  const [menuVisible, setMenuVisible] = useState(false)
  const dispatch = useDispatch()
  const onCloseMenu = useCallback(()=>{
    setMenuVisible(false)
  },[menuVisible])
  
  const onShowMenu = useCallback(()=>{
    setMenuVisible(true)
  },[menuVisible])
  

//====


const { Header, Content, Footer, Sider } = Layout;

const [collapsed, setcollapsed] = useState(false)

const onCollapse = useCallback(()=>{
setcollapsed(!collapsed)
},[collapsed])
const onLogOut = useCallback(() => {
  dispatch(logoutRequestAction());
}, []);

//===

  return (
    <>
    <Layout style={{ minHeight: '100vh'}}>
          <Row style={{
            background:'white', 
            display:'flex', 
            justifyContent:'space-between', 
            alignItems:'center',
            padding:'15px 20px',
            border: '1px solid #DBDBDB'
            }}>
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
              // borderRadius:'10px', 
              }}>
            <MenuOutlined style={{color:'#2C57A5', fontSize:'25px'}}/>
            </Button>
            </Col>

          <Drawer
          // title="Kurumi"
          placement="left"
          closable={false}
          onClose={onCloseMenu}
          visible={menuVisible}
          // style={{background:'#001529'}}
          bodyStyle={{background:'#001529'}}
          >
            <Menu mode= 'vertical' theme="dark">
            {/* <div>dd</div> */}
            
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
          </Row>
            
 
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

          <Footer style={{ textAlign: 'center' ,lineHeight:'3px', height:'5px', padding:'15px'}}><a
              href="https://hjy-portfolio.netlify.app/"
              target="_blank"
              rel="noreferrer noopener"
            >
              made by SatAf
            </a></Footer>
        </Layout>
      </Layout>
    </>
  )
  
  
  // (
  //   <div>
  //     <Menu mode="horizontal">
  //       <Menu.Item>
  //         <Link href="/">
  //           <a>Timeline</a>
  //         </Link>
  //       </Menu.Item>

  //       <Menu.Item>
  //         <Link href="/profile">
  //           <a>Profile</a>
  //         </Link>
  //       </Menu.Item>

  //       <Menu.Item>
  //         <StyledSearch 
  //         enterButton
  //         value={searchInput}
  //         onChange={onChangeSearchInput}
  //         onSearch={onSearch}
          
  //         />
  //       </Menu.Item>

       
  //     </Menu>
  //     <Row gutter={8}>
  //       <Col xs={24} md={6}>
  //         {me ? <UserProfile /> : <LoginForm />}
  //       </Col>
  //       <Col xs={24} md={17}>
  //         {children}
  //       </Col>
  //     </Row>
  //   </div>
  // );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
