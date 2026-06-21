import {CREATE_COMMENT, CREATE_USER_COMMENT, GET_ORDERS} from '../../api'
import React, {memo, useCallback, useEffect, useState} from 'react'
import { useMutation, useQuery } from '@apollo/client'

import ChatInput from './input'
import {ChatWrapper, Title, InfoText} from './styled'
import DeskTopNotification from './header/notification'
import Dialogues from './dialogues'
import Header from './header'
import { OrderType } from '../../types'
import { local } from '../../utils';
import useDriverComments from '../../hooks/subscription/useDriverComments'
import useUserComments from '../../hooks/subscription/useUserComments'

const include = ['created', 'approved', 'closed']

const Chat = ({role, id, orderId}: PropsType) => {
    const phone = local?.getToken()
    const [orderComments] = useMutation(CREATE_COMMENT)
    const [userComments] = useMutation(CREATE_USER_COMMENT)
    const {getComments, reloadDriver} = useDriverComments(phone || '')
    const {getUserComments, reloadUser} = useUserComments(phone || '')
    const {data: orders} = useQuery<{getAllOrders: OrderType[]}, {phone: string | null}>(GET_ORDERS, {variables: {phone}, fetchPolicy: "cache-and-network"})
    //
    const isOrders = orders?.getAllOrders.filter(order => include.includes(order.status)) || [];
    const isUserRead = getUserComments?.some(el => !el.isRead)
    const isDriverRead = getComments?.some(el => !el.isRead)
    const isMoreThanOne = isOrders && isOrders?.length > 1 || false;
    //
    const [toggle, setToggle] = useState(isOrders?.length ? 'Driver' : 'Customer')
    const [text, setText] = useState<string>('')    
    const [comments, setComments] = useState<string>('')
    // console.log(getComments)


    const [disableChat, setDisableChat] = useState<boolean>(true)
    
    const sendComment = useCallback(async () => {
        console.log('send driver')
        if (orderId && role && text.length) {
            await orderComments({
                variables: {
                    id: orderId,
                    comment: text,
                    role
                }
            }).then(data => {
                setText('')
            })
        } else {
            console.log("can't create comment")
        } 
    },[text])
    // console.log(isOrders);
    
    const sendUserComment = useCallback(async () => {
        // console.log('send user')
        if (id && role && text.length) {
            await userComments({
                variables: {
                    id,
                    comment: text,
                    role,
                    image: ''
                }
            }).then(data => {
                const allComments = data.data.userComments;
                const finishComments = allComments[allComments.length - 1]
                //console.log('finishComments:', finishComments)
                setComments(finishComments)
                setText('')
            })
        } else {
            console.log("can't create user comment")
        } 
    },[text])

    useEffect(() => {
        if (isOrders.length) {
             setToggle('Driver')
        } else {
            setToggle('Customer')
        }
    }, [])
   
    return (
        <>  
            <ChatWrapper>
                {disableChat
                ? <>
                        <div>
                            <Title>404</Title>
                            <InfoText>Customer service under development...</InfoText>
                        </div>
                    </>
                :
                <>
                    <Header
                        toggle={toggle}
                        setToggle={setToggle}
                        noOrders={!isOrders?.length}
                        isMoreThanOne={isMoreThanOne}
                        isUserRead={isUserRead}
                        isDriverRead={isDriverRead}
                        reloadUser={reloadUser}
                        reloadDriver={reloadDriver}
                        id={orderId}
                        phone={phone}
                    />
                {phone && isOrders?.length > 0 && getComments && toggle === 'Driver' && <Dialogues getComments={getComments}/>}
                {phone && getUserComments && toggle === 'Customer' && <Dialogues getComments={getUserComments} />}
                    <ChatInput
                    text={text}
                    sendComment={toggle === 'Customer' ? sendUserComment : sendComment}
                    setText={setText}
                    isCustomer={toggle}
                    />
                </>
                }

            </ChatWrapper>
            <DeskTopNotification toggle={toggle} isMoreThanOne={isMoreThanOne}/>
        </>
    )
}

export default memo(Chat);

interface PropsType {
    id: number
    role: string
    orderId: string
}