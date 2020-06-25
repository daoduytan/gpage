import React, { type Node } from 'react';
import styled from 'styled-components';

const ThStyle = styled.span`
  font-weight: 600;
  word-break: normal;
`;

type ThProps = { children: Node };

const Th = ({ children }: ThProps) => {
  return <ThStyle>{children}</ThStyle>;
};

export default Th;
