import React from 'react';
import moment from 'moment';

import { Th } from '../../components';
import Action from './Action';
import SelectShift from './SelectShift';
import ChangeStatusMember from './ChangeStatusMember';

export default members => [
  {
    title: <Th>Tên</Th>,
    dataIndex: 'displayName',
    key: 'displayName'
  },
  {
    title: <Th>Tên đầy đủ</Th>,
    dataIndex: 'fullname',
    key: 'fullname'
  },
  {
    title: <Th>Ca</Th>,
    dataIndex: '',
    key: 'shift',
    render: member => {
      return <SelectShift member={member} />;
    }
  },
  {
    title: <Th>SĐT</Th>,
    dataIndex: 'phoneNumber',
    key: 'phoneNumber'
  },
  { title: <Th>Địa chỉ</Th>, dataIndex: 'address', key: 'address' },
  { title: <Th>Email</Th>, dataIndex: 'email', key: 'email' },
  {
    title: <Th>Ngày sinh</Th>,
    dataIndex: 'birthday',
    key: 'birthday',
    render: birthday => moment(birthday).format('DD/MM/YYYY')
  },
  {
    title: <Th>Trạng thái</Th>,
    dataIndex: '',
    width: 120,
    align: 'center',
    key: 'status',
    render: member => {
      return <ChangeStatusMember member={member} members={members} />;
    }
  },
  {
    title: '',
    align: 'center',
    width: 80,
    dataIndex: '',
    key: '',
    render: member => {
      return <Action member={member} />;
    }
  }
];
