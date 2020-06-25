// @flow
import React, { memo } from 'react';
import {
  Table,
  Icon,
  Button,
  Divider,
  Input,
  message,
  InputNumber
} from 'antd';
import { connect, useSelector } from 'react-redux';

import { InputMoney, UploadImage, Th } from '../../components';
import { formatMoney, removeAlias } from '../../ultils';
import { refs } from '../../api';
import AddProduct from './AddProduct';
import RemoveProductBtn from './RemoveProductBtn';
import { filterProduct } from './util';
import TotalNumberProduct from './TotalNumberProduct';

import Action from './Action';

const { Search } = Input;

type EditImageProps = {
  image: any,
  id: String
};

const errorStyle = {
  borderColor: 'red'
};

// edit image product
const EditImage = memo(({ image, id }: EditImageProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  const onChangeImage = imgrRes => {
    refs.usersRefs
      .doc(user.shopId)
      .collection('products')
      .doc(id)
      .update({
        hinh_anh: imgrRes
      })
      .then(() => message.success('Đã cập nhật hình ảnh'))
      .catch(() => message.error('Lỗi cập nhật ảnh'));
  };
  return <UploadImage image={image} size={50} upload={onChangeImage} />;
});

// table product
type TableProductProps = {
  user: {
    shopId: string
  }
};

type TableProductState = {
  dataSource: any,
  selectedRowKeys: any,
  loading: boolean
};
class TableProduct extends React.Component<
  TableProductProps,
  TableProductState
