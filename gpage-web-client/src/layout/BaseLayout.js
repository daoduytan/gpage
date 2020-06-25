// @flow
import React, { type Node } from 'react';
import { Helmet } from 'react-helmet';

import constants from '../constants';

type BasetLayoutProps = {
  title?: string,
  children: Node
};

const BasetLayout = ({ title, children }: BasetLayoutProps) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </>
  );
};

BasetLayout.defaultProps = {
  title: constants.title
};

export default BasetLayout;
