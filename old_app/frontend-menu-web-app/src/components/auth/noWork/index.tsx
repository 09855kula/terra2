import {Logout, Text, Title, WrapperNoWork} from "../styled";

import React from 'react';

interface PropsType {
    setRoute: (route: string) => void
}

const NoWork = ({setRoute}: PropsType) => {
    return (
        <WrapperNoWork width={'100%'}>
            <Title>We don’t work today :(</Title>
            <Text margin={'28px 0 165px 0'}>Please come back tomorrow</Text>
            <Logout onClick={() => setRoute('main')}>Log out</Logout>
        </WrapperNoWork>
    );
}
;

export default NoWork;
