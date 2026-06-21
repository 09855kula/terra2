//@ts-nocheck

import {Block, InputCode, Text, Title} from "../styled";
import React, {useState} from 'react';
import { CONFIRM } from "../../../api";
import {local} from '../../../utils/localStorageCart'
import { useMutation } from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {Loader} from '../../../components/'
interface PropsType {
    setIsAuth: (isAuth: boolean) => void
    setRoute: (route: string) => void
    phone: string
    userToken: string
    profileId: string
}

const EnterCode = ({phone, setIsAuth, userToken, setRoute, profileId}: PropsType) => {
    const navigate = useNavigate()
    const [value, setValue] = useState<string | null>(null)
    const [isComplete, setIsComplete] = useState(false)
    const [confirm, {loading, data}] = useMutation(CONFIRM)
    const [isInvalidCode, setInvalidCode] = useState<string>('')
    // console.log('userToken:', userToken)
    const checkCode = async (values) => {
        if (values.length === 4) {

            // if (values === userToken) {
            //     setIsComplete(true)
            //     setValue(null)
            //     local.createToken(phone)
            //     local.setUserSettings({profileId: profileId})
            //     setIsAuth(true)
            //     setTimeout(() => {
            //         return navigate('/')
            //     }, 3000)
            // } else {
            //     setRoute('nowork')
            // }
            await confirm({variables: {phone: phone.replace(/[^0-9.]/g, ''), token: Number(values)}})
                .then(({data}) => {
                    if (data?.confirmUser?.is_token_right) {
                        // console.log('confirm', data?.confirmUser?.is_token_right)
                        setIsComplete(true)
                        setValue(null)
                        local.createToken(phone)
                        local.setUserSettings({profileId: profileId})

                        setTimeout(() => {
                            setIsAuth(true)
                            navigate('/')
                        }, 1500)
                    }
                    if(data?.confirmUser?.is_token_reverse) {
                        setRoute('nowork')
                    }
                    if(data?.confirmUser?.is_token_invalid) {
                        setRoute('invalid')
                    }
                }).catch(err => {
                    console.log('err', err)
                    setRoute('invalid')
                })
        } 
    }
    if(loading) return <Loader/>
    return (
        <>
            {loading
                ? <>
                    <Title>Authorization complete</Title>
                    <Text>We are glad to see you! <br/> Please wait few seconds...</Text>
                </>
                :
                <>
                    {!isComplete ?
                        <>
                            <Title>Enter a code</Title>
                            <Text>You will receive authorization <br/> code within few minutes</Text>
                            <InputCode
                                type='number'
                                fields={4}
                                onChange={(value) => checkCode(value)}
                                autoFocus
                            />
                            <Block>
                                <Text>You will receive authorization code within few minutes</Text>
                            </Block>
                        </>
                        :
                        <>
                            <Title>Authorization complete</Title>
                            <Text>We are glad to see you! <br/> Please wait few seconds...</Text>
                        </>}
                </>
            }


        </>
    );
};

export default EnterCode;
