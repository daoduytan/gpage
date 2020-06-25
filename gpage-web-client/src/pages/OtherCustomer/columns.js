import moment from 'moment';

export default [
  {
    title: 'Họ và nên',
    dataIndex: 'order_name',
    key: 'order_name'
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'order_phone',
    key: 'order_phone'
  },
  {
    title: 'Page',
    dataIndex: 'pageId',
    key: 'pageId'
  },
  {
    title: 'Email',
    dataIndex: 'order_email',
    key: 'order_email'
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'date',
    key: 'date',
    render: date => moment(date).format('HH:mm DD/MM/YYYY')
  }
];
