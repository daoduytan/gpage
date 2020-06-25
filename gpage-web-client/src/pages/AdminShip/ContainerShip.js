import React, { type Node } from 'react';
import { Row, Col } from 'antd';

import { WrapShip } from './style';

type ContainerShipProps = {
  children: Node
};

const col = 12;

const ContainerShip = ({ children }: ContainerShipProps) => {
  return (
    <Row type="flex" justify="center">
      <Col md={col}>
        <WrapShip>{children}</WrapShip>
      </Col>
    </Row>
  );
};

export default React.memo(ContainerShip);
