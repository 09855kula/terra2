const packConverter = (pack: number, index: number): number => {
    let result = 1;

    switch(pack) {
        case 1:
        case 30:
            if (index < 3) {
                result = result * index
            }else {
                result = pack * 4
            }
            break;
        case 7:
        case 6:
        case 28: 
            if (index < 3) {
                result = pack * index
            } else {
                result = pack * 4
            }   
    }

    return result
}

export default packConverter