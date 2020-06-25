import React from 'react';
import { Tabs, Icon } from 'antd';

import { BaseLayout } from '../../layout';
import constants from '../../constants';
import { useNotification } from '../Customer/context';
import TabContent from './TabContent';

const { TabPane } = Tabs;

const tabs = [
  {
    key: 1,
    title: 'Tất cả',
    icon: 'appstore',
    component: <TabContent type="all" />
  },
  {
    key: 2,
    title: 'Xác nhận',
    icon: 'check-circle',
    component: <TabContent type="xac_nhan" />
  },
  {
    key: 3,
    title: 'In & Đóng gói',
    icon: 'printer',
    component: <TabContent type="dong_goi" />
  },
  {
    key: 4,
    title: 'Đang chuyển',
    icon: 'car',
    component: <TabContent type="dang_chuyen" />
  },
  {
    key: 5,
    title: 'Thanh toán',
    icon: 'dollar-circle',
    component: <TabContent type="thanh_toan" />
  },

  {
    key: 6,
    title: 'Hủy hàng',
    icon: 'stop',
    component: <TabContent type="huy_hang" />
  }
];

type TitleTabProps = {
  icon: String,
  title: String
};

const TitleTab = ({ icon, title }: TitleTabProps) => (
  <span>
    <Icon type={icon} theme="filled" /> {title}
  </span>
);

const OrderHome = () => {
  const [tab_key, setTab] = React.useState(1);
  // eslint-disable-next-line no-console
  const callback = key => setTab(key);

  const text = `${constants.title} - Đơn hàng -${tabs[tab_key - 1].title} `;

  const { notifications } = useNotification();

  const number = notifications.length;

  const title = `${number === 0 ? '' : `(${number})`}${text}`;

  return (
    <BaseLayout title={title}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        {tabs.map(tab => (
          <TabPane
            tab={<TitleTab icon={tab.icon} title={tab.title} />}
            key={tab.key}
          >
            <div style={{ padding: 15 }}>{tab.component}</div>
          </TabPane>
        ))}
      </Tabs>
    </BaseLayout>
  );
};

export default OrderHome;
