import React, {useEffect, useState} from 'react'

import { GET_ROUTES } from '../api/query/routes';
import { RouteResponseType } from '../types';
import {delivery} from '../utils'
import { useQuery } from '@apollo/client';

export default function useGetRoutes(profileId: string ) {
    const {data, loading} = useQuery<{getRoutesByDistrictFromProfile: RouteResponseType[]}>(GET_ROUTES, {variables: {profileId: profileId.toString()}})
    const [routes, setRoutes] = useState<RouteResponseType[]>();
    console.log('profileIdUseGetRoutes:', profileId,  typeof profileId)
    const deliveryRoutes = data?.getRoutesByDistrictFromProfile && delivery.getDileveryWindows(data?.getRoutesByDistrictFromProfile) || [
        {weekday: 'Monday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Tuesday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Wednesday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Thursday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Friday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Saturday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Sunday', timeslot: 'Day Off!', cutOff: ''},

    ]
    const chooseDeliveryWindow = data?.getRoutesByDistrictFromProfile && delivery.getChooseDeliveryWindow(data?.getRoutesByDistrictFromProfile) || [
        {weekday: 'Monday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Tuesday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Wednesday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Thursday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Friday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Saturday', timeslot: 'Day Off!', cutOff: ''},
        {weekday: 'Sunday', timeslot: 'Day Off!', cutOff: ''},

    ]
    // const deliveryRoutes = data?.getRoutesByDistrictFromProfile || []
    console.log('chooseDeliveryWindow????:', chooseDeliveryWindow)
    const dataWeek = data?.getRoutesByDistrictFromProfile && delivery.formatRoutesDeliveryWindows(data?.getRoutesByDistrictFromProfile)
        || {
            monday: [{weekday: 'Monday', timeslot: 'Day Off!', cutOff: ''}],
            tuesday: [{weekday: 'Tuesday', timeslot: 'Day Off!', cutOff: ''}],
            wednesday: [{weekday: 'Wednesday', timeslot: 'Day Off!', cutOff: ''}],
            thursday: [{weekday: 'Thursday', timeslot: 'Day Off!', cutOff: ''}],
            friday: [{weekday: 'Friday', timeslot: 'Day Off!', cutOff: ''}],
            saturday: [{weekday: 'Saturday', timeslot: 'Day Off!', cutOff: ''}],
            sunday :[{weekday: 'Sunday', timeslot: 'Day Off!', cutOff: ''}]

        }



    useEffect(() => {
        if (data?.getRoutesByDistrictFromProfile) {
            setRoutes(data?.getRoutesByDistrictFromProfile)
        }
    }, [data]);

    return {routes, deliveryRoutes, loading, dataWeek, chooseDeliveryWindow};
}
