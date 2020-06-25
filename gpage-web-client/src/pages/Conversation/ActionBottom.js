import React from 'react';

import { ActionBottomWrap } from './style';
import ModalImage from './ModalImage';
import ModalQuestion from './ModalQuestion';
import ModalHelps from './ModalHelps';

const ActionBottom = () => {
  return (
    <ActionBottomWrap>
      <ModalImage />
      <ModalQuestion />
      <ModalHelps title="Trợ giúp" />
    </ActionBottomWrap>
  );
};

export default ActionBottom;
