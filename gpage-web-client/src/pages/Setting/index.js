import React from 'react';
import { Tabs } from 'antd';
import { Helmet } from 'react-helmet';

import { Scrollbars } from '../../components';
import constants from '../../constants';
import { useNotification } from '../Customer/context';
import TabSetting from './TabSetting';
import TabLabels from './TabLabels';
import TabShift from './TabShift';
import TabQuickAnswer from './TabQuickAnswer';
import TabSettingComment from './TabSettingComment';

const { TabPane } = Tabs;
const tabs = [
  { title: 'Cài đặt chung', component: <TabSetting />, key: 0 },
  { title: 'Cài đặt bình luận', component: <TabSettingComment />, key: 1 },

  { title: 'Ca trực', component: <TabShift />, key: 2 },
  { title: 'Câu hỏi nhanh', component: <TabQuickAnswer />, key: 3 },
  { title: 'Nhãn hội thoại', component: <TabLabels />, key: 4 }
];

const callback = () => {};

const title_page = 'Cài đặt';

const Setting = () => {
  const { notifications } = useNotification();
  const text = `${constants.title} - ${title_page}`;
  const number = notifications.length;
  const title = `${number === 0 ? '' : `(${number})`}${text}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Scrollbars style={{ height: 'calc(100vh - 50px)' }}>
        <Tabs defaultActiveKey="0" onChange={callback}>
          {tabs.map(tab => (
            <TabPane tab={tab.title} key={tab.key}>
              {tab.component}
            </TabPane>
          ))}
        </Tabs>
      </Scrollbars>
    </>
  );
};

export default Setting;
