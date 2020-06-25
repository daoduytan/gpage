import React, { memo } from 'react';

import Logo from '../Logo';
import Menu from './Menu';

const HeaderLeft = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: 15 }}>
        <Logo light style={{ height: 30 }} />
      </div>

      <Menu />
    </div>
  );
};

export default memo(HeaderLeft);
