import React from 'react';
import { Row, Col } from 'antd';

import SelectDate from '../ReportConversation/SelectDate';
import { SelectTypeDate } from '../ReportConversation/FormFilter';

type DateFilterProps = {
  filter: any,
  selectTypeDate: any,
  selectDate: any
};

const DateFilter = ({
  filter,
  selectTypeDate,
  selectDate
}: DateFilterProps) => {
  return (
    <Row gutter={10}>
      <Col span={8}>
        <SelectTypeDate filter={filter} selectTypeDate={selectTypeDate} />
      </Col>
      <Col span={16}>
        <SelectDate
          date={filter.date}
          type={filter.type}
          selectDate={selectDate}
        />
      </Col>
    </Row>
  );
};

export default DateFilter;
