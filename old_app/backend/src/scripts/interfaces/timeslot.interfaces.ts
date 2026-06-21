interface RouteType {
    id: string
    name: string
    cut_offs: String[]
    cut_offs_2: String[]
    points: PointsType[]
}

interface PointsType {
    index: number
    district: string
    timeslot: string
    weekday: string
}

interface RouteResponseType {
    timeslot: string
    weekday: string
    cutOff: string
}