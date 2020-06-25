import styled from 'styled-components';
import { Button } from 'antd';
import theme from '../../theme';
import note from '../../assets/note.png';

const Section = styled.div`
  padding: ${theme.size.space * 2 + 10}px 0;
  overflow: hidden;

  .title {
    display: block;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50px;
    text-align: center;
    font-size: 40px;
    font-weight: 600;

    @media (max-width: 767px) {
      font-size: 30px;
    }
  }
`;

const BannerSection = styled(Section)`
  background: #4267b2;

  h1 {
    font-size: 46px;
    color: #fff;
    font-weight: 700;
  }

  p {
    font-size: 18px;
    color: #fff;
    margin-bottom: 30px;
  }

  img {
    display: inline-block;
    width: 95%;
    max-width: 500px;
  }

  @media (max-width: 767px) {
    text-align: center;

    h1 {
      font-size: 40px;
    }

    img {
      margin-top: 30px;
    }
  }
`;

const ButtonTrialStyle = styled(Button)`
  text-transform: uppercase;
  height: 50px !important;
  font-weight: 600 !important;
  font-size: 15px;
  color: #1f5396 !important;
  border: none !important;

  &:hover {
    background: #0953b2 !important;
    color: #fff !important;
  }
`;

const FunctionSection = styled(Section)`
  .contentBox {
    display: grid;
    grid-gap: 30px;
    grid-template-columns: repeat(3, 1fr);

    @media (max-width: 767px) {
      grid-gap: 10px;
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 767px) {
    .item_detail {
      border-bottom: 1px dashed #ddd;

      &:last-child {
        border: none;
      }
    }
  }

  .box {
    text-align: center;
    box-shadow: 0px 0px 9px 4px #f1e9e9;
    border-radius: 10px;
    padding: 40px 20px;
    overflow: hidden;
    position: relative;
    margin-bottom: 20px;

    @media (max-width: 767px) {
      margin-bottom: 10px;
      padding: 30px 10px;
    }

    &:after {
      content: '';
      width: 0;
      height: 7px;
      background: #095aba;
      position: absolute;
      left: 0;
      bottom: 0;
      transition: 0.5s all;
    }

    &:hover {
      &:after {
        width: 100%;
        transition: 0.5s all;
      }
    }

    img {
      display: inline-block;
      margin-bottom: 30px;
    }

    h3 {
      font-size: 20px;
      margin-bottom: 15px;
      font-weight: 600;
      @media (max-width: 767px) {
        font-size: 16px;
      }
    }

    p {
      color: #666666;
      font-size: 15px;
      margin-bottom: 15px;
      @media (max-width: 767px) {
        display: none;
      }
    }

    .read_more {
      color: #08bafb;
      font-size: 15px;
    }
  }
`;

const DetailFunctionSection = styled(Section)`
  background: #f7fafc;

  .item_detail {
    padding: 30px 0;
  }

  h3 {
    font-size: 25px;
    font-weight: 600;
    color: #092a44;
    padding: 20px 0 25px 0;

    @media (max-width: 767px) {
      font-size: 18px;
    }
  }

  ul {
    padding: 0;
    margin: 0;
    list-style-image: url(${note});

    list-style-position: inside;
    li {
      margin-bottom: 10px;
    }
  }

  @media (max-width: 767px) {
    .item_detail {
      border-bottom: 1px dashed #ddd;

      &:last-child {
        border: none;
      }
    }
  }
`;

const PriceSection = styled(Section)`
  .table-price {
    margin-bottom: 60px;
    padding: 0 30px;
    // overflow: auto;
    // border: 1px solid #ddd;

    @media (max-width: 767px) {
      overflow: auto;
    }

    table {
      font-size: 15px;
      font-weight: 300;

      strong {
        font-weight: 600;
        color: $blue;
      }
      tr {
        td {
          padding: 15px;
          border-right: 1px solid #ddd;
        }
        &:nth-child(2n + 1) {
          background: #f7fafc;
        }
      }
      @media (max-width: 767px) {
        width: 1000px;
      }
    }
    .total-price {
      padding: 10px 0 30px 0;
      ul {
        display: inline-flex;
        width: 100%;
        justify-content: space-around;

        li {
          flex: 1;
          margin: 0 15px;
        }
      }

      .total {
        color: #095aba;
        font-size: 25px;
        font-weight: 600;
      }
    }

    ul {
      list-style: none;
      padding: 0;
    }
  }
  h3 {
    font-size: 30px;
    margin-bottom: 15px;
    color: #092a44;
  }
`;

const CardService = styled.div`
  cursor: pointer;
  text-align: center;
  border: 1px solid ${theme.color.border};
  border-radius: 7px;
  box-shadow: 0 20px 43px 0 rgba(20, 42, 87, 0.06);
  margin: 0 0 44px;
  background-color: #fff;
  padding: 39px 30px;
  position: relative;

  .service_title {
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .service_price {
    font-size: 16px;
    padding: 15px 0;
    border-bottom: 1px solid ${theme.color.border};
  }

  .service_note {
    font-size: 16px;
    line-height: 22px;
    font-weight: 400;
    position: relative;
    padding: 0 0 27px;
    margin: 10px 0 22px;

    &:after {
      content: '';
      position: absolute;
      width: 83px;
      height: 2px;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background: #08c7fb;
    }
  }

  .sub_title {
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    color: #9c9c9c;
  }

  .service_list {
    font-size: 18px;
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid ${theme.color.border};

    &:last-child {
      border: none;
    }

    span {
      color: #3ecc75;
    }
  }

  &.active {
    border-color: #095aba;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
  }

  &:hover {
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

export {
  BannerSection,
  ButtonTrialStyle,
  FunctionSection,
  DetailFunctionSection,
  PriceSection,
  CardService
};
