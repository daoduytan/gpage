import React, { type Node } from 'react';
import { useSelector } from 'react-redux';
import { Row, Select, Col, Button } from 'antd';
import SelectDate from './SelectDate';

const types = [
  { value: 'day', title: 'Ngày' },
  { value: 'week', title: 'Tuần' },
  { value: 'month', title: 'Tháng' },
  { value: 'custom', title: 'Tùy chọn ngày' }
];

type SelectTypeDateProps = {
  filter: {
    type: string
  },
  selectTypeDate: any
};

export const SelectTypeDate = ({
  filter,
  selectTypeDate
}: SelectTypeDateProps) => {
  return (
    <Select
      defaultValue={filter.type}
      onChange={selectTypeDate}
      style={{ width: '100%' }}
    >
      {types.map(type => (
        <Select.Option key={type.value} value={type.value}>
          {type.title}
        </Select.Option>
      ))}
    </Select>
  );
};

type FormFilterProps = {
  children: Node,
  filter: any,
  submitFilter: any,
  setFilter: any,
  hasChildren?: boolean
};
const FormFilter = ({
  hasChildren,
  children,
  filter,
  submitFilter,
  setFilter
}: FormFilterProps) => {
  const { facebookPages } = useSelector(({ authReducer }) => authReducer.user);

  const selectPage = id => {
    const page = facebookPages.find(p => p.id === id);
    setFilter({ ...filter, page });
  };

  const selectTypeDate = type => {
    const date = filter.type === 'custom' ? new Date() : filter.date;
    setFilter({ ...filter, date, type });
  };

  const selectDate = date => {
    setFilter({ ...filter, date });
  };

  return (
    <Row gutter={10}>
      <Col span={4}>
        <Select
          defaultValue={filter.page.id}
          onChange={selectPage}
          style={{ width: '100%' }}
        >
          {facebookPages.map(p => (
            <Select.Option key={p.id}>{p.name}</Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={3}>
        <SelectTypeDate filter={filter} selectTypeDate={selectTypeDate} />
        {/* <Select
          defaultValue={filter.type}
          onChange={selectTypeDate}
          style={{ width: '100%' }}
        >
          {types.map(type => (
            <Select.Option key={type.value} value={type.value}>
              {type.title}
            </Select.Option>
          ))}
        </Select> */}
      </Col>
      <Col span={filter.type === 'custom' ? 8 : 4}>
        <SelectDate
          type={filter.type}
          selectDate={selectDate}
          date={filter.date}
        />
      </Col>
      {hasChildren > 0 && children}

      <Col span={2}>
        <Button type="primary" block onClick={submitFilter}>
          Lọc
        </Button>
      </Col>
    </Row>
  );
};

FormFilter.defaultProps = {
  hasChildren: false
};

export default FormFilter;
