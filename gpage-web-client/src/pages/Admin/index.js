import React, { type Node } from 'react';
import { Layout } from 'antd';
import Logo from '../../components/Logo';
import Sidebar from './Sidebar';
import HeaderAdminLeft from './HeaderAdminLeft';
import HeaderAdminRight from './HeaderAdminRight';
import { BottomText } from '../../components';

const { Header, Content, Footer, Sider } = Layout;

type AdminProps = { children: Node };

const Admin = ({ children }: AdminProps) => {
  const [collapsed, setCollapsed] = React.useState(true);

  const toggle = () => setCollapsed(!collapsed);

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth={100}
        trigger={null}
        collapsible
        collapsed={collapsed}
        // onBreakpoint={broken => {
        //   console.log(broken);
        // }}
        // onCollapse={(collapsed, type) => {
        //   console.log(collapsed, type);
        // }}
      >
        <div
          style={{
            borderBottom: '1px solid #2f465d',
            display: 'flex',
            height: 64,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Logo light style={{ height: 35 }} />
        </div>

        <Sidebar collapsed={collapsed} />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 15px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%'
            }}
          >
            <HeaderAdminLeft toggle={toggle} collapsed={collapsed} />
            <HeaderAdminRight />
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ minHeight: `calc(100vh - 201px)` }}>{children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <BottomText />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Admin;
