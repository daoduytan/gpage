import React from 'react';
import { Icon, Checkbox, Table } from 'antd';

import {
  quan_huyen,
  getAdressShip,
  shipers,
  tinh_thanhpho
} from '../../../dumpdata';
import { shipApi } from '../../../api';

// Loading

const Loading = () => {
  return (
    <div style={{ textAlign: 'center', padding: 15 }}>
      <Icon type="loading" />
    </div>
  );
};

type ShiperTableProps = {
  services: any,
  updateShip: void,
  shiper: any
};

const ShiperTable = ({
  order,
  shiper,
  services,
  updateShip,
  loading
}: ShiperTableProps) => {
  // const user = useSelector(({ authReducer }) => authReducer.user);

  const dataSource = services.map(s => {
    return { ...s, key: s.ServiceID };
    // return null;
  });

  // const checkNoShip = () => {
  //   if (!user.ship) return true;

  //   if (user.ship && user.ship > 0) {
  //     const arrExist = user.ship.map(s => s.token);
  //     if (arrExist.length > 0) return false;
  //     return true;
  //   }

  //   return false;
  // };

  const columns = [
    {
      title: '',
      dataIndex: '',
      key: 'x',
      render: service => {
        // const disabled =
        //   checkNoShip() || (order && order.type_order !== 'use_carrier');
        return (
          <Checkbox
            checked={shiper && shiper.ServiceID === service.ServiceID}
            // disabled={disabled}
          />
        );
      }
    },
    {
      title: 'Hãng',
      dataIndex: '',
      key: 'shiper',
      render: service => (
        <img
          style={{ height: 40 }}
          src={shipers[service.id].logo}
          alt={shipers[service.id].name}
        />
      )
    },
    {
      title: 'Gói',
      dataIndex: 'Name',
      key: 'name'
    },
    {
      title: 'Giá',
      dataIndex: 'ServiceFee',
      key: 'price'
    }
  ];

  return (
    <Table
      onRow={service => {
        return {
          onClick: () => {
            if (
              // checkNoShip() ||
              order &&
              order.type_order !== 'use_carrier'
            ) {
              return updateShip(null);
            }

            if (!shiper || shiper.ServiceID !== service.ServiceID) {
              return updateShip(service);
            }

            return updateShip(null);
          }
        };
      }}
      loading={loading}
      bordered
      pagination={false}
      dataSource={dataSource}
      columns={columns}
    />
  );
};

// Shipping

type ShippingProps = { order: any, setOrder: () => void };

const Shipping = ({ order, setOrder }: ShippingProps) => {
  console.log('dadasorder', order);

  const [loading, setLoading] = React.useState(false);

  // const [data, setData] = React.useState({
  //   Weight: 0,
  //   FromDistrictID: null,
  //   ToDistrictID: null
  // });

  const [data, setData] = React.useState({
    giaohangnhanh: {
      Weight: 0,
      FromDistrictID: null,
      ToDistrictID: null
    },
    giaohangtietkiem: {
      pick_province: null,
      pick_district: null,
      province: null,
      district: null,
      weight: 0
    }
  });

  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    if (order.addressInfo.district) {
      // get data giao hang nhanh
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

      // setData({
      //   ...data,
      //   Weight,
      //   ToDistrictID: toDistrict && toDistrict.DistrictID,
      //   FromDistrictID: fromDistrict && fromDistrict.DistrictID
      // });

      const giaohangnhanh = {
        Weight,
        ToDistrictID: toDistrict && toDistrict.DistrictID,
        FromDistrictID: fromDistrict && fromDistrict.DistrictID
      };

      // get data giao hang tiet kiem
      const giaohangtietkiem = {
        pick_province: tinh_thanhpho[order.addressInfo.city].name,
        pick_district: quan_huyen[order.addressInfo.district].name_with_type,
        province:
          order.store &&
          order.store.city &&
          tinh_thanhpho[order.store.city].name,
        district:
          order.store &&
          order.store.district &&
          quan_huyen[order.store.district].name_with_type,
        weight: Weight
      };

      // giaohangtietkiem

      setData({ ...data, giaohangnhanh, giaohangtietkiem });
    }
  }, [order.store, order.list_order, order.addressInfo.district]);

  React.useEffect(() => {
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
          console.log('res ship', res);

          setLoading(false);
          setServices(res.data.data);
        })
        .catch(() => setLoading(false));
    }
  }, [data]);

  function handleUpdateShip(service) {
    setOrder({
      ...order,
      shiper: service,
      phi_van_chuyen: service ? service.ServiceFee : 0,
      order_type: 'use_carrier'
    });
  }

  if (loading) return <Loading />;

  if (services.length === 0) return null;

  return (
    <React.Suspense fallback={<Loading />}>
      <ShiperTable
        shiper={order.shiper}
        services={services}
        order={order}
        updateShip={handleUpdateShip}
      />
    </React.Suspense>
  );
};

export { Shipping as default, ShiperTable };
