import {AnimatePage, ChangeAddress} from '../..';
import {
    AnotherAddress,
    Block,
    Content,
    Italic,
    Route,
    RoutesText,
    ContentHeader,
    RouteSpanCutoffTwo,
    RouteSpanTimeslotTwo,
    ContentHeaderDayTablet,
    ContentHeaderCutoffTablet,
    ContentHeaderTimeslotTablet,
    RouteSpanCutoff,
    RouteSpanTimeslot,
    RouteSpanDay,
    ContentHeaderDay,
    ContentHeaderTimeslot,
    ContentHeaderCutoff,
    CutoffNumber,
    CutoffText,
    RouteSpanDayTwoTimeslots,
    RouteTwoTimeslots,
    RouteSpanTimeslotAndCutoffBlockTwoColumn,
    RouteSpanTimeslotAndCutoffBlockOneRow,
    ContentTablet,
    ContentHeaderTablet,
    TextBox,
    ItalicTablet,
    RouteTwoTimeslotsTablet,
    RouteSpanDayTwoTimeslotsTablet,
    RouteSpanTimeslotAndCutoffBlockTwoRows,
    RouteSpanTimeslotAndCutoffBlockOneRowTablet, RouteSpanTimeslotTwoTablet, RouteSpanCutoffTwoTablet
} from './styled'
import {MainContainer, MainContainerWindow} from "../../common";
import React, {useEffect} from 'react';

import {Link, useNavigate} from 'react-router-dom'
import {TitleBlock} from '../styled';
import {local} from '../../../utils';
import useGetProfiles from '../../../hooks/useGetProfiles'
import useGetRoutes from '../../../hooks/useGetRoutes'
import {useWindowDimension} from "../../../hooks/useWindowDimension";
import Menu from "../../menu";
import Loader from "../../loader";
import {LinkToProfile} from "../../checkout/checkoutAddress/styled";


