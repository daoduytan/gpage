import React from 'react';
import { Tooltip as TooltipUi } from 'antd';

type TooltipProps = {
  text: string,
  width?: number
};

const style = {
  whiteSpace: 'nowrap',
  display: 'block',
  textOverflow: 'ellipsis',
  overflow: 'hidden'
};

const Tooltip = ({ text, width }: TooltipProps) => {
  return (
    <TooltipUi placement="top" title={text}>
      <span style={{ ...style, width }}>{text}</span>
    </TooltipUi>
  );
};

Tooltip.defaultProps = {
  width: 100
};

export default React.memo(Tooltip);
