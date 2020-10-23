import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React,{useCallback, useState,useRef} from 'react'
import { useDispatch, useSelector } from "react-redux";
import {
    UPLOAD_IMAGES_REQUEST,
    REMOVE_IMAGE,
    ADD_POST_REQUEST,
  } from "../reducers/post";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const PicturesWall = ({text})=> {
    const dispatch = useDispatch();
    const { imagePaths, addPostDone, addPostIng } = useSelector((state) => state.post);
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    
    const [fileList, setFileList] = useState([
        {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }
])

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
    
   
//    usecallback은 async랑 같이 못쓸것같은데?

  const handleUpload = useCallback(({fileList})=>{
      console.log(`fileList:${fileList}`)
      setFileList({fileList})

    //   const imageFormData = new FormData();

    // // [].forEach.call(fileList.originFileObj, (f) => {
    // //   imageFormData.append("image", f);
    // // });
    // imageFormData.append('image',fileList[0].originFileObj)
    // // imageFormData.append("content", text)

    // dispatch({
    //   type: UPLOAD_IMAGES_REQUEST,
    //   data: imageFormData,
    // });

  },[])

//  const imageInput=useRef()
//  const onChangeImages = useCallback((e) => {
//     console.log("images", e.target.files);

//     const imageFormData = new FormData();

//     [].forEach.call(e.target.files, (f) => {
//       imageFormData.append("image", f);
//     });

//     dispatch({
//       type: UPLOAD_IMAGES_REQUEST,
//       data: imageFormData,
//     });
//   });
  
    return (
      <>
        <Upload
          action="http://localhost:3065/post/images"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleUpload(fileList)}
          withCredentials={true}
          beforeUpload={() => false}
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
      </>
    );
        }


export default PicturesWall