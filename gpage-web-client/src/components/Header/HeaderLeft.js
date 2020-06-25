import React from 'react';
import Logo from '../Logo';
import MenuLeft from './Menu';

const HeaderLeft = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Logo />
      <MenuLeft />
    </div>
  );
};

export default HeaderLeft;
