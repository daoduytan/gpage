import React from 'react';
import { Icon } from 'antd';

type HeaderAdminLeftProps = {
  toggle: void,
  collapsed: boolean
};

const HeaderAdminLeft = ({ toggle, collapsed }: HeaderAdminLeftProps) => {
  return (
    <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={toggle} />
  );
};

export default HeaderAdminLeft;
