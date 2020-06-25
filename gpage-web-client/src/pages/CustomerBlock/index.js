import React from 'react';
import { Col, Row } from 'antd';
import { Redirect } from '@reach/router';
import { useSelector } from 'react-redux';

import Header from '../SelectPages/Header';
import { Container } from '../../components';

const CustomerBlock = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  if (!user) return <Redirect to="/login" noThrow />;
  if (user && user.status) return <Redirect to="/" noThrow />;
  return (
    <>
      <Header />

      <Container style={{ marginTop: 100 }}>
        <Row type="flex" align="center" style={{ textAlign: 'center' }}>
          <Col md={10}>
            <h3 style={{ fontSize: 30, fontWeight: 700, color: 'red' }}>
              Tài khoản tạm khóa
            </h3>
            <p style={{ fontSize: 18 }}>
              Tài khoản của bạn tạm thời đang bị khóa. Liên hệ với chúng tôi để
              biết lý do.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CustomerBlock;
