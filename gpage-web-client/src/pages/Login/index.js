import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Card, Col, Button, Icon } from 'antd';

import { DefaultLayout } from '../../layout';
import FormLogin from './FormLogin';
import { login } from '../../reducers/authState/authActions';
import { Container } from '../../components';
import { Title, LoginFacebookWrap } from './style';
import content from './content';

const size = 'large';

const Login = () => {
  const dispatch = useDispatch();
  const handleLogin = () => dispatch(login());
  return (
    <DefaultLayout title="Login">
      <Container style={{ marginTop: 50, marginBottom: 50 }}>
        <Title>Chọn hình thức đăng nhập</Title>

        <Row gutter={30}>
          <Col md={12}>
            <Card
              title={content.facebook.title}
              type="inner"
              style={{ marginBottom: 30 }}
            >
              <LoginFacebookWrap>
                <Button type="primary" size={size} onClick={handleLogin}>
                  <Icon type="facebook" theme="filled" color="#fff" />
                  {content.facebook.btn_title}
                </Button>
              </LoginFacebookWrap>
              <div style={{ marginTop: 30 }}>
                <p>
                  <b>{content.note_label}</b>
                </p>
                <p>{content.facebook.note}</p>
              </div>
            </Card>
          </Col>

          <Col md={12}>
            <Card
              title={content.account.title}
              type="inner"
              style={{ marginBottom: 30 }}
            >
              <FormLogin />

              <div style={{ marginTop: 30 }}>
                <p>
                  <b>{content.note_label}</b>
                </p>
                <p>{content.account.note}</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </DefaultLayout>
  );
};

export default Login;
