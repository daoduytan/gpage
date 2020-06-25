// @flow
import React, { useState, useEffect, useContext } from 'react';
import { Icon, Modal, Input } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from '@reach/router';
import styled from 'styled-components';

import hocModal from './hocModal';
import { Context } from './ConversationAction';
import theme from '../../theme';
import { refs } from '../../api';

const LabelModalQuestion = React.memo(() => (
  <>
    <Icon type="message" style={{ marginRight: 10 }} /> Trả lời nhanh
  </>
));

const style = {
  heading: {
    background: theme.color.primary,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '5px 0'
  },
  text: {
    whiteSpace: 'nowrap',
    padding: '0 10px'
  }
};

const RowAnswerItemStyle = styled.div`
  padding: ${theme.size.space}px;
  border-bottom: 1px solid ${theme.color.border};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.color.border};
  }
`;

const RowAnswerItem = ({
  answer,
  ...rest
}: {
  answer: { short_key: String, message: String, attachs: Array }
}) => (
  <RowAnswerItemStyle {...rest}>
    <span>
      <b>/{answer.short_key}</b> - {`${answer.message}`}
    </span>
    {answer.attachs.length > 0 && (
      <span>
        {`+${answer.attachs.length} `} <Icon type="picture" />
      </span>
    )}
  </RowAnswerItemStyle>
);

type ModalQuestionProps = {
  visible: Boolean,
  onCancel: Function,
  title?: String,
  user: {
    uid: String
  }
};

const ModalQuestion = ({
  visible,
  onCancel,
  title,
  ...rest
}: ModalQuestionProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [answers, setAnswers] = useState([]);
  const [filter_text, setFilterText] = useState('');
  const { setMessage, setAttachs } = useContext(Context);

  useEffect(() => {
    refs.usersRefs
      .doc(user.shopId)

      .collection('quick_answer')
      .get()
      .then(querySnapshot => {
        const m = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        setAnswers(m);
      });
  }, [user]);

  const copyMessage = message => {
    setAttachs(message.attachs);
    setMessage(message.message);
    onCancel();
  };

  const searchAnswer = e => {
    setFilterText(e.target.value);
  };

  const filterAnswers =
    filter_text.length === 0
      ? answers
      : answers.filter(a => a.message.indexOf(filter_text) !== -1);

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      bodyStyle={{ padding: 0 }}
      {...rest}
    >
      <div style={style.heading}>
        <div style={style.text}>Trả lời nhanh</div>
        <Input size="large" onChange={searchAnswer} />

        <div style={style.text}>
          <Link to="/customer/other/setting" style={{ color: '#fff' }}>
            Cài đặt
          </Link>
        </div>
      </div>

      <div>
        {filterAnswers.map(a => (
          <RowAnswerItem
            key={a.id}
            onClick={() => copyMessage(a)}
            role="presentation"
            answer={a}
          />
        ))}
      </div>
    </Modal>
  );
};

ModalQuestion.defaultProps = { title: '' };

export default hocModal(ModalQuestion, LabelModalQuestion);
