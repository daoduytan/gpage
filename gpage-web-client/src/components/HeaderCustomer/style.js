import styled from 'styled-components';

import theme from '../../theme';

const HeaderCustomerWrap = styled.div`
  height: ${theme.size.header}px;
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: space-between;
  background: ${theme.color.secondary};
  padding: 0 ${theme.size.space}px;
`;

const MenuItemStyle = styled.div`
  height: ${theme.size.header}px;
  padding: 0 ${theme.size.space}px;
  cursor: pointer;
  color: #fff;
  line-height: ${theme.size.header}px;

  &:hover {
    background: #41558b;
  }
`;

export { HeaderCustomerWrap, MenuItemStyle };
