import styled from 'styled-components';
import theme from '../../theme';

const HeaderStyle = styled.div`
  height: 60px;
  background: #4267b2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const PageWrap = styled.div`
  max-width: 650px;
  width: 100%;
  text-align: center;

  .title {
    font-size: 25px;
  }
`;

const PageListStyle = styled.div`
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: ${theme.size.space}px

  background:${theme.color.light};
`;

const BtnLogoutStyle = styled.div`
  color: #fff;
  background-color: #ffc107;
  border-radius: 3px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 5px;
  cursor: pointer;
`;

const TextRight = styled.div`
  text-align: right;
`;

export { HeaderStyle, PageWrap, BtnLogoutStyle, TextRight, PageListStyle };
