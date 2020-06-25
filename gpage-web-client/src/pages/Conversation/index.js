import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';

import { Loading } from '../../components';
import constants from '../../constants';
import { useNotification } from '../Customer/context';
import { ProviderConvsContext } from './context';
import TabPages from './TabPages';

const ConversationList = React.lazy(() => import('./ConversationList'));
const ConversationDetail = React.lazy(() => import('./ConversationDetail'));
const CardDetailCustomer = React.lazy(() => import('./CardDetailCustomer'));
const ReAnabled = React.lazy(() => import('../ReAnabled'));

const Conversation = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { notifications } = useNotification();

  const number = notifications.length;

  const title = `${number === 0 ? '' : `(${number}) `}${
    constants.title
  } - Quản lý hội thoại`;

  console.log('user', user);

  const renderContent = () => {
    if (user.subscrided === 're_enabled') return <ReAnabled />;
    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <ProviderConvsContext>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <TabPages />

              <Row style={{ flex: 1 }}>
                <Col span={7}>
                  <ConversationList />
                </Col>
                <Col span={9}>
                  <ConversationDetail />
                </Col>
                <Col span={8}>
                  <CardDetailCustomer />
                </Col>
              </Row>
            </div>
          </div>
        </ProviderConvsContext>
      </>
    );
  };

  return (
    <React.Suspense fallback={<Loading />}>{renderContent()}</React.Suspense>
  );
};

export default Conversation;
