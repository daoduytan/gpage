import styled from 'styled-components';
import theme from '../../theme';

const WrapCustomer = styled.div`
  height: calc(100vh - ${theme.size.header}px);
  overflow: hidden;
`;

// eslint-disable-next-line import/prefer-default-export
export { WrapCustomer };
