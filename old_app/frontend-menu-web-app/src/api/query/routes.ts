import {gql} from '@apollo/client'

export const GET_ROUTES = gql`
    query getRoutesByDistrictFromProfile($profileId: String!) {
        getRoutesByDistrictFromProfile(id: $profileId){
            timeslot
            weekday
            cutOff
        }
    }
`