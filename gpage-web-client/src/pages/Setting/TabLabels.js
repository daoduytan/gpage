import React, { useState } from 'react';
import { Button, Modal, Input, Popover, Row, Col, Tag, message } from 'antd';
import { ChromePicker } from 'react-color';
import { connect } from 'react-redux';

import { Scrollbars } from '../../components';
import { TabContentWrap } from './style';
import ListLabels from './ListLabels';

import { refs } from '../../api';

type ColorPickerProps = {
  color: String,
  pickColor: any,
  label: string
};

// form add label
const ColorPicker = ({ color, pickColor, label }: ColorPickerProps) => {
  const [visible, setVisible] = useState(false);
  const [color_state, setColorState] = useState(color);

  const handleVisibleChange = () => setVisible(!visible);

  const selectColor = (color_pick, event) => {
    setColorState(color_pick.hex);
    pickColor(color_pick.hex);
    // setVisible(false);
  };

  return (
    <>
      <Popover
        content={
          <ChromePicker
            onChangeComplete={selectColor}
            color={color_state || 'yellow'}
          />
        }
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Input addonBefore={label} value={color_state} size="large" />
      </Popover>
    </>
  );
};

const initialLabel = {
  text: '',
  bg: null,
  color: null
};

const enhance = connect(({ authReducer }) => ({
  user: authReducer.user
}));

export const AddLabelForm = enhance(({ user, label }) => {
  const base_label = label || initialLabel;

  const [label_state, setLabel] = useState(base_label);

  const handleSubmit = e => {
    e.preventDefault();

    if (!label) {
      return refs.usersRefs
        .doc(user.shopId)
        .collection('list_labels')
        .add(label_state)
        .then(() => {
          message.success('Đã thêm nhãn hội thoại');
          setLabel(base_label);
        })
        .catch(() => {
          message.error('Đã xảy ra lỗi, vui lòng thử lại');
        });
    }
    return refs.usersRefs
      .doc(user.shopId)
      .collection('list_labels')
      .doc(label.id)
      .update({ ...label_state })
      .then(() => {
        message.success('Đã thêm nhãn hội thoại');
        setLabel(label_state);
      })
      .catch(() => {
        message.error('Đã xảy ra lỗi, vui lòng thử lại');
      });
  };

  const onChange = e => {
    setLabel({ ...label_state, text: e.target.value });
  };

  const pickColorBg = bg => {
    setLabel({ ...label_state, bg });
  };

  const pickColorText = color_text =>
    setLabel({ ...label_state, color: color_text });

  return (
    <form onSubmit={handleSubmit}>
      {label_state.text.length > 0 && (
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <Tag color={label_state.bg} size="large">
            <span style={{ color: label_state.color }}>{label_state.text}</span>
          </Tag>
        </div>
      )}

      <Row gutter={15}>
        <Col style={{ marginBottom: 30 }}>
          <Input onChange={onChange} value={label_state.text} size="large" />
        </Col>
        <Col>
          <Row gutter={15}>
            <Col span={12}>
              <ColorPicker
                color={label_state.bg}
                pickColor={pickColorBg}
                size="large"
                label="Màu nền"
              />
            </Col>
            <Col span={12}>
              <ColorPicker
                color={label_state.color}
                pickColor={pickColorText}
                size="large"
                label="Màu chữ"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <div style={{ textAlign: 'right', marginTop: 15 }}>
        <Button htmlType="submit" type="primary">
          Lưu
        </Button>
      </div>
    </form>
  );
});

// modal add label
const AddLabel = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <Button type="primary" style={{ marginBottom: 20 }} onClick={showModal}>
        Thêm
      </Button>
      <Modal
        visible={visible}
        onCancel={hideModal}
        title="Thêm nhãn hội thoại"
        footer={false}
      >
        <AddLabelForm />
      </Modal>
    </>
  );
};

const TabLabels = () => {
  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      <Scrollbars style={{ flex: 1 }}>
        <TabContentWrap>
          <AddLabel />
          <ListLabels />
        </TabContentWrap>
      </Scrollbars>
    </div>
  );
};

export default TabLabels;
