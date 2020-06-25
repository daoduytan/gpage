import React from 'react';
import { useSelector } from 'react-redux';
import { Tag, Icon } from 'antd';
import { refs } from '../../api';

type NumberProductInStoreProps = {
  product: {
    id: string
  },
  store: {
    id: string
  }
};

const NumberProductInStore = ({
  product,
  store
}: NumberProductInStoreProps) => {
  const [loading, setLoading] = React.useState(true);
  const [number, setNumber] = React.useState(false);

  const user = useSelector(({ authReducer }) => authReducer.user);

  React.useState(() => {
    // refs.usersRefs
    //   .doc(user.shopId)
    //   .collection('products_store')
    //   .where('storeId', '==', store.id)
    //   .where('productId', '==', product.id)
    //   .get()
    //   .then(response => {
    //     if (response.docs.empty || response.docs.length === 0) {
    //       setLoading(false);
    //     } else {
    //       const docProducts = response.docs[0].data();
    //       setNumber(docProducts.so_luong);
    //       setLoading(false);
    //     }
    //   });

    refs.usersRefs
      .doc(user.shopId)
      .collection('products_store')
      .where('storeId', '==', store.id)
      .where('productId', '==', product.id)
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          setLoading(false);
        } else {
          const docProducts = snapshot.docs[0].data();

          setNumber(docProducts.so_luong);
          setLoading(false);
        }
      });
  }, []);

  if (loading) return <Icon type="loading" />;

  const color = number > 0 ? '#108ee9' : '#f50';
  const title = number > 0 ? `Còn hàng (${number})` : 'Hết hàng';

  return <Tag color={color}>{title}</Tag>;
};

export default React.memo(NumberProductInStore);
