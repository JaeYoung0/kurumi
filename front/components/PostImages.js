import React, { useCallback, useState } from "react";
import PostCard from "./PostCard";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import ImagesZoom from "../components/imagesZoom";
import {Carousel} from 'antd'
import Slider from "react-slick";
import styled from 'styled-components'
import {backUrl} from '../config/config'

const SliderStyled = styled(Slider)`
.slick-dots{
  font-size: 5px;
  
}
`

const PostImages = ({ images }) => {
  const [ShowImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  
    return (
      <>
        <Slider
        dots={true}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        fade={true}
        lazyLoad={true}
        // customPaging={()=>}
        >
        {images.map((v)=>
          <div key={v.id} 
          // style={{display:'flex', justifyContent:'center', alignItems:'center'}} 
          >
          <img
              style={{width:'100%'}}
              role="presentation"
              src={`${v.src}`}
              alt={`${v.src}`}
              // onClick={onZoom}
            />
          </div>
        
        )}
        
          
          
          </Slider>
        
        
        
       
      </>
    );
  }

 

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
