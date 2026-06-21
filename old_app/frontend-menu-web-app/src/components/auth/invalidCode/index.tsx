import {Logout, Text, Title, WrapperNoWork} from "../styled";

import React from 'react';

interface PropsType {
    setRoute: (route: string) => void
    setNoNumber: (route: boolean) => void
}

const InvalidCode = ({setRoute, setNoNumber}: PropsType) => {
        return (
            <WrapperNoWork width={'100%'}>
                <Title>Invalid code</Title>
                <Text margin={'28px 0 165px 0'}>Code doesn’t match. <br/>Please try again. </Text>
                <Logout onClick={() =>
                {
                    setNoNumber(false)
                    setRoute('main')
                }
                    }>Try again</Logout>
            </WrapperNoWork>
        );
    }
;

export default InvalidCode;