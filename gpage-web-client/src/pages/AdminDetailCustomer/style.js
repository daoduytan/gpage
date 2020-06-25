import styled from 'styled-components';

const CustomerInfoStyle = styled.div`
  > div {
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CustomerInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  > span:nth-child(2) {
    font-weight: 600;
  }
`;

export { CustomerInfoStyle, CustomerInfoRow };
