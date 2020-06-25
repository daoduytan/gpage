import React from 'react';

import { PageListStyle } from './style';
import TableListPages from './TableListPages';
import { BottomText } from '../../components';

const ListPages = () => {
  return (
    <PageListStyle>
      <TableListPages />
      <BottomText />
    </PageListStyle>
  );
};

export default ListPages;
