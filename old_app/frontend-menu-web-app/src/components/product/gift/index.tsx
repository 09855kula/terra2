import {
    BackGround,
    MessageText,
    PlusButton,
} from '../styled';
import {Flex, Image} from '../../common'

import Plus from '../../../assets/icons/plus.png'
import React from 'react'

export default function GiftProducts({addGiftProduct}: PropsType) {

    return (
        <Flex margin={'10px 0 0 0'}>
            <MessageText margin={'10px'}>Add it to the Starter Kit {`>`}</MessageText>
            <PlusButton onClick={addGiftProduct}>
                <Image src={Plus}/>
            </PlusButton>
            <BackGround/>
        </Flex>
    )
}

interface PropsType {
    addGiftProduct: () => void
}
