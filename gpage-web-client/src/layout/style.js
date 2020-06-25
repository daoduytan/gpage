import styled from 'styled-components';
import theme from '../theme';

const TitlePage = styled.div`
  padding: ${theme.size.space}px ${theme.size.space + 5}px;
  border-bottom: 1px solid ${theme.color.border};

  .title {
    font-size: 18px;
    font-weight: 600;
  }
`;

const ContentPage = styled.div`
  padding: ${theme.size.space + 5}px;
`;

export { TitlePage, ContentPage };
