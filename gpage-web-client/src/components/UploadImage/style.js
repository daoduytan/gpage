import styled from 'styled-components';
import theme from '../../theme';

const UploadImageStyle = styled.div`
  border: 1px dashed ${theme.color.border};
  border-radius: 3px;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: ${theme.color.primary};
  }

  input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    rigth: 0;
    bottom: 0;
    cursor: pointer;
  }

  &:hover {
    .gray {
      background: rgba(0, 0, 0, 0.4);
      display: flex;
    }
  }
`;

const image_size = 100;

const WrapImage = styled.div`
  display: inline-block;
  position: relative;
`;

const ImageStyle = styled.div`
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

const padding = 3;

const ImageSelect = styled.div`
  position: absolute;
  top: ${padding}px;
  left: ${padding}px;
  right: ${padding}px;
  bottom: ${padding}px;
  border-radius: 3px;
  display: flex;
  background: ${({ src }) => {
    return `url(${src}) no-repeat center`;
  }};
  background-size: cover;

  .gray {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    display: none;
  }
`;

export { UploadImageStyle, WrapImage, ImageStyle, ImageSelect };
