import React from 'react';
import { BaseLayout } from '../../layout';
import Sidebar from './Sidebar';

type ProductsProps = {
  children: Node
};

const Products = ({ children }: ProductsProps) => {
  return (
    <BaseLayout titlr="Bao cao">
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, position: 'relative' }}>{children}</div>
      </div>
    </BaseLayout>
  );
};

export default Products;
