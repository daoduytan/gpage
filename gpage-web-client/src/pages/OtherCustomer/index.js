import React from 'react';
import { BaseLayout } from '../../layout';
import { Scrollbars } from '../../components';
import { TitlePage, ContentPage } from '../../layout/style';
import constants from '../../constants';
import { useNotification } from '../Customer/context';
import TableCustomer from './TableCustomer';

const title_page = 'Khách hàng';

const OtherCustomer = () => {
  const { notifications } = useNotification();
  const text = `${constants.title} - ${title_page}`;
  const number = notifications.length;
  const title = `${number === 0 ? '' : `(${number})`}${text}`;

  return (
    <BaseLayout title={title}>
      <Scrollbars style={{ height: '100vh' }}>
        <TitlePage>
          <span className="title">{title_page}</span>
        </TitlePage>

        <ContentPage>
          <TableCustomer />
        </ContentPage>
      </Scrollbars>
    </BaseLayout>
  );
};

export default OtherCustomer;
