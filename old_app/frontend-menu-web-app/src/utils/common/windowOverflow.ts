const windowOverflow = (visible: boolean = false) => {

    if (visible) {
        document.body.style.overflowY = 'hidden'
        window.scrollTo(0, 0)
    } else {
        document.body.style.overflowY = 'auto'
    }

}

export default windowOverflow