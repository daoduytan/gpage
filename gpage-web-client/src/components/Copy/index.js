// @flow
import React, { type Node } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

type CopyProps = {
  children: Node,
  text: String,
  onCopy: Function
};

const Copy = ({ children, text, onCopy }: CopyProps) => {
  return (
    <CopyToClipboard text={text} onCopy={onCopy}>
      {children}
    </CopyToClipboard>
  );
};

export default React.memo(Copy);
