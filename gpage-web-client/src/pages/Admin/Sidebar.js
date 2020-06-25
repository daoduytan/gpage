import React from 'react';
import { Icon } from 'antd';

import theme from '../../theme';
import menus from './menus';

import { SidebarLinkStyle, SidebarStyle } from './style';

type SidebarLinkProps = {
  partial: boolean
};

const SidebarLink = ({ partial = true, ...props }: SidebarLinkProps) => {
  const isActive = ({ isCurrent, isPartiallyCurrent }) => {
    const active = partial ? isPartiallyCurrent : isCurrent;
    return {
      style: { background: active ? theme.color.secondary : null }
    };
  };
  return <SidebarLinkStyle getProps={isActive} {...props} />;
};

type SidebarProps = {
  collapsed: boolean
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  return (
    <SidebarStyle collapsed={collapsed}>
      {menus.map(menu => (
        <SidebarLink key={menu.to} to={menu.to}>
          <Icon type={menu.icon} />
          <span>{menu.title}</span>
        </SidebarLink>
      ))}
    </SidebarStyle>
  );
};

export default Sidebar;
