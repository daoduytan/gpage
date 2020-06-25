import React, { type Node } from 'react';

import { BaseLayout } from '../../layout';
import Sidebar from './Sidebar';

type ReportProp = {
  children: Node
};

const Report = ({ children }: ReportProp) => {
  return (
    <BaseLayout title="Báo cáo">
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, position: 'relative' }}>{children}</div>
      </div>
    </BaseLayout>
  );
};

export default Report;
