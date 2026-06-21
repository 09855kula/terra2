import React, {useEffect, useState} from 'react'

import { GET_PROFILE } from '../api/query/profile';
import { UserProfileType } from '../types';
import { useQuery } from '@apollo/client';

export default function useGetProfile(userId: number) {
    const {data, loading} = useQuery<{getProfile: UserProfileType[]}>(GET_PROFILE, {variables: {userId: userId}, fetchPolicy: "cache-and-network"})
    const [profiles, setProfiles] = useState<UserProfileType[]>();
    //
    useEffect(() => {
        if (data?.getProfile) {
            setProfiles(data?.getProfile)
        }
    }, [data, userId]);

    return {profiles, loading};
}
