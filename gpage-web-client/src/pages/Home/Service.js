import React from 'react';

import { CardService } from './style';
import { formatMoney } from '../../ultils';

type ServiceProps = {
  service: {
    name: string,
    price: number,
    time: number,
    id: string,
    number_page: number,
    number_users: number,
    note: string
  },
  active: boolean,
  selectService: (id: string) => void
};

const Service = ({ service, selectService, active }: ServiceProps) => {
  const onClick = () => selectService(service.id);
  return (
    <CardService onClick={onClick} className={active ? 'active' : null}>
      <div className="service_title">{service.name}</div>
      <p className="service_note">{service.note}</p>
      <div className="service_price">
        <span className="sub_title">Giá</span>

        <div style={{ marginTop: 10, fontSize: 25 }}>
          <span style={{ fontWeight: 600, color: '#3ECC75' }}>
            {formatMoney(service.price)}
          </span>
          <sup>đ</sup>
          <span style={{ fontSize: 16 }}> page /tháng</span>
        </div>
      </div>
      <div
        style={{
          margin: '30px 0 20px'
        }}
      >
        <span className="sub_title"> Gói dịch vụ bao gồm:</span>
      </div>

      <div className="service_list">
        <span>{service.number_users}</span> thành viên
      </div>
      <div className="service_list">
        <span>{service.number_page}</span> pages
      </div>
    </CardService>
  );
};

export default React.memo(Service);
