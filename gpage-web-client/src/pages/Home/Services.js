import React from 'react';
import { Row, Col } from 'antd';

import Service from './Service';

type ServicesProps = {
  services: [
    {
      name: string
    }
  ],
  selectService: () => void
};

const Services = ({ services, selectService }: ServicesProps) => {
  const [active_id, setActiveId] = React.useState(null);

  const selectServiceID = id => {
    const service = services.find(s => s.id === id);
    setActiveId(id);
    selectService(service);
  };

  return (
    <Row type="flex" align="middle" justify="center">
      <Col md={22}>
        <Row gutter={30}>
          {services.map(service => (
            <Col md={8} key={service.id}>
              <Service
                service={service}
                active={active_id === service.id}
                selectService={selectServiceID}
              />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default Services;
