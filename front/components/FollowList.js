import React from "react";
import {Card,Avatar } from "antd";
import PropTypes from "prop-types";
import {StopTwoTone,DownOutlined,} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { UNFOLLOW_REQUEST } from "../reducers/user";

const FollowList = ({ data, onClickMore }) => {
  const dispatch = useDispatch();

  const OnCancel = (id) => () => {
    dispatch({
      type: UNFOLLOW_REQUEST,
      data: id,
    });
  };

  return (
        <div style={{textAlign:'center'}}>
        
        {data && data.map((item)=>
            <Card key={item.id}>
                <Card.Meta 
                  avatar={<Avatar src={item.Image.src} />}
                  title={
                        <div style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                          <span>{item.nickname}</span> 
                          <StopTwoTone twoToneColor="#eb2f96" key="stop" onClick={OnCancel(item.id)} />
                        </div>
                        }
                  description={
                              <div style={{display:'flex', justifyContent:"flex-start"}}>
                                <span style={{fontSize:'0.8em'}}>게시글 {item.Posts.length} ・ </span>
                                <span style={{fontSize:'0.8em'}}>팔로워 {item.Followers.length}</span>
                              </div>
                              } 

                />
          </Card>  
            )}

            <DownOutlined onClick={onClickMore}/>

        </div>

      )}


FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;
