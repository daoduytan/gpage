import styled from 'styled-components';
import theme from '../../../theme';

const TabPagesStyle = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  border: 1px solid ${theme.color.border};
  height: 60px;
`;

const ButtonTagPage = styled.div`
  display: flex;
  height: 36px;
  align-items: center;
  border-radius: ${theme.size.borderRadius}px;
  padding: 0 ${theme.size.space - 5}px;
  cursor: pointer;
  border: 1px solid;
  background: ${({ active }) => (active ? theme.color.primary : '#fff')};
  border-color: ${({ active }) => (active ? theme.color.primary : '#eee')};
  margin-right: ${theme.size.space}px;
  color: ${({ active }) => (active ? '#fff' : '#333')};
  font-weight: 600;

  .text {
    display: inline-block;
    max-width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &:hover {
    border-color: ${({ active }) => (active ? theme.color.primary : '#ddd')};
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  }
`;

export { TabPagesStyle, ButtonTagPage };
