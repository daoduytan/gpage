import React from 'react';
import { connect } from 'react-redux';
import { Card, Table } from 'antd';

import { fireStore } from '../../api/firebase';
import AddSupplier from './AddSupplier';

type TabSupplierProps = {
  user: { uid: String }
};
type TabSupplierState = {
  suppliers: any
};

class TabSupplier extends React.Component<TabSupplierProps, TabSupplierState> {
  constructor(props) {
    super(props);

    this.state = {
      suppliers: []
    };

    this.columns = [
      { title: 'Tên', dataIndex: 'ten', key: 'ten' },
      {
        title: 'Số điện thoại',
        dataIndex: 'so_dien_thoai',
        key: 'so_dien_thoai'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'dia_chi',
        key: 'dia_chi'
      }
    ];
  }

  componentDidMount() {
    this.loadSupplier();
  }

  loadSupplier = () => {
    const { user } = this.props;
    fireStore
      .collection('users')
      .doc(user.uid)
      .collection('suppliers')
      .onSnapshot(snapDocs => {
        const suppliers = [];
        snapDocs.forEach(doc => {
          suppliers.push({ ...doc.data(), id: doc.id });
        });

        this.setState({ suppliers });
      });
  };

  render() {
    const { suppliers } = this.state;
    const dataSource = suppliers.map(s => ({ ...s, key: s.id }));
    return (
      <Card title="Nhà cung cấp" type="inner" extra={<AddSupplier />}>
        <Table dataSource={dataSource} columns={this.columns} />
      </Card>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(TabSupplier);
