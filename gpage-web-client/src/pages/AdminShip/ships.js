import React from 'react';

import Giaohangnhanh from './Giaohangnhanh';
import Giaohangtietkiem from './Giaohangtietkiem';

export default [
  {
    title: 'Giao hàng nhanh',
    id: 'giaohangnhanh',
    component: <Giaohangnhanh />
  },
  {
    title: 'Giao hàng tiết kiệm',
    id: 'giaohangtietkiem',
    component: <Giaohangtietkiem />
  }
];
