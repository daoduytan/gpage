import React from 'react';
import { Table, InputNumber, Icon } from 'antd';
import { InputMoney, Discount } from '../../components';
import { Th } from './style';

type TableOrderListProps = {
  order: any,
  changeListProduct: Function
};

const TableOrderList = ({ order, changeListProduct }: TableOrderListProps) => {
  const dataSource = order.map((o, i) => ({ ...o, stt: i + 1, key: o.id }));

  const columns = [
    {
      title: <Th>STT</Th>,
      width: 30,
      dataIndex: 'stt',
      key: 'stt'
    },
    {
      title: <Th>Tên</Th>,
      dataIndex: 'ten',
      key: 'ten'
    },
    {
      title: <Th>KL</Th>,
      dataIndex: '',
      key: 'khoi_luong',
      render: ({ id, khoi_luong }: { id: String, khoi_luong: Number }) => {
        const changeKl = value => {
          const newOrder = order.map(o => {
            if (o.id === id) return { ...o, khoi_luong: value };
            return o;
          });
          changeListProduct(newOrder);
        };

        return (
          <InputNumber
            value={khoi_luong}
            min={1}
            style={{ width: 70 }}
            onChange={changeKl}
          />
        );
      }
    },

    {
      title: <Th>SL</Th>,
      dataIndex: '',
      key: 'so_luong',
      render: ({ id, so_luong }: { id: String, so_luong: Number }) => {
        const changeSl = value => {
          const newOrder = order.map(o => {
            if (o.id === id) return { ...o, so_luong: value };

            return o;
          });

          changeListProduct(newOrder);
        };
        return (
          <InputNumber
            value={so_luong}
            min={1}
            style={{ width: 50 }}
            onChange={changeSl}
          />
        );
      }
    },
    {
      title: <Th>Giá</Th>,
      dataIndex: '',
      key: 'gia_ban',
      render: ({ id, gia_ban }: { id: String, gia_ban: Number }) => {
        const changeGia = value => {
          const newOrder = order.map(o => {
            if (o.id === id) return { ...o, gia_ban: value };

            return o;
          });

          changeListProduct(newOrder);
        };

        return <InputMoney value={gia_ban} onChange={changeGia} min={1} />;
      }
    },
    {
      title: <Th>C.khấu</Th>,

      dataIndex: '',
      key: 'chiec_khau',
      render: ({ chiet_khau, id }: { chiet_khau: any, id: String }) => {
        const changeCkhau = value => {
          const newOrder = order.map(o => {
            if (o.id === id) return { ...o, chiet_khau: value };
            return o;
          });

          changeListProduct(newOrder);
        };

        return (
          <div syle={{ display: 'flex' }}>
            <Discount chiet_khau={chiet_khau} changeCkhau={changeCkhau} />
          </div>
        );
      }
    },
    {
      title: '',
      dataIndex: '',
      key: '',
      render: ({ id }: { id: String }) => {
        const removeOrder = () => {
          const newOrder = order.filter(o => o.id !== id);
          changeListProduct(newOrder);
        };
        return (
          <Icon
            type="close-circle"
            onClick={removeOrder}
            style={{ color: 'red' }}
            theme="filled"
          />
        );
      }
    }
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      bordered
      pagination={false}
    />
  );
};

export default TableOrderList;
