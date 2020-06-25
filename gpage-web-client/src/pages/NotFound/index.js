import React, { memo } from 'react';
import { Link } from '@reach/router';
import { Button, Card } from 'antd';
import { Wrap, Content } from './style';

type NotFoundProps = {
  hasHeader?: boolean
};

const NotFound = ({ hasHeader }: NotFoundProps) => (
  <Wrap hasHeader={hasHeader}>
    <Card>
      <Content>
        <h2>404</h2>
        <p>
          Trang này không tồn tại. Bấm vào link bên dưới để quay về trang chủ
        </p>
        <Link to="/">
          <Button type="primary" size="large">
            Trang chủ
          </Button>
        </Link>
      </Content>
    </Card>
  </Wrap>
);

NotFound.defaultProps = {
  hasHeader: false
};

export default memo(NotFound);
