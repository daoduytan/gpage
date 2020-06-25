import styled from 'styled-components';
import { Link } from '@reach/router';
import theme from '../../theme';

const SidebarStyle = styled.div`
  a {
    display: block;
    min-height: 40px;
    text-decoration: none;
    color: #fff;
    padding: ${theme.size.space}px ${theme.size.space - 5}px;
    transition: all 0.2s ease-in-out;
    text-align: ${({ collapsed }) => (collapsed ? 'center' : 'left')};
    border-bottom: 1px solid #02264a;

    &:hover {
      background: #02264a;
    }
    span {
      display: ${({ collapsed }) => (collapsed ? 'block' : 'inline-block')};
      font-weight: 500;
      font-size: ${({ collapsed }) => (collapsed ? 12 : 14)}px;
    }

    i {
      margin-right: ${({ collapsed }) => (collapsed ? 0 : theme.size.space)}px;
      font-size: ${({ collapsed }) => (collapsed ? 20 : 16)}px;
    }
  }
`;

const SidebarLinkStyle = styled(Link)`
  text-align: ${props => (props.collapsed ? 'center' : 'left')};
  display: block;

  span {
    margin-top: 5px;
    display: ${props => (props.collapsed ? 'block' : 'inline-block')};
  }

  i {
    margin-right: ${props => (props.collapsed ? 0 : theme.size.space - 5)}px;
  }
`;

export { SidebarStyle, SidebarLinkStyle };
