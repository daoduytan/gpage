import React from 'react';
import { Row, Col } from 'antd';
import { Element } from 'react-scroll';
import { Container } from '../../components';
import { DetailFunctionSection } from './style';
import content from './content';

const DetailFunction = () => {
  return (
    <DetailFunctionSection>
      <Container>
        {content.detail_function.contents.map((item, index) => {
          const style =
            index % 2 !== 0 ? { flexDirection: 'row-reverse' } : null;

          return (
            <div className="item_detail" key={item.icon}>
              <Element name={item.id}>
                <Row type="flex" gutter={60} align="middle" style={style}>
                  <Col md={11}>
                    <div className="icon">
                      <img src={item.icon} alt="icon" />
                    </div>
                    <h3>{item.title}</h3>
                    <ul>
                      {item.list.map(l => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={13}>
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ display: 'inline-block', maxWidth: '100%' }}
                    />
                  </Col>
                </Row>
              </Element>
            </div>
          );
        })}
      </Container>
    </DetailFunctionSection>
  );
};

export default DetailFunction;
