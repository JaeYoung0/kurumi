import React, { lazy, useCallback, useState } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
// import Image from 'next/image'
import styled from 'styled-components'

const DivStyled = styled.div`
.slick-slider{
  touch-action: auto, 
}
`

const PostImages = ({ images }) => {  

    return (
      <DivStyled>
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
            loading={lazy}
            style={{width:'100%'}}
            role="presentation"
            src={`${v.src.replace(/\/thumb\//, '/original/')}`}
            alt={`${v.src.replace(/\/thumb\//, '/original/')}`}
            />                  
        )}
                            
        </Slider>
      </DivStyled>
    );
  }

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
