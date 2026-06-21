import {Button, Container, Content, MoreText, NotiSubText, NotiText, Wrapper} from './styled'
import React, {ReactElement, useState} from 'react';

import {Link} from 'react-router-dom'
import {OrderType} from '../../../types';
import moment from 'moment';
import useUserNotification from '../../../hooks/subscription/useUserNotification';
// import {notificationSet} from "../../auth";
import logo from '../../../assets/logo.svg'
import {detect} from "detect-browser";
import {subscribeUser} from "../../../subscription";
const Notification = ({order, phone}: {order?: OrderType, phone: string}) => {
    const getUserNotification = useUserNotification(phone)
    // subscribeUser()
    const messageCreated = moment(getUserNotification?.created).add(7, 'minutes').fromNow(true)
    moment.updateLocale('en', {
        relativeTime : {
            future: "in %s",
            past:   "%s",
            s  : '%d s',
            ss : '%d s',
            m:  "%d min",
            mm: "%d min",
            h:  "an hour",
            hh: "%d hours",
            d:  "a day",
            dd: "%d days",
            w:  "a week",
            ww: "%d weeks",
            M:  "a month",
            MM: "%d months",
            y:  "a year",
            yy: "%d years"
        }
    });
    return (
        <>
        {getUserNotification && 
            <Message 
                created={messageCreated}
                title={getUserNotification.title}
                desc={getUserNotification?.description}
            />}
        </>
    );
};

const Message = ({created, title, desc}: PropsType) => {
    const splitTitle = title.split(' ')
    const [isDisabled, setDisabled] = useState<boolean>(true)
    const defaultTitle = splitTitle[splitTitle.length - 1] === 'messages!' ? 'messages!' : title
    const onShareClick = () => {
        navigator.clipboard.writeText(desc).then(r => console.log(r));
    };
    const browser = detect();
    if (browser && browser.name !== 'safari'|| browser && browser.name !== 'ios' || browser && browser.name !== 'ios-webview' || browser && browser.name !== 'miui') {
        console.log('browser:',browser)
        console.log('browser:',browser.name)
        subscribeUser(desc,title, logo)

        // notificationSet(desc, title, logo)
    }

    return (
        <Wrapper>
            <Container>
            <Content padding={object[defaultTitle]?.padding}>
                <NotiText welcome={object[defaultTitle]?.title === 'welcome'}>
                    {title}
                    <span>{created} ago</span>
                </NotiText>

                {desc.includes('http')
                ?
                    <NotiSubText>
                    <button className='btn__refer-copy' onClick={onShareClick} disabled>Copy Refer</button>
                    </NotiSubText>
                :object[defaultTitle]?.isMoreText ?
                        <MoreText>
                            {desc}
                        </MoreText>
                        :
                        <NotiSubText
                            welcome={object[defaultTitle]?.title === 'welcome'}
                            dangerouslySetInnerHTML={{ __html: `${desc}`}}/>

                }

            </Content>
           {object[defaultTitle]?.link && <Link to={object[defaultTitle]?.link || '/'}>
                <Button width={object[defaultTitle]?.width} opacity={object[defaultTitle].opacity}>{object[defaultTitle]?.buttonText}</Button>
            </Link>}
            </Container>
        </Wrapper>
    );
};

export default Notification;

interface PropsType {
    created?: string
    title: string
    desc: string
}

interface ObjectType {
    [key: string]: {
        title?: string, 
        desc?: ReactElement, 
        padding?: string,
        link?: string,
        buttonText?: string
        width?: string
        isMoreText?: boolean
        opacity?: number
    }
}

const object: ObjectType = {
    'Your order has been made!': {title: 'Your order has been made!', desc: <>You will be notified when <br/>we will confirm it. Please wait</>},
    'welcome': {title: 'welcome', 
        desc: 
        <>
            We're a small local service focusing on quality and honesty over everything 
            <br/> <br/>
            Too many websites say AAAA when it's AA, 30% when it's 15%, whole plant extract 
            when it's just shake and stem extract. We promise to be forward about all of 
            this and not lie. You'll know what we know. 
            <br/> <br/>
            Feel free to browse around using the Menu button. 
            <br/> <br/>
            If something isn't up to your standards, have any questions, suggestions, 
            feedback, or wanna just send pictures of dogs licking windows, contact 
            Customer Service. 
            <br/> <br/>
            10 out of 10 you'll get me, Travis 🙂 
            <br/> <br/> <br/>
            Send this link to your friend 
        </>},
    'New message!': {
        padding: '42px',
        buttonText: 'Reply',
        // link: '/customer_service',
        link: '/',
        opacity: 0.4,
        isMoreText: true
    },
    'messages!': {
        padding: '42px',
        buttonText: 'Check updates',
        // link: '/customer_service',
        link: '/',
        opacity: 0.4,
        isMoreText: true,
        width: '206px'
    },
    'Your order is accepted!': {
        padding: '26px',
    },
    'Your order was canceled': {
        padding: '42px',
        buttonText: 'Chat',
        opacity: 0.4,
        link: '/',
        // link: '/customer_service',
    },
    'Order is delivered!': {
        padding: '37px',
        buttonText: 'Rate service',
        link: '/',
        opacity: 0.4,
        // link: '/customer_service',
    },
    'Address is approved': {},
    'We miss you!': {
        padding: '37px',
        buttonText: 'Chat with customer service',
        link: '/',
        // link: '/customer_service',
        opacity: 0.4,
        width: '294px'
    },
    "We're a mess without you..": {
        padding: '37px',
        buttonText: 'Open the Menu',
        link: '/products',
        width: '254px'
    }
}
