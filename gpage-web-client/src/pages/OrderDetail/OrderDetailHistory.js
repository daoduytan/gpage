import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import moment from 'moment';

import { refs } from '../../api';
import { Th } from '../../components';
import { options } from '../Order/ChangeStatus';

const columns = [
  {
    title: <Th>Người tạo</Th>,
    dataIndex: '',
    key: 'member',
    render: ({ user, time }) => (
      <div>
        {`${user.displayName}`} <br /> {moment(time).format('DD/MM/YYYY HH:mm')}
      </div>
    )
  },
  {
    title: <Th>Hành động</Th>,
    dataIndex: 'status',
    key: 'action',
    render: status => {
      const status_exist = options.find(s => s.value === status.after);
      if (!status_exist) return 'Mới';
      return status_exist.title;
    }
  },
  {
    title: <Th>Trạng thái</Th>,
    dataIndex: 'status',
    key: 'action',
    render: status => {
      const status_exist_before = options.find(s => s.value === status.before);
      const status_exist_after = options.find(s => s.value === status.after);

      const label_before = status_exist_before
        ? status_exist_before.title_status
        : 'Mới';
      const label_after = status_exist_after
        ? `- ${status_exist_after.title_status}`
        : '';

      return `${label_before} ${label_after}`;
    }
  }
];

type OrderDetailHistoryProps = {
  order: {
    id: string
  }
};

const OrderDetailHistory = ({ order }: OrderDetailHistoryProps) => {
  const [loading, setLoading] = useState(true);
  const [histories, setHistories] = useState();

  useEffect(() => {
    refs.ordersRefs
      .doc(order.id)
      .collection('histories')
      .get()
      .then(res => {
        const data = res.docs.map(doc => ({ ...doc.data(), key: doc.id }));
        setHistories(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error('Xảy ra lỗi');
      });
  }, [order.id]);

  return (
    <Table
      dataSource={histories}
      columns={columns}
      loading={loading}
      bodyStyle={{ border: '1px solid #eee' }}
    />
  );
};

export default OrderDetailHistory;
