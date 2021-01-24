import styled from 'styled-components'
import {Button} from 'antd'
import {useRouter} from 'next/router'

const Wrapper = styled.img`
/* display: flex;
justify-content: center;
align-items: center; */
/* width: 1000px;
@media (max-width: 1024px) {
    width: 300px
  } */
`

export default function Custom404(){
    const router = useRouter();
    return(
        <>
        <div style={{
            height: '100vh', 
        width: '100vw', 
        display:'flex', 
        alignItems:'center', 
        justifyContent:'center',
        flexDirection:'column'
        }}>
            <img src="/images/404kurumi.png" style={{width:'70vw', maxWidth:'400px', minWidth:'200px'}} />
            <Button
            style={{
                marginTop: '20px',
                border: '1px solid #3585BE',
                color: '#3585BE'
                }}
                onClick={()=>{router.push('/')}}
            >Home</Button>
        </div>
        </>
    )
}