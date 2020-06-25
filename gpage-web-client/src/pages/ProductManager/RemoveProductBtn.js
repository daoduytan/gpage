import React from 'react';
import { useSelector } from 'react-redux';
import { Button, message } from 'antd';
import { refs } from '../../api';

type RemoveProductBtnProps = {
  title?: string,
  products: any,
  unSelectProduct: void
};

const RemoveProductBtn = ({
  title,
  products,
  unSelectProduct
}: RemoveProductBtnProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);

  const removeProuct = () => {
    setLoading(true);

    products.forEach((product, index) => {
      refs.usersRefs
        .doc(user.shopId)
        .collection('products')
        .doc(product)
        .delete()
        .then(() => {
          if (index + 1 === products.length) {
            setLoading(false);
            message.success('Đã xóa xong sản phẩm');
            unSelectProduct();
          }
        });
    });
  };

  return (
    <Button
      onClick={removeProuct}
      type="danger"
      loading={loading}
      disabled={loading}
    >
      {title}
    </Button>
  );
};

RemoveProductBtn.defaultProps = {
  title: 'Xóa'
};

export default RemoveProductBtn;
