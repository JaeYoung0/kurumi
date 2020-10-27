import React, { useState,useCallback,useEffect } from "react";
import PropTypes from "prop-types";
import Link from 'next/link'
import styled from "styled-components";
import { useSelector,useDispatch } from "react-redux";
import useInput from '../hooks/useinput'
import { logoutRequestAction } from "../reducers/user";
import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import Router from 'next/router'
import { Layout, Menu, Row,Col,Input,Drawer,Button, Modal,Avatar,Card } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  FieldTimeOutlined,
  SearchOutlined,
  CloudOutlined,
  MenuOutlined,
  LogoutOutlined,
  CreditCardOutlined,
  HighlightOutlined
  
  

  
} from '@ant-design/icons';



const AppLayout2 = ({ children, menuKey }) => {
  
  const [menuVisible, setMenuVisible] = useState(false)
  
  const onCloseMenu = useCallback(()=>{
    setMenuVisible(false)
  },[menuVisible])
  
  const onShowMenu = useCallback(()=>{
    setMenuVisible(true)
  },[menuVisible])


//====



const dispatch = useDispatch();
const [collapsed, setcollapsed] = useState(false)
const { me,logOutIng,logOutDone } = useSelector((state) => state.user);
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
const onCollapse = useCallback(()=>{
setcollapsed(!collapsed)
},[collapsed])

const [searchInput, onChangeSearchInput] = useInput('')
const onSearch = useCallback(()=>{
Router.push(`/hashtag/${searchInput}`)
},[searchInput])


useEffect(() => {
  setMenuVisible(false)
}, [logOutDone])


//===

  return (
    <>
    <Layout style={{ minHeight: '100vh' }}>
    <Row style={{
            background:'white', 
            display:'flex', 
            justifyContent:'space-between', 
            alignItems:'center',
            padding:'15px 20px',
            border: '1px solid #DBDBDB',
            height: '10vh'
            }}>
            <Col>
              <Link href='/' replace>
              <a>
              <img src="../happy.png" alt="nav__icon" style={{width:'40px'}}/>
              <img src="../makes.png" alt="nav__icon" style={{width:'80px', marginLeft:'16px'}}/>
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
          
          
            <Menu 
            mode= 'vertical' 
            theme="dark"
            selectedKeys={[menuKey]}
            >
            {/* <div>dd</div> */}
            
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
            {/* <Button
            ghost={true}
            style={{border:'transparent', padding: 0, color:'#A6ADB4'}}
            > */}
              <a
              target="_blank"
              href='https://smartstore.naver.com/kurumishop'
              >굿즈구매
              </a>
            {/* </Button> */}
              
            </Menu.Item>


            <Menu.Item key='6' icon={<HighlightOutlined />}
            // icon={<LogoutOutlined />}
            >
              <Button
              ghost={true}
              style={{border:'transparent', padding: 0, color:'#A6ADB4'}}
              // onClick={onLogOut}
              // loading={logOutIng}
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
              <div style={{textAlign:'center'}}>베타버전입니다.</div>
              <div style={{textAlign:'center'}}>Copyright © LEMAR KIM & SatAf. All rights reserved.</div>
              <div style={{textAlign:'center'}}>special thanks to BKH</div>
              
            </Menu.Item>

            
            
            

          </Menu>
            {/* <div style={{textAlign:'center', marginTop:'100px'}}>
              <Button 
              onClick={onLogOut} 
              loading={logOutIng}>
              로그아웃
              </Button>
            </div> */}
          </Drawer>  
          </Row>
          
          {/* <Input.Search 
          value={searchInput}
          onChange={onChangeSearchInput}
          onSearch={onSearch}
          placeholder='해시태그로 게시글 검색'

      /> */}
         


        <Layout className="site-layout" style={{ background: '#F0F2F5', width: '100%', height:'90vh'}}>
          {/* <Header className="site-layout-background" style={{ padding: 0 , background: '#F0F2F5'}} /> */}
          
            <Row gutter={50} align='middle' style={{width:'100%', margin:0, height:'100%'}}>
              {me ? null : 
                <Col xs={24} sm={24} md={24} lg={24}>
                <LoginForm />
                </Col>
              }
              
              <Col xs={24} sm={24} md={24} lg={24} style={{padding:0}}>
                {me ? children : null}
              </Col>
            </Row>


          {/* <Footer style={{ textAlign: 'center' ,lineHeight:'3px', height:'2vh', padding:'15px'}}><a
              href="https://hjy-portfolio.netlify.app/"
              target="_blank"
              rel="noreferrer noopener"
              style={{color:'grey'}}
            >
              All rights reserved @ SatAf
            </a></Footer> */}
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

AppLayout2.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout2;
