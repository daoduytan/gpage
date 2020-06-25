import React, { useState, useEffect, memo } from 'react';
import {
  Row,
  Col,
  Input,
  Icon,
  Form,
  Table,
  Button,
  Tabs,
  Modal,
  InputNumber,
  Checkbox,
  Card,
  // AutoComplete,
  Select,
  message,
  Divider,
  Avatar
} from 'antd';
import { useSelector } from 'react-redux';
import { pick } from 'lodash';

import { tinh_thanhpho, getQuanHuyen, getXaPhuong } from '../../../dumpdata';
import { Scrollbars, InputMoney, Th } from '../../../components';
import { useConvs } from '../context';
import AddProductForm from './AddProductForm';
import theme from '../../../theme';
import { formatMoney } from '../../../ultils';
import { refs } from '../../../api';
import AddStore from '../../StoreManager/AddStore';
import Shipping from './Shipping';
import PrintOrder from '../../OrderDetail/PrintOrder';
import { useStores } from '../../Customer/context_store';

const FormItem = Form.Item;

const { TextArea } = Input;
const { TabPane } = Tabs;

const style = { margin: '0 0 5px' };

const InputField = props => {
  return (
    <FormItem style={{ ...style }}>
      <Input addonBefore={<Icon type="user" />} {...props} />
    </FormItem>
  );
};

// address
type OrderAddressProps = {
  order: any,
  setOrder: Function
};

