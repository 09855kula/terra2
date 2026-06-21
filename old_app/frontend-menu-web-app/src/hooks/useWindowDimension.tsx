import React, { useEffect, useState } from 'react';

import _ from 'lodash'

export function useWindowDimension() {
  const [dimension, setDimension] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  useEffect(() => {
    const debouncedResizeHandler = _.debounce(() => {
      console.log('***** debounced resize'); // See the cool difference in console
      let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setDimension([window.innerWidth, window.innerHeight]);
    }, 400); // 100ms
    window.addEventListener('resize', debouncedResizeHandler);
    return () => window.removeEventListener('resize', debouncedResizeHandler);
  }, []); // Note this empty array. this effect should run only on mount and unmount
  
  return dimension;
}