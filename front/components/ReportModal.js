


import React,{useState, useCallback} from 'react'
import useInput from '../hooks/useinput'
import {Button, Modal,Input,Form} from "antd";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {ADD_REPORT_REQUEST} from "../reducers/post";


const ReportModal = ({item,_post}) => {
    const dispatch = useDispatch();

    const {removePostIng,addReportDone } = useSelector(
        (state) => state.post
      ); 
    
    const [reportVisible, setReportVisible] = useState(false)
    
    const showReport = useCallback(()=>{
        // setCommentId(item.id)        
        setReportVisible(true)
      },[])

    const closeReport = useCallback(()=>{
        setReportVisible(false)
    },[])
   
    const [reportText, onChangeReportText, setReportText] = useInput(null)
    const { me } = useSelector((state) => state.user);
    const id = useSelector((state) => state.user.me?.id);

    const onSubmitReport = useCallback((item)=>()=>{
      if(reportText === null){
          return Modal.warning({
            centered:true,
            content:'신고내용을 입력해주세요'
        })}      
        
        dispatch({
          type: ADD_REPORT_REQUEST,
          data:{
            reportId: me.id,  
            postId:_post.id, 
            commentId:item? item.id : null, 
            content: reportText}
        })
      
        Modal.success({
          centered:true,
          content:'신고를 접수했습니다.'
        })
        setReportVisible(false)

      },[reportText])

    return (
        <>             
          <Button onClick={showReport}>신고</Button>
            <Modal
              style={{zIndex:1000}}
              centered={true}
              visible={reportVisible}
              closable= {false}
              footer={null}
            >
              <Form>
                <Input.TextArea
                style={{height: '106px', marginTop:'30px'}}
                value={reportText}
                onChange={onChangeReportText}
                maxLength={140}
                placeholder="신고내용을 입력해주세요"
                />

                <div style={{display:'flex',justifyContent:'flex-end'}}>
                <Button onClick={closeReport}>취소</Button>
                <Button type='primary' onClick={onSubmitReport(item)}>제출</Button>
                </div>

              </Form>
          </Modal>    

          
        </>
    )
}

ReportModal.propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number,
      content: PropTypes.string,
      createAt: PropTypes.string,
      updatedAt: PropTypes.string,
      UserId: PropTypes.number,
      PostId: PropTypes.number,
      User: PropTypes.object,
      CommentLikers: PropTypes.arrayOf(PropTypes.object),
    }),
    _post: PropTypes.object.isRequired
  };

export default ReportModal
    