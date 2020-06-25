import React from 'react';
import { Card, Empty, Row, Col, Avatar, Divider } from 'antd';
import moment from 'moment';

import { useCustomer, useServices } from './hooks';
import { Loading } from '../../components';
import ProgressDate from '../AdminCustomer/ProgressDate';
import { CustomerInfoRow, CustomerInfoStyle } from './style';
import TableFaceboolPages from './TableFaceboolPages';
import ChangeTyleCustomer from './ChangeTyleCustomer';
import ModalRenewal from './ModalRenewal';

type AdminDetailCustomerProps = {
  id: string
};

const Context = React.createContext();

const AdminDetailCustomer = ({ id }: AdminDetailCustomerProps) => {
  const { loading, customer } = useCustomer(id);
  const { services } = useServices();

  if (loading) return <Loading />;

  if (!customer)
    return (
      <Card>
        <Empty />
      </Card>
    );

  const { licence } = customer;
  const { date_active } = licence;

  const service = services.find(s => s.key === customer.licence.service_id);

  const renderService = () => {
    if (!service) return <span>Chưa chọn dịch vụ</span>;

    return (
      <>
        <ProgressDate customer={customer} />

        <div style={{ marginTop: 30 }}>
          <CustomerInfoRow>
            <span>Gói dịch vụ:</span>
            <span>
              {customer.licence.type === 'trial' && 'Dùng thử'}
              {service && service.name && service.name}
            </span>
          </CustomerInfoRow>
          <CustomerInfoRow>
            <span>Ngày đăng ký:</span>

            <span>
              {customer.licence.type === 'trial' &&
                moment(date_active).format('DD/MM/YYYY')}
              {service &&
                moment(customer && customer.licence.date_active).format(
                  'DD/MM/YYYY'
                )}
            </span>
          </CustomerInfoRow>
          <CustomerInfoRow>
            <span>Ngày kích hoạt:</span>
            <span>
              {customer.licence.start_date &&
                moment(customer.licence.start_date).format('DD/MM/YYYY')}
            </span>
          </CustomerInfoRow>
          <CustomerInfoRow>
            <span>Thời gian:</span>
            <span>
              {customer.licence.type === 'trial' && 15}
              {service && customer && customer.licence.time} ngày
            </span>
          </CustomerInfoRow>
          <CustomerInfoRow>
            <span>Page quản lý:</span>
            <span>
              {customer.licence.type === 'trial' && 1}
              {service && service.number_page}
            </span>
          </CustomerInfoRow>
        </div>
      </>
    );
  };

  return (
    <Context.Provider value={{ customer }}>
      <Row gutter={30} justify="center" type="flex">
        <Col md={12}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <Avatar src={customer.photoURL} />
                <span style={{ marginLeft: 10, fontWeight: 600 }}>
                  {customer.displayName}
                </span>
              </div>
              <ChangeTyleCustomer customer={customer} />
            </div>

            <Divider />

            <CustomerInfoStyle>
              <CustomerInfoRow>
                <span>Tên cửa hàng:</span>
                <span>{customer.shop && customer.shop.name}</span>
              </CustomerInfoRow>

              <CustomerInfoRow>
                <span>Email:</span>
                <span>{customer.email}</span>
              </CustomerInfoRow>

              <CustomerInfoRow>
                <span>SĐT:</span>
                <span>{customer.shop.phoneNumber}</span>
              </CustomerInfoRow>
            </CustomerInfoStyle>

            <Divider />

            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 15 }}>
              Dịch vụ
            </div>

            {renderService()}

            <Divider />
            <TableFaceboolPages customer={customer} />

            {customer.licence.type === 'premium' && (
              <>
                <Divider />
                <ModalRenewal customer={customer} />
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Context.Provider>
  );
};
export { AdminDetailCustomer as default, Context };