const RoutesWindow = ({userId, setChangeAddress, changeAddress}: PropsType) => {
    const [width] = useWindowDimension();
    const is743 = width >= 743
    const defaultAddress = local.getUserSettings()
    console.log('defaultAddress1:', defaultAddress)
    const {profiles} = useGetProfiles(userId)
    console.log('profiles1:', profiles)
    const navigate = useNavigate()
    const {routes, dataWeek, loading} = useGetRoutes(defaultAddress?.profileId.toString())
    if (defaultAddress?.profileId) {
        if (profiles) {
            const firstData = profiles.filter(i => i.id === defaultAddress?.profileId.toString())[0]
            console.log('firstData:', firstData)
            local.setUserSettings({address: firstData.address, district: firstData.district})
        }


    }
    useEffect(() => {

        setChangeAddress(false)

    }, [setChangeAddress])
    console.log('dataWeek:', dataWeek)
    console.log('defaultAddress?.address:', defaultAddress?.address)
    if (loading) return <Loader/>
    return (
        <>
            {changeAddress ?
                <ChangeAddress userId={userId}/>
                :
                <AnimatePage>
                    <MainContainerWindow>
                        <Block>
                            <TitleBlock><h3>Delivery Window</h3></TitleBlock>
                            {is743 &&
                                <>
                                    <ContentTablet>
                                        <TextBox>
                                            <ItalicTablet className='inner'>A driver arrives at your
                                                area <br/> <i>{
                                                    defaultAddress.address
                                                        ? `(${defaultAddress?.address})`
                                                        : ''
                                                }</i>&nbsp;
                                                around:</ItalicTablet>
                                        </TextBox>
                                        <ContentHeaderTablet>
                                            <ContentHeaderDayTablet>Day</ContentHeaderDayTablet>
                                            <ContentHeaderTimeslotTablet>Timeslot</ContentHeaderTimeslotTablet>
                                            <ContentHeaderCutoffTablet>Cutoff</ContentHeaderCutoffTablet>
                                            <ContentHeaderTimeslotTablet>Timeslot</ContentHeaderTimeslotTablet>
                                            <ContentHeaderCutoffTablet>Cutoff</ContentHeaderCutoffTablet>
                                        </ContentHeaderTablet>
                                        {dataWeek && is743 && dataWeek.monday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslotsTablet>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        Monday:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.monday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 25}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        <>
                                                                            <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>
                                            </>}
                                        {dataWeek && is743 && dataWeek.monday.length < 2 && dataWeek.monday.map((el, idx) =>
                                            <>
                                                <RouteTwoTimeslotsTablet key={idx * 30}>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        {el.weekday}:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.monday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 35}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        {el.timeslot === 'Day Off!'
                                                                            ? <>
                                                                                {el.cutOff.replace(/[a-zа-яё]/gi, '')}
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                                <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                            </>
                                                                        }
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>

                                            </>)}
                                        {dataWeek && is743 && dataWeek.tuesday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslotsTablet>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        Tuesday:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.tuesday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 40}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        <>
                                                                            <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>
                                            </>}
                                        {dataWeek && is743 && dataWeek.tuesday.length < 2 && dataWeek.tuesday.map((el, idx) =>
                                            <>
                                                <RouteTwoTimeslotsTablet key={idx * 45}>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        {el.weekday}:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.tuesday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 50}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        {el.timeslot === 'Day Off!'
                                                                            ? <>
                                                                                {el.cutOff.replace(/[a-zа-яё]/gi, '')}
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                                <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                            </>
                                                                        }
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>

                                            </>)}
                                        {dataWeek && is743 && dataWeek.wednesday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslotsTablet>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        Wednesday:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.wednesday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 55}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        <>
                                                                            <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>
                                            </>}
                                        {dataWeek && is743 && dataWeek.wednesday.length < 2 && dataWeek.wednesday.map((el, idx) =>
                                            <>
                                                <RouteTwoTimeslotsTablet key={idx * 60}>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        {el.weekday}:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.wednesday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 65}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        {el.timeslot === 'Day Off!'
                                                                            ? <>
                                                                                {el.cutOff.replace(/[a-zа-яё]/gi, '')}
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                                <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                            </>
                                                                        }
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>

                                            </>)}

                                        {dataWeek && is743 && dataWeek.thursday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslotsTablet>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        Thursday:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.thursday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 70}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        <>
                                                                            <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>
                                            </>}
                                        {dataWeek && is743 && dataWeek.thursday.length < 2 && dataWeek.thursday.map((el, idx) =>
                                            <>
                                                <RouteTwoTimeslotsTablet key={idx * 75}>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        {el.weekday}:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.thursday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 80}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        {el.timeslot === 'Day Off!'
                                                                            ? <>
                                                                                {el.cutOff.replace(/[a-zа-яё]/gi, '')}
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                                <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                            </>
                                                                        }
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>

                                            </>)}
                                        {dataWeek && is743 && dataWeek.friday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslotsTablet>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        Friday:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.friday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 85}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        <>
                                                                            <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>
                                            </>}
                                        {dataWeek && is743 && dataWeek.friday.length < 2 && dataWeek.friday.map((el, idx) =>
                                            <>
                                                <RouteTwoTimeslotsTablet key={idx * 90}>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        {el.weekday}:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.friday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 95}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        {el.timeslot === 'Day Off!'
                                                                            ? <>
                                                                                {el.cutOff.replace(/[a-zа-яё]/gi, '')}
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                                <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                            </>
                                                                        }
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>

                                            </>)}
                                        {dataWeek && is743 && dataWeek.saturday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslotsTablet>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        Saturday:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.saturday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 105}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        <>
                                                                            <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>
                                            </>}
                                        {dataWeek && is743 && dataWeek.saturday.length < 2 && dataWeek.saturday.map((el, idx) =>
                                            <>
                                                <RouteTwoTimeslotsTablet key={idx * 110}>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        {el.weekday}:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.saturday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 115}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        {el.timeslot === 'Day Off!'
                                                                            ? <>
                                                                                {el.cutOff.replace(/[a-zа-яё]/gi, '')}
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                                <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                            </>
                                                                        }
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>

                                            </>)}
                                        {dataWeek && is743 && dataWeek.sunday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslotsTablet>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        Sunday:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.sunday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 125}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        <>
                                                                            <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>
                                            </>}
                                        {dataWeek && is743 && dataWeek.sunday.length < 2 && dataWeek.sunday.map((el, idx) =>
                                            <>
                                                <RouteTwoTimeslotsTablet key={idx * 130}>
                                                    <RouteSpanDayTwoTimeslotsTablet>
                                                        {el.weekday}:
                                                    </RouteSpanDayTwoTimeslotsTablet>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                        {
                                                            dataWeek.sunday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRowTablet
                                                                    key={idx * 140}>
                                                                    <RouteSpanTimeslotTwoTablet>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwoTablet>
                                                                    <RouteSpanCutoffTwoTablet>
                                                                        {el.timeslot === 'Day Off!'
                                                                            ? <>
                                                                                {el.cutOff.replace(/[a-zа-яё]/gi, '')}
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <CutoffNumber>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                                <CutoffText>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                            </>
                                                                        }
                                                                    </RouteSpanCutoffTwoTablet>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRowTablet>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoRows>
                                                </RouteTwoTimeslotsTablet>

                                            </>)}
                                    </ContentTablet>
                                </>
                            }

                            {!is743 &&
                                <>
                                    <Italic>A driver arrives at your area <br/> <i>{
                                        defaultAddress.address
                                            ? `(${defaultAddress?.address})`
                                            : ''


                                    }</i>&nbsp;
                                        around:</Italic>
                                    <ContentHeader>
                                        <ContentHeaderDay>Day</ContentHeaderDay>
                                        <ContentHeaderTimeslot>Timeslot</ContentHeaderTimeslot>
                                        <ContentHeaderCutoff>Cutoff</ContentHeaderCutoff>
                                    </ContentHeader>


                                    <Content>
                                        {/*<Italic className='inner'>A driver arrives at your area <br/> ({defaultAddress?.address})*/}
                                        {/*    around:</Italic>*/}

                                        {dataWeek && !is743 && dataWeek.monday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslots>
                                                    <RouteSpanDayTwoTimeslots>
                                                        Monday:
                                                    </RouteSpanDayTwoTimeslots>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                        {
                                                            dataWeek.monday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRow key={idx * 155}>
                                                                    <RouteSpanTimeslotTwo>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwo>
                                                                    <RouteSpanCutoffTwo>
                                                                        <>
                                                                            <CutoffNumber
                                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText
                                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwo>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRow>
                                                            )

                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                </RouteTwoTimeslots>

                                            </>}
                                        {dataWeek && !is743 && dataWeek.monday.length < 2 && dataWeek.monday.map((el, idx) =>
                                            <>
                                                <Route key={idx * 200}>
                                                    <RouteSpanDay>
                                                        {el.weekday}:
                                                    </RouteSpanDay>
                                                    <RouteSpanTimeslot>
                                                        {el.timeslot}
                                                    </RouteSpanTimeslot>
                                                    <RouteSpanCutoff>
                                                        <>
                                                            <CutoffNumber
                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                            <CutoffText
                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                        </>
                                                    </RouteSpanCutoff>
                                                </Route>

                                            </>)}
                                        {dataWeek && !is743 && dataWeek.tuesday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslots>
                                                    <RouteSpanDayTwoTimeslots>
                                                        Tuesday:
                                                    </RouteSpanDayTwoTimeslots>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                        {
                                                            dataWeek.tuesday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRow key={idx * 160}>
                                                                    <RouteSpanTimeslotTwo>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwo>
                                                                    <RouteSpanCutoffTwo>
                                                                        <>
                                                                            <CutoffNumber
                                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText
                                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwo>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRow>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                </RouteTwoTimeslots>
                                            </>}
                                        {dataWeek && !is743 && dataWeek.tuesday.length < 2 && dataWeek.tuesday.map((el, idx) =>
                                            <>
                                                <Route key={idx * 205}>
                                                    <RouteSpanDay>
                                                        {el.weekday}:
                                                    </RouteSpanDay>
                                                    <RouteSpanTimeslot>
                                                        {el.timeslot}
                                                    </RouteSpanTimeslot>
                                                    <RouteSpanCutoff>
                                                        <>
                                                            <CutoffNumber
                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                            <CutoffText
                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                        </>
                                                    </RouteSpanCutoff>
                                                </Route>

                                            </>)}
                                        {dataWeek && !is743 && dataWeek.wednesday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslots>
                                                    <RouteSpanDayTwoTimeslots>
                                                        Wednesday:
                                                    </RouteSpanDayTwoTimeslots>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                        {
                                                            dataWeek.wednesday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRow key={idx * 165}>
                                                                    <RouteSpanTimeslotTwo>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwo>
                                                                    <RouteSpanCutoffTwo>
                                                                        <>
                                                                            <CutoffNumber
                                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText
                                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwo>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRow>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                </RouteTwoTimeslots>
                                            </>}
                                        {dataWeek && !is743 && dataWeek.wednesday.length < 2 && dataWeek.wednesday.map((el, idx) =>
                                            <>
                                                <Route key={idx * 215}>
                                                    <RouteSpanDay>
                                                        {el.weekday}:
                                                    </RouteSpanDay>
                                                    <RouteSpanTimeslot>
                                                        {el.timeslot}
                                                    </RouteSpanTimeslot>
                                                    <RouteSpanCutoff>
                                                        <>
                                                            <CutoffNumber
                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                            <CutoffText
                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                        </>
                                                    </RouteSpanCutoff>
                                                </Route>

                                            </>)}
                                        {dataWeek && !is743 && dataWeek.thursday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslots>
                                                    <RouteSpanDayTwoTimeslots>
                                                        Thursday:
                                                    </RouteSpanDayTwoTimeslots>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                        {
                                                            dataWeek.thursday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRow key={idx * 170}>
                                                                    <RouteSpanTimeslotTwo>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwo>
                                                                    <RouteSpanCutoffTwo>
                                                                        <>
                                                                            <CutoffNumber
                                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText
                                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwo>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRow>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                </RouteTwoTimeslots>
                                            </>}
                                        {dataWeek && !is743 && dataWeek.thursday.length < 2 && dataWeek.thursday.map((el, idx) =>
                                            <>
                                                <Route key={idx * 220}>
                                                    <RouteSpanDay>
                                                        {el.weekday}:
                                                    </RouteSpanDay>
                                                    <RouteSpanTimeslot>
                                                        {el.timeslot}
                                                    </RouteSpanTimeslot>
                                                    <RouteSpanCutoff>
                                                        <>
                                                            <CutoffNumber
                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                            <CutoffText
                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                        </>
                                                    </RouteSpanCutoff>
                                                </Route>

                                            </>)}
                                        {dataWeek && !is743 && dataWeek.friday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslots>
                                                    <RouteSpanDayTwoTimeslots>
                                                        Friday:
                                                    </RouteSpanDayTwoTimeslots>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                        {
                                                            dataWeek.friday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRow key={idx * 180}>
                                                                    <RouteSpanTimeslotTwo>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwo>
                                                                    <RouteSpanCutoffTwo>
                                                                        <>
                                                                            <CutoffNumber
                                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText
                                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwo>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRow>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                </RouteTwoTimeslots>
                                            </>}
                                        {dataWeek && !is743 && dataWeek.friday.length < 2 && dataWeek.friday.map((el, idx) =>
                                            <>
                                                <Route key={idx * 225}>
                                                    <RouteSpanDay>
                                                        {el.weekday}:
                                                    </RouteSpanDay>
                                                    <RouteSpanTimeslot>
                                                        {el.timeslot}
                                                    </RouteSpanTimeslot>
                                                    <RouteSpanCutoff>
                                                        <>
                                                            <CutoffNumber
                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                            <CutoffText
                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                        </>
                                                    </RouteSpanCutoff>
                                                </Route>

                                            </>)}
                                        {dataWeek && !is743 && dataWeek.saturday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslots>
                                                    <RouteSpanDayTwoTimeslots>
                                                        Saturday:
                                                    </RouteSpanDayTwoTimeslots>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                        {
                                                            dataWeek.saturday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRow key={idx * 185}>
                                                                    <RouteSpanTimeslotTwo>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwo>
                                                                    <RouteSpanCutoffTwo>
                                                                        <>
                                                                            <CutoffNumber
                                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText
                                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwo>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRow>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                </RouteTwoTimeslots>
                                            </>}
                                        {dataWeek && !is743 && dataWeek.saturday.length < 2 && dataWeek.saturday.map((el, idx) =>
                                            <>
                                                <Route key={idx * 230}>
                                                    <RouteSpanDay>
                                                        {el.weekday}:
                                                    </RouteSpanDay>
                                                    <RouteSpanTimeslot>
                                                        {el.timeslot}
                                                    </RouteSpanTimeslot>
                                                    <RouteSpanCutoff>
                                                        <>
                                                            <CutoffNumber
                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                            <CutoffText
                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                        </>
                                                    </RouteSpanCutoff>
                                                </Route>

                                            </>)}
                                        {dataWeek && !is743 && dataWeek.sunday.length > 1 &&
                                            <>
                                                <RouteTwoTimeslots>
                                                    <RouteSpanDayTwoTimeslots>
                                                        Sunday:
                                                    </RouteSpanDayTwoTimeslots>
                                                    <RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                        {
                                                            dataWeek.sunday.map((el, idx) =>
                                                                <RouteSpanTimeslotAndCutoffBlockOneRow key={idx * 190}>
                                                                    <RouteSpanTimeslotTwo>
                                                                        {el.timeslot}
                                                                    </RouteSpanTimeslotTwo>
                                                                    <RouteSpanCutoffTwo>
                                                                        <>
                                                                            <CutoffNumber
                                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                                            <CutoffText
                                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                                        </>
                                                                    </RouteSpanCutoffTwo>
                                                                </RouteSpanTimeslotAndCutoffBlockOneRow>
                                                            )
                                                        }
                                                    </RouteSpanTimeslotAndCutoffBlockTwoColumn>
                                                </RouteTwoTimeslots>
                                            </>}
                                        {dataWeek && !is743 && dataWeek.sunday.length < 2 && dataWeek.sunday.map((el, idx) =>
                                            <>
                                                <Route key={idx * 240}>
                                                    <RouteSpanDay>
                                                        {el.weekday}:
                                                    </RouteSpanDay>
                                                    <RouteSpanTimeslot>
                                                        {el.timeslot}
                                                    </RouteSpanTimeslot>
                                                    <RouteSpanCutoff>
                                                        <>
                                                            <CutoffNumber
                                                                className={'mobile__cutoff-number'}>{el.cutOff.replace(/[a-zа-яё]/gi, '')}</CutoffNumber>
                                                            <CutoffText
                                                                className={'mobile__cutoff-text'}>{el.cutOff.replace(/[0-9,:]/g, "")}</CutoffText>
                                                        </>
                                                    </RouteSpanCutoff>
                                                </Route>

                                            </>)}
                                    </Content>
                                </>
                            }
                            {profiles && profiles.length > 1 ?
                                <>
                                    {is743 ?
                                        // <AnotherAddress onClick={() => setChangeAddress(true)}>Check routes for another
                                        //     address</AnotherAddress>
                                        <AnotherAddress onClick={() => {

                                            setChangeAddress(true)
                                        }}>Check routes for another address</AnotherAddress>


                                        :
                                        <Link to='/change_address'>
                                            <AnotherAddress>Check routes for another address</AnotherAddress>
                                        </Link>}
                                </>
                                :
                                <RoutesText>Our delivery operates after noon</RoutesText>}
                        </Block>
                        <Menu/>
                    </MainContainerWindow>


                </AnimatePage>}


        </>
    )
};

export default RoutesWindow;

interface PropsType {
    userId: number
    setChangeAddress: (key: boolean) => void
    changeAddress: boolean
}
