import styled from 'styled-components';

import theme from '../../theme';

const TabContentWrap = styled.div`
  padding: ${theme.size.space}px;
`;

const ListSetting = styled.div`
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: ${theme.size.space}px;
  }

  .item {
    margin: ${theme.size.space}px 0 ${theme.size.space * 2}px
      ${theme.size.space}px;
  }

  .row {
    display: flex;
    margin-bottom: ${theme.size.space + 5}px;

    span {
      margin-left: ${theme.size.space}px;
    }
  }
`;

const image_size = 100;

const WrapImage = styled.div`
  display: inline-block;
  position: relative;
`;

const StyleImage = styled.div`
  display: inline-block;
  width: ${image_size}px;
  height: ${image_size}px;
  margin-right: ${theme.size.space}px;
  background: ${({ src }) => `#f9f9f9 url(${src}) no-repeat center`};
  background-size: cover;
  border-style: solid;
  border-width: ${({ select }) => (select ? 2 : 1)}px;
  border-color: ${({ select }) =>
    select ? theme.color.primary : theme.color.border};
  border-radius: ${theme.size.borderRadius}px;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  .spin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  span {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 10px;
    padding: 3px 5px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export { TabContentWrap, ListSetting, WrapImage, StyleImage };
