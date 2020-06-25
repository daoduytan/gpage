import React from 'react';
import {
  Table,
  Input,
  Dropdown,
  Icon,
  Button,
  Menu,
  Modal,
  Divider,
  message
} from 'antd';
import { connect } from 'react-redux';

import { refs } from '../../api';
import { filterWithText } from '../../ultils';
import AddSupplier from './AddSupplier';

type TableSuppligersProps = {
  user: { shopId: string }
};
type TableSuppligersState = {
  suppliers: any,
  selected: any
};

const { Search } = Input;

class TableSuppliers extends React.Component<
  TableSuppligersProps,
  TableSuppligersState
> {
  columns = [
    {
      title: 'Tên',
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
      title: 'Số điện thoại',
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
      title: 'Địa chỉ',
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
      title: 'Ghi chú',
      dataIndex: '',
      key: 'ghi_chu',
      render: ({ ghi_chu, id }) => {
        const { selected } = this.state;

        if (selected && selected.id === id)
          return (
            <Input value={selected.ghi_chu} onChange={this.onChangeNote} />
          );

        return ghi_chu;
      }
    },
    {
      title: '',
      align: 'right',
      dataIndex: '',
      key: 'x',
      render: supplier => {
        const { selected } = this.state;
        const { user } = this.props;

        const showDeleteConfirm = () => {
          Modal.confirm({
            title: `Xóa kho`,
            content: `Bạn chắc chắn muốn xóa kho ${supplier.ten}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
              refs.usersRefs
                .doc(user.shopId)
                .collection('supplier')
                .doc(supplier.id)
                .delete();
            },

            onCancel() {
              console.log('Cancel');
            }
          });
        };

        const onEdit = () => this.setState({ selected: supplier });

        const onSave = () => {
          refs.usersRefs
            .doc(user.shopId)
            .collection('supplier')
            .doc(supplier.id)
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

        if (selected && selected.id === supplier.id) {
          return (
            <>
              <Button type="primary" onClick={onSave}>
                <Icon type="check" />
              </Button>

              <Divider type="vertical" />
              <Button type="danger" onClick={onCancel}>
                <Icon type="close" />
              </Button>
            </>
          );
        }

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        );
      }
    }
  ];

  constructor(props) {
    super(props);

    this.state = {
      suppliers: [],
      selected: null,
      text: ''
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('supplier')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.setState(prevState => ({
                suppliers: [
                  ...prevState.suppliers,
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
                const newSuppliers = prevState.suppliers.map(s => {
                  if (s.id === change.doc.id)
                    return {
                      ...change.doc.data(),
                      id: change.doc.id,
                      key: change.doc.id
                    };
                  return s;
                });

                return { suppliers: newSuppliers };
              });
            }
            if (change.type === 'removed') {
              this.setState(prevState => {
                const newSuppliers = prevState.suppliers.filter(
                  l => l.id !== change.doc.id
                );
                return { suppliers: newSuppliers };
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

  onChangeNote = e => {
    this.onChangeField(e, 'ghi_chu');
  };

  searchSupplier = text => {
    this.setState({ text });
  };

  dataSource = () => {
    const { suppliers, text } = this.state;

    if (text.length === 0) return suppliers;

    const dataSource = suppliers.filter(s => filterWithText(text, s.ten));

    return dataSource;
  };

  render() {
    return (
      <>
        <div style={{ marginBottom: 20, display: 'flex' }}>
          <Search
            onSearch={this.searchSupplier}
            style={{ maxWidth: 250, marginRight: 10 }}
            placeholder="Tìm theo nhà cung cấp"
          />
          <AddSupplier />
        </div>
        <Table
          bodyStyle={{ border: '1px solid #eee' }}
          columns={this.columns}
          dataSource={this.dataSource()}
        />
      </>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(TableSuppliers);
