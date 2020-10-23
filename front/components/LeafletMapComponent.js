import React,{useState, useEffect,useCallback, useRef} from 'react'
import { Map, TileLayer, Marker, Popup, LeafletConsumer,WMSTileLayer } from 'react-leaflet'
import L from 'leaflet'
import { Form, Input, Button,Row,Col, Drawer } from 'antd';
import styled from 'styled-components'
import { useDispatch, useSelector } from "react-redux";
import { ADD_LEAF_REQUEST,LOAD_LEAFS_REQUEST,LOAD_MY_LEAFS_REQUEST } from "../reducers/post";
import {Modal} from 'antd'
import { END } from "redux-saga";
import wrapper from "../store/configureStore";
import axios from 'axios'
import LeafPostForm from './LeafPostForm'
import PostImages from './PostImages'
import ImagesZoom from './imagesZoom/index'
import {CloudOutlined,AimOutlined,SmileOutlined,SearchOutlined} from '@ant-design/icons'
// import {markerClusterGroup} from 'leaflet.markercluster'

import {LOAD_POST_REQUEST} from '../reducers/post'
import Router from 'next/router'
import { SearchControl,OpenStreetMapProvider } from 'leaflet-geosearch';
import * as GeoSearch from 'leaflet-geosearch';
import MarkerClusterGroup from "react-leaflet-markercluster";

import {backUrl} from '../config/config'





const MapStyled = styled(Map)`
height: 100vh;
.leaflet-bar-part-single{
  opacity:0.7;
  /* height:10px; */
  /* border-radius:40px; */
  border: none
  
}
form{
  opacity:0.7;
  padding:0;
  /* border:0; */
}
.reset{
  display:none;
}
.glass{
  height:30px;
  
}
`
const FormStyled = styled(Form)`
position: absolute;
top: 300px;
right: 10px;
z-index: 998;
background: white;
padding: 10px;
height: 320px;
border-radius: 10px;
`

const PostImagesStyled = styled(PostImages)`
/* img{
  width:200px;
} */
`

// const PostFormStyled = styled(PostForm)`
// position: absolute;
// top: 10px;
// right: 10px;
// z-index: 999;
// background: white;
// padding: 10px;
// height: 320px;
// border-radius: 10px;
// ` 


