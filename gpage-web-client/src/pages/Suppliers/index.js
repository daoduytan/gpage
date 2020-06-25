import React from 'react';
import { BaseLayout } from '../../layout';
import { TitlePage, ContentPage } from '../../layout/style';

import constants from '../../constants';
import { Scrollbars } from '../../components';
import { useNotification } from '../Customer/context';
import TableSuppliers from './TableSuppliers';

const title_page = 'Nhà cung cấp';

const Suppliers = () => {
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
          <TableSuppliers />
        </Scrollbars>
      </ContentPage>
    </BaseLayout>
  );
};

export default Suppliers;
