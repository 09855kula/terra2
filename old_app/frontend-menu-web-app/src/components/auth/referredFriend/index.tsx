import React, {KeyboardEvent, useEffect, useState} from 'react';
import {Text, Title, Wrapper, Refer} from "../styled";
import {Button, Input, TextField} from "../../common";
import {useNavigate, useParams} from "react-router";
import {useMutation, useQuery} from "@apollo/client";
import {GET_NEW_USER, SET_NEW_PROFILE_FALSE, SET_USE_SAFARI} from "../../../api";
import {Loader} from "../../index";
import {useWindowDimension} from "../../../hooks/useWindowDimension";
import {NavLink} from "react-router-dom";
import {CHANGE_PHONE, CHANGE_PROFILE} from "../../../api/mutation/profile";
import {SET_FIRST_NAME} from "../../../api";
import {useToasts} from "react-toast-notifications";
import {UserProfileType} from "../../../types";
import {GET_LAST_PROFILE} from "../../../api/query/profile";
const { detect } = require('detect-browser');

const ReferredFriend = () => {


    const [step, setStep] = useState(0)
    const [name, setName] = useState('')
    const [customAddress, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [changeUserPhone] = useMutation(CHANGE_PHONE)
    const [setUserFirstName] = useMutation(SET_FIRST_NAME)
    const [newProfileFalse] = useMutation(SET_NEW_PROFILE_FALSE)
    const [changeProfile] = useMutation(CHANGE_PROFILE)
    const [setUseSafari] = useMutation(SET_USE_SAFARI)
    const {addToast} = useToasts();
    const [profileId, setProfileId] = useState<string>()
    const [isDisabled, setIsDisables] = useState<boolean>(false)

    const disable = (phone.length < 6)
    const [instruction, setInstruction] = useState('')
    const [width] = useWindowDimension()
    const isWidth = width && width > 743;
    const {id} = useParams();
    const {data: User, loading} = useQuery(GET_NEW_USER, {variables: {id: Number(id)}})
    const {data: GetLastProfile} = useQuery<{getLastProfile: UserProfileType}>(GET_LAST_PROFILE, {variables: {profileId: profileId}})
    const navigate = useNavigate()
    // if (User?.getNewUser == null) {
    //     navigate('/auth')
    // }
    console.log('getLastProfile:', GetLastProfile)
    useEffect(() => {

        if (User?.getNewUser) {
            const {address, addresses, phone: new_phone, phones, new_profile, last_profile, first_name} = User.getNewUser
            if (!new_profile) {
                navigate('/auth')
            }
            if(first_name === null) {
                setName('')
            }
            if(first_name) {
                setName(first_name)
            } else {
                setName('Guest')
            }
            if (GetLastProfile?.getLastProfile) {
                setAddress(GetLastProfile?.getLastProfile?.address)
            } else {

                if(addresses)
                {
                    setAddress(addresses[0])
                } else {
                    setAddress('Default')

                }
            }
            console.log('new_phone:',new_phone)
            if (new_phone) {
                setPhone(new_phone)

            } else {
                setPhone(phones[0])

            }
            if (last_profile) {
                setProfileId(last_profile.toString())
            }
            if(GetLastProfile?.getLastProfile) {
                const {special_instructions} = GetLastProfile?.getLastProfile
                setInstruction(special_instructions)
            }
        }

    }, [GetLastProfile?.getLastProfile, id, phone, User?.getNewUser]);

    const changePhone = async () => {
        if(phone === User?.getNewUser.phone)
        {
            setStep(1)
        } else {
            await changeUserPhone({
                variables: {
                    phone,
                    userId: Number(id)
                }
            }).then(({data}) => {
                addToast(`Phone number successfully updated`, {appearance: 'success', autoDismiss: true});
                setStep(1)
            }).catch((err) => console.log('error', err))
        }
    }

    const changeFirstName = async () => {
            await setUserFirstName({
                variables: {
                    phone,
                    first_name: name
                }
            }).then(({data}) => {
                addToast(`First name successfully saved`, {appearance: 'success', autoDismiss: true});
                setStep(2)
            }).catch((err) => console.log('error', err))
        }

    const handleKeypress = (e: KeyboardEvent) => {
        //it triggers by pressing the enter key
        if (e.key === "Enter" && e.code === "Enter") {
            changePhone()
        }
    };
    const handleKeypressName = (e: KeyboardEvent) => {
        if (e.key === "Enter" && e.code === "Enter") {
            changeFirstName()
        }
    };
    const handleKeypressAddress = (e: KeyboardEvent) => {
        if (e.key === "Enter" && e.code === "Enter") {
            setStep(3)
        }
    };
    const setSpecialInstruction = async () => {
        await changeProfile({
            variables: {
                phone,
                special_instruction: instruction,
                address: customAddress
            }
        }).then(async ({data}) => {
            const browser = detect();

            if (browser && browser.name === 'safari' || browser && browser.name === 'ios' || browser && browser.name === 'ios-webview' || browser && browser.name === 'miui' ) {
                console.log('browser.name:', browser.name)
                console.log('browser.data:', browser)
                setStep(4)
            } else {
                setStep(5)
                // setIsDisables(true)
                await notificationsAndAuthDisabled()

            }
            addToast(`Profile successfully saved`, {appearance: 'success', autoDismiss: true});
        }).catch((err) => console.log('error', err))
    }
    const handleKeypressInstruction = async (e: KeyboardEvent) => {
        if (e.key === "Enter" && e.code === "Enter") {
            await setSpecialInstruction()
        }

    };

    const notificationsAndAuth = async () => {
        await notificationSet()
    }
    const notificationsAndAuthDisabled = async () => {
        await notificationSetDisabled()
    }
    const setNewProfileFalse = async () => {
        await newProfileFalse({
            variables: {
                phone,
            }
        }).then(({data}) => {
            addToast(`You have successfully registered in the system`, {appearance: 'success', autoDismiss: true});
        }).catch((err) => console.log('error', err))

    }
    const notificationSet = async () => {
            if(!('Notification' in window)) {
                alert('Your browser does not support notifications')
                console.log('Your browser does not support notifications')
            } else if(Notification.permission === 'granted') {
                await setNewProfileFalse()
                navigate('/auth')
                console.log('You notifications permission granted')
            } else if(Notification.permission !== 'denied') {
                Notification.requestPermission(async (permission) => {
                    console.log('permission:',permission)
                    if (permission === 'granted') {
                        await setNewProfileFalse()
                        console.log('You granted')
                        navigate('/auth')
                    } else {
                        console.log('You denied')
                        setIsDisables(true)
                        setStep(1)
                    }
                }).then( r => console.log('r:', r))
            }
    }
    const notificationSetDisabled = async () => {
        if(!('Notification' in window)) {
            alert('Your browser does not support notifications')
            console.log('Your browser does not support notifications')
        } else if(Notification.permission === 'granted') {
            setIsDisables(false)
            console.log('You notifications permission granted')
        } else if(Notification.permission !== 'denied') {
            Notification.requestPermission(async (permission) => {
                console.log('permission:',permission)
                if (permission === 'granted') {
                    console.log('You granted')
                    setIsDisables(false)
                } else {
                    console.log('You denied')
                    setIsDisables(true)
                }
            }).then( r => console.log('r:', r))
        }
    }
    const clientUseSafariSendSms = async  () => {
        await setUseSafari({
            variables: {
                phone,
            }
        }).then(({data}) => {
            addToast(`Sms alert successfully connected for you!`, {appearance: 'success', autoDismiss: true});
        }).catch((err) => console.log('error', err))
        await setNewProfileFalse()
        navigate('/auth')
    }
    if (loading) return <Loader/>
    return (
        <Wrapper>
            <div>
                {isWidth
                    ? <Title>Sorry!
                        <br/><br/>Registration is possible only on a mobile device ;(
                    </Title>
                    :
                    <>
                        {step === 0 && <>
                            <Title>Oh hey!
                                <br/><br/>Looks like you've been invited to our little club ;)
                            </Title>
                            <Text margin={'26px 0 25px 0'}>
                                Here is the phone number<br/>connected to your account.<br/><br/>
                                Press continue to receive an<br/>authorization code
                            </Text>
                            <Input
                                required
                                type="tel"
                                value={phone}
                                pattern="/+[0-9]{3}-[0-9]{3}/"
                                onChange={(e) => {
                                    setPhone(e.target.value)

                                }}
                                onKeyPress={handleKeypress}
                                autoFocus
                            />
                            <Button
                                margin={"25px 0 0 0"}
                                onClick={changePhone}
                                disabled={disable}
                            >Continue</Button>
                        </>}
                        {step === 1 && <>
                            <Title>Hey there!</Title>
                            <Text margin={'14px 0 22px 0'}>
                                Now before we get started.<br/>
                                May I know your name?
                            </Text>
                            <Input
                                required
                                type="text"
                                value={name}
                                placeholder='Enter your name here'
                                font={'16px'}
                                onChange={(e) => setName(e.target.value)}
                                onKeyPress={handleKeypressName}
                                autoFocus
                            />
                            <Button disabled={!name.length} margin={"25px 0 0 0"}
                                    onClick={changeFirstName}>Continue
                            </Button>
                        </>}
                        {step === 2 && <>
                            <Title>Is that your address?</Title>
                            <Text margin={'14px 0 18px 0'}>
                                Is this the address you would like to <br/>
                                use for delivery?
                                <br/><br/>
                                Press on it to edit
                            </Text>
                            <Input
                                font={'16px'}
                                required type="text"
                                value={customAddress} placeholder='Enter your address here'
                                onChange={(e) => setAddress(e.target.value)}
                                onKeyPress={handleKeypressAddress}
                                autoFocus
                            />
                            <Button disabled={!customAddress.length} margin={"25px 0 0 0"}
                                    onClick={() => setStep(3)}>Continue
                            </Button>
                        </>}
                        {step === 3 && <>
                            <Title>Special instruction</Title>
                            <Text margin={'14px 0 14px 0'}>
                                Please write down your <br/>
                                special instruction.
                            </Text>
                            <TextField value={instruction}
                                       placeholder='Enter your instruction here'
                                       onChange={(e) => setInstruction(e.target.value)}
                                       onKeyPress={handleKeypressInstruction}
                                       autoFocus
                            />
                            <Button margin={"25px 0 0 0"}

                                    onClick={setSpecialInstruction}>
                                Continue
                            </Button>
                        </>}
                        {step === 4 && <>
                            <Title>Using Safari?</Title>
                            <Text margin={'21px 0 0 0'}>
                                Unfortunately, Safari iOS doesn’t allow <br/>
                                to send app-like notifications
                                <br/><br/>
                                We recommend to use Google Chrome<br/>
                                or Mozilla Firefox for our website
                                <br/><br/>
                                Otherwise, we’ll notify you by SMSs<br/>
                                instead. You won’t miss any valuable<br/>
                                info, but it’s just a bit less convenient
                                <br/><br/>
                            </Text>
                            <a href={'https://support.google.com/chrome/answer/95346?hl=en&co=GENIE.Platform%3DDesktop'}>
                                <Button margin={"25px 0 0 0"}>
                                    Download Chrome
                                </Button></a>
                            <Refer>
                                <NavLink className={'nav__link'} to={`/intro/${id}`} onClick={clientUseSafariSendSms}>That’s
                                    fine, just send me SMS</NavLink>
                            </Refer>
                        </>}
                        {step === 5 && <>
                            <Title>And the last step!</Title>
                            <Text margin={'21px 0 0 0'}>
                                Please allow push notifications in the <br/>
                                dialog box above.
                                <br/><br/>
                                It’s needed to inform you about your<br/>
                                order status, send messages from a<br/>
                                driver and etc
                                <br/><br/>
                                Allow them, and green button below<br/>
                                becomes active
                                <br/><br/>
                                If you accidentally clicked “Deny” -<br/>
                                just refresh the page and popup will<br/>
                                appear again
                            </Text>
                            <Button
                                margin={"25px 0 0 0"}
                                onClick={notificationsAndAuth}
                                value={'Notification'}
                                disabled={isDisabled}
                            >
                                Continue
                            </Button>
                        </>}
                    </>
                }
            </div>
        </Wrapper>
    );
};
export default ReferredFriend;


