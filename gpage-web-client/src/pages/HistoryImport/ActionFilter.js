import React from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';

import { ActionFilterStyle } from './style';
import StoreFilter from './StoreFilter';
import SupplierFilter from './SupplierFilter';
import TextFilter from './TextFilter';
import DateFilter from './DateFilter';

type ActionFilterProps = {
  updateFilter: any,
  filter: {
    text: string,
    storeId: string,
    supplierId: string,
    type: string
  }
};

const ActionFilter = ({ updateFilter, filter }: ActionFilterProps) => {
  const handleUpdateFilter = (key: string, value: any) => {
    const new_filter = { ...filter, [key]: value };
    updateFilter(new_filter);
  };

  const selectStore = (storeId: string) =>
    handleUpdateFilter('storeId', storeId);

  const selectSupplier = (supplierId: string) =>
    handleUpdateFilter('supplierId', supplierId);

  const changeText = (text: string) => handleUpdateFilter('text', text);

  const selectTypeDate = type => {
    if (filter.type === 'custom' && type !== 'customer') {
      handleUpdateFilter('date', new Date());
    }
    handleUpdateFilter('type', type);
  };

  const selectDate = date => handleUpdateFilter('date', date);

  const { text, storeId, supplierId } = filter;

  return (
    <ActionFilterStyle>
      <Row gutter={10}>
        <Col span={5}>
          <TextFilter text={text} changeText={changeText} />
        </Col>
        <Col span={5}>
          <StoreFilter selectStore={selectStore} storeId={storeId} />
        </Col>
        <Col span={5}>
          <SupplierFilter
            supplierId={supplierId}
            selectSupplier={selectSupplier}
          />
        </Col>
        <Col span={9}>
          <DateFilter
            filter={filter}
            selectTypeDate={selectTypeDate}
            selectDate={selectDate}
          />
        </Col>
      </Row>
    </ActionFilterStyle>
  );
};

export default ActionFilter;
