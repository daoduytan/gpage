import React from 'react';
import { Card } from 'antd';

import TableProducts from './Tab';
import AddProduct from './AddProduct';

const Products = () => {
  return (
    <Card
      type="inner"
      title={
        <div
          style={{
            fontSize: 16,
            fontWeight: 600
          }}
        >
          Quản lý sản phẩm
        </div>
      }
      extra={<AddProduct />}
    >
      <TableProducts />
    </Card>
  );
};

export default Products;
