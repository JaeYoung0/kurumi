import React, { useState, useCallback, useRef, useEffect } from "react";
import { Form, Button, Input,Upload,Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
} from "../reducers/post";
import useInput from "../hooks/useinput";
import {PlusOutlined} from '@ant-design/icons'


const PostForm = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const onCancel = useCallback(()=>{
    setModalVisible(false)
    setText(post.content)
  })
  const [text, onChangeText, setText] = useInput("");
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([
  //   {
  //   uid: '-4',
  //   name: 'image.png',
  //   status: 'done',
  //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // }
  ,])
  

  const { imagePaths, addPostDone, addPostIng,uploadImagesDone,uploadImagesIng,removePostDone } = useSelector(
    (state) => state.post
  );

  const imageInput = useRef();

 

  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
    
  }, [addPostDone]);

  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert("게시글을 작성하세요.");
    }
    // if(imagePaths)

    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append("image", p.image); // req.body.image
    });

    formData.append("content", text); //req.body.content
    
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
  }, [text, imagePaths]);

  const onChangeImage = useCallback((e) => { //같은 컴포넌트에있는 Prop의 데이터를 받는건가?
    console.log("e", e);
    console.log("e.target.files or e.file~~~~~~~", e.file);
    setFileList(e.fileList)
    console.log(`e.file!!!!!!!${e.file}`)

    const imageFormData = new FormData();
    
    imageFormData.append('image',e.file)
    imageFormData.append('key',e.file.uid) //req.body.key


    for (let key of imageFormData.keys()) {
      console.log('key',key);
    }
    for (let value of imageFormData.values()) {
      console.log('value',value);
    }

    return dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
    
  },[uploadImagesIng]);

  const onRemoveImage = useCallback((e) => {
    console.log(`eeeeeeeeeeeeee${JSON.stringify(e.uid)}`)
    return dispatch({
      type: REMOVE_IMAGE,
      data: e.uid
    });
    
  },[removePostDone]);

  const handleCancel = useCallback(()=>{
    setPreviewVisible(false)
   },[])
   
   const handlePreview = async file => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      setPreviewImage(file.url || file.preview)
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
   }

const getBase64 = (file)=>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

   useEffect(() => {
     setFileList([])
     
   }, [addPostDone])

   useEffect(()=>{
    console.log('AFter Upload, fileList:', fileList)
    
   },[uploadImagesDone])

   

  return (
    <Form
      style={{ margin: "0" }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
  
      <Input.TextArea
        style={{height: '106px'}}
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="감상을 공유해주세요"
      >
       
      </Input.TextArea>
      
      {/* <PicturesWall text={text} /> */}
      <Upload
      
          action={`${backUrl}/post/images`}
          listType="picture-card"
          fileList={fileList}
          onRemove={onRemoveImage}
          onPreview={handlePreview}
          onChange={onChangeImage}
          withCredentials={true}
          beforeUpload={() => false}
          multiple={true}
          
        //   ref={imageInput}
        >
          {fileList.length >= 8 ? null : 
          (
            <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )
          }
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

  
      <div style={{display: 'flex', justifyContent:'flex-end'}}>
   
        <Button
          type="primary"
          style={{ float: "right" }}
          htmlType="submit"
          loading={addPostIng}
        >
          게시
        </Button>
      </div>

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
          
         

          <div style={{display:'flex',justifyContent:'flex-end'}}>
          {/* <Button onClick={onClickImageUpload}><FileImageOutlined /></Button> */}
          <Button key="canel" onClick={onCancel}>취소</Button>
          <Button key="submit" type="primary" htmlType="submit">저장</Button>
          </div>
        </Form>
    </Modal>

    </Form>
  );
};

export default PostForm;
