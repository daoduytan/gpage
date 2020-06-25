import React, { type Node } from 'react';
import { Link } from '@reach/router';
import { Icon, Tooltip } from 'antd';

import { Sidebar } from '../../components';
import { SidebarItem } from '../../components/Sidebar/style';
import { menu_other } from '../../menu';

type NavLinkProps = {
  children: Node
};

export const NavLink = (props: NavLinkProps) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        children: React.cloneElement(props.children, {
          className: isCurrent ? 'active' : ''
        })
      };
    }}
  />
);

export default () => {
  return (
    <Sidebar>
      {menu_other.map(menu => (
        <NavLink to={`/customer/${menu.to}`} key={menu.to}>
          <Tooltip placement="right" title={menu.title}>
            <SidebarItem>
              <Icon type={menu.icon} />
            </SidebarItem>
          </Tooltip>
        </NavLink>
      ))}
    </Sidebar>
  );
};
