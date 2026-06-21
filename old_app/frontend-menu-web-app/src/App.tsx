import {Auth, Loader} from './components/'
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom'
import React, {useEffect, useState} from 'react';
import {local, users} from './utils';
import {Cart} from "./context/cartContext";
import {GET_USER} from "./api";
import {Main} from './pages';
import moment from 'moment';
import {useLazyQuery} from "@apollo/client";
import ReferredFriend from "./components/auth/referredFriend";
import {detect} from "detect-browser";


moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s",
        s: 's',
        ss: '%ss s',
        m: "ago",
        mm: "%dm",
        h: "1h ",
        hh: "%dh",
        d: "d ago",
        dd: "%dd",
        w: "a week",
        ww: "%d weeks",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }
});

function App() {
    const token = local.getToken();
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [isRefer, setIsRefer] = useState<boolean>(false)
    const [login, {loading, data}] = useLazyQuery(GET_USER)
    const navigate = useNavigate()
    const [intro, setIntro] = useState(false)
    useEffect(() => {
        if (token) {
            setIsAuth(true)
        }
        token && login({variables: {phone: token}})
            .then(({data}) => {
                if (data?.getUser?.limited) {
                    users.checkExpire(data?.getUser?.limited)
                }
            })
    }, [token])
    const browser = detect();
    if (browser) {
        console.log('browser.name:', browser.name)
    }
    if (loading) return <Loader/>
    return (
        <>
            <Routes>
                <Route path='/intro/:id' element={<ReferredFriend/>}/>
                <Route path='/auth' element={<Auth isAuth={setIsAuth}/>}/>
                <Route path='*'
                       element={!token ? <Navigate to="/auth"/> : <Cart><Main data={data?.getUser}/></Cart>}/>
            </Routes>
        </>
    )
}
export default App;

