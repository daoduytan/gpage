import React from 'react';

import { useConvs } from '../context';
import { ButtonTagPage } from './style';

const ButtonResetPage = () => {
  const { state, resetPage } = useConvs();
  const { pages } = state;
  const active = pages.length === 0;
  return (
    <ButtonTagPage onClick={resetPage} active={active}>
      Tất cả
    </ButtonTagPage>
  );
};

export default React.memo(ButtonResetPage);
