import React from 'react';
import { Row, Col } from 'antd';

import banner from '../../assets/banner.png';
import { Container } from '../../components';
import { BannerSection } from './style';
import content from './content';
import ButtonTrial from './ButtonTrial';

const Banner = () => {
  return (
    <BannerSection>
      <Container>
        <Row gutter={30}>
          <Col md={11}>
            <h1>{content.banner.h1}</h1>
            <p>{content.banner.p}</p>
            <ButtonTrial />
          </Col>
          <Col md={13}>
            <img src={banner} alt="" />
          </Col>
        </Row>
      </Container>
    </BannerSection>
  );
};

export default Banner;
