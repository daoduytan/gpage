import React from 'react';
import { Link } from '@reach/router';
import { Card, Table } from 'antd';
import { connect } from 'react-redux';

import { refs } from '../../api';

type TabStoreProps = {
  user: {
    shopId: string
  }
};

type TabStoreState = {
  don_nhap: any
};

class TabStore extends React.Component<TabStoreProps, TabStoreState> {
  constructor(props) {
    super(props);

    this.state = {
      don_nhap: []
    };
    this.columns = [
      { title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
      { title: 'Nha cung cap', dataIndex: 'nha_cung_cap', key: 'nha_cung_cap' },
      { title: 'SL', dataIndex: 'so_luong', key: 'so_luong' },
      { title: 'Gia', dataIndex: 'gia', key: 'gia' }
    ];
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.loadDonNhap();
    }
  }

  loadDonNhap = () => {
    const { user } = this.props;
    refs.usersRefs
      .doc(user.shopId)
      .collection('don_nhap')
      .onSnapshot(snapshot => {
        const don_nhap = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        this.setState({ don_nhap });
      });
  };

  render() {
    const { don_nhap } = this.state;
    const dataSource = don_nhap.map(d => ({ ...d, key: d.id }));

    return (
      <Card
        type="inner"
        title="Quản lý kho"
        extra={<Link to="add_supplier">Nhập hàng</Link>}
      >
        <Table dataSource={dataSource} columns={this.columns} />
      </Card>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(TabStore);
