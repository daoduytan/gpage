import React from 'react';
import { Scrollbars } from '../../components';
import { TabContentWrap } from './style';
import QuickAnswer from './QuickAnswer';

const TabQuickAnswer = () => {
  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      <Scrollbars style={{ flex: 1 }}>
        <TabContentWrap>
          <QuickAnswer />
        </TabContentWrap>
      </Scrollbars>
    </div>
  );
};

export default TabQuickAnswer;
