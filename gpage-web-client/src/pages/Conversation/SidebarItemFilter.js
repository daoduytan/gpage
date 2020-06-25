import React from 'react';
import { Tooltip, Icon } from 'antd';

import { useConvs } from './context';
import { SidebarItem } from '../../components/Sidebar/style';

type ItemProps = {
  menu: any,
  reset: any,
  loading: boolean
};

const Item = ({ menu, reset, loading }: ItemProps) => {
  const {
    state,
    handleChangeParent,
    handleChangeReset,
    selectConversation,
    handleChangeText
  } = useConvs();
  const { parent } = state.filter;

  const onClick = () => {
    if (loading) return null;

    if (reset) {
      handleChangeReset();
      handleChangeText('');
    } else {
      handleChangeParent(menu.active);
      selectConversation(null);
    }
  };

  return (
    <Tooltip placement="right" title={menu.title} key={menu.title}>
      <SidebarItem
        className={menu.active === parent ? 'active' : null}
        onClick={onClick}
      >
        <Icon type={menu.icon} />
      </SidebarItem>
    </Tooltip>
  );
};

type ItemChildProps = {
  menu: any,
  loading: boolean
};

const ItemChild = ({ menu, loading }: ItemChildProps) => {
  const { state, handleChangeChildren } = useConvs();
  const { children } = state.filter;

  const className = active => {
    const exits = children.find(c => c === active);
    if (exits) return 'active';
    return null;
  };

  const onClick = () => {
    if (loading) return null;
    return handleChangeChildren(menu.active);
  };

  return (
    <Tooltip placement="right" title={menu.title} key={menu.title}>
      <SidebarItem onClick={onClick} className={className(menu.active)}>
        <Icon type={menu.icon} />
      </SidebarItem>
    </Tooltip>
  );
};

export { Item, ItemChild };
