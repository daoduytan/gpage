import React from 'react';

import { BaseLayout } from '../../layout';
import constants from '../../constants';
import { TitlePage, ContentPage } from '../../layout/style';
import { Scrollbars } from '../../components';
import { useNotification } from '../Customer/context';
import HistoryTable from './HistoryTable';

const title_page = 'Lịch sử nhập hàng';

const HistoryImport = () => {
  const { notifications } = useNotification();
  const text = `${constants.title} - ${title_page}`;
  const number = notifications.length;
  const title = `${number === 0 ? '' : `(${number})`}${text}`;

  return (
    <BaseLayout title={title}>
      <TitlePage>
        <span className="title">{title_page}</span>
      </TitlePage>
      <Scrollbars style={{ height: 'calc(100vh - 100px)' }}>
        <ContentPage>
          <HistoryTable />
        </ContentPage>
      </Scrollbars>
    </BaseLayout>
  );
};

export default HistoryImport;
