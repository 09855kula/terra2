import {Button, Container, DefaultButton, Input, Text, Title, Wrapper} from './styled'
import {ButtonFlex, Image} from '../../common'
import React, {KeyboardEvent, useState} from 'react'

import { AnimatePage } from '../..'
import { CHANGE_PHONE } from '../../../api/mutation/profile'
import { Link } from 'react-router-dom'
import arrowLeft from "../../../assets/icons/arrowLeftWhite.svg";
import { local } from '../../../utils';
import { useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications';
import { useWindowDimension } from '../../../hooks/useWindowDimension';

const ChangeNumber = ({userId}: PropsType) => {
  const [width] = useWindowDimension()
  const { addToast } = useToasts();
  const is743 = width >= 744;
  //
  const [changeUserPhone] = useMutation(CHANGE_PHONE)
  //
  const [phone, setPhone] = useState<string>('')
  //
  const disable = (phone.length < 6)
 
  const changeNumber = async () => {
    await changeUserPhone({
            variables: {
                phone,
                userId}
            }).then(({ data }) => {
                setPhone('')
                addToast(`Phone number successfully updated` , {appearance: 'success', autoDismiss: true});
                setTimeout(() => {
                  local.removeToken()
                  window.location.reload()
                }, 3000)
            }).catch((err) => console.log('error', err))
  }

  const handleKeypress = (e: KeyboardEvent) => {
      //it triggers by pressing the enter key
    if (e.key === "Enter" && e.code === "Enter") {
      changeNumber()
    }
  };

  return (
    <AnimatePage>
      <Wrapper>
        <Title><h3>Enter new phone number</h3></Title>
        <Container>
          <Text>Please enter your new phone <br /> number, which will be used</Text>
          <Input required type="tel" value={phone} pattern="/+[0-9]{3}-[0-9]{3}/"
                placeholder={is743 ? 'Phone number' : '+1 412 231 58 90'}
                onChange={(e) => setPhone(e.target.value)}
                onKeyPress={handleKeypress}
          />
          {!is743 && <Button margin={"18px 0 0 0"}  onClick={changeNumber} disabled={disable}>Confirm</Button>}
          {is743 && 
          <ButtonFlex className="desktop__btn-wrapper"> 
              <Link to='/profile'>
                <DefaultButton width={'133px'}>
                  <Image src={arrowLeft}/>
                    Back
                </DefaultButton>
              </Link>
              <DefaultButton 
                  width={'198px'} 
                  disabled={disable}
                  onClick={changeNumber}
                >Confirm</DefaultButton>
          </ButtonFlex>}
        </Container>    
      </Wrapper>
    </AnimatePage>
  )
}

export default ChangeNumber

interface PropsType {
    userId: number
}