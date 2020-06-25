import styled from 'styled-components';
import theme from '../../theme';

const FooterWrap = styled.div`
  padding: ${theme.size.space * 2}px 0;
  background: #0a53b2;
  color: #fff;

  h3 {
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    margin: 20px 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin-bottom: 10px;

      a {
        color: #fff;
      }

      i {
        display: inline-block;
        margin-right: 10px;
      }
    }
  }

  .link-list {
    li {
      i {
        margin-right: 5px;
      }
    }
  }

  .bottom_footer {
    text-align: center;
    margin-top: 40px;
    padding: 40px 0 20px;
    border-top: 1px solid #1e75e4;
  }
`;
export { FooterWrap };
