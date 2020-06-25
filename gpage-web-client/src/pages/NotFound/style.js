import styled from 'styled-components';

const Wrap = styled.div`
  min-height: ${({ hasHeader }) => (hasHeader ? 'calc(100vh-50px' : '100vh')};
  background: #f5f6f7;
  text-align: center;
  padding: 30px;
`;

const Content = styled.div`
  h2 {
    font-size: 50px;
    color: red;
    font-weight: 700;
  }
  p {
    font-size: 18px;
  }
`;

export { Wrap, Content };
