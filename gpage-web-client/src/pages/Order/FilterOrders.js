import React from 'react';
import { useSelector } from 'react-redux';
import { Select, Button } from 'antd';

import { options } from './ChangeStatus';
import { refs } from '../../api';
// import PrintMoreOrders from './PrintMoreOrders';

// const { Search } = Input;
const size = 'default';

type ActionOrderProps = {
  orders: any,
  type: string
};

const FilterOrders = ({ orders, type, onChange, filter }: ActionOrderProps) => {
  // const user = useSelector(({ authReducer }) => authReducer.user);

  const selectOrderType = value => {
    filter(value);
  };

  const onChangeType = status => {
    orders.forEach((order, index) => {
      refs.ordersRefs.doc(order.id).update({
        status
      });
    });
  };

  const removeOrder = () => {
    orders.forEach(order => refs.ordersRefs.doc(order.id).delete());
  };

  const onAfterPrint = () => {
    orders.forEach(order => {
      refs.ordersRefs.doc(order.id).update({
        status: 'dong_goi'
      });
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',

        paddingBottom: 15
      }}
    >
      <Select
        onChange={selectOrderType}
        defaultValue="all"
        style={{ marginRight: 10, width: 150 }}
      >
        <Select.Option value="all">Tất cả</Select.Option>
        <Select.Option value="use_transformer">Tự vận chuyển</Select.Option>
        <Select.Option value="use_carrier">Hãng vận chuyển</Select.Option>
      </Select>

      {/* <Search style={{ width: 200, marginRight: 10 }} size={size} /> */}
      {/* <Select
        disabled={orders.length === 0}
        style={{ width: 180, marginRight: 10 }}
        size={size}
        onChange={onChangeType}
        placeholder="Chuyển trạng thái"
      >
        {options.map(option => (
          <Select.Option key={option.value} value={option.value}>
            {option.title}
          </Select.Option>
        ))}
      </Select> */}
      {type === 'xac_nhan' && (
        <>
          {/* <PrintMoreOrders
            orders={orders}
            onAfterPrint={onAfterPrint}
            title={
              <Button
                size={size}
                style={{ marginRight: 10 }}
                // onClick={printOrder}
                disabled={orders.length === 0}
                icon="printer"
              >
                In
              </Button>
            }
          /> */}

          {/* <Button
            size={size}
            style={{ marginRight: 10 }}
            onClick={printOrder}
            disabled={orders.length === 0}
            icon="printer"
          >
            In
          </Button> */}
        </>
      )}

      <Button
        type="danger"
        size={size}
        onClick={removeOrder}
        icon="delete"
        disabled={orders.length === 0}
      >
        Xóa
      </Button>
    </div>
  );
};

export default FilterOrders;
