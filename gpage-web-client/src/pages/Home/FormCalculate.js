import React from 'react';
import { InputNumber, Select, Row, Col } from 'antd';
import { formatMoney } from '../../ultils';

const calculate_price = ({ month, service }) => {
  const price = service.price * month;

  return price;
};

type FormCalculateProps = {
  services: [
    {
      id: string,
      price: number
    }
  ],
  service_select: any
};

const FormCalculate = ({ services, service_select }: FormCalculateProps) => {
  const [state, setState] = React.useState({
    month: 1,
    service: service_select || services[0]
  });

  console.log('111');

  const changeMonth = number => {
    setState({ ...state, month: number });
  };

  React.useEffect(() => {
    if (
      service_select &&
      state.service &&
      state.service.id !== service_select.id
    ) {
      setState({ ...state, service: service_select });
    }
  }, [service_select, state]);

  const changeService = value => {
    const service = services.find(s => s.id === value);
    setState({ ...state, service });
  };

  const price = formatMoney(calculate_price(state));

  return (
    <div className="total-price">
      <Row gutter={30}>
        <Col md={6} style={{ marginBottom: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <strong>Tùy chọn</strong>
          </div>
        </Col>
        <Col md={6} style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <strong>Thời gian(số tháng)</strong>
          </div>

          <InputNumber
            value={state.month}
            onChange={changeMonth}
            min={1}
            style={{ width: '100%' }}
            size="large"
          />
        </Col>
        <Col md={6} style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <strong>Chọn dịch vụ</strong>
          </div>
          <Select
            onChange={changeService}
            // value={state.month}
            style={{ width: '100%' }}
            block
            size="large"
            value={state.service.id}
          >
            {services.map(service => (
              <Select.Option key={service.id} value={service.id}>
                {service.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col md={6} style={{ marginBottom: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 10 }}>
              <strong className="text-center">Thành tiền</strong>
            </div>
            <div className="total">{price} đ</div>
          </div>
        </Col>
      </Row>
      {/* <ul className="list-inline">
        <li style={{ textAlign: 'center' }}>
          <strong>Tùy chọn</strong>
        </li>
        <li>
          <div style={{ marginBottom: 10 }}>
            <strong>Chọn số page</strong>
          </div>

          <InputNumber
            value={state.page}
            onChange={handleChangePage}
            min={1}
            style={{ width: '100%' }}
            size="large"
          />
        </li>
        <li>
          <div style={{ marginBottom: 10 }}>
            <strong>Chọn số page</strong>
          </div>
          <Select
            onChange={handleChangeMonth}
            // value={state.month}
            style={{ width: '100%' }}
            block
            size="large"
            value={state.service.id}
          >
            {services.map(service => (
              <Select.Option key={service.id} value={service.id}>
                {service.name}
              </Select.Option>
            ))}
          </Select>
        </li>
        <li style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 10 }}>
            <strong className="text-center">Thành tiền</strong>
          </div>
          <div className="total">{price} đ</div>
        </li>
      </ul> */}
    </div>
  );
};

export default FormCalculate;
