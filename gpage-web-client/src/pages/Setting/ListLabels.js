import React, { Component, useState } from 'react';
import { Table, Button, Icon, Divider, Modal, Tag, Checkbox } from 'antd';
import { connect } from 'react-redux';

import { AddLabelForm } from './TabLabels';
import { refs } from '../../api';

const EditLabel = ({ label, ...rest }: { label: any }) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <Button onClick={showModal} {...rest}>
        <Icon type="edit" />
      </Button>
      <Modal
        visible={visible}
        title="Chỉnh sửa câu trả lời"
        onCancel={hideModal}
        footer={null}
      >
        <AddLabelForm label={label} hideModal={hideModal} />
      </Modal>
    </>
  );
};

const { confirm } = Modal;

type RemoveLabelProps = {
  label: {
    id: string
  },
  shopId: string
};

const RemoveLabel = ({ label, shopId, ...rest }: RemoveLabelProps) => {
  const removeLabel = () =>
    confirm({
      title: 'Xóa nhãn hội thoại?',
      content: 'Bạn có chắc chắn muốn xóa nhãn hội thoại không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Thoát',
      onOk() {
        refs.usersRefs
          .doc(shopId)
          .collection('list_labels')
          .doc(label.id)
          .delete();
      },
      onCancel() {
        console.log('Cancel');
      }
    });

  return (
    <Button onClick={removeLabel} {...rest}>
      <Icon type="delete" />
    </Button>
  );
};

// modal add new short key

type ListLabelsProps = { user: { init: boolean, shopId: string } };
type ListLabelsState = { labels: any };

class ListLabels extends Component<ListLabelsProps, ListLabelsState> {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    labels: []
  };

  componentDidMount() {
    const { user } = this.props;

    refs.usersRefs
      .doc(user.shopId)
      .collection('list_labels')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            this.setState(prevState => ({
              labels: [
                ...prevState.labels,
                { ...change.doc.data(), id: change.doc.id }
              ]
            }));
          }
          if (change.type === 'modified') {
            this.setState(prevState => {
              const newLabels = prevState.labels.map(l => {
                if (l.id === change.doc.id) return change.doc.data();
                return l;
              });

              return { labels: newLabels };
            });
          }
          if (change.type === 'removed') {
            this.setState(prevState => {
              const newLabels = prevState.labels.filter(
                l => l.id !== change.doc.id
              );
              return { labels: newLabels };
            });
          }
        });
      });
  }

  changeStatus = label => {
    const { user } = this.props;
    refs.usersRefs
      .doc(user.shopId)
      .collection('list_labels')
      .doc(label.id)
      .update({
        ...label,
        status: !label.status
      });
  };

  columns = () => {
    const { user } = this.props;
    return [
      {
        title: 'Tên',
        dataIndex: '',
        key: 'text',
        render: label => (
          <Tag color={label.bg}>
            <span style={{ color: label.color }}>{label.text}</span>
          </Tag>
        )
      },
      {
        title: 'Trạng thái',
        dataIndex: '',
        key: 'status',
        render: label => (
          <Checkbox
            checked={label.status}
            onChange={() => this.changeStatus(label)}
          >
            Bật
          </Checkbox>
        )
      },
      {
        title: '',
        dataIndex: '',
        key: 'action',
        render: record => (
          <>
            <span>
              <EditLabel label={record} shopId={user.shopId} size="small" />
              <Divider type="vertical" />
              <RemoveLabel label={record} shopId={user.shopId} size="small" />
            </span>
          </>
        )
      }
    ];
  };

  render() {
    const { labels } = this.state;
    const dataSource = labels.map(l => ({ ...l, key: l.id }));

    return <Table columns={this.columns()} dataSource={dataSource} bordered />;
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(ListLabels);
