import React from 'react'
import {motion} from 'framer-motion'

const HeightAnimation: React.FC<{keyElement: string | number, height?: string}> = ({children, keyElement, height = '100%'}) => {
    return (
        <motion.div 
            key={keyElement}
            initial={{ opacity: 1, height: '50px'}}
            animate={{ opacity: 1, height: '200px'}}
            transition={{duration: '0.5s'}}
            >
            {children}
        </motion.div>
    )
}

export default HeightAnimation;