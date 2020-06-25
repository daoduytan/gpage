import React from 'react';

import constants from '../../constants';
import { BaseLayout } from '../../layout';
import { TitlePage, ContentPage } from '../../layout/style';
import { Scrollbars } from '../../components';
import { useNotification } from '../Customer/context';
import TableProducts from './TableProducts';

const title_page = 'Quản lý sản phẩm';

const ProductManager = () => {
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
          <TableProducts />
        </Scrollbars>
      </ContentPage>
    </BaseLayout>
  );
};

export default ProductManager;
