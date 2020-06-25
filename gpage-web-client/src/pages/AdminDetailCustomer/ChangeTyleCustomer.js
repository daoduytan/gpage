import React from 'react';
import { Dropdown, Menu, Icon } from 'antd';

import { refs } from '../../api';
import { TagTypeCustomer } from '../AdminCustomer/TableCustomer';

type ChangeStyleCustomerProps = {
  customer: {
    licence: {
      type: string
    },
    shopId: string
  }
};

type MenuItemProps = {
  type: string,
  changeTypeLicence: (type: string) => void
};

const MenuItem = ({ type, changeTypeLicence }: MenuItemProps) => {
  const onClick = () => changeTypeLicence(type);

  const title = type === 'premium' ? 'Trả phí' : 'Dùng thử';

  return (
    <div onClick={onClick} role="presentation">
      {title}
    </div>
  );
};

const ChangeTyleCustomer = ({ customer }: ChangeStyleCustomerProps) => {
  const changeTypeLicence = type => {
    refs.usersRefs.doc(customer.shopId).update({ licence: { type, time: 0 } });
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <MenuItem changeTypeLicence={changeTypeLicence} type="trial" />
      </Menu.Item>
      <Menu.Item key="1">
        <MenuItem changeTypeLicence={changeTypeLicence} type="premium" />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <span>
        <TagTypeCustomer type={customer.licence.type} />
        <Icon type="down" />
      </span>
    </Dropdown>
  );
};

export default ChangeTyleCustomer;
