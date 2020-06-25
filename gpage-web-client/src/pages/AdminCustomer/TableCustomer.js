import React from 'react';
import { Link } from '@reach/router';
import { Table, Avatar, Input, Icon, Tag, Button, Select } from 'antd';

import theme from '../../theme';
import { refs } from '../../api';
import { Th } from '../../components';
import { useServices } from '../AdminDetailCustomer/hooks';
import Tooltip from './Tooltip';
import SwitchStatusCustomer from './SwitchStatusCustomer';
import Expired from './Expired';
import ServiceTag from './ServiceTag';
import Action from './Action';

const { Search } = Input;
const size = 'default';

const types = {
  trial: {
    title: 'Dùng thử',
    color: theme.color.customer.trial
  },
  premium: {
    title: 'Trả phí',
    color: theme.color.customer.premium
  }
};

export const TagTypeCustomer = ({ type }: { type: string }) => {
  const { title, color } = types[type];

  return (
    <Tag color={color} size="small">
      {title}
    </Tag>
  );
};

const TableCustomer = () => {
  const [loading, setLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState([]);
  const [filter_customers, setFilterCustomer] = React.useState([]);
  const { services } = useServices();

  const loadCustomers = () => {
    refs.usersRefs
      .where('type', '==', 'customer')
      .where('role', '==', 'admin')
      .get()
      .then(res => {
        const arrData = res.docs.map(doc => ({ ...doc.data(), key: doc.id }));
        setCustomers(arrData);
        setFilterCustomer(arrData);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      loadCustomers();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = text => {
    setLoading(true);
    const newCustomers = filter_customers.filter(
      cusstomer => cusstomer.displayName.indexOf(text) >= 0
    );

    setFilterCustomer(newCustomers);
    setLoading(false);
  };

  const toggleStatusCustomer = customer => {
    const newCustomers = customers.map(c => {
      if (c.uid === customer.uid) return customer;
      return c;
    });

    setFilterCustomer(newCustomers);
  };

  const filterType = type => {
    if (type === 'all') return setFilterCustomer(customers);
    const newCustomers = customers.filter(
      cusstomer => cusstomer.licence.type === type
    );

    return setFilterCustomer(newCustomers);
  };

  const reset = () => setFilterCustomer(customers);

  const dataSource = filter_customers.map(c => ({ ...c }));

  const columns = [
    {
      title: <Th>Ảnh</Th>,
      dataIndex: '',
      key: 'photoURL',
      render: ({ photoURL, shopId }: { photoURL: string, shopId: string }) => (
        <Link to={shopId}>
          <Avatar src={photoURL} />
        </Link>
      )
    },
    {
      title: <Th>Tên</Th>,
      dataIndex: '',
      key: 'displayName',

      render: ({
        displayName,
        shopId
      }: {
        displayName: string,
        shopId: string
      }) => (
        <Link to={shopId}>
          <Tooltip text={displayName} width={100} />
        </Link>
      )
    },
    {
      title: <Th>Email</Th>,
      dataIndex: 'email',
      key: 'email',
      render: email => <Tooltip text={email} width={100} />
    },
    {
      title: <Th>SĐT</Th>,
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: <Th>Cửa hàng</Th>,
      dataIndex: 'shop',
      key: 'shop',
      align: 'center',
      render: shop =>
        shop && shop.name ? <Tooltip text={shop.name} width={100} /> : '"'
    },
    {
      title: <Th>Tài khoản</Th>,
      dataIndex: 'licence',
      align: 'center',
      key: 'type_account',
      render: ({ type }: { type: string }) => {
        return <TagTypeCustomer type={type} />;
      }
    },
    {
      title: <Th>Thời hạn</Th>,
      dataIndex: 'licence',
      align: 'center',
      key: 'expired',
      render: licence => <Expired licence={licence} />
    },
    {
      title: <Th>Dịch vụ</Th>,
      dataIndex: 'licence',
      align: 'center',
      key: 'service',
      render: licence => <ServiceTag licence={licence} services={services} />
    },
    {
      title: <Th>Trạng thái</Th>,
      dataIndex: '',
      key: 'status',
      align: 'center',
      render: customer => {
        return <SwitchStatusCustomer customer={customer} />;
      }
    },

    {
      title: '',
      dataIndex: '',
      align: 'right',
      key: 'zx',
      render: customer => (
        <Action
          customer={customer}
          toggleStatusCustomer={toggleStatusCustomer}
        />
      )
    }
  ];

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Search
          size={size}
          placeholder="Tìm kiếm tên khách hàng"
          onSearch={handleSearch}
          style={{ maxWidth: 300 }}
        />
        <Select
          defaultValue="all"
          onChange={filterType}
          size={size}
          style={{ margin: '0 10px', width: 120 }}
        >
          <Select.Option key="all" value="all">
            Tất cả
          </Select.Option>
          <Select.Option key="trial" value="trial">
            Dùng thử
          </Select.Option>
          <Select.Option key="premium" value="premium">
            Trả phí
          </Select.Option>
        </Select>
        <Button size={size} onClick={reset}>
          <Icon type="reload" />
        </Button>
      </div>
      <Table loading={loading} columns={columns} dataSource={dataSource} />
    </>
  );
};

export default TableCustomer;
