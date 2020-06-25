import React from 'react';
import { Table, Tag } from 'antd';
import moment from 'moment';

import { Th } from '../../components';
import { formatMoney } from '../../ultils';
import FilterOrders from './FilterOrders';
import ChangeStatus from './ChangeStatus';
import ExpanedTableOrder from './ExpanedTableOrder';
import ShipStatus from './ShipStatus';
import Action from './Action';

// change status
// export const options = [
//   { value: 'moi', title: 'Mới' },
//   { value: 'xac_nhan', title: 'Xác nhận' },
//   { value: 'dong_goi', title: 'Đóng gói' },
//   { value: 'dang_chuyen', title: 'Đang chuyển' },
//   { value: 'thanh_toan', title: 'Thanh toán' }
// ];

// columns

const columns = [
  {
    title: <Th>Ngày</Th>,
    dataIndex: 'date',
    key: 'date',
    render: date => (
      <>
        {moment(date).format('HH:mm')}
        <br />
        {moment(date).format('DD/MM/YYYY')}
      </>
    )
  },
  {
    title: <Th>Khách hàng</Th>,
    dataIndex: '',
    key: 'khach_hang',
    render: order => {
      return (
        <>
          {order.order_name}
          <br />
          {order.order_phone}
        </>
      );
    }
  },
  {
    title: <Th>Nhân viên</Th>,
    dataIndex: 'member',

    key: 'member',
    render: member => {
      if (!member) return null;

      const color = member.role === 'admin' ? '#f50' : '#108ee9';
      const text = member.role === 'admin' ? 'Chủ shop' : 'Nhân viên';

      return (
        <>
          {member.displayName}
          <br />
          <Tag color={color}>{text}</Tag>
        </>
      );
    }
  },
  {
    title: <Th>KL(g)</Th>,
    dataIndex: 'list_order',
    key: 'khoi_luong',
    render: order => {
      return order.reduce((number, d) => number + d.so_luong * d.khoi_luong, 0);
    }
  },
  {
    title: <Th>Tổng tiền(VND)</Th>,
    dataIndex: 'list_order',
    key: 'thanh_toan',
    render: order => {
      return formatMoney(
        order.reduce((number, d) => number + d.so_luong * d.gia_ban, 0)
      );
    }
  },

  // {
  //   title: 'Ghi chú',
  //   dataIndex: '',
  //   key: 'ghi_chu',
  //   render: order => {
  //     return (
  //       <div>
  //         {order.customer_note}
  //         <Divider style={{ margin: '5px 0' }} dashed />
  //         {order.cskh_note}
  //       </div>
  //     );
  //   }
  // },
  {
    title: <Th>Trạng thái</Th>,

    dataIndex: '',
    key: 'trang_thai',
    render: order => <ChangeStatus order={order} />
  },
  {
    title: <Th>Kho hàng</Th>,
    dataIndex: 'store',
    key: 'store',
    render: store => store.ten
  },
  {
    title: <Th>Vận chuyển</Th>,
    dataIndex: '',
    align: 'center',
    key: 'ship',
    render: ({ shiper, order_ship }) => {
      return <ShipStatus shiper={shiper} order_ship={order_ship} />;
    }
  },
  {
    title: <Th>Chênh lệch PVC(VND)</Th>,
    dataIndex: '',
    align: 'center',
    key: 'xx',
    render: ({ phi_bao_khach, phi_van_chuyen }) => {
      return formatMoney(phi_bao_khach - phi_van_chuyen);
    }
  },

  {
    title: '',
    dataIndex: '',
    key: 'action',
    render: order => (
      <div style={{ textAlign: 'center' }}>
        <Action order={order} />
      </div>
    )
  }
];

const TableOrder = ({ orders, type }: { orders: any, type: string }) => {
  const [loading, setLoading] = React.useState(true);
  const [select_orders, setSelectOrder] = React.useState([]);
  const [orders_local, setOrderLocal] = React.useState(orders);
  const [filter, setFillter] = React.useState({
    transport: 'all'
  });

  React.useEffect(() => {
    setOrderLocal(orders);
  }, [orders]);

  React.useEffect(() => {
    setLoading(true);
    const filterOrderWithTransport = orders.filter(
      s => s.type_order === filter.transport
    );

    const newOrderLocal =
      filter.transport === 'all' ? orders : filterOrderWithTransport;

    setOrderLocal(newOrderLocal);
    setLoading(false);
  }, [filter.transport, orders]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectOrder(selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name
    })
  };

  const expandedRowRender = record => <ExpanedTableOrder order={record} />;

  const filterOrder = transport => {
    setFillter({
      transport
    });
  };

  const dataSource = orders_local.map(order => ({ ...order, key: order.id }));

  return (
    <>
      <FilterOrders orders={select_orders} type={type} filter={filterOrder} />

      <Table
        loading={loading}
        bodyStyle={{ border: '1px solid #eee' }}
        dataSource={dataSource}
        columns={columns}
        rowSelection={rowSelection}
        expandedRowRender={expandedRowRender}
      />
    </>
  );
};

export default TableOrder;
