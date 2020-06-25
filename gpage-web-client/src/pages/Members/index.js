// @flow
import React from 'react';

import { BaseLayout } from '../../layout';
import { Scrollbars } from '../../components';
import constants from '../../constants';
import { TitlePage, ContentPage } from '../../layout/style';
import { useNotification } from '../Customer/context';
import MembersTable from './MembersTable';

const title_page = 'Nhân viên';

const Members = () => {
  const { notifications } = useNotification();
  const text = `${constants.title} - ${title_page}`;
  const number = notifications.length;
  const title = `${number === 0 ? '' : `(${number})`}${text}`;

  return (
    <BaseLayout title={title}>
      <Scrollbars style={{ height: 'calc(100vh - 50px' }}>
        <TitlePage>
          <span className="title">{title_page}</span>
        </TitlePage>

        <ContentPage>
          <MembersTable />
        </ContentPage>
      </Scrollbars>
    </BaseLayout>
  );
};

export default Members;
