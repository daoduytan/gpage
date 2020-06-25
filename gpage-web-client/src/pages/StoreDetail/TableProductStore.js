import React from 'react';
import { connect } from 'react-redux';
import { Table, Icon, Input } from 'antd';
import { refs } from '../../api';
import { formatMoney } from '../../ultils';
import { filterProduct } from '../ProductManager/util';
import AddProductStore from './AddProductStore';
import { ImageStyle } from './style';

export const Image = ({ image }: { image?: string }) => {
  if (!image || image.length === 0) {
    return (
      <ImageStyle>
        <Icon type="picture" />
      </ImageStyle>
    );
  }

  return <ImageStyle image={image} />;
};

Image.defaultProps = {
  image: ''
};

const columns = [
  {
    title: <b>Hình ảnh</b>,
    dataIndex: 'hinh_anh',
    key: 'hinh_anh',

    render: hinh_anh => <Image image={hinh_anh && hinh_anh.src} />
  },
  {
    title: <b>Tên</b>,
    dataIndex: 'ten',
    key: 'ten'
  },
  {
    title: <b>Mã</b>,
    dataIndex: 'ma',
    key: 'ma'
  },
  {
    title: <b>Giá vốn</b>,
    dataIndex: 'gia_von',
    key: 'gia_von',
    render: gia_von => {
      if (!gia_von) return '';

      return formatMoney(gia_von);
    }
  },
  {
    title: <b>Giá bán</b>,
    dataIndex: 'gia_ban',
    key: 'gia_ban',
    render: gia_ban => {
      if (!gia_ban) return '';
      return formatMoney(gia_ban);
    }
  },
  {
    title: <b>Giá buôn</b>,
    dataIndex: 'gia_buon',
    key: 'gia_buon',
    render: gia_buon => {
      if (!gia_buon) return '';

      return formatMoney(gia_buon);
    }
  },
  {
    title: <b>Số lượng</b>,
    dataIndex: 'so_luong',
    key: 'so_luong',
    render: so_luong => {
      if (!so_luong) return 0;

      return formatMoney(so_luong);
    }
  }
];

type TableProductStoreProps = { storeId: string, user: { shopId: string } };
type TableProductStoreState = {
  products: any,
  products_store: any,
  loading: boolean
};

const { Search } = Input;

class TableProductStore extends React.Component<
  TableProductStoreProps,
  TableProductStoreState
> {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      products_store: [],
      loading: true,
      text: ''
    };
  }

  componentDidMount() {
    this.loadProductStore();
  }

  componentDidUpdate(prevProps, prevState) {
    const { storeId } = this.props;
    if (prevProps.storeId !== storeId) {
      this.loadProductStore();
    }
  }

  loadProductStore = () => {
    const { user, storeId } = this.props;

    this.setState({ products: [], products_store: [] });

    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('products')

        .get()
        .then(response => {
          const products = response.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            key: doc.id
          }));

          this.setState({ products, loading: false }, () => {
            refs.usersRefs
              .doc(user.shopId)
              .collection('products_store')
              .where('storeId', '==', storeId)
              .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                  const product = { ...change.doc.data(), key: change.doc.id };
                  if (change.type === 'added') {
                    this.setState(prevState => ({
                      products_store: [...prevState.products_store, product]
                    }));
                  }
                  if (change.type === 'modified') {
                    this.setState(prevState => {
                      const new_products_store = prevState.products_store.map(
                        p => {
                          if (p.key === change.doc.id) return change.doc.data();
                          return p;
                        }
                      );

                      return { products_store: new_products_store };
                    });
                  }
                  // if (change.type === 'removed') {
                  //   console.log('Removed city: ', change.doc.data());
                  // }
                });
              });
          });
        });
    }
  };

  dataSource = () => {
    const { products, products_store, text } = this.state;

    const arr = products_store.map(product => {
      const existProduct = products.find(p => p.id === product.productId);

      if (!existProduct) return null;

      return { ...existProduct, ...product };
    });

    const dataSource = arr.filter(product =>
      filterProduct(product, 'ten', text)
    );

    return dataSource;
  };

  searchProduct = text => {
    this.setState({ text });
  };

  render() {
    const { storeId } = this.props;
    const { loading } = this.state;

    return (
      <>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: 15 }}>
            <Search
              // ref={this.searchRef}
              onSearch={this.searchProduct}
              style={{ maxWidth: 250 }}
              placeholder="Tìm theo tên"
            />
          </div>

          <AddProductStore storeId={storeId} />
        </div>

        <Table
          loading={loading}
          bodyStyle={{ border: `1px solid #eee` }}
          columns={columns}
          dataSource={this.dataSource()}
        />
      </>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(TableProductStore);
