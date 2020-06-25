import React, { type Node } from 'react';
import { Helmet } from 'react-helmet';

import { HeaderCustomer } from '../components';
import constants from '../constants';
import { LayoutWrap, ContentStyle } from './CustomerLayout.style';

type CustomerLayoutProps = {
  title?: String,
  children: Node
};
const CutomerLayout = ({ title, children }: CustomerLayoutProps) => {
  return (
    <LayoutWrap>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <HeaderCustomer />
      <ContentStyle>{children}</ContentStyle>
    </LayoutWrap>
  );
};

CutomerLayout.defaultProps = {
  title: constants.title
};

export default CutomerLayout;
