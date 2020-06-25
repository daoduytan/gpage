import React from 'react';

import { Table, Alert } from 'antd';

import { shipers } from '../../dumpdata';
import { formatMoney } from '../../ultils';

// Table ship
type TableShipProps = { shiper: any, order: any };

const TableShip = ({ shiper, order }: TableShipProps) => {
  if (!shiper) return <Alert message="Tự giao hàng" type="info" showIcon />;

  const dataSource = [shiper].map(s => ({ ...s, key: s.ServiceID }));
  const columns = [
    {
      title: 'Hãng',

      dataIndex: '',
      key: 'name',
      render: service => (
        <img
          style={{ height: 40 }}
          src={shipers[service.id].logo}
          alt={shipers[service.id].name}
        />
      )
    },
    {
      title: 'Gói',
      dataIndex: 'Name',
      key: 'Name'
    },
    {
      title: 'Giá',
      dataIndex: 'ServiceFee',
      key: 'price',
      render: price => formatMoney(price)
    }
  ];

  return (
    <Table
      bordered
      pagination={false}
      dataSource={dataSource}
      columns={columns}
    />
  );
};

export default React.memo(TableShip);
