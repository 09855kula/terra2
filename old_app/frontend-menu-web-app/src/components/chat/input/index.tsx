import {Input, InputWrapper} from './styled';
import React, {MouseEvent} from 'react'

import { Image } from '../../common';
import image from '../../../assets/icons/image.svg'
import send from '../../../assets/icons/sendIcon.svg'

const ChatInput = ({text, setText, sendComment, isCustomer}:PropsType) => {
    const isDriver = isCustomer === 'Driver' ? 'driver' : 'customer service'

    function onChange({
        target: {
        validity,
        files
        },
    }: React.ChangeEvent<HTMLInputElement>) {
        console.log(validity)
    // if (validity.valid) mutate({ variables: { file } });
        if (validity.valid){
            console.log('valid', files)
        } else {
            console.log('error')
        };

    }

    return (
        <InputWrapper>
            <button className="chat__image-btn">
                <label htmlFor="upload-file">
                    <Image src={image}/>
                </label>
                <input type="file" name="photo" id="upload-file" onChange={onChange}/>
            </button>
            <Input 
                placeholder={`Type here to chat with ${isDriver}`} 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                onKeyUp={(evt) => {
                    if (evt.key === 'Enter' || evt.code === 'Enter') {
                        sendComment();
                    }
                    }}
                />
            <button className={ text.length ? "chat__send-btn active" : "chat__send-btn"} 
                onClick={sendComment}>
                <Image src={send}/>
            </button>
        </InputWrapper>
    )
}

export default ChatInput

interface PropsType {
    text: string
    setText: (text: string) => void
    sendComment: () => void
    isCustomer: string
}