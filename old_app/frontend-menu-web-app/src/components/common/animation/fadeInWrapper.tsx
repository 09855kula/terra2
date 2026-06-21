import React from 'react'
import {motion} from 'framer-motion'

const FadeInWrapper: React.FC<{keyElement: string | number, duration?: number}> = ({children, keyElement, duration = 0.5}) => {
    return (
        <motion.div 
            key={keyElement}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{duration: duration}}
            style={{width: '100%'}}
            >
            {children}
        </motion.div>
    )
}

export default FadeInWrapper;