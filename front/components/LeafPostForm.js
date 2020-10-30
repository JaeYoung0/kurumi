import React, {useCallback} from "react";
import { Form, Button, Input,Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {ADD_POST_REQUEST,} from "../reducers/post";
import UploadImages from './UploadImages';


const LeafPostForm = ({makeLeafOnScreen, content, setContent, submitLeaf,closeDrawer}) => {
     
  const onChangecontent = useCallback((e)=>{
    setContent(e.target.value)
    console.log(`content:${content}`)
    },[content])

  const { imagePaths, addPostDone} = useSelector(state => state.post);

  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {

    if (!content || !content.trim()) {
      return Modal.warning({
        content: '게시글을 작성하세요.',
        centered: true
      })
    }

    if(imagePaths.length === 0){
      return Modal.warning({
         content: '사진을 올려주세요.',
         centered: true
       })
     }
    
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append("image", p.image); // req.body.image
    });

    formData.append("content", content); //req.body.content
    
    
    for (let key of formData.keys()) {
    console.log(`formData keys: ${key}`); 
   }
    for (let value of formData.values()) {
    console.log(`formData values: ${value}`); 
   }

    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [content, imagePaths]);



    return (
    <>
        <Form style={{ margin: "0"}} encType="multipart/form-data">
          <Input.TextArea
            style={{height: '60px'}}
            value={content}
            onChange={onChangecontent}
            maxLength={140}
            placeholder="현위치 > 사진 업로드 > 구름생성 > 구름저장 순으로 작성해주세요."  
          />
    
          <UploadImages />

          <div style={{display: 'flex', justifyContent:'flex-end'}}>
            <Button type='default' style={{float:'right'}} onClick={closeDrawer}>취소</Button> 
            <Button type='default' style={{float:'right'}} onClick={makeLeafOnScreen}>구름생성</Button> 
            <Button type="primary" onClick={()=>{submitLeaf();onSubmit(); }} style={{float:'right'}}>구름저장</Button>
          </div>
      </Form>
   
    </>
    )
}

export default LeafPostForm
