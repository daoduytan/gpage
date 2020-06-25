// @flow
import React, { useState } from 'react';
import { Form, Button, Input, message, Icon } from 'antd';
import { useSelector } from 'react-redux';

import { refs } from '../../api';

import { UploadBtnImage } from '../Conversation/ModalImage';
import ImagesList from './ImagesList';

const { TextArea } = Input;

type QuickAnswerNewFormProps = {
  form: any,
  user: {
    uid: String
  },
  answer: any,
  hideModal: any
};

const QuickAnswerNewForm = ({
  hideModal,
  answer,
  form
}: QuickAnswerNewFormProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [attachs, setAttachs] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { validateFields, getFieldDecorator } = form;

  React.useEffect(() => {
    refs.usersRefs
      .doc(user.shopId)
      .collection('images')
      .onSnapshot(querySnapshot => {
        const images_arr = querySnapshot.docs.map(doc => {
          return { ...doc.data(), id: doc.id };
        });

        setImages(images_arr);
        setLoading(false);
      });
  }, [user.shopId]);

  const addShortMessage = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        const quick_answer = { ...values, attachs, uid: user.uid };

        const ref = refs.usersRefs.doc(user.shopId).collection('quick_answer');

        if (!answer) {
          ref
            .add(quick_answer)
            .then(() => {
              message.success('Đã thêm thành công');
              setLoading(false);
              hideModal();
            })
            .catch(() => {
              message.error('Xảy ra lỗi, vui lòng thử lại.');
              setLoading(false);
            });
        } else {
          ref
            .doc(answer.id)
            .update({
              ...quick_answer
            })
            .then(() => {
              message.success('Đã chỉnh sửa thành công');
              setLoading(false);
              hideModal();
            })
            .catch(() => {
              message.error('Xảy ra lỗi, vui lòng thử lại.');
              setLoading(false);
            });
        }
      }
    });
  };

  const addAttach = attach => {
    const newAttachs = [...attachs, attach];
    setAttachs(newAttachs);
  };
  const removeAttach = attach => {
    const newAttachs = attachs.filter(a => a.id !== attach.id);
    setAttachs(newAttachs);
  };

  return (
    <Form onSubmit={addShortMessage}>
      <Form.Item>
        {getFieldDecorator('title', {
          rules: [{ required: true, message: 'Điền tiêu đề' }],
          initialValue: answer && answer.title ? answer.title : ''
        })(
          <Input style={{ marginRight: 10, flex: 2 }} placeholder="Tiêu đề" />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('short_key', {
          initialValue: answer && answer.short_key ? answer.short_key : ''
        })(<Input addonBefore="Phím tắt: /" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('message', {
          rules: [{ required: true, message: 'Nhập lời nhắn' }],
          initialValue: answer && answer.message ? answer.message : ''
        })(<TextArea rows={4} placeholder="Nhập tin nhắn" />)}
      </Form.Item>
      <Form.Item>
        <ImagesList
          images={images}
          attachs={attachs}
          addAttach={addAttach}
          removeAttach={removeAttach}
        />

        <UploadBtnImage />
      </Form.Item>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" loading={loading} htmlType="submit">
          <Icon type="save" /> Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(QuickAnswerNewForm);
