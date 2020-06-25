import React from 'react';
import { Table, Checkbox, Button, message } from 'antd';
import { useServices, useModal } from './hooks';
import { Context } from '.';
import { refs } from '../../api';

const SelectServices = () => {
  const { customer } = React.useContext(Context);
  const { toggle } = useModal();

  const [service, setService] = React.useState(null);
  const { loading, services } = useServices();

  const columns = [
    {
      title: '',
      dataIndex: '',
      key: 0,
      render: s => {
        const checked = service && service.key === s.key;

        return <Checkbox checked={checked} />;
      }
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Thời hạn',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'SL page',
      dataIndex: 'number_page',
      key: 'number_page'
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      width: 150,
      key: 'note'
    }
  ];

  const handleSelectSevices = () => {
    console.log(service);
    refs.usersRefs
      .doc(customer.shopId)
      .update({
        licence: {
          ...customer.licence,
          startTime: Date.now(),
          service: service.key
        }
      })
      .then(() => {
        message.success('Đã cập nhật gói dịch vụ');
        toggle();
      })
      .catch(error => {
        message.error(error.message);
      });
  };

  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              if (service && service.key === record.key) {
                setService(null);
              } else {
                setService(record);
              }
            } // click row
          };
        }}
        dataSource={services}
        columns={columns}
        loading={loading}
        pagination={false}
      />

      <div style={{ padding: '30px 0', textAlign: 'center' }}>
        <Button
          onClick={handleSelectSevices}
          disabled={!service}
          type="primary"
          size="large"
        >
          Chọn dịch vụ
        </Button>
      </div>
    </>
  );
};

export default SelectServices;
