// @flow
import React, { type Node } from 'react';

import Scrollbars from 'react-custom-scrollbars';

export default ({ children, ...rest }: { children: Node }) => {
  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      {...rest}
    >
      {children}
    </Scrollbars>
  );
};
