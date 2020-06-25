import styled from 'styled-components';
import { Select } from 'antd';

const ActionFilterStyle = styled.div`
  display: flex;
  padding: 15px 0;
  align-items: center;
`;

const FilterItem = styled.div`
  margin: 0 5px;
`;

const SelectStyle = styled(Select)`
  minwidth: 150px;
`;

export { ActionFilterStyle, FilterItem, SelectStyle };
