import React from 'react';
import { Location } from '@reach/router';
import { Link } from 'react-scroll';

import { MenuLeftStyle } from './style';

export const menus = [
  {
    title: 'Tính năng',
    href: 'tinh_nang'
  },
  {
    title: 'Bảng giá',
    href: 'bang_gia'
  },
  {
    title: 'Quản lý bán hàng',
    href: 'quan_ly_ban_hang'
  }
];

const MenuLeft = () => {
  return (
    <Location>
      {({ location }) => {
        const { pathname } = location;
        if (pathname !== '/') return null;
        return (
          <MenuLeftStyle>
            {menus.map(menu => (
              <li key={menu.href}>
                <Link to={menu.href} spy smooth duration={500} offset={-82}>
                  {menu.title}
                </Link>
              </li>
            ))}
          </MenuLeftStyle>
        );
      }}
    </Location>
  );
};

export default MenuLeft;
