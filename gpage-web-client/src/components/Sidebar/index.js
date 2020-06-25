import React, { type Node, memo } from 'react';

import { SidebarWrap } from './style';

type SidebarProps = {
  children: Node
};

const Sidebar = ({ children }: SidebarProps) => {
  return <SidebarWrap>{children}</SidebarWrap>;
};

export default memo(Sidebar);
