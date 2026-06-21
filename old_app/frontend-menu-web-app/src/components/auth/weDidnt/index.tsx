import {Logout, Text, Title, WrapperNoWork} from "../styled";

import React from 'react';

interface PropsType {
    setRoute: (route: string) => void
}

const WeDidnt = ({setRoute}: PropsType) => {
        return (
            <WrapperNoWork width={'100%'}>
                <Title>We couldn’t find you</Title>
                <Text margin={'28px 0 165px 0'}>We didn’t find an account <br/> attached to this number.</Text>
                <Logout onClick={() => setRoute('main')}>Log out</Logout>
            </WrapperNoWork>
        );
    }
;

export default WeDidnt;