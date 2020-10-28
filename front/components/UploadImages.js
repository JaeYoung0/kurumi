import React,{useState, useCallback, useEffect} from 'react'
import {PlusOutlined} from '@ant-design/icons'
import {
    UPLOAD_IMAGES_REQUEST,
    REMOVE_IMAGE,
    
  } from "../reducers/post";
import { useSelector, useDispatch } from "react-redux";
import { Upload, Modal } from "antd";
import {backUrl} from '../config/config'

const UploadImages = () => {

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [fileList, setFileList] = useState([])
    const { uploadImagesIng,uploadImagesDone,removePostDone, addPostDone} = useSelector(
        (state) => state.post
      );


    const dispatch = useDispatch();

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

    const handleCancel = useCallback(()=>{
        setPreviewVisible(false)
       },[])

    const onRemoveImage = useCallback((e) => {
        console.log(`uiddddddddddd${JSON.stringify(e.uid)}`)
        return dispatch({
          type: REMOVE_IMAGE,
          data: e.uid
        });
        
      },[removePostDone]);

    const onChangeImage = useCallback((e) => { //같은 컴포넌트에있는 Prop의 데이터를 받는건가?
        
      setFileList(e.fileList)

      const imageFormData = new FormData();  
      imageFormData.append('image',e.file)
      imageFormData.append('key',e.file.uid) //req.body.key
  
      return dispatch({
          type: UPLOAD_IMAGES_REQUEST,
          data: imageFormData,
        });
        
      },[uploadImagesIng]);
    
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
          }
          setPreviewImage(file.url || file.preview)
          setPreviewVisible(true)
          setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
       }

      

    return (
        <>
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
            >
              {fileList.length >= 1 ? null : 
              (
                <div>
                <PlusOutlined style={{color:'#BFBFBF'}} />
                <div style={{ marginTop: 8, color:'#BFBFBF'}}>사진</div>
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

            
    )
}

export default UploadImages
