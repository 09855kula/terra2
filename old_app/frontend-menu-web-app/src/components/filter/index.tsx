import {CheckBox, Flex, Image} from '../common';
import {
    Content,
    EffectText,
    EffectsWrapper,
    FilterButton,
    FilterButtonWrapper,
    FilterTitle,
    Overlay,
    Range,
    RangeText,
    RangeWrapper,
    Reset,
    Text,
    Wrapper
} from './styled';
import React, {MouseEvent, useContext, useEffect, useState} from 'react';

import {CartButton} from '..';
import {CartContext} from '../../context/cartContext';
import Energy from '../../assets/icons/filterMobile/energyDefault.svg'
import EnergyDesktop from '../../assets/icons/filterDesktop/energyDefaultDesktop.svg'
import EnergyActive from '../../assets/icons/filterMobile/energyActive.svg'
import EnergyActiveDesktop from '../../assets/icons/filterDesktop/energyActiveDesktop.svg'
import Euphoria from '../../assets/icons/filterMobile/creativeDefault.svg'
import EuphoriaDesktop from '../../assets/icons/filterDesktop/creativeDefaultDesktop.svg'
import EuphoriaActive from '../../assets/icons/filterMobile/creativeActive.svg'
import EuphoriaActiveDesktop from '../../assets/icons/filterDesktop/creativeActiveDesktop.svg'
import Happy from '../../assets/icons/filterMobile/happyDefault.svg'
import HappyDesktop from '../../assets/icons/filterDesktop/happyDefaultDesktop.svg'
import HappyActive from '../../assets/icons/filterMobile/happyActive.svg'
import HappyActiveDesktop from '../../assets/icons/filterDesktop/happyActiveDesktop.svg'
import In from '../../assets/icons/filterMobile/calmDefault.svg'
import InDesktop from '../../assets/icons/filterDesktop/calmDefaultDesktop.svg'
import InActive from '../../assets/icons/filterMobile/calmActive.svg'
import InActiveDesktop from '../../assets/icons/filterDesktop/calmActiveDesktop.svg'
import OpenFilters from "./filterButton";
import Sleep from '../../assets/icons/filterMobile/sleepyDefault.svg'
import SleepDesktop from '../../assets/icons/filterDesktop/sleepyDefaultDesktop.svg'
import SleepActive from '../../assets/icons/filterMobile/sleepyActive.svg'
import SleepActiveDesktop from '../../assets/icons/filterDesktop/sleepyActiveDesktop.svg'
import close from '../../assets/icons/closeGreen.svg'
import {local} from '../../utils'
const cats = ['calm', 'energy', 'creative', 'happy', 'sleepy']