> {
  columns = [
    {
      title: <Th>Hình ảnh</Th>,
      dataIndex: '',
      key: 'hinh_anh',
      render: ({ hinh_anh, id }) => <EditImage image={hinh_anh} id={id} />
    },
    {
      title: <Th>Tên</Th>,
      dataIndex: '',
      key: 'ten',
      render: ({ ten, id }) => {
        const { selected } = this.state;

        if (selected && selected.id === id) {
          const style =
            selected.ten.length === 0
              ? { ...errorStyle, width: 80 }
              : { width: 80 };

          return (
            <Input
              value={selected.ten}
              onChange={this.onChangeName}
              style={style}
            />
          );
        }
        return ten;
      }
    },
    {
      title: <Th>Mã</Th>,
      dataIndex: '',
      key: 'ma',
      render: product => {
        const { ma, id } = product;

        const { selected } = this.state;
        if (selected && selected.id === id) {
          const style =
            selected.ma.length === 0
              ? { ...errorStyle, width: 80 }
              : { width: 80 };

          return (
            <Input
              value={selected.ma}
              onChange={this.onChangeCode}
              style={style}
            />
          );
        }

        if (!ma) return '"';

        return ma;
      }
    },
    {
      title: <Th>Giá vốn (vnd)</Th>,
      dataIndex: '',
      key: 'gia_von',
      render: ({ gia_von, id }) => {
        const { selected } = this.state;
        if (selected && selected.id === id) {
          const style = !selected.gia_von ? { ...errorStyle } : {};
          return (
            <InputNumber
              min={1}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/vnd\s?|(,*)/g, '')}
              value={selected.gia_von}
              onChange={this.onChangeGiaVon}
              style={style}
            />
          );
        }

        if (!gia_von) return '';

        return formatMoney(gia_von);
      }
    },
    {
      title: <Th>Giá bán (vnd)</Th>,
      dataIndex: '',
      key: 'gia_ban',
      render: ({ gia_ban, id }) => {
        const { selected } = this.state;

        if (selected && selected.id === id) {
          const style = !selected.gia_ban ? { ...errorStyle } : {};

          return (
            <InputNumber
              min={1}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/vnd\s?|(,*)/g, '')}
              value={selected.gia_ban}
              onChange={this.onChangeGiaBan}
              style={style}
            />
          );
        }

        if (!gia_ban) return '"';

        return formatMoney(gia_ban);
      }
    },
    {
      title: <Th>Giá buôn (vnd)</Th>,
      dataIndex: '',
      key: 'gia_buon',
      render: ({ gia_buon, id }) => {
        const { selected } = this.state;
        if (selected && selected.id === id) {
          const style = !selected.gia_buon ? { ...errorStyle } : {};
          return (
            <InputMoney
              min={1}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/vnd\s?|(,*)/g, '')}
              value={selected.gia_buon}
              onChange={this.onChangeGiaBuon}
              style={style}
            />
          );
        }
        if (!gia_buon) return '';

        return formatMoney(gia_buon);
      }
    },
    {
      title: <Th>SL</Th>,
      dataIndex: '',
      align: 'center',
      key: 'so_luong',
      render: product => {
        return <TotalNumberProduct product={product} />;
      }
    },
    {
      title: <Th>KL (gram)</Th>,
      dataIndex: '',
      align: 'center',
      key: 'khoi_luong',
      render: ({ khoi_luong, id }) => {
        const { selected } = this.state;

        if (selected && selected.id === id) {
          const style = selected.khoi_luong === 0 ? { ...errorStyle } : {};
          return (
            <InputMoney
              value={selected.khoi_luong}
              onChange={this.onChangeKhoiluong}
              style={style}
            />
          );
        }

        if (!khoi_luong) return '';

        return khoi_luong;
      }
    },
    {
      title: '',
      dataIndex: '',
      align: 'right',
      key: 'x',
      render: product => {
        const { user } = this.props;
        const { selected, loading } = this.state;

        const removeProduct = () => {
          refs.usersRefs
            .doc(user.shopId)
            .collection('products')
            .doc(product.id)
            .delete();
        };

        const onEdit = () => this.setState({ selected: product });

        const onSave = () => {
          this.setState({ loading: true }, () => {
            refs.usersRefs
              .doc(user.shopId)
              .collection('products')
              .doc(selected.id)
              .update({
                ...selected
              })
              .then(() => {
                this.setState({ selected: null, loading: false });
                message.success('Cập nhật thành công');
              })
              .catch(() => {
                this.setState({ loading: false });
                message.error('Cập nhật thất bại');
              });
          });
        };
        const onCancel = () => {
          this.setState({ selected: null });
        };

        return (
          <div style={{ textAlign: 'right' }}>
            {selected && selected.id === product.id ? (
              <>
                <Button
                  onClick={onSave}
                  type="primary"
                  disabled={!this.validate() || loading}
                >
                  <Icon type="check" />
                </Button>

                <Divider type="vertical" />

                <Button onClick={onCancel} type="danger">
                  <Icon type="close" />
                </Button>
              </>
            ) : (
              <Action
                product={product}
                removeProduct={removeProduct}
                onCancel={onCancel}
                onEdit={onEdit}
              />
            )}
          </div>
        );
      }
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selected: null,
      selectedRowKeys: [],
      text: '',
      loading: false
    };

    this.searchRef = React.createRef();
  }

  componentDidMount() {
    const { user } = this.props;

    if (user) {
      const { shopId } = user;
      this.subscrideData(shopId);
    }
  }

  validate = () => {
    const { selected } = this.state;
    if (!selected) return false;
    const { gia_ban, gia_buon, gia_von, ma, khoi_luong, ten } = selected;

    if (
      !gia_ban ||
      !gia_buon ||
      !gia_von ||
      ma.length === 0 ||
      khoi_luong === 0 ||
      ten.length === 0
    )
      return false;

    return true;
  };

  onChangeName = e => {
    const ten = e.target.value;

    this.setState(prevState => {
      return { selected: { ...prevState.selected, ten } };
    });
  };

  onChangeCode = e => {
    const ma = e.target.value;
    this.setState(prevState => {
      return { selected: { ...prevState.selected, ma } };
    });
  };

  onChangeGiaVon = gia_von => {
    this.setState(prevState => {
      return { selected: { ...prevState.selected, gia_von } };
    });
  };

  onChangeGiaBan = gia_ban => {
    this.setState(prevState => {
      return { selected: { ...prevState.selected, gia_ban } };
    });
  };

  onChangeKhoiluong = khoi_luong => {
    this.setState(prevState => {
      return { selected: { ...prevState.selected, khoi_luong } };
    });
  };

  onChangeGiaBuon = gia_buon => {
    this.setState(prevState => {
      return { selected: { ...prevState.selected, gia_buon } };
    });
  };

  onChangeQuantity = so_luong => {
    this.setState(prevState => {
      return { selected: { ...prevState.selected, so_luong } };
    });
  };

  subscrideData = (shopId: string) => {
    refs.usersRefs
      .doc(shopId)
      .collection('products')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            this.setState(prevState => ({
              dataSource: [
                ...prevState.dataSource,
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
              const newDataSource = prevState.dataSource.map(l => {
                if (l.id === change.doc.id)
                  return {
                    ...change.doc.data(),
                    id: change.doc.id,
                    key: change.doc.id
                  };
                return l;
              });

              return { dataSource: newDataSource };
            });
          }
          if (change.type === 'removed') {
            this.setState(prevState => {
              const newDataSource = prevState.dataSource.filter(
                l => l.id !== change.doc.id
              );
              return { dataSource: newDataSource };
            });
          }
        });
      });
  };

  searchProduct = text => {
    const format_text = removeAlias(text).toLowerCase();

    this.setState({ text: format_text });
  };

  changText = e => this.setState({ text: e.target.value });

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  unSelectProduct = () => {
    this.setState({ selectedRowKeys: [] });
  };

  filterDataSoure = () => {
    const { dataSource, text } = this.state;

    if (text.length === 0) return dataSource;

    const arrWithName = dataSource.filter(product =>
      filterProduct(product, 'ten', text)
    );
    const arrWithMa = dataSource.filter(product =>
      filterProduct(product, 'ma', text)
    );

    return [...arrWithName, ...arrWithMa];
  };

  reset = () => this.setState({ text: '' });

  render() {
    const { selectedRowKeys, text } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <>
        <div
          style={{
            display: 'flex',
            marginBottom: 20
          }}
        >
          <Search
            ref={this.searchRef}
            onChange={this.changText}
            onSearch={this.searchProduct}
            style={{ maxWidth: 250 }}
            placeholder="Tìm theo tên, mã sản phẩm"
            value={text}
          />
          <Button onClick={this.reset} style={{ margin: '0 10px' }}>
            <Icon type="reload" />
          </Button>

          <div>
            {selectedRowKeys.length > 0 && (
              <span style={{ marginRight: 10 }}>
                <RemoveProductBtn
                  products={selectedRowKeys}
                  unSelectProduct={this.unSelectProduct}
                />
              </span>
            )}{' '}
            <AddProduct />
          </div>
        </div>

        <Table
          bodyStyle={{ border: '1px solid #eee' }}
          rowSelection={rowSelection}
          dataSource={this.filterDataSoure()}
          columns={this.columns}
        />
      </>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(TableProduct);
