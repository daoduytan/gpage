import React from 'react';
import { debounce } from 'lodash';
import { Button } from 'antd';

import { getAdressShip, quan_huyen, tinh_thanhpho } from '../../dumpdata';
import { shipApi } from '../../api';
import { Loading } from '../../components';
import { ShiperTable } from '../Conversation/CardDetailCustomer/Shipping';
import { Title } from './style';

type ShippingProps = { order: any, updateShip: void };

const Shipping = ({ order, updateShip }: ShippingProps) => {
  const [loading, setLoading] = React.useState(true);
  const [services, setServices] = React.useState([]);

  const handleUpdateShip = debounce(shiper => {
    updateShip(shiper);
  }, 300);

  const setUpdateShip = () => {
    const existShip = services.find(
      s => s.ServiceID === order.shiper.ServiceID
    );

    updateShip(existShip);
  };

  React.useEffect(() => {
    const districtTo = order.addressInfo.district
      ? quan_huyen[order.addressInfo.district]
      : null;

    const districtFrom =
      order.store && order.store.district
        ? quan_huyen[order.store.district]
        : null;

    const toDistrict = districtTo
      ? getAdressShip(districtTo.name_with_type)
      : null;
    const fromDistrict = districtFrom
      ? getAdressShip(districtFrom.name_with_type)
      : null;
    // console.log(order);

    const Weight = order.list_order.reduce(
      (value, o) => o.so_luong * o.khoi_luong + value,
      0
    );

    // const data = {
    //   Weight,
    //   ToDistrictID: toDistrict && toDistrict.DistrictID,
    //   FromDistrictID: fromDistrict && fromDistrict.DistrictID
    // };

    const giaohangnhanh = {
      Weight,
      ToDistrictID: toDistrict && toDistrict.DistrictID,
      FromDistrictID: fromDistrict && fromDistrict.DistrictID
    };

    console.log('dasdad', order.addressInfo);

    const giaohangtietkiem = {
      pick_province: order.addressInfo.city
        ? tinh_thanhpho[order.addressInfo.city].name
        : null,
      pick_district: order.addressInfo.district
        ? quan_huyen[order.addressInfo.district].name_with_type
        : null,
      province:
        order.store && order.store.city && tinh_thanhpho[order.store.city].name,
      district:
        order.store &&
        order.store.district &&
        quan_huyen[order.store.district].name_with_type,
      weight: Weight
    };

    const data = {
      giaohangnhanh,
      giaohangtietkiem
    };

    // const valid = data.ToDistrictID && data.FromDistrictID && data.Weight >= 0;

    const valid =
      order.addressInfo.city &&
      order.addressInfo.district &&
      order.store &&
      order.store.city &&
      order.store.district;

    if (valid) {
      setLoading(true);

      shipApi
        .findAvailableServices(data)
        .then(res => {
          console.log('res', res);
          setLoading(false);
          setServices(res.data.data);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [order.addressInfo.district, order.list_order, order.store]);

  return (
    <React.Suspense fallback={<Loading />}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          marginTop: 20
        }}
      >
        <Title style={{ margin: 0 }}>Chọn dịch vụ giao hàng</Title>

        <Button type="primary" onClick={setUpdateShip}>
          Cập nhật giá ship
        </Button>
      </div>

      <ShiperTable
        loading={loading}
        shiper={order.shiper}
        services={services}
        updateShip={handleUpdateShip}
      />
    </React.Suspense>
  );
};

export default Shipping;
