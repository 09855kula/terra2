import {Notification} from '../styled'
import React from 'react'

const DeskTopNotification = ({toggle, isMoreThanOne}: {isMoreThanOne: boolean, toggle: string}) => {
  return (
      <Notification>
            <p className={toggle === 'Customer' ? 'active' : 'hide'}>
                Here you can ask all your questions! We appreciate feedback 
                and suggestions so be honest, say whatever you want :)
                <br />
                <br /> 
                    We also send info here about sales, news, events, etc
                </p>
                <p className={toggle === 'Driver' ? 'active' : 'hide'}>
                    Here is the chat with your driver. Send any details 
                    which may help your delivery, need change, etc
                    <br />
                    <br /> 
                    {!isMoreThanOne ? 
                    <>Questions about the website? Switch to <span>Customer Service</span></>
                        :
                    <>
                        You’re chatting with the driver of the nearest order, scheduled on  28nov.
                        <br />
                        <br /> 
                        If you want to discuss another order, please switch to <span>Customer Service</span>
                    </>}
            </p>
        </Notification>
  )
}

export default DeskTopNotification