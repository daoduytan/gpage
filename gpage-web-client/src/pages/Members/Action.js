import React from 'react';
import { useSelector } from 'react-redux';
import { Menu, Dropdown, Icon, Button, Drawer, message } from 'antd';
import FormEditMember from './FormEditMember';
import { customerApi } from '../../api';

type ActionProps = {
  member: {
    uid: String
  }
};

const Action = ({ member }: ActionProps) => {
  const [visible, setVisible] = React.useState(false);
  const user = useSelector(({ authReducer }) => authReducer.user);

  const toggle = () => setVisible(!visible);
  const removeMember = () => {
    customerApi
      .delete_member({
        uid: member.uid,
        adminId: user.uid,
        shopId: user.shopId
      })
      .then(() => message.success('Đã xóa nhân viên'))
      .catch(() => message.error('Lỗi xóa nhân viên'));
  };
  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={toggle}>
        Sửa
      </Menu.Item>
      <Menu.Item key="3" onClick={removeMember}>
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

      <Drawer title="Chỉnh sửa" width={500} onClose={toggle} visible={visible}>
        <FormEditMember member={member} toggle={toggle} />
      </Drawer>
    </>
  );
};

export default Action;
