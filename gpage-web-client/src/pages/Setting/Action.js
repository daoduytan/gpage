import React from 'react';
import { Dropdown, Button, Menu, Modal, message } from 'antd';
import { useSelector } from 'react-redux';

import { refs } from '../../api';
import { useModal } from './hooks';
import QuickAnswerNewForm from './QuickAnswerNewForm';

type ActionProps = {
  answer: {
    id: string
  }
};

const Action = ({ answer }: ActionProps) => {
  const [loading, setLoading] = React.useState(false);
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { visible, toggle } = useModal();

  const confirmRemoveAnswer = () => {
    setLoading(true);
    refs.usersRefs
      .doc(user.shopId)
      .collection('quick_answer')
      .doc(answer.id)
      .delete()
      .then(() => {
        message.success('Đã xóa câu hỏi');
        setLoading(false);
      })
      .catch(() => {
        message.error('Lỗi xóa câu hỏi');
        setLoading(false);
      });
  };

  const removeAnswer = () => {
    if (user) {
      Modal.warning({
        title: 'Xóa câu trả lời nhanh',

        okCancel: 'Hủy',
        okText: 'Xóa',
        onOk: confirmRemoveAnswer
      });
    }
  };
  const menu = (
    <Menu>
      <Menu.Item onClick={toggle}>Chỉnh sửa</Menu.Item>
      <Menu.Item onClick={removeAnswer}>Xóa</Menu.Item>
    </Menu>
  );

  if (!answer) return null;

  return (
    <>
      <Dropdown overlay={menu} placement="bottomRight">
        <Button icon="ellipsis" loading={loading} />
      </Dropdown>
      <Modal
        visible={visible}
        title="Chỉnh sửa"
        footer={null}
        onCancel={toggle}
      >
        <QuickAnswerNewForm answer={answer} hideModal={toggle} />
      </Modal>
    </>
  );
};

export default Action;
