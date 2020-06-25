// @flow
import React, { memo } from 'react';
import { Link, Location } from '@reach/router';
import { Icon, Dropdown, Menu } from 'antd';

import { MenuItemStyle } from './style';

type HeaderLinkProps = {
  to: string,
  icon: string,
  title: string,
  child?: Array
};

const MenuItem = ({ icon, title, child, to, ...rest }: HeaderLinkProps) => {
  if (child.length > 0) {
    const renderMenuDropDown = child.map(m => (
      <Menu.Item key={m.to}>
        <Link to={m.to}>
          <Icon type={m.icon} style={{ marginRight: 5 }} /> {m.title}
        </Link>
      </Menu.Item>
    ));
    const menu = <Menu>{renderMenuDropDown}</Menu>;

    return (
      <Location>
        {({ location }) => {
          const index = location.pathname.indexOf(to);
          const background = index !== -1 ? '#41558b' : 'transparent';

          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <MenuItemStyle style={{ background }}>
                <Icon type={icon} style={{ marginRight: 5 }} /> {title}{' '}
                <Icon type="caret-down" />
              </MenuItemStyle>
            </Dropdown>
          );
        }}
      </Location>
    );
  }
  return (
    <Link
      {...rest}
      to={`/customer/${to}`}
      getProps={({ isCurrent }) => {
        return {
          style: {
            background: isCurrent ? '#41558b' : 'transparent'
          }
        };
      }}
    >
      <MenuItemStyle>
        <Icon type={icon} style={{ marginRight: 5 }} /> {title}
      </MenuItemStyle>
    </Link>
  );
};

MenuItem.defaultProps = {
  child: []
};

export default memo<HeaderLinkProps>(MenuItem);
