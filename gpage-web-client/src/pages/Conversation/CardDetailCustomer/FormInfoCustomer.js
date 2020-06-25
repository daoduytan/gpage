import React from 'react';

import FormField from './FormField';

const FormInfoCustomer = () => {
  return (
    <>
      <FormField field="email" icon="mail" placeholder="Email" />
      <FormField field="phone" icon="phone" placeholder="Số điện thoại" />
      <FormField field="address" icon="environment" placeholder="Địa chỉ" />
    </>
  );
};

export default FormInfoCustomer;
