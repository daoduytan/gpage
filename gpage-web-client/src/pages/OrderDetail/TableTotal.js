import React from 'react';
import { Table } from 'antd';

import { formatMoney } from '../../ultils';
import { caculatorMoney } from '.';

const columns = [
  {
    title: <b style={{ fontSize: 12 }}>Số SP</b>,
    dataIndex: 'sl',
    key: 'sl',
    render: value => <b style={{ color: 'green' }}>{value}</b>
  },
  {
    title: <b style={{ fontSize: 12 }}>KL</b>,
    dataIndex: 'kl',
    key: 'kl',
    render: value => <b style={{ color: 'green' }}>{value}</b>
  },
  {
    title: <b style={{ fontSize: 12 }}>Thu người nhận</b>,
    dataIndex: 'thu_nguoi_nhan',
    key: 'thu_nguoi_nhan',
    render: value => <b style={{ color: 'green' }}>{value}</b>
  },
  {
    title: <b style={{ fontSize: 12 }}>Trả người gửi</b>,
    dataIndex: 'tra_nguoi_gui',
    key: 'tra_nguoi_gui',
    render: value => <b style={{ color: 'green' }}>{value}</b>
  }
];

const TableTotal = ({ order }: { order: any }) => {
  const phi_bao_khach = order.phi_bao_khach
    ? order.phi_bao_khach
    : order.phi_van_chuyen;

  const thu_nguoi_nhan = caculatorMoney(order) + phi_bao_khach;

  const dataSource = [
    {
      key: '1',
      sl: order.list_order.reduce((value, o) => value + o.so_luong, 0),

      kl: order.list_order.reduce(
        (value, o) => value + o.khoi_luong * o.so_luong,
        0
      ),
      thu_nguoi_nhan: formatMoney(thu_nguoi_nhan),
      tra_nguoi_gui: formatMoney(thu_nguoi_nhan - order.phi_van_chuyen)
    }
  ];

  return (
    <Table
      bordered
      pagination={false}
      columns={columns}
      dataSource={dataSource}
    />
  );
};

export default TableTotal;
