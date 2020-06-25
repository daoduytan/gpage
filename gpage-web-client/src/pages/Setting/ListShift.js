// @flow
import React from 'react';

import { connect, useSelector } from 'react-redux';
import { Table, Button, Icon, Menu, Dropdown, message, Modal, Tag } from 'antd';

import FormShift from './FormShift';
import { refs } from '../../api';
import theme from '../../theme';

// List member
type ListMemberProps = { shiftId: string };

const ListMember = ({ shiftId }: ListMemberProps) => {
  const [loading, setLoading] = React.useState(true);
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    if (shiftId) {
      refs.usersRefs
        .where('shifts', 'array-contains', shiftId)
        .get()
        .then(snapshot => {
          const arrData = snapshot.docs.map(s => ({ ...s.data() }));
          setMembers(arrData);
          setLoading(false);
        });
    }
  }, [setMembers, shiftId]);

  if (loading) return <Icon type="loading" />;

  return members.map(member => (
    <Tag key={member.uid}>{member.displayName}</Tag>
  ));
};

// Action
type ActionProps = {
  shift: {
    id: string
  }
};

const Action = ({ shift }: ActionProps) => {
  const [visible, setVisible] = React.useState(false);
  const user = useSelector(({ authReducer }) => authReducer.user);

  const removeShift = () => {
    if (!user) return null;
    return refs.usersRefs
      .doc(user.shopId)
      .collection('shifts')
      .doc(shift.id)
      .delete()
      .then(() => {
        message.success('Đã xóa ca');
      })
      .catch(error => {
        message.error(error.message);
      });
  };

  const toggleModal = () => setVisible(!visible);

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={toggleModal}>
        Sửa
      </Menu.Item>
      <Menu.Item key="1" onClick={removeShift}>
        Xóa
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button>
          <Icon type="ellipsis" />
        </Button>
      </Dropdown>
      <Modal
        visible={visible}
        footer={null}
        title="Chỉnh sửa ca"
        onCancel={toggleModal}
      >
        <FormShift shift={shift} edit />
      </Modal>
    </>
  );
};

// Table shift
type TableShiftProps = { shifts: any };

const TableShift = ({ shifts }: TableShiftProps) => {
  const columns = [
    {
      title: <span style={{ fontWeight: 600 }}>Ca</span>,
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: <span style={{ fontWeight: 600 }}>Thời gian</span>,
      dataIndex: '',
      key: 'time',
      render: ({ start_time, end_time }) => {
        return `${start_time} -  ${end_time}`;
      }
    },

    {
      title: <span style={{ fontWeight: 600 }}>Page</span>,
      dataIndex: 'pages',
      key: 'pages',
      render: pages => {
        return pages.map(page => (
          <Tag color={theme.color.primary}>{page.name}</Tag>
        ));
      }
    },
    {
      title: <span style={{ fontWeight: 600 }}>Nhân viên</span>,
      dataIndex: '',
      key: '',
      render: shift => {
        if (!shift) return null;
        return <ListMember shiftId={shift.id} />;
      }
    },
    {
      title: '',

      dataIndex: '',
      width: 80,
      key: 'action',
      render: shift => {
        return <Action shift={shift} />;
      }
    }
  ];

  const dataSource = shifts.map(shift => ({ ...shift, key: shift.id }));

  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  );
};

// List shift

type ListShiftProps = {
  user: {
    shopId: string
  }
};

type ListShiftState = {
  shifts: any
};

class ListShift extends React.Component<ListShiftProps, ListShiftState> {
  constructor(props) {
    super(props);

    this.state = {
      shifts: []
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('shifts')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            const shift = { ...change.doc.data(), id: change.doc.id };
            if (change.type === 'added') {
              this.setState(prevState => ({
                shifts: [...prevState.shifts, shift]
              }));
            }
            if (change.type === 'modified') {
              this.setState(prevState => {
                const newShifts = prevState.shifts.map(s => {
                  if (s.id === change.doc.id) return shift;
                  return s;
                });

                return { shifts: newShifts };
              });
            }
            if (change.type === 'removed') {
              this.setState(prevState => {
                const newShifts = prevState.shifts.filter(
                  s => s.id !== change.doc.id
                );
                return { shifts: newShifts };
              });
            }
          });
        });
    }
  }

  render() {
    const { shifts } = this.state;

    return <TableShift shifts={shifts} />;
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(ListShift);
