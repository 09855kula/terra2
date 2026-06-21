import {Button, Input} from '../common';
import {LOGIN} from "../../api";
import React, {KeyboardEvent, useState} from 'react';
import {Text, Title, Wrapper} from "./styled";
import {useMutation} from "@apollo/client";
import logo from '../../assets/logo.svg'
import {useNavigate} from "react-router";
import EnterCode from './enterCode';
import Loader from '../loader';
import {Navigate} from 'react-router-dom'
import NoWork from './noWork';
import ReferredFriend from './referredFriend';
import {local} from '../../utils'
import InvalidCode from "./invalidCode";
import WeDidnt from "./weDidnt";

const Auth = ({isAuth}: {isAuth: (auth: boolean) => void}) => {
    const user = local.getToken()
    const [phone, setPhone] = useState<string>('')
    const [route, setRoute] = useState('main')
    const [noNumber, setNoNumber] = useState(false)
    const [isReferred, setReferred] = useState(false)
    const [token, setToken] = useState<string>('')
    const navigate = useNavigate()
    const [intro, setNoIntro] = useState(false)
    const [login, {loading, data}] = useMutation(LOGIN)
    // console.log('auth', user)
    // const oneString = 'We didn’t find an account'
    // const text = noNumber ?
    //     `Please use our bot instead. Click here https://t.me/crazyawesomerbot to access the bot`
    //     : "Enter your phone number to login"
    //
    // const title = noNumber ? "Sorry today web shop is unavailable!"
    //     : "Hey there!"
    const oneString = 'We didn’t find an account'
    const text = noNumber ?
        'We didn’t find an account \n attached to this number.'
        : "Enter your phone number to login"

    const title = noNumber ? "We couldn’t find you"
        : "Hey there!"
    const getUser = async () => {
        // console.log(phone.length);
        if (phone.length > 6) {

            await login({
                variables: {
                    phone: phone.replace(/[^0-9.]/g, '')
                }
            }).then(({data}) => {
                // console.log(data);
                if (data?.login && !data?.login.new_profile) {
                    setRoute('code')
                    setToken(data?.login?.token)
                } else {
                    setRoute('wedidnt')               }
            }).catch(err => {
                    console.log('error');
                    setNoNumber(true)
            })


        }
    }

    const handleKeypress = (e: KeyboardEvent) => {
      //it triggers by pressing the enter key
        if (e.key === "Enter" && e.code === "Enter") {
            getUser()
        }
    };

    if (user) return <Navigate to='/' replace/>
    if (loading) return <Loader/>
    return (
        <Wrapper>
            <div>
                {route === 'main' && <>
                    <Title>{title}</Title>
                    <Text>{text}</Text>
                    {/*{noNumber*/}
                    {/*    ? <Text>Please use our bot instead. Click  <a href='https://t.me/crazyawesomerbot'>here</a> to access the bot</Text>*/}
                    {/*    : <Text>Enter your phone number to login</Text>*/}
                    {/*}*/}
                    <Input required type="tel" value={phone} pattern="/+[0-9]{3}-[0-9]{3}/"
                           placeholder={'1 XXX XXX XX XX'}
                           onChange={(e) => setPhone(e.target.value.replace(/[a-zа-яё]/g, ""))}
                           onKeyPress={handleKeypress}
                           autoFocus
                    />
                    {!noNumber && <Button margin={"18px 0 0 0"} value={'Notification'} onClick={getUser}>Continue</Button>}
                    {noNumber && <Button margin={"18px 0 0 0"} value={'Notification'} onClick={getUser}>Try again</Button>}
                </>}
                {route === 'code' && <EnterCode
                    setRoute={setRoute} userToken={token} setIsAuth={isAuth} phone={phone.replace(/[^0-9.]/g, '')} profileId={data?.login?.last_profile}/>}
                {isReferred && <ReferredFriend/>}
                {route === 'nowork' && <NoWork setRoute={setRoute}/>}
                {route === 'wedidnt' && <WeDidnt setRoute={setRoute}/>}

                {route === 'invalid' && <InvalidCode setRoute={setRoute} setNoNumber={setNoNumber}/>}
            </div>
        </Wrapper>
    );
};

export default Auth;