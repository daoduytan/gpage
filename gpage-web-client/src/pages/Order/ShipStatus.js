import React from 'react';
import { Tag, Tooltip } from 'antd';

import { giaohangnhanh, giaohangtietkiem } from './ship_status';
import { StatusStyle } from './style';

const color = {
  giaohangnhanh: '#FF8216',
  giaohangtietkiem: '#11924B'
};

const ShipStatus = ({ shiper, order_ship }) => {
  if (!shiper) {
    return (
      <Tooltip title="Tự vận chuyển">
        <Tag>TVC</Tag>
      </Tooltip>
    );
  }

  const renderStatusGHN = () => {
    if (!order_ship) return null;
    if (
      !order_ship.CurrentStatus ||
      order_ship.CurrentStatus === 'ReadyToPick'
    ) {
      return 'Đã tạo đơn hàng';
    }

    const status = giaohangnhanh.find(
      s => s.value === order_ship.CurrentStatus
    );

    return status.title;
  };

  if (shiper.id === 'giaohangnhanh') {
    return (
      <span>
        <Tooltip title="Giao hàng nhanh">
          <Tag color={color.giaohangnhanh}>GHN</Tag>
        </Tooltip>

        <StatusStyle>{renderStatusGHN()}</StatusStyle>
      </span>
    );
  }

  const renderStatusGHTK = () => {
    if (!order_ship || !order_ship.status_id) return null;
    if (order_ship.status_id === 0) {
      return 'Đã tạo đơn hàng';
    }

    const status = giaohangtietkiem.find(s => s.value === order_ship.status_id);

    return status.title;
  };

  if (shiper.id === 'giaohangtietkiem') {
    return (
      <span>
        <Tooltip title="Giao hàng tiết kiệm">
          <Tag color={color.giaohangtietkiem}>GHTK</Tag>
        </Tooltip>
        <StatusStyle>{renderStatusGHTK()}</StatusStyle>
      </span>
    );
  }

  return '"';
};

export default React.memo(ShipStatus);
