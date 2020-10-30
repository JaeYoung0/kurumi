import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import styled from 'styled-components'



const PostImages = ({ images }) => {  

    return (
      <>
        <Slider
          adaptiveHeight={true}
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          fade={true}
          lazyLoad={true}
          arrows={false}
        >
        {images.map((v)=>
          <img
            key={v.id}
            style={{width:'100%'}}
            role="presentation"
            src={`${v.src.replace(/\/thumb\//, '/original/')}`}
            alt={`${v.src.replace(/\/thumb\//, '/original/')}`}
            />                  
        )}
                            
        </Slider>
      </>
    );
  }

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
