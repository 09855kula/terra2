import React from 'react'
import {motion} from 'framer-motion'

const AnimatePage: React.FC<{}> = ({children}) => {
    return (
        <motion.div 
            exit={{opacity: 0, x: -100}}
            initial={{opacity: 0, x: 100}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.3}}
            >
            {children}
        </motion.div>
    )
}

export default AnimatePage;