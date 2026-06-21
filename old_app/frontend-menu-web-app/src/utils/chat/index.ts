import moment from "moment"

export const chat = {
    time: (time: string) => moment(time).format('h:mm')
}

export default chat