const LeafletMapComponent = ()=> {
  const dispatch = useDispatch()
  const { me } = useSelector((state) => state.user);
  const {addPostDone, addLeafDone,leafs,imagePaths} = useSelector(state => state.post)
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [zoom, setZoom] = useState(3)
  const [content, setContent] = useState('')
  const [haveUsersLocation, setHaveUsersLocation] = useState(false) // 나중에 true로 바뀌면 Marker나오게 바꾸기 줌도 바꾸기
  const position = [lat,lng]
  const [currentPos, setCurrentPos] = useState([0,0])
  const [visible, setVisible] = useState(false)
  const [countCloud, setCountCloud] = useState(1)
  const myIcon = L.icon({
    iconUrl: 'gaekurumi.png',
    iconSize: [50, 50],
    iconAnchor: [25, 45],
    popupAnchor: [5, -35],
  });

  
  

  const myIconOpacity = L.icon({
    iconUrl: 'gaekurumi_opacity.png',
    iconSize: [50, 50],
    iconAnchor: [25, 45],
    popupAnchor: [5, -35],
  })

  const myFixedIcon = L.icon({
    iconUrl: 'pin.png',
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    popupAnchor: [-3, -50],
  })

  const mapRef = useRef()  


  useEffect(() => {
  // search

  const map = mapRef.current
  
  const searchControl = new SearchControl({
    style: 'button',
    showMarker:false,
    provider: new OpenStreetMapProvider(),
    autoClose:true,
    position:'topleft',
    animateZoom:true,
    // classNames:{
    // container:'search_Leaflet_Container'
    // }
    searchLabel:`찾고싶은 주소를 입력해주세요.`,
  });

  map.leafletElement.addControl(searchControl)  
  }, [])

  const markerRef = useRef()

// useEffect(() => {
//   // cluster
//   const marker = markerRef.current
//   const map = mapRef.current
//   const markers = L.markerClusterGroup()
//   markers.leafletElement.addLayer(L.marker(getRandomLatLng(map.leafletElement)))
// }, [])
  


  
  


  
  useEffect(() => {

     navigator.geolocation.getCurrentPosition(
    (position) => {
      setLat(position.coords.latitude)
      setLng(position.coords.longitude)
      setHaveUsersLocation(true)
      setCurrentPos([position.coords.latitude, position.coords.longitude])
    },
    (position)=>{


  console.log('geolocation 1차 시도 실패')
  // return Modal.warning({
  //     content: '새로고침 해주세요.',
  //     centered: true
  // })
  axios.get('https://ipapi.co/json')
    .then((response)=>{
      console.log(response.data.latitude, response.data.longitude)
      setLat(response.data.latitude)
      setLng(response.data.longitude)
      setLat(position.coords.latitude)
      setLng(position.coords.longitude)
      setHaveUsersLocation(true)
      setCurrentPos([position.coords.latitude, position.coords.longitude])

      
    },{timeout:5000})
    }
    , [countCloud] );
  })
    

  
  useEffect(() => {
    setZoom(13)
  }, [haveUsersLocation])

  useEffect(() => {
    console.log(lat, lng)  
  }, [lat,lng])
    
  useEffect(() => {
  if(addLeafDone){
    setVisible(false)

    setContent('')
    Modal.success({
      content: '저장완료',
      centered: true
    });
    
    Router.push('/leafletmap')
    
    
  }
}, [addLeafDone])

  const onChangecontent = useCallback((e)=>{
  setContent(e.target.value)
  console.log(`content:${content}`)
  },[content])

  const makeLeafOnScreen = useCallback(()=>{
    // if(countCloud ===1){
    //   return
    // }
  const map = mapRef.current
  const marker = L.marker(currentPos,{icon:myIconOpacity, draggable:true})
  marker.addTo(map.leafletElement)
  marker.on('drag', ()=>{
  const newPos = marker.getLatLng()
  setLat(newPos.lat)
  setLng(newPos.lng)  
  })
  marker.bindPopup(`..`,{closeButton:false})
  
  console.log(marker)


 

  setCountCloud(countCloud+1)
  console.log(`지금 구름 갯수는 ${countCloud}개입니다.`)

  

},[currentPos, content])

const flyScreen = useCallback(()=>{
  const map = mapRef.current
  map.leafletElement.flyTo(currentPos,16)
  
  const marker = L.marker(currentPos,{icon:myFixedIcon})
  marker.addTo(map.leafletElement)

  
  
},[currentPos])

const submitLeaf = useCallback(()=>{
  if (!content || !content.trim()) {
    return 
  }

  if(imagePaths.length === 0){
    return 
   }

  dispatch({
    type: ADD_LEAF_REQUEST,
    data: {lat, lng, imagePaths}
  })
})

const showDrawer = useCallback(()=>{
  setVisible(!visible)
},[visible])

const closeDrawer = useCallback(()=>{
  setVisible(false);
},[])

const goToPost = useCallback((leaf)=>()=>{
  dispatch({
    type:LOAD_POST_REQUEST,
    data: leaf.id
  })
  Router.push(`/post/${leaf.id}`)
})

const [wantMyLeaf, setWantMyLeaf] = useState(false)

const loadMyLeaf = useCallback(()=>{

  
  console.log(wantMyLeaf)

  if(wantMyLeaf === false){
    console.log('내꺼만 부를게')
    setWantMyLeaf(!wantMyLeaf)
     dispatch({
      type: LOAD_MY_LEAFS_REQUEST,
      data: me.id 
    })
      
  } else{
    console.log('남의것도 보여줘')
    setWantMyLeaf(!wantMyLeaf)
     dispatch({
      type:LOAD_LEAFS_REQUEST
    })
    
  }
  

  
},[wantMyLeaf])

    return (
<>
          <MapStyled 
          className="markercluster-map"
          center={currentPos} 
          zoom={zoom} 
          ref={mapRef} 
          zoomControl={false} 
          >
          <TileLayer
            // attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            // url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            // url='https://firms.modaps.eosdis.nasa.gov/wms/viirs'

          />
          
          <MarkerClusterGroup
>
          {leafs.length > 0  
          ? leafs.map((leaf,index)=> 
          (
            
            
            <Marker 
          position={[leaf.lat, leaf.lng]}
          icon={myIcon}
          // draggable={true}
          opacity={0.9}
          key={leaf.id}
          ref={markerRef}
          >
              <Popup key={index} leaf={leaf} closeButton={false}>
                {/* <span>{leaf.content}</span>
                <br /> */}
                {/* <span style={{color:'blue'}}></span> */}
                
                {/* <ImagesZoom images={leaf.Images} /> */}
                {leaf.Images.length !== 0 ? 
                <>
                
                <a onClick={goToPost(leaf)}>
                  <img 
                  src={`${backUrl}/${leaf.Images[0]?.src}`} 
                  style={{width:'100px'}}
                  ></img>
                </a>
                
                </>
                  : null
                }
                
                {/* <Button onClick = {removeLeaf}>삭제</Button> */}
              </Popup>
          </Marker>   



          ))

          
          : "" 
          
          }
          </MarkerClusterGroup>
          
      </MapStyled>

        <Button 
        onClick={showDrawer} 
        style={{
          position:'fixed', 
          bottom:'10px', right:20, zIndex:999,
          boxShadow:'2px 2px 5px rgba(0, 0, 0, .2)',
          opacity:'.7'}}
        shape={'round'}
        icon={<CloudOutlined/>}
        // type="primary"
        >구름이</Button>
        <Drawer
        // title="구름이 생성기"
        placement="top"
        closable={true}
        onClose={closeDrawer}
        visible={visible}
        width={400}
        mask={false}
        keyboard={true}
        closable={false}
        // style={{opacity:'0.9'}}
        >
          <LeafPostForm 
          submitLeaf={submitLeaf} 
          setContent={setContent} 
          onChangecontent={onChangecontent} 
          makeLeafOnScreen={makeLeafOnScreen} 
          content={content}
          closeDrawer={closeDrawer}  
          
          />
          
        </Drawer>

        <Button
        style={{
          position:'fixed', 
          bottom:'10px', right:240, zIndex:999,
          
          boxShadow:'2px 2px 5px rgba(0, 0, 0, .2)',
          opacity:'.7'
        }}
        onClick={flyScreen}
        icon={<AimOutlined />}
        shape={'round'}
        >
          현위치
        </Button>

        <Button
        style={{
          position:'fixed', 
          bottom:'10px', right:130, zIndex:999,
          boxShadow:'2px 2px 5px rgba(0, 0, 0, .2)',
          opacity:'.7'
        }}
        onClick={loadMyLeaf}
        icon={<SmileOutlined />}
        shape={'round'}
        >
          스위치
        </Button>
   
</>

     )}


export default LeafletMapComponent
