//@ts-nocheck

import { SyntheticEvent, useEffect, useState } from 'react'

import _ from 'lodash'

function useScrollPosition(): number {
    const [position, setPosition] = useState<number>(0)
 
    useEffect(() => {
        const onScroll = (e: SyntheticEvent<HTMLElement>) => {
            if (e.target) {
                setPosition(e.target.documentElement.scrollTop)
            };
        };
        window.addEventListener("scroll",  _.throttle(onScroll, 500));

        return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
    return position;
}

export default useScrollPosition