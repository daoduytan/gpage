import tinh_thanhpho from './tinh_thanhpho.json';
import quan_huyen from './quan_huyen.json';
import xa_phuong from './xa_phuong';
import ship_address from './ship_address';

import ghn from '../assets/ghn.png';
import ghtk from '../assets/ghtk.png';

const getAddress = (jsonData, idParent) => {
  if (!idParent) return [];
  const arr = Object.keys(jsonData).map(q => jsonData[q]);
  const result = arr.filter(q => q.parent_code === idParent);
  return result;
};

const getThanhPho = idCity => tinh_thanhpho[idCity];
const getQuanHuyen = idCity => getAddress(quan_huyen, idCity);
const getXaPhuong = idDistrict => getAddress(xa_phuong, idDistrict);

const getAdressShip = DistrictName => {
  // const districts = ship_address.find(
  //   address => address.ProvinceName === ProvinceName
  // );
  const district = ship_address.find(d => {
    const index = d.DistrictName.toLowerCase().indexOf(
      DistrictName.toLowerCase()
    );

    if (index >= 0) return true;

    return false;
  });

  return district;
};

const shipers = {
  giaohangnhanh: {
    no: 1,
    id: 'giaohangnhanh',
    name: 'Giao hàng nhanh',
    logo: ghn
  },
  giaohangtietkiem: {
    no: 2,
    id: 'giaohangtietkiem',
    name: 'Giao hàng tietkiem',
    logo: ghtk
  }
};

export {
  ship_address,
  tinh_thanhpho,
  quan_huyen,
  xa_phuong,
  getThanhPho,
  getQuanHuyen,
  getXaPhuong,
  getAdressShip,
  shipers
};
