import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { formatMoney, filterWithText } from '../../ultils';
import { refs } from '../../api';
import { Image } from '../StoreDetail/TableProductStore';
import LabelStore from './LabelStore';
import ActionFilter from './ActionFilter';

const columns = [
  {
    title: <b>Ngày</b>,
    dataIndex: 'date',
    key: 'date',
    render: date => moment(date).format('DD/MM/YYYY')
  },
  {
    title: <b>Hình ảnh</b>,
    dataIndex: 'product',
    key: 'hinh_anh',
    render: product => {
      if (!product) return <Image />;
      const { hinh_anh } = product;
      return <Image image={hinh_anh && hinh_anh.src} />;
    }
  },
  {
    title: <b>Sản phẩm</b>,
    dataIndex: 'product',
    key: 'ten',
    render: product => {
      if (!product) return '';
      const { ten } = product;
      return ten || '';
    }
  },
  {
    title: <b>Nhà cung cấp</b>,
    dataIndex: 'supplier',
    key: 'nha_cung_cap',
    render: supplier => {
      if (!supplier) return '';
      const { ten } = supplier;
      return ten || '';
    }
  },

  {
    title: <b>Kho hàng</b>,
    dataIndex: 'storeId',
    key: 'kho_hang',
    render: storeId => <LabelStore storeId={storeId} />
  },

  {
    title: <b>Số lượng</b>,
    dataIndex: 'so_luong',
    key: 'so_luong',
    render: so_luong => formatMoney(so_luong)
  }
];

const HistoryTable = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  const [loading, setLoading] = useState(true);
  const [histories, setHistories] = useState([]);
  const [histories_filter, setHistoriesFilter] = useState(histories);
  const [filter, setFilter] = useState({
    text: '',
    storeId: null,
    supplierId: null,
    type: 'month',
    date: new Date()
  });
  const ref = useRef(false);

  const updateFilter = new_filter => {
    setFilter(new_filter);
  };

  useEffect(() => {
    ref.current = true;

    const loadDataHistories = async () => {
      if (!user || (user && !user.shopId)) {
        return setLoading(false);
      }

      const refsShop = refs.usersRefs.doc(user.shopId);
      // get suppliers
      const resSupplier = await refsShop.collection('supplier').get();
      const suppliers = resSupplier.docs.map(doc => ({
        ...doc.data(),
        supplierId: doc.id
      }));

      // get products
      const resProducts = await refsShop.collection('products').get();
      const products = resProducts.docs.map(doc => ({
        ...doc.data(),
        productId: doc.id
      }));

      // get histories
      const resHistories = await refsShop
        .collection('history_import')
        .orderBy('date', 'desc')
        .get();

      const dataHistories = resHistories.docs.map(doc => {
        const history = doc.data();
        const supplier = suppliers.find(
          s => s.supplierId === history.nha_cung_cap
        );
        const product = products.find(p => p.productId === history.productId);

        return {
          ...history,
          supplier,
          product,
          id: doc.id,
          key: doc.id
        };
      });

      return setHistories(dataHistories);
    };

    if (ref.current) {
      loadDataHistories();
    }

    return () => {
      ref.current = false;
    };
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const { text, storeId, supplierId, type, date } = filter;

    let data = histories;

    // filter day
    if (type === 'month') {
      const new_date = moment(date).format('MM/YYYY');

      data = data.filter(i => {
        const date_filter = moment(i.date).format('MM/YYYY');

        return date_filter === new_date;
      });
    }
    if (type === 'day') {
      const new_date = moment(date).format('DD/MM/YYYY');

      data = data.filter(i => {
        const date_filter = moment(i.date).format('DD/MM/YYYY');

        return date_filter === new_date;
      });
    }

    if (type === 'week') {
      const weekStart = moment(date).startOf('week');
      let arr = [];

      for (let index = 0; index <= 6; index += 1) {
        const dateValue = moment(weekStart).add(index, 'days');
        const d = moment(dateValue).format('DD/MM/YYYY');

        const items = histories.filter(i => {
          const date_filter = moment(i.date).format('DD/MM/YYYY');

          return date_filter === d;
        });

        arr = arr.concat(items);
        data = arr;
      }
    }

    if (type === 'custom') {
      let arr = [];

      const valueStartDate = moment(date[0]).valueOf();
      const valueEndDate = moment(date[1]).valueOf();

      const diff = Math.floor((valueEndDate - valueStartDate) / 86400000);

      for (let index = 0; index <= diff; index += 1) {
        const dateValue = moment(valueStartDate).add(index, 'days');
        const d = moment(dateValue).format('DD/MM/YYYY');

        const items = histories.filter(i => {
          const date_filter = moment(i.date).format('DD/MM/YYYY');
          return date_filter === d;
        });

        arr = arr.concat(items);
        data = arr;
      }
    }

    // filter with name product
    if (text.length > 0) {
      data = data.filter(i => filterWithText(text, i.product.ten));
    }

    // filter with store
    if (storeId) {
      data = data.filter(i => i.storeId === storeId);
    }

    // filter with supplier
    if (supplierId) {
      data = data.filter(i => {
        if (!i.supplier) return false;
        return i.supplier.id === supplierId;
      });
    }

    setHistoriesFilter(data);
    setLoading(false);
  }, [filter, histories]);

  return (
    <>
      <ActionFilter filter={filter} updateFilter={updateFilter} />

      <Table
        loading={loading}
        dataSource={histories_filter}
        columns={columns}
        bodyStyle={{ border: '1px solid #eee' }}
      />
    </>
  );
};

export default HistoryTable;
