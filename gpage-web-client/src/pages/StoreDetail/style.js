import styled from 'styled-components';

const size = 50;
const ImageStyle = styled.div`
  height: ${size}px;
  width: ${size}px;
  border-radius: 2px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ image }) =>
    image ? `url(${image}) no-repeat center` : null};
  background-size: cover;
  background-color: #fff;
`;

// eslint-disable-next-line import/prefer-default-export
export { ImageStyle };
