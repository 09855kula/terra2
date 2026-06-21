import {OrderInfoFlexBox, OrderInfoText, OrderInfoWrapper} from './styled'

import {Image} from '../../../common'
import { OrderType } from '../../../../types';
import React from 'react';
import calendar from "../../../../assets/icons/calendar.svg";
import location from "../../../../assets/icons/location.png";
import moment from 'moment';
import money from "../../../../assets/icons/money.svg";
import timeImage from "../../../../assets/icons/time.svg";

const OrderInfo = ({order}: {order?: OrderType}) => {
  const date = order?.delivery_date && moment(order?.delivery_date).format('dddd, D MMM')

  return (
      <OrderInfoWrapper>
          <OrderInfoFlexBox>
            <Image src={location}/>
            <OrderInfoText>{order?.address}</OrderInfoText>
          </OrderInfoFlexBox>
          <OrderInfoFlexBox>
            <Image src={calendar}/>
            <OrderInfoText>{date}</OrderInfoText>
          </OrderInfoFlexBox>
          <OrderInfoFlexBox>
            <Image src={timeImage}/>
            <OrderInfoText>{order?.timeslot}</OrderInfoText>
          </OrderInfoFlexBox>
          <OrderInfoFlexBox className='desktop__hide'>
            <Image src={money}/>
            <OrderInfoText>${order?.total_after_discount}</OrderInfoText>
          </OrderInfoFlexBox>
      </OrderInfoWrapper>
  )
};

export default OrderInfo;
