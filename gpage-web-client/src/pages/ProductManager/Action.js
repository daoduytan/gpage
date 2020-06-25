import React from 'react';
import { Menu, Dropdown, Icon, Modal, Button } from 'antd';

type ActionProps = {
  product: {
    ten: string
  },
  removeProduct: any,
  onCancel: any,
  onEdit: any
};

const Action = ({ product, removeProduct, onCancel, onEdit }: ActionProps) => {
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Xóa sản phẩm?',
      content: `Bạn chắc chắn muốn xóa sản phẩm ${product.ten}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        removeProduct();
      },
      onCancel() {
        onCancel();
      }
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onEdit}>
        Sửa
      </Menu.Item>

      <Menu.Item key="2" onClick={showDeleteConfirm}>
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
};

export default Action;
