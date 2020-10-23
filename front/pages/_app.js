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
// import 'leaflet.markercluster/dist/MarkerCluster.css'
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'react-leaflet-markercluster/dist/styles.min.css'

const NodeBird = ({ Component }) => {
  return (
    <>
      <Component />
      <Head>
        <meta charSet="utf-8" />
        <script defer src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
        {/* <title>HushNe</title> */}
      </Head>
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

// wrapper.withRedux라는 HOC로 감싸준 덕분에 <Provider store={store}>같은걸로 또 감싸줄 필요가 없다
export default wrapper.withRedux(NodeBird);
