import React from 'react';

import {
  Table,
  Dropdown,
  Button,
  Menu,
  Icon,
  message,
  Modal,
  InputNumber
} from 'antd';

import { formatMoney } from '../../ultils';
import { refs } from '../../api';
import FormAddService from './FormAddService';
import SwitchStatusService from './SwitchStatusService';

type ServicesTableProps = {};

type ServicesTableState = {
  services: any,
  visible: boolean,
  service_select: any
};

const ChangeNumberOrder = ({ service }) => {
  const [value, setValue] = React.useState(service.stt || undefined);
  const changeNumberOrder = number => {
    refs.servicesRefs.doc(service.id).update({ stt: number });
    setValue(number);
  };
  return (
    <InputNumber
      onChange={changeNumberOrder}
      style={{ width: 50 }}
      min={1}
      value={value}
    />
  );
};

class ServicesTable extends React.Component<
  ServicesTableProps,
  ServicesTableState
> {
  columns = [
    {
      title: 'STT',
      dataIndex: '',
      key: 'stt',
      render: service => <ChangeNumberOrder service={service} />
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Giá (page/tháng)',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: price => formatMoney(price)
    },
    // {
    //   title: 'Thời hạn (tháng)',
    //   dataIndex: 'time',
    //   align: 'center',
    //   key: 'time'
    // },
    {
      title: 'SL người dùng',
      dataIndex: 'number_users',
      align: 'center',
      key: 'number_users'
    },
    {
      title: 'SL page',
      dataIndex: 'number_page',
      align: 'center',
      key: 'number_page'
    },
    {
      title: 'Trạng thái',
      dataIndex: '',
      key: 'status',
      align: 'center',
      render: service => <SwitchStatusService service={service} />
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      width: 150,
      key: 'note',
      align: 'center',
      render: note => note || '"'
    },
    {
      title: '',
      dataIndex: '',
      align: 'right',
      key: 'x',
      render: service => {
        const handleRemoveCustomer = () => {
          refs.servicesRefs
            .doc(service.id)
            .delete()
            .then(() => {
              message.success('Đã xóa dịch vụ');
            })
            .catch(error => {
              console.log(error);
              message.error('Lỗi xóa dịch vụ');
            });
        };

        const edit = () =>
          this.setState({ visible: true, service_select: service });

        const menu = (
          <Menu>
            <Menu.Item key="0" onClick={edit}>
              Sửa
            </Menu.Item>
            <Menu.Item key="1" onClick={handleRemoveCustomer}>
              Xóa
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        );
      }
    }
  ];

  constructor(props) {
    super(props);

    this.state = {
      services: [],
      visible: false,
      service_select: null
    };
  }

  componentDidMount() {
    refs.servicesRefs.orderBy('stt', 'asc').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          this.setState(prevState => ({
            services: [
              ...prevState.services,
              { ...change.doc.data(), id: change.doc.id, key: change.doc.id }
            ]
          }));
        }

        if (change.type === 'modified') {
          this.setState(prevState => {
            const newServices = prevState.services.map(service => {
              if (service.id === change.doc.id)
                return {
                  ...change.doc.data(),
                  id: change.doc.id,
                  key: change.doc.id
                };
              return service;
            });

            return { services: newServices };
          });
        }

        if (change.type === 'removed') {
          this.setState(prevState => {
            const servicesNew = prevState.services.filter(
              s => s.id !== change.doc.id
            );

            return { services: servicesNew };
          });
        }
      });
    });
  }

  toggle = () => this.setState({ visible: false, service_select: null });

  dataSource = () => {
    const { services } = this.state;
    return services.map(s => ({ ...s, key: s.id }));
  };

  render() {
    const { visible, service_select } = this.state;
    return (
      <>
        <Table columns={this.columns} dataSource={this.dataSource()} />
        <Modal
          visible={visible}
          onCancel={this.toggle}
          footer={null}
          title={service_select && service_select.name}
        >
          {service_select && <FormAddService service={service_select} />}
        </Modal>
      </>
    );
  }
}

export default ServicesTable;
