import React, { memo } from 'react';

import MenuItem from './MenuItem';
import { menuCustomer } from '../../menu';

const Menu = () => {
  return (
    <div style={{ display: 'flex', alignItem: 'center' }}>
      {menuCustomer.map(menu => (
        <MenuItem key={menu.to} {...menu} />
      ))}
    </div>
  );
};

export default memo(Menu);
