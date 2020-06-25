import React from 'react';
import { Row, Col, Icon } from 'antd';
import { Link } from '@reach/router';
import moment from 'moment';

import Logo from '../Logo';
import Container from '../Container';
import { FooterWrap } from './style';
import content from './content';

const Footer = () => {
  return (
    <FooterWrap>
      <Container>
        <Logo light />
        <Row gutter={30}>
          <Col md={12}>
            <h3>CÔNG TY TNHH CÔNG NGHỆ PHẦN MỀM GCO</h3>
            <ul className="contact-list">
              <li>
                <Icon type="environment" />
                Tầng 8, Tòa nhà TOYOTA Thanh Xuân, 315 Trường Chinh, Thanh Xuân,
                Hà Nội
              </li>

              <li>
                <Icon type="phone" />
                0123.456.789
              </li>
              <li>
                <Icon type="mail" /> gsoftware@gmail.com
              </li>
            </ul>
          </Col>
          <Col md={6}>
            <h3>CHĂM SÓC KHÁCH HÀNG</h3>
            <ul className="link-list">
              {content.links.map(link => (
                <li key={link.path}>
                  <Link to={link.path}>
                    <Icon type="caret-right" /> {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={6}>
            <h3>MẠNG XÃ HỘI</h3>
            <ul className="social-list">
              {content.socials.map(social => (
                <li key={social.title}>
                  <a href={social.path}>
                    <i>
                      <img src={social.logo} alt={social.title} />
                    </i>{' '}
                    {social.title}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        <div className="bottom_footer">
          © GCO GROUP {moment().format('YYYY')}. All rights reserved
        </div>
      </Container>
    </FooterWrap>
  );
};

export default Footer;
