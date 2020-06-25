import styled from 'styled-components';
import theme from '../../theme';

const Table = styled.table`
  border: 1px solid ${theme.color.border};

  th,
  td {
    padding: 15px 5px;
    border-right: 1px solid ${theme.color.border};
    border-bottom: 1px solid ${theme.color.border};
  }

  td {
    text-align: center;
  }

  th {
    white-space: nowrap;
    background: ${theme.color.light};
    font-weight: 600;

    &:nth-child(n + 2) {
      text-align: center;
    }
  }
`;

export { Table as default };
