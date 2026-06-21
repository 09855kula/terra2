import React, {useState} from "react"

import {motion} from "framer-motion"

const AnimatedPulse: React.FC<{keyElement?: string | number, delay?: number, scale?: number[]}> = 
({children, keyElement, delay = 0, scale = [1, 1.05, 1.1, 1.05, 1]}) => {
  const [pulseOnce, setPulseOnce] = useState<boolean>(false)
  
  return (
    <motion.div
      key={keyElement}
      variants={{
        // hidden: {
        //   opacity: 1,
        //   scale: 1,
        // },
        visible: {
          opacity: 1,
        },
      }}
      // initial="hidden"
      animate="visible"
      // onAnimationComplete={() => setPulseOnce(true)}
    >
      <motion.div
        key={keyElement}
        variants={{
          pulse: {
            scale: scale,
             transition: {
              duration: 0.3,
              delay: delay
            },
          },
        }}
        animate={"pulse"}
        // onAnimationComplete={() => setPulseOnce(false)}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default AnimatedPulse