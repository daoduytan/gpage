// @flow
import React, { type Node } from 'react';
import Media from 'react-media';

import { Header, Footer } from '../components';
import constants from '../constants';

import BaseLayout from './BaseLayout';

type DefaultLayoutProps = {
  title?: string,
  children: Node
};

const DefaultLayout = ({ title, children }: DefaultLayoutProps) => {
  return (
    <BaseLayout title={title}>
      <Media queries={{ small: '(max-width: 767px)' }}>
        {matches => {
          const style = { paddingTop: matches.small ? 57 : 82 };
          return (
            <div style={{ ...style }}>
              <Header />
              <div>{children}</div>

              <Footer />
            </div>
          );
        }}
      </Media>
    </BaseLayout>
  );
};

DefaultLayout.defaultProps = {
  title: constants.title
};

export default DefaultLayout;
