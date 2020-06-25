import React from 'react';
import { Icon } from 'antd';
import { useSelector } from 'react-redux';

import { refs } from '../../api';

type TotalNumberProductProps = {
  product: any
};

const TotalNumberProduct = ({ product }: TotalNumberProductProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(true);
  const [number, setNumer] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('products_store')
        .where('productId', '==', product.id)
        .get()
        .then(response => {
          if (response.empty) {
            setLoading(false);
          } else {
            const arr = response.docs.map(doc => doc.data());

            const new_number = arr.reduce((value, p) => p.so_luong + value, 0);

            setNumer(new_number);
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }
  }, [product.id, user]);

  if (loading) return <Icon type="loading" />;

  return number;
};

export default TotalNumberProduct;