const Filter = ({isStart, width}: { isStart: boolean, width: number }) => {
    const settings = local.getUserSettings()
    const {filteredProducts, group, groupHandler} = useContext(CartContext)
    //console.log('settings', settings)
    const [filters, setFilters] = useState<string[]>(settings?.effects || [])
    const [costFilter, setCostFilter] = useState<[number, number]>(settings?.costs || [0, 100])
    const [tagsPriceFilter, setTagsFilter] = useState<[number, number]>(settings?.price_tag || [0, 100])
    const [LSO, setLSO] = useState(false)
    const [safari, setSafari] = useState(false)
    const [open, setOpen] = useState(false)
    const is744 = width > 743
    const is1280 = width > 1279
    const isBuds = group === 'Buds'

    const addFilter = (filter: string) => {
        let arr = []
        if (filters.includes(filter)) {
            arr = filters.filter((el) => el !== filter)
            setFilters(arr)
            local.setUserSettings({effects: arr})
            groupHandler(group)
        } else {
            arr = [...filters]
            arr.push(filter)
            setFilters(arr)
            local.setUserSettings({effects: arr})
            groupHandler(group)
        }
    }

    const resetFilters = () => {
        setFilters([])
        setLSO(false)
        setCostFilter([0, 100])
        setTagsFilter([0, 100])
        local.setUserSettings({effects: [], costs: [0, 100], lso: true, price_tag: [0, 100]})
        groupHandler(group)
    }

    const closeFilter = (e: MouseEvent) => {
        e.stopPropagation()
        setOpen(false)
    }

    function onChange(value: [number, number]) {
        local.setUserSettings({costs: value})
        // console.log('filteredProducts:', filteredProducts)
        setCostFilter(value)
        groupHandler(group)
    }

    function filterLso(value: boolean) {
        setLSO(value)
        local.setUserSettings({lso: value})
        groupHandler(group)
    }

    return (
        <>
            <OpenFilters
                open={() => setOpen(!open)}
                filter={filters}
                costFilter={costFilter}
                isStart={isStart}
                setLSO={filterLso}
                LSO={LSO}
                isBuds={isBuds}
            />
            <Overlay className={open ? 'active' : ''} onClick={closeFilter}>
                <Wrapper>
                    <Content onClick={(e) => e.stopPropagation()}>
                        {!is744 &&
                            <Flex margin={'0 0 76px 0'} >

                                <FilterTitle>
                                    <button className='filter__button-x' onClick={closeFilter}>
                                        <Image padding={'0 0 0 0'} src={close}/>
                                    </button>
                                    <p>FILTERS</p>
                                </FilterTitle>
                                <Reset onClick={resetFilters}>
                                    Reset filters
                                </Reset>
                            </Flex>}
                        <RangeWrapper>
                            <Text>{is744 ? 'Filter by Price' : 'Price'}</Text>
                            <Flex margin={'20px 0 12px 0'} className="range__text-wrapper">
                                <RangeText>$</RangeText>
                                <RangeText className="range__text-center">$$</RangeText>
                                <RangeText>$$$</RangeText>
                            </Flex>
                            <Range
                                range
                                step={50}
                                value={costFilter}
                                onChange={onChange}
                                tooltipVisible={false}
                            />
                        </RangeWrapper>
                        <EffectsWrapper>
                            <Text margin={'80px 0 9px 0'}>{is744 ? 'Filter by Effect' : 'Effect'}</Text>
                            <Flex >
                                <FilterButtonWrapper onClick={() => addFilter('calm')}>
                                    <Flex direction={'column'} className='effect'>
                                        <FilterButton>
                                            <Image src={
                                                is744
                                                    ? filters.includes('calm') ? InActiveDesktop : InDesktop
                                                    : filters.includes('calm') ? InActive : In

                                                }/>
                                        </FilterButton>
                                        <EffectText>calm</EffectText>
                                    </Flex>
                                </FilterButtonWrapper>
                                <FilterButtonWrapper onClick={() => addFilter('energy')}>
                                    <Flex direction={'column'} className='effect'>
                                        <FilterButton>
                                            <Image src={
                                                is744
                                                    ? filters.includes('energy') ? EnergyActiveDesktop : EnergyDesktop
                                                    : filters.includes('energy') ? EnergyActive : Energy
                                            }/>
                                        </FilterButton>
                                        <EffectText>energy</EffectText>
                                    </Flex>
                                </FilterButtonWrapper>
                                <FilterButtonWrapper onClick={() => addFilter('creative')}>
                                    <Flex direction={'column'} className='effect'>
                                        <FilterButton>
                                            <Image src={
                                                is744
                                                    ? filters.includes('creative') ? EuphoriaActiveDesktop : EuphoriaDesktop
                                                    : filters.includes('creative') ? EuphoriaActive : Euphoria
                                            }/>
                                        </FilterButton>
                                        <EffectText>creative</EffectText>
                                    </Flex>
                                </FilterButtonWrapper>
                                <FilterButtonWrapper onClick={() => addFilter('happy')}>
                                    <Flex direction={'column'} className='effect'>
                                        <FilterButton>
                                            <Image src={
                                                is744
                                                    ? filters.includes('happy') ? HappyActiveDesktop : HappyDesktop
                                                    : filters.includes('happy') ? HappyActive : Happy
                                                }/>
                                        </FilterButton>
                                        <EffectText>happy</EffectText>
                                    </Flex>
                                </FilterButtonWrapper>
                                <FilterButtonWrapper onClick={() => addFilter('sleepy')}>
                                    <Flex direction={'column'} className='effect'>
                                        <FilterButton>
                                            <Image src={
                                                is744
                                                    ? filters.includes('sleepy') ? SleepActiveDesktop : SleepDesktop
                                                    : filters.includes('sleepy') ? SleepActive : Sleep


                                            }/>
                                        </FilterButton>
                                        <EffectText>sleepy</EffectText>
                                    </Flex>
                                </FilterButtonWrapper>
                            </Flex>
                        </EffectsWrapper>
                        {is744 && isBuds && <>
                            <CheckBox className='filter-check' id="filter-check" type="checkbox" checked={LSO}
                                      onChange={(e) => setLSO(e.target.checked)}/>
                            <label htmlFor="filter-check">LSO only</label>
                        </>}
                        {is1280 && <CartButton/>}
                        {is744 &&
                            <Reset onClick={resetFilters}>
                                Reset filters
                            </Reset>}
                    </Content>
                </Wrapper>
            </Overlay>
        </>
    );
};

export default Filter;
