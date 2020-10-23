import React from "react";
import { List, Button, Card,Avatar,Modal } from "antd";
import PropTypes from "prop-types";
import { StopOutlined,StopTwoTone,PlusCircleTwoTone
,DownSquareTwoTone,
DownOutlined,
CaretDownOutlined

} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { UNFOLLOW_REQUEST } from "../reducers/user";

const FollowList = ({ header, data, onClickMore, loading }) => {
  const dispatch = useDispatch();
  const OnCancel = (id) => () => {
    dispatch({
      type: UNFOLLOW_REQUEST,
      data: id,
    });
  };

  return (
    // <List
    //   style={{ marginBottom: 20 }}
    //   grid={{ gutter: 4, xs: 2, md: 3 }}
    //   size="small"
    //   // header={<div>{header}</div>}
    //   loadMore={
    //     <div style={{ textAlign: "center", margin: "10px 0" }}>

    //     </div>
    //   }
    //   bordered
    //   dataSource={data}
    //   renderItem={(item) => (
    //     <List.Item style={{ marginTop: 20 }}>

        <div style={{textAlign:'center'}}>
        {data && data.map((item,i)=>
            <Card
            
            key={item.id}
          >
            <Card.Meta 
            avatar={<Avatar
                    src={item.Image.src}
                    >
                    </Avatar>}
            title={
              <div style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                <span>{item.nickname}</span> 
                <StopTwoTone twoToneColor="#eb2f96" key="stop" onClick={OnCancel(item.id)} />
              </div>
              }
            description={
              <div>
                <span>게시글 {item.Posts.length} ・ </span>
                <span>팔로워 {item.Followers.length}</span>
              </div>
            } />
          </Card>  
            )}
            {/* <CaretDownOutlined /> */}
            <DownOutlined 
            onClick={onClickMore}
            // loading={loading}
            />
        </div>
          
            
          



        // {/* </List.Item> */}
      )}
    // />
//   );
// };

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;
