import {Date, DialogueScroll, DialogueWrapper} from './styled'
import { GET_USER_COMMENTS, USER_COMMENTS_SUBSCRIPTION } from '../../../api';
import React, { useEffect } from 'react'

import { CommentType } from '../../../types';
import Dialogue from './dialugue';
import { animateScroll } from "react-scroll";
import moment from 'moment'
import { useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

const CustomerService = ({phone, getUserComments}: PropsType) => {
    const chatContainer = React.createRef<HTMLInputElement>();
    const messageScroll = React.createRef<HTMLInputElement>();
    const date = Array.from(new Set(getUserComments.map(item => moment(item.created).format('D MMMM'))))
    // console.log('Customer');

    const scrollToBottom = () => {
         animateScroll.scrollToBottom({
            containerId: "message__scroll"
        });
    }

    useEffect(() => {
        console.log('customer')
        scrollToBottom()
    })

    const onScroll = () => {
         if (messageScroll.current) {
            const { scrollTop, scrollHeight, clientHeight } = messageScroll.current;
            if (scrollTop + clientHeight + 2 >= scrollHeight) {
                console.log("reached bottom");
            }
        }
    }

    return (
        <DialogueScroll ref={messageScroll} onScroll={onScroll} id="message__scroll">
            <DialogueWrapper ref={chatContainer}> 
                {date?.map(date => {
                   return <React.Fragment key={uuidv4()}>
                    <Date key={uuidv4()}>{date}</Date>
                    {getUserComments?.map(message => {
                        if (date === moment(message.created).format('D MMMM')) {
                            return <Dialogue
                                    key={uuidv4()} 
                                    text={message.text}
                                    created={message.created}
                                    role={message.role}
                            />
                        }
                    })}
                    </React.Fragment>
                })}
            </DialogueWrapper>
        </DialogueScroll>
    )
}

export default CustomerService;

interface PropsType {
    phone: string
    getUserComments: CommentType[]
}

interface CommetType {
    role: string
    created: string
    text: string
    image?: string
    user_id?: number
}
