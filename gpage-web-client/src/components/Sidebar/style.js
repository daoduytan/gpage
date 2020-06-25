import styled from 'styled-components';
import theme from '../../theme';

const SidebarWrap = styled.div`
  position: relative;
  width: 50px;
  height: calc(100vh - ${theme.size.header}px);
  background: ${theme.color.sidebar.bg};
`;

const SidebarItem = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.color.sidebar.color};
  font-size: 18px;
  cursor: ${({ loading }) => (loading ? 'no-drop' : 'pointer')};

  &.active,
  &:hover {
    background: ${theme.color.sidebar.bg_hover};
    color: ${theme.color.sidebar.color_hover};
  }
`;

export { SidebarWrap, SidebarItem };
