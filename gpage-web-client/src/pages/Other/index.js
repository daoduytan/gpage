import React, { type Node } from 'react';
import Sidebar from './Sidebar';

type OtherProps = { children: Node };

const Other = ({ children }: OtherProps) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

export default Other;
