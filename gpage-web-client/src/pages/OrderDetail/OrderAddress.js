import React from 'react';
import { Form, Select } from 'antd';
import { tinh_thanhpho, getQuanHuyen, getXaPhuong } from '../../dumpdata';

const FormItem = Form.Item;
const style = { marginBottom: 5 };

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 }
};

type OrderAddressProps = {
  address: {
    city: string,
    district: string,
    ward: string
  },
  updateAddress: (arg: any) => void
};

const OrderAddress = ({ address, updateAddress }: OrderAddressProps) => {
  const [districts, setDistrict] = React.useState(() =>
    getQuanHuyen(address.city)
  );
  const [wards, setWards] = React.useState(() => getXaPhuong(address.district));

  const selectCity = id => {
    if (id !== address.city) {
      setDistrict(getQuanHuyen(id));

      const newAddess = {
        ...address,
        city: id,
        district: undefined,
        ward: undefined
      };

      updateAddress(newAddess);
    }
  };

  const selectDistrict = id => {
    if (id !== address.district) {
      setWards(getXaPhuong(id));
      const newAddess = {
        ...address,
        district: id,
        ward: undefined
      };
      updateAddress(newAddess);
    }
  };

  const selectWard = id => {
    const newAddess = {
      ...address,
      ward: id
    };

    updateAddress(newAddess);
  };

  return (
    <>
      <FormItem label="Tỉnh/TP" {...formItemLayout} style={style}>
        <Select
          showSearch
          onChange={selectCity}
          style={{ width: '100%' }}
          value={address.city}
          placeholder="Tỉnh/Thành phố"
        >
          {Object.keys(tinh_thanhpho).map(c => (
            <Select.Option value={tinh_thanhpho[c].code} key={c}>
              {tinh_thanhpho[c].name}
            </Select.Option>
          ))}
        </Select>

        {/* <AutoComplete
          value={address.city}
          style={{ width: '100%' }}
          dataSource={tinh_thanhpho}
          placeholder="Tỉnh/Thành phố"
          filterOption={(inputValue, option) =>
            option.props.children
              .toUpperCase()
              .indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={selectCity}
        >
          {Object.keys(tinh_thanhpho).map(c => (
            <AutoComplete.Option value={tinh_thanhpho[c].code} key={c}>
              {tinh_thanhpho[c].name}
            </AutoComplete.Option>
          ))}
        </AutoComplete> */}
      </FormItem>

      <FormItem label="Quận/Huyện" {...formItemLayout} style={style}>
        <Select
          onChange={selectDistrict}
          value={address.district}
          style={{ width: '100%' }}
          placeholder="Quận/Huyện"
          disabled={districts.length === 0}
        >
          {Object.keys(districts).map(c => (
            <Select.Option value={districts[c].code} key={c}>
              {districts[c].name}
            </Select.Option>
          ))}
        </Select>
        {/* <AutoComplete
          value={address.district}
          style={{ width: '100%' }}
          dataSource={districts}
          placeholder="Quận/Huyện"
          disabled={districts.length === 0}
          filterOption={(inputValue, option) =>
            option.props.children
              .toUpperCase()
              .indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={selectDistrict}
        >
          {Object.keys(districts).map(c => (
            <AutoComplete.Option value={districts[c].code} key={c}>
              {districts[c].name}
            </AutoComplete.Option>
          ))}
        </AutoComplete> */}
      </FormItem>

      <FormItem label="Xã/Phường" {...formItemLayout} style={style}>
        <Select
          onChange={selectWard}
          value={address.ward}
          style={{ width: '100%' }}
          placeholder="Phường/Xã"
          disabled={wards.length === 0}
        >
          {Object.keys(wards).map(c => (
            <Select.Option value={wards[c].code} key={c}>
              {wards[c].name}
            </Select.Option>
          ))}
        </Select>
        {/* <AutoComplete
          value={address.ward}
          style={{ width: '100%' }}
          dataSource={wards}
          placeholder="Phường/Xã"
          disabled={wards.length === 0}
          filterOption={(inputValue, option) =>
            option.props.children
              .toUpperCase()
              .indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={selectWard}
        >
          {Object.keys(wards).map(c => (
            <AutoComplete.Option value={wards[c].code} key={c}>
              {wards[c].name}
            </AutoComplete.Option>
          ))}
        </AutoComplete> */}
      </FormItem>
    </>
  );
};

export default OrderAddress;
