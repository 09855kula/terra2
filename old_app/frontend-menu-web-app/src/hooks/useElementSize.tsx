import { useEffect, useRef, useState } from 'react'

import _ from 'lodash'

interface Size {
  width: number
  height: number
  windowWidth: number
  windowHeight: number
}

function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Size,
] {
    
    const ref: any = useRef();
    const [size, setSize] = useState<Size>({
        width: 0,
        height: 0,
        windowWidth: 0,
        windowHeight: 0,
    })
 
    const observer = useRef(
      new ResizeObserver((entries) => {
        const { height, width} = entries[0].contentRect;
        const { scrollHeight} = entries[0].target;
        document.documentElement.style.setProperty('--chatHeader', `${scrollHeight}px`);
        
        setSize({
            width: width || 0,
            height: height || 0,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        })
      })
    );
   
    useEffect(() => {
        observer.current.observe(ref.current);
      }, 
    [ref, observer]);
 
    return [ref, size];
}

export default useElementSize