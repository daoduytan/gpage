import React from 'react';
import { AutoComplete } from 'antd';

import { useSelector } from 'react-redux';
import { fireStore } from '../../api/firebase';

const ProductAutocomplete = ({
  order,
  changeListProduct
}: {
  changeListProduct: Function,
  order: any
}) => {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const user = useSelector(({ authReducer }) => authReducer.user);

  React.useEffect(() => {
    if (user) {
      fireStore
        .collection('users')
        .doc(user.uid)
        .collection('products')
        .get()
        .then(snaps => {
          const arr = snaps.docs.map(doc => ({ ...doc.data(), id: doc.id }));

          setProducts(arr);
          setLoading(false);
        });
    }
  }, [user]);

  const selectProduct = e => {
    const product = products.find(d => d.ten === e);

    if (product) {
      const exits = order.find(d => d.ten === e);

      if (exits) {
        const new_order = order.map(l => {
          if (l.id === exits.id) return { ...l, so_luong: l.so_luong + 1 };
          return l;
        });
        changeListProduct(new_order);
      } else {
        changeListProduct([...order, { ...product, so_luong: 1 }]);
      }
    }
  };

  return (
    <AutoComplete
      placeholder="Tìm sản phẩm"
      loading={loading}
      dataSource={products}
      filterOption={(inputValue, option) =>
        option.props.children
          .toUpperCase()
          .indexOf(inputValue.toUpperCase()) !== -1
      }
      onChange={selectProduct}
    >
      {products.map(d => (
        <AutoComplete.Option key={d.ten} value={d.ten}>
          {d.ten}
        </AutoComplete.Option>
      ))}
    </AutoComplete>
  );
};

export default ProductAutocomplete;
