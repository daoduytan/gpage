import styled from 'styled-components';
import theme from '../../theme';

const HeaderWrap = styled.div`
  background: #fff;
  position: fixed;
  z-index: 1000;
  top: 0; 
  left: 0; 
  right: 0;
  min-height: ${theme.size.header}px
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.size.space - 2}px ${theme.size.space * 2}px;
  border-bottom: 1px solid ${theme.color.border};
`;

const MenuLeftStyle = styled.ul`
  padding: 0;
  margin: 0 0 0 50px;
  list-style: none;
  display: flex;

  li {
    margin-right: ${theme.size.space * 2}px;

    a {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      &:hover {
        color: ${theme.color.primary};
      }
    }
  }
`;

export { HeaderWrap, MenuLeftStyle };
