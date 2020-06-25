import React from 'react';
import { Switch, message } from 'antd';
import { refs } from '../../api';

const SwitchStatusService = ({ service }) => {
  const [checked, setChecked] = React.useState(service.status);
  const [loading, setLoading] = React.useState(false);

  const changeStatusCustomer = status => {
    setLoading(true);

    refs.servicesRefs
      .doc(service.id)
      .update({ status })
      .then(() => {
        message.success('Đã thay đổi trạng thái dịch vụ');
        setLoading(false);
        setChecked(status);
      })
      .catch(error => {
        message.error('Lỗi thay đổi trạng thái dịch vụ');
        setLoading(false);
      });
  };

  return (
    <Switch
      size="small"
      checked={checked}
      loading={loading}
      onChange={changeStatusCustomer}
    />
  );
};

export default SwitchStatusService;
