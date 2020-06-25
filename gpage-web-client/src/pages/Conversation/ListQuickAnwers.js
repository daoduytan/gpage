import React from 'react';
import { Icon } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from '@reach/router';

import { Context } from './ConversationAction';
import { fireStore } from '../../api/firebase';
import { ListQuickAnwersWrap, AnswerRow } from './style';

import theme from '../../theme';

const ListQuickAnwers = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { setMessage, setAttachs, show_list_answer } = React.useContext(
    Context
  );
  const [answers, setAnswers] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [select_answer, selectAnswer] = React.useState(answers[index]);

  const handleSelectAnswer = answer => {
    console.log('answer', answer);
    setMessage(answer.message);
    // setShowListAnswer(false);
    selectAnswer(answer);
  };

  React.useEffect(() => {
    if (user) {
      const { uid } = user;
      fireStore
        .collection('users')
        .doc(uid)
        .collection('quick_answer')
        .where('uid', '==', uid)
        .get()
        .then(querySnapshot => {
          const a = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));

          setAnswers(a);
          selectAnswer(a[0]);
        });
    }
  }, [user]);

  const handMoveSelect = React.useCallback(
    e => {
      const leng_answers = answers.length;

      if (e.code === 'ArrowDown') {
        if (index === leng_answers - 1) return null;
        setIndex(index + 1);
        return selectAnswer(answers[index + 1]);
      }

      if (e.code === 'ArrowUp') {
        if (index === 0) return null;
        setIndex(index - 1);
        return selectAnswer(answers[index - 1]);
      }

      if (e.code === 'Enter' && show_list_answer) {
        const answer = answers[index];
        setAttachs(answer.attachs || []);
        setMessage(answer.message);
        selectAnswer(answer);
      }

      return null;
    },
    [answers, index, setAttachs, setMessage, show_list_answer]
  );

  React.useEffect(() => {
    document.addEventListener('keydown', handMoveSelect);

    return () => {
      document.removeEventListener('keydown', handMoveSelect);
    };
  }, [answers.length, handMoveSelect]);

  return (
    <ListQuickAnwersWrap>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
          background: theme.color.border
        }}
      >
        <span style={{ fontWeight: 600 }}>
          Sử dụng ↑ hoặc ↓ để di chuyển [enter để chọn]
        </span>
        <Link to="/customer/other/setting">
          <Icon type="setting" /> Cài đặt
        </Link>
      </div>
      {answers.map(a => (
        <AnswerRow
          key={a.id}
          selected={select_answer && select_answer.id === a.id}
          onClick={() => handleSelectAnswer(a)}
        >
          <div>{`/${a.short_key} ${a.title} ${a.message}`}</div>
          {a.attachs.length > 0 && (
            <span>
              {a.attachs.length} <Icon type="picture" />
            </span>
          )}
        </AnswerRow>
      ))}
    </ListQuickAnwersWrap>
  );
};

export default ListQuickAnwers;
