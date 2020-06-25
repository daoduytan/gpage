import React from 'react';
import { Link } from '@reach/router';
import { Modal, Menu, Dropdown, Button, Icon, message } from 'antd';

import { refs } from '../../api';
import { getAppAccessToken } from '../../api/util';
import FormRenewal from './FormRenewal';

type ActionProps = {
  customer: {
    shopId: string,
    licence: any,
    displayName: string,
    status: boolean,
    facebookPages: any
  },
  toggleStatusCustomer: (customer: any) => void
};

const Action = ({ customer, toggleStatusCustomer }: ActionProps) => {
  const [visible, setVisible] = React.useState(false);

  const isFalse = typeof customer.status !== 'undefined' && !customer.status;

  const title = isFalse
    ? `Mở ${customer.displayName}`
    : `Khóa ${customer.displayName}`;
  const content = `Bạn chắc chắn muốn ${isFalse ? 'mở' : 'khóa'} ${
    customer.displayName
  }`;
  const okText = isFalse ? 'Mở' : 'Khóa';
  const errorText = isFalse ? 'Lỗi mở tài khoản' : 'Lỗi khóa tài khoản';

  const subscrided = isFalse ? 're_enabled' : 'disabled';

  const handleChangeStatus = () => {
    Modal.warning({
      title,
      content,
      okText,
      cancelText: 'Hủy',
      onOk: () => {
        refs.usersRefs
          .doc(customer.shopId)
          .update({ status: !customer.status, subscrided })
          .then(async () => {
            const { facebookPages } = customer;
            const app_access_token = await getAppAccessToken();

            if (!customer.status) {
              facebookPages.forEach(page => {
                window.FB.api(
                  `/${page.id}/subscribed_apps`,
                  'DELETE',
                  {
                    access_token: app_access_token
                  },
                  response => {
                    console.log('response', response);
                  }
                );
              });
            }

            toggleStatusCustomer({ ...customer, status: !customer.status });
            message.success(isFalse ? 'Mở tài khoản' : 'Khóa tài khoản');
          })
          .catch(error => {
            console.log(error);
            message.error(errorText);
          });
      },
      onCancel: () => {}
    });
  };

  const toggle = () => setVisible(!visible);

  const handleRenewal = () => {
    toggle();
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to={customer.shopId}>Xem</Link>
      </Menu.Item>

      <Menu.Item key="1" onClick={handleRenewal}>
        Chỉnh sửa
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item key="2" onClick={handleChangeStatus}>
        {isFalse ? 'Mở tài khoản' : 'Khóa tài khoản'}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <Button size="small">
          <Icon type="ellipsis" />
        </Button>
      </Dropdown>
      <Modal visible={visible} onCancel={toggle} footer={null} title="Gia hạn">
        <FormRenewal customer={customer} />
      </Modal>
    </>
  );
};

export default Action;
