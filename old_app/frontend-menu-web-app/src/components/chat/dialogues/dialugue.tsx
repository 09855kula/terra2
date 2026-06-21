import {Customer, Driver, DriverWrapper, Text, Time} from './styled'

import { Image } from '../../common';
import { chat } from '../../../utils/chat';
import driver from '../../../assets/icons/driver.svg'
import { v4 as uuidv4 } from 'uuid';

const includes = {
    admin: ['admin'],
    notification: ['notification'], 
    announcement: ['announcement'],
    costumer: ['trusted', 'newbie']
}

const Dialogue = ({created, text, role}: CommetType) => {
     if (includes.admin.includes(role)) {
        return (
            <DriverWrapper key={uuidv4()}>
                <Image src={driver}/>
                <Driver>
                    <Text>{text}</Text>
                    <Time>{chat.time(created)}</Time>
                </Driver>
            </DriverWrapper>)}
    if (includes.costumer.includes(role)) {
        return( 
            <Customer key={uuidv4()}>
                <Text>{text}</Text>
                <Time>{chat.time(created)}</Time>
            </Customer>)}
    if (includes.notification.includes(role)) {
        return( 
            <Driver key={uuidv4()}>
                <Text>{text}</Text>
                <div><p>NOTIFICATION</p><Time>{chat.time(created)}</Time></div>
            </Driver>)}
    if (includes.announcement.includes(role)) {
        return( 
            <Driver key={uuidv4()}>
                <Text>{text}</Text>
                <div><p>Announcement</p><Time>{chat.time(created)}</Time></div>
            </Driver>)}

    return <></>
}

export default Dialogue

interface CommetType {
    role: string
    created: string
    text: string
    image?: string
    user_id?: number
}