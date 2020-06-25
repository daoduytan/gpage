import React from 'react';

import { BaseLayout } from '../../layout';
import { TitlePage, ContentPage } from '../../layout/style';
import { Scrollbars } from '../../components';
import constants from '../../constants';
import { useNotification } from '../Customer/context';
import TableStore from './TableStore';

const title_page = 'Danh sách kho';

const StoreManager = () => {
  const { notifications } = useNotification();
  const text = `${constants.title} - ${title_page}`;
  const number = notifications.length;
  const title = `${number === 0 ? '' : `(${number})`}${text}`;
  return (
    <BaseLayout title={title}>
      <TitlePage>
        <span className="title">{title_page}</span>
      </TitlePage>
      <ContentPage>
        <Scrollbars style={{ height: 'calc(100vh - 100px)' }}>
          <TableStore />
        </Scrollbars>
      </ContentPage>
    </BaseLayout>
  );
};

export default StoreManager;
