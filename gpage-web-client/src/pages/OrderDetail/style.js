import styled from 'styled-components';
import theme from '../../theme';

const Title = styled.div`
  font-weight: 600;
  color: ${theme.color.primary};
  margin-bottom: ${theme.size.space}px;
`;

const Th = styled.span`
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
`;

export { Title, Th };
