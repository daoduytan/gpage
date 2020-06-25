import React from 'react';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import {
  Table,
  Dropdown,
  Icon,
  Button,
  Menu,
  Divider,
  Input,
  message,
  Modal
} from 'antd';

import { Th } from '../../components';
import { tinh_thanhpho, quan_huyen, xa_phuong } from '../../dumpdata';
import { refs } from '../../api';
import AddStore from './AddStore';
import FormAddStore from './FormAddStore';

type TableStoreProps = {
  user: { shopId: string }
};

type TableStoreState = {
  stores: any,
  selected: any
};

class TableStore extends React.Component<TableStoreProps, TableStoreState> {
  columns = [
    {
      title: <Th>Tên</Th>,
      dataIndex: '',
      key: 'ten',
      render: ({ ten, id }) => {
        const { selected } = this.state;

        if (selected && selected.id === id)
          return <Input value={selected.ten} onChange={this.onChangeName} />;

        return ten;
      }
    },
    {
      title: <Th>Quản lý</Th>,
      dataIndex: '',
      key: 'quan_ly',
      render: ({ quan_ly, id }) => {
        const { selected } = this.state;

        if (selected && selected.id === id)
          return (
            <Input value={selected.quan_ly} onChange={this.onChangeQuanly} />
          );

        return quan_ly;
      }
    },
    {
      title: <Th>Số điện thoại</Th>,
      dataIndex: '',
      key: 'so_dien_thoai',
      render: ({ so_dien_thoai, id }) => {
        const { selected } = this.state;

        if (selected && selected.id === id)
          return (
            <Input
              value={selected.so_dien_thoai}
              onChange={this.onChangePhone}
            />
          );

        return so_dien_thoai;
      }
    },
    {
      title: <Th>Tỉnh/Thành phố</Th>,
      dataIndex: 'city',
      key: 'city',
      render: code => tinh_thanhpho[code].name
    },
    {
      title: <Th>Quận/Huyện</Th>,
      dataIndex: 'district',
      key: 'district',
      render: code => quan_huyen[code].name
    },
    {
      title: <Th>Xã/Phường</Th>,
      dataIndex: 'ward',
      key: 'ward',
      render: code => xa_phuong[code].name
    },

    {
      title: <Th>Địa chỉ</Th>,

      dataIndex: '',
      key: 'dia_chi',
      render: ({ dia_chi, id }) => {
        const { selected } = this.state;

        if (selected && selected.id === id)
          return (
            <Input value={selected.dia_chi} onChange={this.onChangeAddress} />
          );

        return dia_chi;
      }
    },

    {
      title: '',
      width: 160,
      dataIndex: '',
      key: 'action',
      render: store => {
        const { selected } = this.state;
        const { user } = this.props;

        const onSave = () => {
          refs.usersRefs
            .doc(user.shopId)
            .collection('store')
            .doc(store.id)
            .update({ ...selected })
            .then(() => {
              this.setState({ selected: null });
              message.success('Đã cập nhật thành công');
            })
            .catch(() => {
              message.error('Lỗi cập nhật');
            });
        };

        const onCancel = () => this.setState({ selected: null });

        if (selected && selected.id === store.id) {
          return (
            <>
              <Button type="primary" onClick={onSave}>
                Lưu
              </Button>

              <Divider type="vertical" />
              <Button type="danger" onClick={onCancel}>
                Hủy
              </Button>
            </>
          );
        }

        const showDeleteConfirm = () => {
          Modal.confirm({
            title: `Xóa kho`,
            content: `Bạn chắc chắn muốn xóa kho ${store.ten}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
              refs.usersRefs
                .doc(user.shopId)
                .collection('store')
                .doc(store.id)
                .delete();
            },

            onCancel() {
              console.log('Cancel');
            }
          });
        };

        const onEdit = () => this.setState({ selected: store });

        const menu = (
          <Menu>
            <Menu.Item key="1" onClick={onEdit}>
              Sửa
            </Menu.Item>

            <Menu.Item key="2" onClick={showDeleteConfirm}>
              Xóa
            </Menu.Item>
          </Menu>
        );

        return (
          <>
            <Link to={store.id}>
              <Button type="primary">Xem</Button>
            </Link>

            <Divider type="vertical" />
            <Dropdown overlay={menu} trigger={['click']}>
              <Button>
                <Icon type="ellipsis" />
              </Button>
            </Dropdown>
          </>
        );
      }
    }
  ];

  constructor(props) {
    super(props);

    this.state = {
      stores: [],
      selected: null
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('store')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.setState(prevState => ({
                stores: [
                  ...prevState.stores,
                  {
                    ...change.doc.data(),
                    id: change.doc.id,
                    key: change.doc.id
                  }
                ]
              }));
            }
            if (change.type === 'modified') {
              this.setState(prevState => {
                const newStores = prevState.stores.map(s => {
                  if (s.id === change.doc.id)
                    return {
                      ...change.doc.data(),
                      id: change.doc.id,
                      key: change.doc.id
                    };
                  return s;
                });

                return { stores: newStores };
              });
            }
            if (change.type === 'removed') {
              this.setState(prevState => {
                const newStores = prevState.stores.filter(
                  l => l.id !== change.doc.id
                );
                return { stores: newStores };
              });
            }
          });
        });
    }
  }

  onChangeField = (e, field) => {
    const { value } = e.target;

    this.setState(prevState => {
      return { selected: { ...prevState.selected, [field]: value } };
    });
  };

  onChangeName = e => {
    this.onChangeField(e, 'ten');
  };

  onChangePhone = e => {
    this.onChangeField(e, 'so_dien_thoai');
  };

  onChangeAddress = e => {
    this.onChangeField(e, 'dia_chi');
  };

  toggle = () => {
    this.setState({ selected: null });
  };

  render() {
    const { stores, selected } = this.state;

    return (
      <>
        <div style={{ marginBottom: 20 }}>
          <AddStore />
        </div>

        <Table
          columns={this.columns}
          dataSource={stores}
          bodyStyle={{ border: '1px solid #eee' }}
        />

        <Modal
          visible={!!selected}
          title="Thêm kho"
          footer={null}
          onCancel={this.toggle}
        >
          <FormAddStore toggle={this.toggle} store={selected} />
        </Modal>
      </>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(TableStore);
