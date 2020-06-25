import React, { useState } from 'react';

import { LabelModelStyle } from './style';

const hocModal = (BaseComponent, LabelModal) => {
  return () => {
    const [visible, setVisible] = useState(false);

    const handleOpen = () => setVisible(true);
    const onCancel = () => setVisible(false);

    return (
      <>
        <LabelModelStyle onClick={handleOpen} role="presentation">
          <LabelModal />
        </LabelModelStyle>
        <BaseComponent
          visible={visible}
          onCancel={onCancel}
          closable={false}
          width={720}
          centered
        />
      </>
    );
  };
};

export const hocModalBad = (BaseComponent, LabelModal) => {
  return () => {
    const [visible, setVisible] = useState(false);

    const handleOpen = () => setVisible(true);
    const onCancel = () => setVisible(false);

    return (
      <>
        <div onClick={handleOpen} role="presentation">
          <LabelModal />
        </div>

        <BaseComponent
          visible={visible}
          onCancel={onCancel}
          closable
          centered
        />
      </>
    );
  };
};

export default hocModal;
