import {
  getAdressShip,
  getQuanHuyen,
  getXaPhuong,
  tinh_thanhpho,
  quan_huyen
} from '../../dumpdata';
import { shipApi } from '../../api';

const getFromAddress = async ({ user, order }) => {
  try {
    const { store } = order;

    // get distrist store detail
    const districtStore = getQuanHuyen(store.city).find(
      d => d.code === store.district
    );

    // get distrist id of giao hanh nhanh
    const FromDistrictID = getAdressShip(districtStore.name).DistrictID;

    // get name ward store
    const wardName = getXaPhuong(districtStore.code).find(
      w => w.code === store.ward
    );

    // get ship detail giao hanh nhanh
    // const ship = user.ship.find(s => s.name === order.shiper.id);

    // get list ward with api giaohangnhanh

    const GetWard = await shipApi.getWardsGhn({
      // token: ship.token,
      DistrictID: FromDistrictID
    });

    console.log('GetWard', GetWard);

    // get detail ward
    const { DistrictID, WardCode } = GetWard.data.data.Wards.find(
      w => w.WardName === wardName.name_with_type
    );

    return {
      DistrictID,
      WardCode
    };
  } catch (error) {
    console.log('error', error);
  }
};

const getToAdress = async ({ user, order }) => {
  const { addressInfo } = order;

  // get distrist order customer detail
  const districtOrder = getQuanHuyen(addressInfo.city).find(
    d => d.code === addressInfo.district
  );

  // get distrist id of giao hanh nhanh
  const FromDistrictID = getAdressShip(districtOrder.name).DistrictID;

  // get name ward order customer
  const wardName = getXaPhuong(districtOrder.code).find(
    w => w.code === addressInfo.ward
  );

  // get ship detail giao hanh nhanh
  // const ship = user.ship.find(s => s.name === order.shiper.id);

  // get list ward with api giaohangnhanh
  const GetWard = await shipApi.getWardsGhn({
    // token: ship.token,
    DistrictID: FromDistrictID
  });

  // get detail ward
  const { DistrictID, WardCode } = GetWard.data.data.Wards.find(
    w => w.WardName === wardName.name_with_type
  );

  return {
    DistrictID,
    WardCode
  };
};

// phi van chuyen
const order_price_vc = order => {
  if (order.shiper.id === 'giaohangtietkiem') {
    return !order.phi_bao_khach || order.phi_bao_khach === 0
      ? 0
      : order.phi_bao_khach;
  }
  return !order.phi_bao_khach || order.phi_bao_khach === 0
    ? order.phi_van_chuyen
    : order.phi_bao_khach;
};

const price_list_product = order =>
  order.list_order.reduce((number, d) => number + d.so_luong * d.gia_ban, 0);

const price_chiet_khau = order => {
  const { chiet_khau } = order;
  const price = price_list_product(order);
  if (chiet_khau.type === 'percent') {
    return (price * chiet_khau.value) / 100;
  }
  return chiet_khau.value;
};

const pick_money = order =>
  price_list_product(order) +
  order_price_vc(order) -
  price_chiet_khau(order) -
  order.tien_chuyen_khoan -
  order.tien_coc;

const formatDataOrderShipGhn = async ({ user, order }) => {
  const { Width, Height, Length } = order;

  // const ship = user.ship.find(s => s.name === order.shiper.id);

  const From = await getFromAddress({ user, order });

  const To = await getToAdress({ user, order });

  const weight_order = order.list_order.reduce(
    (value, o) => o.so_luong * o.khoi_luong + value,
    0
  );

  const Weight = weight_order === 0 ? 1 : weight_order;

  return {
    // token: ship.token,
    FromDistrictID: From.DistrictID,
    FromWardCode: From.WardCode,
    ToDistrictID: To.DistrictID,
    ToWardCode: To.WardCode,

    ClientContactName: user.shop.name,
    ClientContactPhone: user.shop.phoneNumber,
    ClientAddress: user.shop.address,
    CustomerName: order.order_name,
    CustomerPhone: order.order_phone,
    ShippingAddress: order.address,
    NoteCode: 'KHONGCHOXEMHANG', // [CHOTHUHANG, CHOXEMHANGKHONGTHU, KHONGCHOXEMHANG]
    ServiceID: order.shiper.ServiceID,
    Weight,
    Width,
    Height,
    Length,

    ReturnContactName: user.shop.name,
    ReturnContactPhone: user.shop.phoneNumber,
    ReturnAddress: user.shop.address,
    ReturnDistrictID: From.DistrictID,
    ExternalReturnCode: user.shop.name,
    CoDAmount: pick_money(order)
    // AffiliateID: parseInt(ship.AffiliateID, 10)
  };
};

const formatDataOrderShipGhtk = ({ order, user }) => {
  const products = order.list_order.map(o => {
    const name = o.ten;
    const weight = (o.khoi_luong * o.so_luong) / 1000;
    return {
      name,
      weight,
      quantity: o.so_luong
    };
  });

  // const ship = user.ship.find(s => s.name === 'giaohangtietkiem');

  return {
    // token: ship.token,
    products,
    order: {
      id: order.id,
      pick_name: order.order_name,
      pick_money: pick_money(order),
      pick_address: order.address,
      pick_province: tinh_thanhpho[order.addressInfo.city].name_with_type,
      pick_district: quan_huyen[order.addressInfo.district].name_with_type,
      pick_tel: order.order_phone,
      name: user.shop.name,
      address: user.shop.address,
      province: tinh_thanhpho[order.store.city].name_with_type,
      district: quan_huyen[order.store.district].name_with_type,
      tel: user.shop.phoneNumber,
      email: user.shop.email || '',
      return_name: user.shop.name,
      return_address: order.store.dia_chi,
      return_province: tinh_thanhpho[order.store.city].name_with_type,
      return_district: quan_huyen[order.store.district].name_with_type,
      return_tel: user.shop.phoneNumber,
      return_email: user.shop.email || ''
    }
  };
};

// eslint-disable-next-line import/prefer-default-export
export { formatDataOrderShipGhn, formatDataOrderShipGhtk };
