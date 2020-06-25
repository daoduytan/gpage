import React from 'react';

import ModalFormBadCustomer from './ModalFormBadCustomer';
import ModalListBadCustomer from './ModalListBadCustomer';

const BadCustomer = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <ModalFormBadCustomer />
      <ModalListBadCustomer />
    </div>
  );
};

export default BadCustomer;
