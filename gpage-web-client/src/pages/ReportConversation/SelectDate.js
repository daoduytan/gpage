import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

type SelectDateProps = {
  date: any,
  type: string,
  selectDate: any
};

const SelectDate = ({ date, type, selectDate }: SelectDateProps) => {
  if (type === 'day')
    return (
      <DatePicker
        onChange={selectDate}
        defaultValue={moment(date)}
        format="DD/MM/YYYY"
        style={{ width: '100%' }}
      />
    );
  if (type === 'week')
    return (
      <WeekPicker
        format="WW/YYYY"
        onChange={selectDate}
        style={{ width: '100%' }}
        defaultValue={moment(date)}
      />
    );
  if (type === 'custom')
    return (
      <RangePicker
        onChange={selectDate}
        style={{ width: '100%' }}
        format="DD/MM/YYYY"
      />
    );
  return (
    <MonthPicker
      onChange={selectDate}
      format="MM/YYYY"
      style={{ width: '100%' }}
      defaultValue={moment(date)}
    />
  );
};

export default React.memo(SelectDate);
