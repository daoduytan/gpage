import { useState } from 'react';

const useModal = () => {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible(!visible);

  return {
    visible,
    toggle
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useModal };
