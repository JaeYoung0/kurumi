import React, { useState, useCallback, useEffect,useRef } from "react";
import { Card, Popover, Avatar, List, Comment, Button, Modal,Input,Form,Tooltip } from "antd";
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
  HeartTwoTone,
  FileImageOutlined,
  UserOutlined,
  
  
} from "@ant-design/icons";


import PropTypes from "prop-types";
import UploadImages from '../components/UploadImages'

import { useSelector, useDispatch } from "react-redux";
import PostImages from "../components/PostImages";
import CommentForm from "../components/CommentForm";
import PostCardContent from "./PostCardContent";
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  PATCH_UPLOAD_IMAGES_REQUEST,
  PATCH_POST_REQUEST,
  REMOVE_IMAGE,
  REMOVE_COMMENT_REQUEST,
  LIKE_COMMENT_REQUEST,
  UNLIKE_COMMENT_REQUEST
} from "../reducers/post";
import FollowButton from "./FollowButton";

import Link from 'next/link'
import moment from 'moment'
import styled from 'styled-components'
import useInput from '../hooks/useinput'
import Router from 'next/router'
import ReportModal from './ReportModal'

moment.locale('ko')

const CommentStyled = styled(Comment)`
background: white;
padding: 0px 20px;
box-shadow: 2px 2px 5px rgba(0, 0, 0, .2);
.ant-comment-content{
  background:#F0F2F5;
  padding: 10px;
  border-radius:10px;
  border: 0px;
}

.ant-comment-actions{
width: 100%;
  /* li{
    width:10%
  } */
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin:0;
  width:100%;
}

.ant-comment-content-author{
  display: flex;
  justify-content:space-between;
}
`
const CardStyled= styled(Card)`
box-shadow: 2px 2px 5px rgba(0,0,0,.2);
margin: 0 0 0 0;
width: 100%;
border-radius:3px;

.ant-card-meta-detail{
  /* width: 90%; */
}
.ant-card-body{
  padding: 30px;
}

.ant-card-head{
  padding:0;
  width:100%;
}

.ant-card-meta-description{
  white-space: pre-wrap;
  /* display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden; */
}

.ant-card-actions{
  /* border: 0px; */
}
`
const ListStyled= styled(List)`
.ant-spin-container{
  background-color: white;
  box-shadow: 2px 2px 5px rgba(0,0,0,.2);
  /* border: 0.2px; */
}
`

const PostCard = ({ post }) => {
  const _post = post

 


const dispatch = useDispatch();
const { me } = useSelector((state) => state.user);
const {removePostIng, addCommentDone,imagePaths,PatchimagePaths,singlePost,mainPosts } = useSelector(
    (state) => state.post
  );
const id = useSelector((state) => state.user.me?.id);
const postliked = mainPosts.length !== 0 ? post.PostLikers.find((v) => v.id === id) : singlePost.PostLikers.find((v)=>v.id === id)


const imageInput = useRef();
const [commentFormOpened, setcommentFormOpened] = useState(false);
const [modalVisible, setModalVisible] = useState(false)
const [text, onChangeText, setText] = useInput(post.content);

const onDeleteComment = useCallback((item)=>()=>{
  dispatch({
    type: REMOVE_COMMENT_REQUEST,
    data:{itemId: item.id,postId: _post.id}
  })
  },[removePostIng])  


// const [showReport, setshowReport] = useState(showReport)


    

// const [commentId, setCommentId] = useState(null)



// useEffect(() => {
//   console.log(`commentId:${commentId}`)
// }, [reportVisible])




const onLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);
const onUnlike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);
const onToggleComment = useCallback(() => {
    setcommentFormOpened((prev) => !prev);
  }, []);
const removePost = useCallback(() => {
  Router.push('/')
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id
    });
  }, [id]);

 

const onShare = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }

    Kakao.init('d1d1666eac47faa6c1c3ec72b9114b8f')
    Kakao.Link.sendCustom({
      templateId: 39271   
    });

   },[id]);
  

const showModal = useCallback(()=>{
  console.log(post.id)
  setModalVisible(true)

})


const onChangeImages = useCallback((e) => {
  console.log("images", e.target.files);

  const imageFormData = new FormData();

  [].forEach.call(e.target.files, (f) => {
    imageFormData.append("image", f);
  });

  dispatch({
    type: PATCH_UPLOAD_IMAGES_REQUEST,
    data: imageFormData,
  });
});
const onClickImageUpload = useCallback(() => {
  imageInput.current.click();
}, [imageInput.current]);

const onRemoveImage = useCallback((index) => () => {
  dispatch({
    type: REMOVE_IMAGE,
    data: index,
  });
});


const onCancel = useCallback(()=>{
  setText(post.content)
  setModalVisible(false)
  
})
const onSubmit = useCallback(() => {
    
  if (!text || !text.trim()) {
    return alert("게시글을 작성하세요.");
  }

  

  const formData = new FormData();
  imagePaths.forEach((p) => {
    formData.append("image", p.image); // req.body.image
  });

  formData.append("content", text); //req.body.content
  const postId = mainPosts.length !==0 ? post.id : singlePost.id
  formData.append('postId', postId)

  for (let key of formData.keys()) {
    console.log(`formData keyssssssss: ${key}`); 
   }
    for (let value of formData.values()) {
    console.log(`formData valuessssss: ${value}`); 
   }

   setModalVisible(false)

  return dispatch({
    type: PATCH_POST_REQUEST,
    data: {formData,postId}

    
  })
}, [text, imagePaths, post]);







const likeComment = useCallback((item)=>()=>{
dispatch({
  type: LIKE_COMMENT_REQUEST,
  data: {itemId:item.id, postId:post.id}
})
},[id])

