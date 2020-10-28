import React, { useCallback, useState,useEffect } from "react";
import { Card, Avatar, Button,Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user";
import Link from 'next/link'
import styled from "styled-components";
import useInput from '../hooks/useinput'
import { Input, Modal } from "antd";
import Router from 'next/router'
import NicknameEditForm from "../components/NicknameEditForm";
import {UPDATE_AVATAR_REQUEST} from '../reducers/user'
import {UserOutlined,LeftOutlined} from '@ant-design/icons'
import UploadImages from './UploadImages';
import FollowList from '../components/FollowList'
import useSWR from 'swr'
import {backUrl} from '../config/config'
import axios from 'axios'

const fetcher = (url) => axios.get(url, {withCredentials:true})
.then((result)=>result.data)

const StyledSearch = styled(Input.Search)`
  vertical-align: middle;
  
`;

const UserProfile = () => {

  const {mainPosts} = useSelector(state => state.post)
  const [followingVisible, setFollowingVisible] = useState(false);
  const showFollowing = useCallback(()=>{
    setFollowingVisible(true)
  },[followingVisible])
  const closeFollowing = useCallback(()=>{
    setFollowingVisible(false)
  },[followingVisible])
  const [followingsLimit, setFollowingsLimit] = useState(3)
  const loadMoreFollowings = useCallback(()=>{
    setFollowingsLimit((prev)=>prev+3)
  })
  const {data:followingsData, error:followingError} = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`, fetcher)


  const [followerVisible, setFollowerVisible] = useState(false);
  const showFollower = useCallback(()=>{
    setFollowerVisible(true)
  },[])
  const closeFollower = useCallback(()=>{
    setFollowerVisible(false)
  },[])
  const [followersLimit, setFollowersLimit] = useState(3)
  
  const loadMoreFollowers = useCallback(()=>{
    setFollowersLimit((prev)=>prev+3)
  })
  const {data:followersData, error:followerError} = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`, fetcher)

  const [StatusVisible, setStatusVisible] = useState(false)
  const showStatus = useCallback(()=>{
    setStatusVisible(true)
  })
  const closeStatus = useCallback(()=>{
    setStatusVisible(false)
  })



  const [modalVisible, setModalVisible] = useState(false)
  const dispatch = useDispatch();
  const { me,updateAvatarDone } = useSelector((state) => state.user);
  const { imagePaths } = useSelector((state) => state.post);
  
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  const showModal = useCallback(()=>{
    setModalVisible(true)
  })
  
  const handleCancel = useCallback(()=>{
    setModalVisible(false)
  })
  
  useEffect(() => {
    // Modal.success({
    //   content: '수정완료',
    //   centered: true
    // });
   setModalVisible(false)
   
  }, [updateAvatarDone])

  const [searchInput, onChangeSearchInput] = useInput('')
  const onSearch = useCallback(()=>{
        Router.push(`/hashtag/${searchInput}`)
        },[searchInput])

  const updateAvatar = useCallback(()=>{
    if(imagePaths.length === 0){
      return Modal.error({
        content: '이미지를 찾을 수 없습니다.',
        centered: true
        
      })
    } else if(imagePaths.length !== 1){
      return Modal.warning({
        content: '이미지를 한 장만 올려주세요.',
        centered: true
      })
    } else{
      dispatch({
        type: UPDATE_AVATAR_REQUEST,
        data: {avatar: imagePaths[0].image[0], userId: me.id, imageId:me.Image?.id}
      }) 
    }
},[imagePaths,me])



if(followerError || followingError){
  console.error(followerError || followingError);
  return <div>'팔로일/팔로워 로딩 중 에러가 발생합니다.'</div>
}

  return (
    <>
    <Card
    style={{ boxShadow:'5px 5px 5px rgba(0, 0, 0, .2)', 
    borderRadius:'3px',
    }}
    actions={[
        <div key="twit">
          
            <span onClick={showStatus}>게시글 <br />{me.Posts.length} </span>
          
        </div>,

        <div key="followings">
          
            <span onClick={showFollowing}>팔로잉 <br /> {me.Followings.length}</span>
          
        </div>,

        <div key="followers">
          
            <span onClick={showFollower}>팔로워<br />{me.Followers.length}</span>
          
        </div>,
      ]}
    >
      <Card.Meta
      avatar={<Link
              href={`/user/${me.id}`}
              prefetch={false}
              >
                <a>
                  <Avatar 
                    size={60}
                    src={me.Image.src}
                    >
                  {me.Image === null && <UserOutlined style={{fontSize:20}} />}
                  </Avatar>
                </a>
              </Link>}
      title={`${me.nickname}`}
      description={<span 
                    style={{color:'#2C57A5', fontWeight:'bold', cursor:'pointer'}}
                    onClick={showModal}
                    >
                    프로필 사진 바꾸기
                  </span>}
      />
      
      <NicknameEditForm />      
    </Card>


      {/* 프로필 바꾸기 모달창 */}
      <Modal
        width={200}
        bodyStyle={{display:'flex', justifyContent:'center'}}
        centered={true}
        visible={modalVisible}
        closable= {false}
        footer={[
              <Button key="back" onClick={handleCancel}>
                취소
              </Button>,
              <Button key="submit" type="primary" onClick={updateAvatar}>
                저장
              </Button>,
               ]}
      
      >
          <div style={{justifyContent:'center', alignItems:'center'}}>
          <UploadImages />
          </div>
      </Modal>

      {/* 팔로잉 목록 */}
      <Drawer
        title={
        <>
          <LeftOutlined 
          style={{marginRight:'10px'}} 
          onClick={closeFollowing}/>
          <span>팔로잉</span>
        </>
        }
        placement="right"
        closable={false}
        onClose={closeFollowing}
        visible={followingVisible}
      >
          <FollowList 
            header="팔로잉 목록" 
            data={followingsData} 
            onClickMore={loadMoreFollowings} 
            loading={!followingsData && !followingError}/>
      </Drawer>

      {/* 팔로워 목록 */}
      <Drawer
        title={
              <>
                <LeftOutlined style={{marginRight:'10px'}} onClick={closeFollower}/>
                <span>팔로워</span>
              </>
              }
        placement="right"
        closable={false}
        onClose={closeFollower}
        visible={followerVisible}
      >
        <FollowList header="팔로워 목록" data={followersData} onClickMore={loadMoreFollowers} 
        loading={!followersData && !followerError}/>
      </Drawer>

      {/* 게시글 목록 */}
      <Drawer
        title={
              <>
                <LeftOutlined style={{marginRight:'10px'}} onClick={closeStatus}/>
                <span>게시글</span>
              </>
              }
        placement="right"
        closable={false}
        onClose={closeStatus}
        visible={StatusVisible}
      >
        <Card cover={<img src='../profile_kurumi1.png'/>}>
          <Card.Meta 
          title={'Basic 개구름이'}
          description={
          <div>
           {me.Posts.length}마리를 모았어요!
          </div>
          }
          />
        </Card>
      </Drawer>
    </>
  );
};

export default UserProfile;