const OrderAddress = ({ order, setOrder }: OrderAddressProps) => {
  const [districts, setDistrict] = useState([]);
  const [wards, setWards] = useState([]);

  const onChange = e => {
    const newOrder = { ...order, [e.target.name]: e.target.value };
    setOrder(newOrder);
  };

  const selectCity = id => {
    setDistrict(getQuanHuyen(id));

    const newAddressInfo = {
      ...order.addressInfo,
      city: id,
      district: undefined,
      ward: undefined
    };

    const newOrder = { ...order, addressInfo: newAddressInfo };
    setOrder(newOrder);
  };

  const selectDistrict = id => {
    setWards(getXaPhuong(id));
    const newAddressInfo = {
      ...order.addressInfo,
      district: id,
      ward: undefined
    };

    const newOrder = { ...order, addressInfo: newAddressInfo };
    setOrder(newOrder);
  };

  const selectWard = id => {
    const newAddressInfo = {
      ...order.addressInfo,
      ward: id
    };

    const newOrder = { ...order, addressInfo: newAddressInfo };
    setOrder(newOrder);
  };

  return (
    <Row gutter={10}>
      <Col span={12}>
        <InputField
          addonBefore={<Icon type="user" />}
          value={order.order_name}
          name="order_name"
          onChange={onChange}
        />

        <InputField
          addonBefore={<Icon type="phone" />}
          value={order.order_phone}
          name="order_phone"
          onChange={onChange}
        />
      </Col>
      <Col span={12} style={{ marginTop: -4 }}>
        <FormItem style={{ ...style }}>
          <Select
            showSearch
            style={{ width: '100%' }}
            dataSource={tinh_thanhpho}
            placeholder="Tỉnh/Thành phố"
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
            onChange={selectCity}
          >
            {Object.keys(tinh_thanhpho).map(c => (
              <Select.Option value={tinh_thanhpho[c].code} key={c}>
                {tinh_thanhpho[c].name}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem style={{ ...style }}>
          <Select
            showSearch
            style={{ width: '100%' }}
            dataSource={districts}
            placeholder="Quận/Huyện"
            disabled={districts.length === 0}
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
            onChange={selectDistrict}
          >
            {Object.keys(districts).map(c => (
              <Select.Option value={districts[c].code} key={c}>
                {districts[c].name_with_type}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem style={{ ...style }}>
          <Select
            showSearch
            style={{ width: '100%' }}
            dataSource={wards}
            placeholder="Phường/Xã"
            disabled={wards.length === 0}
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
            onChange={selectWard}
          >
            {Object.keys(wards).map(c => (
              <Select.Option value={wards[c].code} key={c}>
                {wards[c].name}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem style={{ ...style }} label="Địa chỉ">
          <TextArea
            onChange={onChange}
            value={order.address}
            name="address"
            placeholder="Địa chỉ khách hàng "
          />
        </FormItem>
      </Col>
    </Row>
  );
};

// list order
type SearchProductsProps = {
  addProductToOrder: (product: any) => void,
  removeProductToOrder: (product: any) => void
};

const SearchProducts = ({
  addProductToOrder,
  removeProductToOrder
}: SearchProductsProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [dataSource, setDataSource] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [products, setProducts] = useState([]);

  const toggle = () => setVisible(!visible);

  React.useEffect(() => {
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('products')
        .get()
        .then(data => {
          const a = data.docs.map(d => ({ ...d.data(), id: d.id, key: d.id }));
          setDataSource(a);
        });
    }
  }, [user]);

  const handleSelectProduct = product => {
    const exist = products.find(p => p.id === product.id);

    let new_products;

    if (exist) {
      new_products = products.filter(p => p.id !== product.id);
      setProducts(new_products);
      removeProductToOrder(product);
    } else {
      const new_product = { ...product, so_luong: 1 };
      setProducts([...products, new_product]);
      addProductToOrder(new_product);
    }
  };

  return (
    <>
      <Button onClick={toggle}>Sản phẩm</Button>
      <Modal
        visible={visible}
        footer={null}
        title="Chọn sản phẩm"
        onOk={toggle}
        onCancel={toggle}
      >
        <Table
          bodyStyle={{ border: '1px solid #eee' }}
          dataSource={dataSource}
          // rowSelection={rowSelection}
          columns={[
            {
              title: '',
              dataIndex: '',
              key: 'check',
              render: ({ id }: { id: string }) => {
                const product = products.find(p => p.id === id);
                const checked = !!product;

                return <Checkbox checked={checked} />;
              }
            },
            {
              title: <Th>Hình ảnh</Th>,
              dataIndex: 'hinh_anh',
              key: 'hinh_anh',
              render: hinh_anh => {
                if (!hinh_anh) return <Avatar icon="picture" shape="square" />;
                return <Avatar src={hinh_anh.src} shape="square" />;
              }
            },
            {
              title: <Th>Tên</Th>,

              dataIndex: 'ten',
              key: 'ten'
            },
            {
              title: <Th>Giá bán</Th>,

              dataIndex: 'gia_ban',
              key: 'gia_ban'
            },

            {
              title: <Th>Khối lượng</Th>,
              dataIndex: 'khoi_luong',
              key: 'khoi_luong'
            }
          ]}
          onRow={product => {
            return {
              onClick: () => {
                handleSelectProduct(product);
              }
            };
          }}
        />

        {/* <AutoComplete
          dataSource={dataSource}
          filterOption={(inputValue, option) =>
            option.props.children
              .toUpperCase()
              .indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={selectProduct}
          // style={{ width: 100 }}
        >
          {dataSource.map(d => (
            <AutoComplete.Option key={d.ten} value={d.ten}>
              {d.ten}
            </AutoComplete.Option>
          ))}
        </AutoComplete> */}
      </Modal>
    </>
  );
};

// add product
type AddProductProps = {
  addProductToOrder: (product: any) => void,
  removeProductToOrder: (product: any) => void
};

const AddProduct = ({
  addProductToOrder,
  removeProductToOrder
}: AddProductProps) => {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible(!visible);

  return (
    <>
      <Button
        onClick={toggle}
        style={{ borderRadius: '0 3px 3px 0', marginLeft: -1 }}
      >
        <Icon type="plus" />
      </Button>

      <Modal
        visible={visible}
        title="Thêm sản phẩm mới"
        footer={null}
        width={400}
        onCancel={toggle}
      >
        <AddProductForm
          addProductToOrder={addProductToOrder}
          removeProductToOrder={removeProductToOrder}
          onCancel={toggle}
        />
      </Modal>
    </>
  );
};

type OrderProps = {
  order: any,
  setOrder: Function
};

export const OrderList = ({ order, setOrder }: OrderProps) => {
  const dataSource = order.list_order.map(o => ({
    ...o,
    quantity: 1
  }));

  const addProductToOrder = product => {
    const exits = order.list_order.find(l => l.id === product.id);
    if (exits) {
      const new_order_list = order.list_order.map(l => {
        if (l.id === exits.id) return { ...l, so_luong: l.so_luong + 1 };
        return l;
      });
      setOrder({ ...order, list_order: new_order_list });
    } else {
      setOrder({ ...order, list_order: [...order.list_order, product] });
    }
  };

  const removeProductToOrder = product => {
    const new_list_order = order.list_order.filter(l => l.id !== product.id);
    setOrder({ ...order, list_order: new_list_order });
  };

  const columns = [
    {
      title: () => (
        <div style={{ display: 'flex' }}>
          <SearchProducts
            addProductToOrder={addProductToOrder}
            removeProductToOrder={removeProductToOrder}
          />
          <AddProduct
            addProductToOrder={addProductToOrder}
            list_order={order.list_order}
          />
        </div>
      ),
      width: 150,
      dataIndex: '',
      key: 'ten',
      render: ({ ten, id }: { ten: string, id: string }) => {
        const removeProduct = () => {
          const new_order_list = order.list_order.filter(l => l.id !== id);
          setOrder({ ...order, list_order: new_order_list });
        };
        return (
          <>
            {ten}

            <Icon
              type="close-circle"
              theme="filled"
              style={{ marginLeft: 5, color: 'red' }}
              onClick={removeProduct}
            />
          </>
        );
      }
    },
    { title: 'KL', dataIndex: 'khoi_luong', key: 'khoi_luong' },
    {
      title: 'SL',
      dataIndex: '',
      key: 'so_luong',
      render: ({ so_luong, id }: { so_luong: Number, id: String }) => {
        const changeQuantity = quantity => {
          const list_order = order.list_order.map(product => {
            if (product.id === id) return { ...product, so_luong: quantity };
            return product;
          });
          setOrder({ ...order, list_order });
        };

        return (
          <InputNumber
            min={1}
            value={so_luong}
            onChange={changeQuantity}
            style={{ width: 50, margin: 0 }}
          />
        );
      }
    },
    { title: 'Giá', dataIndex: 'gia_ban', key: 'gia_ban' }
  ];

  return (
    <>
      <Table
        style={{ margin: '5px 0' }}
        bodyStyle={{ padding: 0 }}
        columns={columns}
        bordered
        dataSource={dataSource}
        pagination={false}
        locale={{ emptyText: <span>Chưa có đơn hàng</span> }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          textAlign: 'right',
          margin: '10px 0 15px'
        }}
      >
        <div>
          <b>SL: </b>
          {dataSource.reduce((number, d) => number + d.so_luong, 0)}
        </div>
        <div>
          <b>KL: </b>
          {dataSource.reduce(
            (number, d) => number + d.khoi_luong * d.so_luong,
            0
          )}{' '}
          gram
        </div>

        <div>
          <b>Giá: </b>
          {formatMoney(
            dataSource.reduce((number, d) => number + d.so_luong * d.gia_ban, 0)
          )}
        </div>
      </div>
    </>
  );
};
// order transport
type UseCarrierProps = {
  setOrder: (order: any) => void,
  order: any
};

const UseCarrier = ({ setOrder, order }: UseCarrierProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  console.log('user', user);

  // const checkNoShip = () => {
  //   if (!user.ship) return true;

  //   if (user.ship && user.ship > 0) {
  //     const arrExist = user.ship.map(s => s.token);
  //     if (arrExist.length > 0) return false;
  //     return true;
  //   }

  //   return false;
  // };

  // if (checkNoShip()) return <NoShip />;

  const changePbk = value => setOrder({ ...order, phi_bao_khach: value });

  const changeCkType = type => {
    setOrder({ ...order, chiet_khau: { ...order.chiet_khau, type } });
  };
  const changeValueCk = value => {
    setOrder({ ...order, chiet_khau: { ...order.chiet_khau, value } });
  };

  const changeNoteKh = e => {
    const customer_note = e.target.value;
    setOrder({ ...order, customer_note });
  };
  const changeNoteCskh = e => {
    const cskh_note = e.target.value;
    setOrder({ ...order, cskh_note });
  };

  const price_list_product = order.list_order.reduce(
    (number, d) => number + d.so_luong * d.gia_ban,
    0
  );
  const price_chiet_khau = price => {
    const { chiet_khau } = order;
    if (chiet_khau.type === 'percent') {
      return (price * chiet_khau.value) / 100;
    }

    return chiet_khau.value;
  };

  const paySender =
    price_list_product +
    order.phi_bao_khach -
    order.phi_van_chuyen -
    price_chiet_khau(price_list_product) -
    order.tien_chuyen_khoan -
    order.tien_coc;

  const collectingRecipient =
    price_list_product +
    order.phi_bao_khach -
    price_chiet_khau(price_list_product) -
    order.tien_chuyen_khoan -
    order.tien_coc;

  return (
    <Row gutter={10} style={{ padding: '0 10px' }}>
      <Col span={12}>
        <FormItem label="Phí vận chuyển" style={{ ...style }}>
          <InputMoney
            disabled
            value={order.phi_van_chuyen}
            style={{ width: '100%' }}
          />
        </FormItem>

        <FormItem label="Ghi chú của khách" style={{ ...style }}>
          <TextArea onChange={changeNoteKh} />
        </FormItem>

        <FormItem label="Ghi chú CSKH" style={{ ...style }}>
          <TextArea onChange={changeNoteCskh} />
        </FormItem>
      </Col>

      <Col span={12}>
        <FormItem label="Phí báo khách" style={{ ...style }}>
          {/* <Checkbox>Lấy theo tổng phí</Checkbox> */}
          <InputNumber style={{ width: '100%' }} onChange={changePbk} />
        </FormItem>

        <FormItem label="Chiết khấu" style={{ ...style }}>
          <Select defaultValue="money" onChange={changeCkType}>
            <Select.Option value="money">Tiền</Select.Option>
            <Select.Option value="percent">%</Select.Option>
          </Select>

          {order.chiet_khau.type === 'percent' ? (
            <InputNumber max={100} min={0} onChange={changeValueCk} />
          ) : (
            <InputMoney min={0} onChange={changeValueCk} />
          )}
        </FormItem>

        <div style={{ fontSize: 12, fontWeight: '700' }}>
          <Row gutter={5} style={{ margin: '15px 0' }}>
            <Col span={12}>Thu người nhận:</Col>
            <Col
              span={12}
              style={{ textAlign: 'right', color: theme.color.secondary }}
            >
              {formatMoney(collectingRecipient)}
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={12}>Trả người gửi:</Col>
            <Col
              span={12}
              style={{ textAlign: 'right', color: theme.color.secondary }}
            >
              {formatMoney(paySender)}
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

// use transformer
type UseTransformerProps = {
  order: any,
  setOrder: Function
};
const UseTransformer = ({ order, setOrder }: UseTransformerProps) => {
  const changePvc = value => {
    setOrder({ ...order, phi_van_chuyen: value });
  };

  const changePbk = value => setOrder({ ...order, phi_bao_khach: value });

  const changeCkType = type => {
    setOrder({ ...order, chiet_khau: { ...order.chiet_khau, type } });
  };

  const changeValueCk = value => {
    setOrder({ ...order, chiet_khau: { ...order.chiet_khau, value } });
  };

  const price_list_product = order.list_order.reduce(
    (number, d) => number + d.so_luong * d.gia_ban,
    0
  );
  const price_chiet_khau = price => {
    const { chiet_khau } = order;
    if (chiet_khau.type === 'percent') {
      return (price * chiet_khau.value) / 100;
    }

    return chiet_khau.value;
  };

  const paySender =
    price_list_product +
    order.phi_bao_khach -
    order.phi_van_chuyen -
    price_chiet_khau(price_list_product) -
    order.tien_chuyen_khoan -
    order.tien_coc;

  const collectingRecipient =
    price_list_product +
    order.phi_bao_khach -
    price_chiet_khau(price_list_product) -
    order.tien_chuyen_khoan -
    order.tien_coc;

  const changeCustomerNote = e => {
    setOrder({ ...order, customer_note: e.target.value });
  };
  const changeCskhNote = e => {
    setOrder({ ...order, cskh_note: e.target.value });
  };

  return (
    <Row gutter={10} style={{ padding: '0 10px' }}>
      <Col span={12}>
        <FormItem label="Phí vận chuyển" style={{ ...style }}>
          <InputMoney onChange={changePvc} style={{ width: '100%' }} />
        </FormItem>

        <FormItem label="Ghi chú của khách" style={{ ...style }}>
          <TextArea onChange={changeCustomerNote} />
        </FormItem>

        <FormItem label="Ghi chú CSKH" style={{ ...style }}>
          <TextArea onChange={changeCskhNote} />
        </FormItem>
      </Col>

      <Col span={12}>
        <FormItem label="Phí báo khách" style={{ ...style }}>
          <InputMoney onChange={changePbk} style={{ width: '100%' }} />
        </FormItem>

        <FormItem label="Chiết khấu" style={{ ...style }}>
          <Select defaultValue="money" onChange={changeCkType}>
            <Select.Option value="money">Tiền</Select.Option>
            <Select.Option value="percent">%</Select.Option>
          </Select>

          {order.chiet_khau.type === 'percent' ? (
            <InputNumber max={100} min={0} onChange={changeValueCk} />
          ) : (
            <InputMoney min={0} onChange={changeValueCk} />
          )}
        </FormItem>
        <div style={{ fontSize: 12, fontWeight: '700' }}>
          <Row gutter={5} style={{ margin: '15px 0' }}>
            <Col span={12}>Thu người nhận:</Col>
            <Col
              span={12}
              style={{ textAlign: 'right', color: theme.color.secondary }}
            >
              {formatMoney(collectingRecipient)}
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={12}>Trả người gửi:</Col>
            <Col
              span={12}
              style={{ textAlign: 'right', color: theme.color.secondary }}
            >
              {formatMoney(paySender)}
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

// order transport
const ContextTransport = React.createContext();

// No ship
// const NoShip = () => {
//   const { setTab } = React.useContext(ContextTransport);
//   const moveTab = () => {
//     setTab('use_transformer');
//   };

//   return (
//     <div style={{ paddingBottom: 15 }}>
//       <Empty description="Chưa thêm hãng vận chuyển">
//         <Button style={{ marginRight: 5 }} onClick={moveTab}>
//           Tự vận chuyển
//         </Button>
//         <Link to="/customer/other/setting">
//           <Button type="primary">Thêm vận chuyển</Button>
//         </Link>
//       </Empty>
//     </div>
//   );
// };

const OrderTransport = ({ order, setOrder }: OrderProps) => {
  const [tab, setTab] = React.useState(order.type_order || 'use_carrier');

  function callback(key) {
    const shiper = key === 'use_carrier' ? order.shiper : null;
    setTab(key);

    setOrder({ ...order, type_order: key, shiper, phi_van_chuyen: 0 });
  }

  const value = { tab, setTab };

  return (
    <ContextTransport.Provider value={value}>
      <Card bodyStyle={{ padding: 0 }}>
        <Tabs activeKey={tab} onChange={callback}>
          <TabPane tab="Gửi vận chuyển" key="use_carrier">
            <React.Suspense fallback={<Icon type="loading" />}>
              <UseCarrier order={order} setOrder={setOrder} />
            </React.Suspense>
          </TabPane>
          <TabPane tab="Tự vận chuyển" key="use_transformer">
            <React.Suspense fallback={<Icon type="loading" />}>
              <UseTransformer order={order} setOrder={setOrder} />
            </React.Suspense>
          </TabPane>
        </Tabs>
      </Card>
    </ContextTransport.Provider>
  );
};

// select store

type SelectStoreProps = { selectStore: any };

const SelectStore = ({ selectStore }: SelectStoreProps) => {
  const { stores } = useStores();

  const handleSelectStore = idStore => {
    const store = stores.find(s => s.id === idStore);

    selectStore(store);
  };

  const renderStore = () => {
    if (stores.length === 0) {
      return <AddStore type="default" block />;
    }
    return (
      <Select onChange={handleSelectStore} style={{ width: '100%' }}>
        {stores.map(store => (
          <Select.Option key={store.id} value={store.id}>
            {store.ten}
          </Select.Option>
        ))}
      </Select>
    );
  };

  return (
    <FormItem label="Chọn kho hàng" style={{ ...style }}>
      {renderStore()}
    </FormItem>
  );
};

// Create Order done
const height = 'calc(100vh - 50px - 45px - 80px - 80px)';

type OrderDoneProps = {
  toggleDone: void
};

const OrderDone = React.memo(({ toggleDone }: OrderDoneProps) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 15,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div>
        <h3>Đã tạo đơn thành công</h3>
        <Button type="primary" size="large" onClick={toggleDone}>
          Trở lại
        </Button>
      </div>
    </div>
  );
});

const FormOrder = ({ conversation }: { conversation: any }) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const initialOrder = {
    pageId: conversation.pageId,
    order_user_info: conversation.sender,
    order_name: conversation.sender.name,
    order_phone: conversation.phone,
    order_email: conversation.email || '',

    addressInfo: {
      city: undefined,
      district: undefined,
      ward: undefined
    },
    street: '',
    list_order: [],
    type_order: 'use_carrier',
    shiper: null,
    phi_van_chuyen: 0,
    phi_bao_khach: 0,
    chiet_khau: {
      type: 'tien',
      value: 0
    },
    customer_note: '',
    cskh_note: '',
    store: null
  };

  const [order, setOrder] = useState(initialOrder);

  const updateOrder = newOrder => {
    setOrder(newOrder);
  };

  useEffect(() => {
    const reload_order = {
      pageId: conversation.pageId,
      order_user_info: conversation.sender,
      order_name: conversation.sender.name,
      order_phone: conversation.phone,
      order_email: conversation.email || '',
      address: conversation.address || '',
      addressInfo: {
        city: null,
        district: null,
        ward: null
      },
      tien_coc: 0,
      tien_chuyen_khoan: 0,
      list_order: [],
      type_order: 'use_carrier',
      shiper: null,
      phi_van_chuyen: 0,
      phi_bao_khach: 0,
      chiet_khau: {
        type: 'tien',
        value: 0
      },
      store: null
    };

    setOrder(reload_order);
  }, [
    conversation.address,
    conversation.email,
    conversation.pageId,
    conversation.phone,
    conversation.sender
  ]);

  const toggleDone = () => setDone(!done);

  const checkValid = () => {
    if (!order.order_name || order.order_name.length === 0) return false;
    if (!order.order_phone || order.order_phone.length === 0) return false;
    if (!order.addressInfo.city) return false;
    if (!order.addressInfo.district) return false;
    if (!order.addressInfo.ward) return false;
    if (!order.address || order.address.length === 0) return false;
    if (order.list_order.length === 0) return false;
    if (!order.store) return false;
    return true;
  };

  const saveOrder = () => {
    if (user) {
      if (!order.order_name || order.order_name.length === 0)
        return message.error('Điền tên khách hàng');
      if (!order.order_phone || order.order_phone.length === 0)
        return message.error('Điền số diện thoại khách hàng');
      if (!order.addressInfo.city) return message.error('Chọn tỉnh/thành phố');
      if (!order.addressInfo.district) return message.error('Chọn quận/huyện');
      if (!order.addressInfo.ward) return message.error('Chọn xã/phường');
      if (!order.address || order.address.length === 0)
        return message.error('Điền địa chỉ khách hàng');
      if (order.list_order.length === 0) return message.error(' Chọn sản phẩm');
      if (!order.store) return message.error('Chọn kho hàng');

      setLoading(true);

      return refs.ordersRefs
        .add({
          ...order,
          shopId: user.shopId,
          date: Date.now(),
          member: pick(user, ['displayName', 'uid', 'role'])
        })
        .then(doc => {
          const history = {
            user: pick(user, ['displayName', 'shopId', 'uid']),
            time: Date.now(),
            status: {
              before: 'moi',
              after: null
            }
          };

          refs.ordersRefs
            .doc(doc.id)
            .collection('histories')
            .add(history);

          setLoading(false);
          toggleDone();
          setOrder(initialOrder);
        });
    }

    return null;
  };

  const saveOrderPrint = () => {
    saveOrder();
  };

  // const changeTienDatCoc = tien_coc => setOrder({ ...order, tien_coc });

  // const changeTienChuyenKhoan = tien_chuyen_khoan =>
  //   setOrder({ ...order, tien_chuyen_khoan });

  const selectStore = store => setOrder({ ...order, store });

  if (done) return <OrderDone toggleDone={toggleDone} />;

  return (
    <div style={{ position: 'relative', paddingBottom: 70 }}>
      <Scrollbars style={{ height }}>
        <div style={{ padding: '0 15px' }}>
          <OrderAddress order={order} setOrder={updateOrder} />
          <Divider />
          <OrderList order={order} setOrder={updateOrder} />
          <Divider />
          {/* <Row gutter={10}>
            <Col span={12}>
              <FormItem label="Đặt cọc" style={{ ...style }}>
                <InputMoney
                  style={{ width: '100%' }}
                  onChange={changeTienDatCoc}
                  value={order.tien_coc}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Chuyển khoản" style={{ ...style }}>
                <InputMoney
                  style={{ width: '100%' }}
                  onChange={changeTienChuyenKhoan}
                  value={order.tien_chuyen_khoan}
                />
              </FormItem>
            </Col>
          </Row>
          <Divider /> */}

          <SelectStore selectStore={selectStore} />
          <Divider />

          {order.list_order.length > 0 && (
            <>
              <Shipping order={order} setOrder={updateOrder} />

              <OrderTransport order={order} setOrder={updateOrder} />
            </>
          )}
        </div>
      </Scrollbars>

      <div
        style={{
          padding: '15px 10px',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #eee'
        }}
      >
        <Row gutter={10}>
          <Col span={12}>
            <Button
              type="primary"
              block
              onClick={saveOrder}
              disabled={!checkValid()}
              loading={loading}
            >
              <Icon type="save" /> Lưu
            </Button>
          </Col>
          <Col span={12}>
            {checkValid() ? (
              <PrintOrder
                order={order}
                title={
                  <Button block onClick={saveOrderPrint}>
                    <Icon type="printer" /> Lưu & In
                  </Button>
                }
              />
            ) : (
              <Button block disabled>
                <Icon type="printer" /> Lưu & In
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

const CreateOrder = () => {
  const { state } = useConvs();
  const conversation = state.conversation_select;

  if (!conversation) return null;

  return <FormOrder conversation={conversation} />;
};

export default memo(CreateOrder);
