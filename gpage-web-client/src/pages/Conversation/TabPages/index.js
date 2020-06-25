import React from 'react';
import { useSelector } from 'react-redux';

import { TabPagesStyle } from './style';
import ButtonResetPage from './ButtonResetPage';
import TagPage from './TagPage';

const TabPages = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  const { facebookPages } = user;

  const renderPageTag = facebookPages.map(page => (
    <TagPage key={page.id} page={page} />
  ));

  return (
    <TabPagesStyle>
      <span style={{ marginRight: 10, fontWeight: 600 }}>Hộp thoại từ: </span>
      {facebookPages.length > 1 && <ButtonResetPage />}

      {renderPageTag}
    </TabPagesStyle>
  );
};

export default TabPages;