const unlikeComment = useCallback((item)=>()=>{
dispatch({
  type:UNLIKE_COMMENT_REQUEST,
  data: {itemId:item.id, postId:post.id}
})
},[id])

  return (
    <>
      <CardStyled
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="share" 
          onClick={onShare} 

          />,

          postliked 
          ? (<span key="heart" onClick={onUnlike}> 
          <HeartTwoTone twoToneColor="#eb2f96"/> {post.PostLikers ? post.PostLikers.length : singlePost.PostLikers.length}개
          </span>) 
          : (<span key="heart" onClick={onLike}> 
          <HeartOutlined/> {post.PostLikers ? post.PostLikers.length : singlePost.PostLikers.length}개
          </span>),

          <span key="comment" onClick={onToggleComment}> 
          <MessageOutlined/> {post.Comments.length}개
          </span>,
          
          <Popover
            key="more"
            content={
                    <Button.Group>
                      {id && post.User.id === id 
                      ? (
                        <>
                          <Button
                          onClick={showModal}
                          >수정</Button>
                          <Button
                            type="danger"
                            loading={removePostIng}
                            onClick={removePost}
                          >삭제
                          </Button>
                        </>
                      ) 
                      : (
                        
                      <ReportModal _post={_post}/>
                      
                      )}
                    </Button.Group>
                    }
          >
            <EllipsisOutlined style={{fontSize:20}}/>
          </Popover>,
        ]}
        // extra={id && <FollowButton post={post} />}
      >

        {post.RetweetId && post.Retweet 
        ? (<Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
            title={
              post.RetweetId
                ? `${post.User.nickname}님이 리트윗하셨습니다`
                : null
            }
          >
            <Card.Meta
              avatar={
              <Link
              href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
              </Link>}
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) 
        : (<Card.Meta
            avatar={
            <Link
            href={`/user/${post.User.id}`} prefetch={false}>
                <a><Avatar size={'large'} 
                src={
                  mainPosts.length !== 0 ? `${post.User.Image.src}` : `${singlePost.User.Image.src}`
                  

                  }
                >
                {me.Image === null && <UserOutlined style={{fontSize:20}} />}
                </Avatar>
                </a>
            </Link>
            
            }
            title={
                <div style={{display:'flex', justifyContent:'space-between'}}>
                {post.User.nickname}
                {id && <FollowButton post={post} />}
                </div>
            }
            description={
            <>
              <PostCardContent postData={post.content} />
              <div style={{fontSize:'10px', margin:'5px 2px'}}>{moment(post.updatedAt).startOf('hour').fromNow()}</div>
            </>
            }
          />)
        }
      </CardStyled>

{/* 게시글 수정할 때의 모달창 */}
      <Modal
      centered={true}
      visible={modalVisible}
      closable= {false}
      footer={null}
      >
        <Form 
            style={{ margin: "0" }}
            encType="multipart/form-data"
            onFinish={onSubmit}
          >
          <Input.TextArea
                style={{height: '106px', marginTop:'30px'}}
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder="어떤 일이 있었나요?"
          />
          
          <UploadImages 
          
          />
          
          <div style={{display:'flex',justifyContent:'flex-end'}}>
          <Button key="canel" onClick={onCancel}>취소</Button>
          <Button key="submit" type="primary" htmlType="submit">저장</Button>
          </div>
        </Form>
    </Modal>

      {commentFormOpened && (
        <div> 
          <ListStyled
            itemLayout="horizontal"
            dataSource={post.Comments}
            // renderItem={
             
             
            // }
          >
          {post.Comments.map((item)=>
            
        <li key={item.id}>
                <CommentStyled
                key={item.id}
                  datetime={
                  item.CommentLikers?.find((v)=> v.id === id) !== undefined
                  ? <HeartTwoTone twoToneColor="#eb2f96" 
                    onClick={unlikeComment(item)}
                  />
                  : <HeartOutlined style={{color:'#848587'}} 
                    onClick={likeComment(item)}
                  />
                  }
                 
                  author={item.User.nickname}
                  avatar={<Link
                    href={`/user/${post.User.id}`} prefetch={false}>
                      <a><Avatar
                      src={
                        
                        `${item.User.Image.src}`
                        }  
                      ></Avatar></a>
                    </Link>}
                  content={item.content}
                  actions={[
                    // <div style={{width:'100%' ,display:'flex', justifyContent:'space-between'}}>
                    <div>
                    <span style={{fontSize:'0.5em', marginRight:'10px'}} >{moment(item.updatedAt).startOf('hour').fromNow()}</span>
                    {item.CommentLikers.length !==0
                     && <span style={{fontSize:'0.5em'}}>좋아요 {item.CommentLikers.length}개</span>}
                    </div>,
                    <Popover
            
                    key="more"
                    content={
                    <Button.Group>
                      {id && item.UserId === id 
                      ? (
                        <>
                          
                          <Button
                            type="danger"
                            loading={removePostIng}
                            onClick={onDeleteComment(item)}
                          >삭제
                          </Button>
                        </>
                      ) 
                      : (
                        <ReportModal 
                      key={item.id}
                      item={item} 
                      _post={_post}
                      />    
                        
                      
                      
                      
                      )}
                    </Button.Group>
                    }
                    >
                           <EllipsisOutlined 
                               style={{marginRight:'5px'}}
                           />
                           

                               
                    </Popover>
                     
                      // </div>   


                     
                    
                
                  ]}
                >
                  

                  

                </CommentStyled>

          </li>

              
              
            
      
          )}
                
              
          </ListStyled>


          <CommentForm post={post}/>
        </div>
      )}



    </>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createAt: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    PostLikers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
