import React from "react";
import PropTypes from "prop-types";
import "antd/dist/antd.css";
import Head from "next/head";
import wrapper from "../store/configureStore";
import '../pages/styles.css'
import 'leaflet/dist/leaflet.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'leaflet-search/src/leaflet-search.css';
import 'leaflet-geosearch/dist/geosearch.css';
import dotenv from 'dotenv'
dotenv.config()
import 'react-leaflet-markercluster/dist/styles.min.css'

const NodeBird = ({ Component }) => {
  
  return (
    <>
      <Head>
        <meta charSet="utf-8" />        
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

// wrapper.withRedux라는 HOC로 감싸준 덕분에 <Provider store={store}>같은걸로 또 감싸줄 필요가 없다
export default wrapper.withRedux(NodeBird);
