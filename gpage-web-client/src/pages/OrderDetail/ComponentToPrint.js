import React, { Component } from 'react';

import './print.css';
import { getThanhPho, getQuanHuyen, getXaPhuong } from '../../dumpdata';
import { formatMoney } from '../../ultils';
import { caculatorMoney } from '.';

type ComponentToPrintProps = {
  order: any,
  user: any
};

// eslint-disable-next-line react/prefer-stateless-function
class ComponentToPrint extends Component<ComponentToPrintProps> {
  render() {
    const { order, user } = this.props;

    console.log(order);

    const city = getThanhPho(order.addressInfo.city);
    const district = getQuanHuyen(order.addressInfo.city).find(d => {
      return d.code === order.addressInfo.district;
    });
    const ward = getXaPhuong(order.addressInfo.district).find(w => {
      return w.code === order.addressInfo.ward;
    });

    const allOrderNumber = order.list_order.reduce(
      (value, o) => o.so_luong + value,
      0
    );

    const renderListOrder = order.list_order.map(o => (
      <div key={o.id}>{`${o.ten}: ${o.so_luong}`}</div>
    ));

    if (!order) return null;

    const address = order.address || '';
    const ward_string = ward ? ward.name_with_type : '';
    const district_string = district ? district.name_with_type : '';
    const city_string = city ? city.name_with_type : '';

    const address_string = `${address} ${ward_string} - ${district_string} - ${city_string}`;

    const khoi_luong = order.list_order.reduce(
      (value, o) => value + o.khoi_luong * o.so_luong,
      0
    );

    const phi_bao_khach = order.phi_bao_khach
      ? order.phi_bao_khach
      : order.phi_van_chuyen;

    const thu_nguoi_nhan = caculatorMoney(order) + phi_bao_khach;

    return (
      <div className="print">
        <div style={{ padding: '30px 10px', fontSize: 30 }}>INSA</div>
        <div className="row">
          <div style={{ padding: 10 }}>
            <div>
              <b>Từ:</b> {user.shop && user.shop.name}
            </div>
            <div>
              <b>Địa chỉ:</b> {user.shop && user.shop.address}
            </div>
            <div>
              <b>Số điện thoại:</b> {user.shop && user.shop.phoneNumber}
            </div>
          </div>
          <div style={{ padding: 10 }}>
            <div>Đến: {`${order.order_name} ${order.order_phone}`}</div>
            <div>{address_string}</div>
          </div>
        </div>
        <div className="row">
          <div style={{ padding: 10 }} />
          <div style={{ borderLeft: '1px dashed #000', padding: 10 }}>
            <div>Hàng hóa: (Tổng SL {allOrderNumber})</div>
            <div>{renderListOrder}</div>
          </div>
        </div>
        <div className="row">
          <div style={{ padding: 10 }}>
            <div>
              Tiền thu người nhận: <br />
              <span style={{ fontSize: 30, fontWeight: 600 }}>
                {formatMoney(thu_nguoi_nhan)} VND
              </span>
            </div>
            <div>
              Chỉ dẫn giao hàng
              <ul style={{ margin: '5px 0 0' }}>
                <li>Cho xem hàng và không cho thử</li>
                <li>Chuyển hoàn sau 3 lần phát</li>
                <li>Lưu kho tối đa 5 ngày</li>
              </ul>
            </div>
          </div>
          <div style={{ padding: 10 }}>
            <div style={{ marginBottom: 5 }}>Khối lượng: {khoi_luong} gram</div>

            <div
              style={{
                textAlign: 'center',
                border: '1px solid #000',
                padding: 5,
                height: 125
              }}
            >
              <span style={{ fontSize: 20 }}> Chữ ký người nhận</span>
              <br />
              Xác nhận hàng nguyên vẹn, không bị móp/vỡ
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ComponentToPrint;
