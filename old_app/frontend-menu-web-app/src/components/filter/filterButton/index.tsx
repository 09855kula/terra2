import { ActiveFilters, ActiveFiltersWrapper, CircleFilter, FilterContainer } from '../styled';
import {CheckBox, Image} from '../../common';

import Filter from '../../../assets/icons/filter.svg'
import React from 'react';

interface PropsType {
    open: () => void
    filter: string[]
    costFilter: [number, number]
    isStart: boolean
    LSO: boolean
    setLSO: (LSO: boolean) => void
    isBuds: boolean

}

const OpenFilters = ({open, filter, costFilter, isStart, LSO, setLSO, isBuds}: PropsType) => {
    const cost = !(costFilter[0] === 0 && costFilter[1] === 100);
    const length = cost ? filter.length + 1 : filter.length
    return (
        <FilterContainer>
            <ActiveFiltersWrapper> 
                <ActiveFilters onClick={open} isStart={isStart}>
                    <Image src={Filter}/>
                    {isStart && <p>Open filters</p>}
                    {length ? <span>{length}</span> : null}
                </ActiveFilters>
                {isBuds &&
                    <>
                        <CheckBox id="filter-check" type="checkbox" checked={LSO} onChange={(e) => setLSO(e.target.checked)}/>
                        <label htmlFor="filter-check">LSO only</label>
                    </>}
            </ActiveFiltersWrapper>

            <CircleFilter onClick={open} isStart={isStart}>
                <Image src={Filter} height={'32px'} width={'32px'}/>
                {length ? <span>{length}</span> : null}
            </CircleFilter>
        </FilterContainer>
    );
};

export default OpenFilters;

