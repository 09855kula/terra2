const scrollToElement = (element: string) => {
    const container = document.getElementById(element)
    // console.log(container);

    container && setTimeout(() => {
        window.scrollTo({   
            behavior: container ? "smooth" : "auto",
            top: container ? container.offsetTop : 0
        })
    }, 300)
    
    
}

export default scrollToElement