import React, { memo } from 'react';
import moment from 'moment';

import { BottomTextStyle } from './style';

const BottomText = () => {
  const year = moment(Date.now()).format('YYYY');

  return (
    <BottomTextStyle>
      {`Copyright © ${year}. All rights reserved`}
    </BottomTextStyle>
  );
};

export default memo(BottomText);
