import React from 'react';

import { Icon, Tooltip } from 'antd';

import { Sidebar } from '../../components';
import { menu_report } from '../../menu';
import { NavLink } from '../Other/Sidebar';
import { SidebarItem } from '../../components/Sidebar/style';

export default () => {
  return (
    <Sidebar>
      {menu_report.map(menu => (
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
