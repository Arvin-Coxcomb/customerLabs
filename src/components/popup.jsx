import React from 'react'
import "./popup.css"

function Popup({...props}) {
  const {opened,toggle,setToggle} = {...props}
  return (
    <>
    {toggle ? (    
        <div className='container'>
            <div className='sub-container'>
            <button className="close" onClick={()=>setToggle(!toggle)}>X</button>
            {props.children}
            </div>
        </div>
    )
     :
      `unable to display ${toggle}`}
    </>
  )
}

export default Popup