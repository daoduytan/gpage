import React from 'react';
import { Table, Avatar } from 'antd';

import { formatMoney } from '../../ultils';
import NumberProductInStore from './NumberProductInStore';

type ExpanedTableOrderProps = {
  order: any
};

const ExpanedTableOrder = ({ order }: ExpanedTableOrderProps) => {
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'hinh_anh',
      render: hinh_anh => {
        if (!hinh_anh) return <Avatar icon="picture" shape="square" />;
        return <Avatar src={hinh_anh.src} shape="square" />;
      }
    },
    { title: 'Tên', dataIndex: 'ten', key: 'ten' },
    { title: 'Khối lượng (g)', dataIndex: 'khoi_luong', key: 'khoi_luong' },
    { title: 'Số lượng', dataIndex: 'so_luong', key: 'so_luong' },

    {
      title: 'Đơn giá(VND)',
      dataIndex: 'gia_ban',
      key: 'gia',
      render: gia_ban => formatMoney(gia_ban)
    },
    {
      title: 'SL trong kho',
      dataIndex: '',
      key: 'sl_trong_kho',
      align: 'center',
      render: product => {
        return <NumberProductInStore product={product} store={order.store} />;
        // if (!order.status || order.status === 'moi')
        //   return <NumberProductInStore product={product} store={order.store} />;

        // return '"';
      }
    },
    { title: '', dataIndex: '', key: 'action', render: () => {} }
  ];

  const dataSource = order.list_order.map(o => ({ ...o, key: o.id }));

  return <Table columns={columns} pagination={false} dataSource={dataSource} />;
};

export default ExpanedTableOrder;
