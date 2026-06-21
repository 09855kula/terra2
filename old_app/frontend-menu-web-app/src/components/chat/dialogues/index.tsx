import {Date, DialogueScroll, DialogueWrapper} from './styled'
import React, { useEffect } from 'react'

import { CommentType } from '../../../types';
import Dialogue from './dialugue';
import { animateScroll } from "react-scroll";
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';

const Dialogues = ({getComments}: PropsType) => {
    const chatContainer = React.createRef<HTMLInputElement>();
    const messageScroll = React.createRef<HTMLInputElement>();
    //
    const date = Array.from(new Set(getComments.map(item => moment(item.created).format('D MMMM'))))
    // console.log(getComments);
   
    const scrollToBottom = () => {
         animateScroll.scrollToBottom({
            containerId: "message__scroll",
            offset: 50
        });
    }

    useEffect(() => {
        scrollToBottom()
    },[])

    const onScroll = () => {
         if (messageScroll.current) {
            const { scrollTop, scrollHeight, clientHeight } = messageScroll.current;
            if (scrollTop + clientHeight + 2 >= scrollHeight) {

            }
        }
    }
    
    return (
        <DialogueScroll ref={messageScroll} onScroll={onScroll} id="message__scroll">
            <DialogueWrapper ref={chatContainer}>
                {date?.map(date => {
                   return <React.Fragment key={uuidv4()}>
                    <Date key={uuidv4()}>{date}</Date>
                    {getComments?.map(message => {
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

export default Dialogues;

interface PropsType {
    getComments: CommentType[]
}

