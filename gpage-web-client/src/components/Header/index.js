import React from 'react';
import Media from 'react-media';
import { Icon } from 'antd';
import { Link } from 'react-scroll';

import { HeaderWrap } from './style';
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import Logo from '../Logo';
import { menus } from './Menu';

const HeaderLarge = () => (
  <HeaderWrap>
    <HeaderLeft />
    <HeaderRight />
  </HeaderWrap>
);

const HeaderMobile = () => {
  const [show, setShow] = React.useState(false);
  const toggle = () => setShow(!show);

  const type = show ? 'close' : 'menu';

  return (
    <HeaderWrap>
      <Logo style={{ height: 35 }} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon
          type={type}
          style={{ fontSize: 20, color: '#2977B9' }}
          onClick={toggle}
        />
      </div>
      <div
        style={{
          position: 'fixed',
          zIndex: 10,
          left: show ? 0 : '-80%',
          top: 62,
          bottom: 0,
          background: '#f3f3f3',
          width: '80%',
          transition: '.4s all'
        }}
      >
        <ul
          style={{
            padding: 0,
            margin: 0,
            listStyle: 'none'
          }}
        >
          {menus.map(menu => (
            <li
              key={menu.href}
              style={{
                borderBottom: '1px solid #ddd'
              }}
            >
              <Link
                to={menu.href}
                spy
                smooth
                duration={500}
                offset={-82}
                style={{ display: 'block', padding: 10 }}
              >
                {menu.title}
              </Link>
            </li>
          ))}
          <li style={{ padding: 10 }}>
            <HeaderRight />
          </li>
        </ul>
      </div>
    </HeaderWrap>
  );
};

const Header = () => {
  return (
    <Media queries={{ small: '(max-width: 767px)' }}>
      {matches => (matches.small ? <HeaderMobile /> : <HeaderLarge />)}
    </Media>
  );
};

export default Header;
