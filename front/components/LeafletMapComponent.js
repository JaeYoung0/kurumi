import React,{useState, useEffect,useCallback, useRef} from 'react'
import { Map, TileLayer, Marker, Popup, LeafletConsumer,WMSTileLayer } from 'react-leaflet'
import L from 'leaflet'
import { Form, Button, Drawer } from 'antd';
import styled from 'styled-components'
import { useDispatch, useSelector } from "react-redux";
import { ADD_LEAF_REQUEST,LOAD_LEAFS_REQUEST,LOAD_MY_LEAFS_REQUEST } from "../reducers/post";
import {Modal} from 'antd'
import axios from 'axios'
import LeafPostForm from './LeafPostForm'
import PostImages from './PostImages'
import {CloudOutlined,AimOutlined,SmileOutlined} from '@ant-design/icons'
import {LOAD_POST_REQUEST} from '../reducers/post'
import Router from 'next/router'
import { SearchControl,OpenStreetMapProvider } from 'leaflet-geosearch';
import MarkerClusterGroup from "react-leaflet-markercluster";

const MapStyled = styled(Map)`
height: 100vh;
.leaflet-bar-part-single{
  opacity:0.7;
  border: none
  
}
form{
  opacity:0.7;
  padding:0;
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

const LeafletMapComponent = ()=> {
  const dispatch = useDispatch()
  const { me } = useSelector((state) => state.user);
  const {addLeafDone,leafs,imagePaths} = useSelector(state => state.post)
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

  // 장소 검색하기
  useEffect(() => {
  const map = mapRef.current
  const searchControl = new SearchControl({
    style: 'button',
    showMarker:false,
    provider: new OpenStreetMapProvider(),
    autoClose:true,
    position:'topleft',
    animateZoom:true,
    searchLabel:`찾고싶은 주소를 입력해주세요.`,
  });

  map.leafletElement.addControl(searchControl)  

  }, [])

  const markerRef = useRef()
  // 위치 추적하기
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

      return Modal.warning({
      content: '새로고침 해주세요.',
      centered: true
      })
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
  },[])
    
  // 구름 추가 이후
  useEffect(() => {
  if(addLeafDone){
    setContent('')
    Modal.success({
      content: '저장완료',
      centered: true
    });
    
    Router.push('/leafletmap')
    setVisible(false)
  }
}, [addLeafDone])

  const onChangecontent = useCallback((e)=>{
  setContent(e.target.value)
  console.log(`content:${content}`)
  },[content])

  // 화면에 구름생성
  const makeLeafOnScreen = useCallback(()=>{
  const map = mapRef.current
  const marker = L.marker(currentPos,{icon:myIconOpacity, draggable:true})
  marker.addTo(map.leafletElement)
  marker.on('drag', ()=>{
  const newPos = marker.getLatLng()
  setLat(newPos.lat)
  setLng(newPos.lng)  
  })
  marker.bindPopup(`..`,{closeButton:false})
  setCountCloud(countCloud+1)
  console.log(`지금 구름 갯수는 ${countCloud}개입니다.`)
},[currentPos, content])

  // 현위치로 이동
  const flyScreen = useCallback(()=>{
  const map = mapRef.current
  map.leafletElement.flyTo(currentPos,16)
  const marker = L.marker(currentPos,{icon:myFixedIcon})
  marker.addTo(map.leafletElement)
},[currentPos])

  // dispatch: 구름생성
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

  // 타임라인으로 이동
  const goToPost = useCallback((leaf)=>()=>{
  dispatch({
    type:LOAD_POST_REQUEST,
    data: leaf.id
  })
  Router.push(`/post/${leaf.id}`)
})

  // 내 구름만 보기
  const [wantMyLeaf, setWantMyLeaf] = useState(false)
  const loadMyLeaf = useCallback(()=>{

  if(wantMyLeaf === false){
    console.log('내 구름')
    setWantMyLeaf(!wantMyLeaf)
     dispatch({
      type: LOAD_MY_LEAFS_REQUEST,
      data: me.id 
    })
      
  } else{
    console.log('모든 구름')
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
            <TileLayer url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'/>
          
              <MarkerClusterGroup>
              {leafs.length > 0  
              ? leafs.map((leaf,index)=> 
              (<Marker 
                position={[leaf.lat, leaf.lng]}
                icon={myIcon}
                opacity={0.9}
                key={leaf.id}
                ref={markerRef}
                >
                  <Popup key={index} leaf={leaf} closeButton={false}>
                  {leaf.Images.length !== 0 
                  ? 
                    <>                
                      <a onClick={goToPost(leaf)}>
                        <img 
                        src={`${leaf.Images[0]?.src}`} 
                        style={{width:'100px'}}
                        ></img>
                      </a>                
                    </>
                  : null
                  }
                </Popup>
                </Marker>   
              ))
              : "" 
              }
              </MarkerClusterGroup>
          </MapStyled>

        {/* 구름생성버튼 */}
        <Button 
        onClick={showDrawer} 
        style={{
          position:'fixed', 
          bottom:'10px', right:20, zIndex:999,
          boxShadow:'2px 2px 5px rgba(0, 0, 0, .2)',
          opacity:'.7'}}
        shape={'round'}
        icon={<CloudOutlined/>}
        >구름이</Button>

        {/* 구름 생성창 */}
        <Drawer
        placement="top"
        closable={true}
        onClose={closeDrawer}
        visible={visible}
        width={400}
        mask={false}
        keyboard={true}
        closable={false}
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

        {/* 현위치로 이동 버튼 */}
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
        >현위치
        </Button>

        {/* 내 구름만 버튼 */}
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
        >스위치
        </Button>
</>

     )}


export default LeafletMapComponent
