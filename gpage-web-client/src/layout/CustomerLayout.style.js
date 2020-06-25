import styled from 'styled-components';
import theme from '../theme';

const LayoutWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const HeaderStyle = styled.div``;

const ContentStyle = styled.div`
  height: calc(100vh - ${theme.size.header}px);
`;

export { LayoutWrap, HeaderStyle, ContentStyle };
