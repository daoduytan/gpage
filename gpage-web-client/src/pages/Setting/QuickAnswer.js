import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Table, Button } from 'antd';

import { refs } from '../../api';
import QuickAnswerNew from './QuickAnswerNew';
import Action from './Action';

type QuickAnswerProps = {
  user: { uid: string, shopId: string }
};
type QuickAnswerState = {
  answers: any,
  filter_text: string
};

class QuickAnswer extends Component<QuickAnswerProps, QuickAnswerState> {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      filter_text: ''
    };

    this.columns = [
      {
        title: 'Phím tắt',
        dataIndex: 'short_key',
        key: 'short_key'
      },
      {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Tin nhắn',
        dataIndex: 'message',
        key: 'message'
      },
      {
        title: 'Đính kèm',
        key: 'attachs',
        dataIndex: 'attachs',
        render: attachs =>
          attachs.length === 0 ? null : (
            <Button type="secondary" size="small">
              File đính kèm
            </Button>
          )
      },
      {
        title: '',
        key: 'action',
        width: 50,
        render: answer => {
          return <Action answer={answer} />;
        }
      }
    ];
  }

  componentDidMount() {
    const { user } = this.props;

    refs.usersRefs
      .doc(user.shopId)
      .collection('quick_answer')
      .onSnapshot(docSnapshot => {
        docSnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const newAnswer = { ...change.doc.data(), id: change.doc.id };
            this.setState(prevState => ({
              answers: [...prevState.answers, newAnswer]
            }));
          }
          if (change.type === 'modified') {
            // console.log('Modified city: ', change.doc.data());

            this.setState(prevState => {
              const newFilterAnswers = prevState.answers.map(a => {
                if (a.id === change.doc.id)
                  return { ...change.doc.data(), id: change.doc.id };
                return a;
              });

              return { answers: newFilterAnswers };
            });
          }
          if (change.type === 'removed') {
            // console.log('Removed city: ', change.doc.data());
            this.setState(prevState => {
              const newFilterAnswers = prevState.answers.filter(
                a => a.id !== change.doc.id
              );

              return { answers: newFilterAnswers };
            });
          }
        });
      });
  }

  seachAnswer = e => {
    const filter_text = e.target.value;
    this.setState({ filter_text });
  };

  render() {
    const { answers, filter_text } = this.state;
    const filter_anwers = answers.filter(
      a => a.message.indexOf(filter_text) !== -1
    );

    const dataSource = filter_anwers.map(a => ({ key: a.id, ...a }));

    return (
      <>
        <div style={{ marginBottom: 20, display: 'flex' }}>
          <QuickAnswerNew />
          <Input placeholder="Tìm kiếm" onChange={this.seachAnswer} />
        </div>
        <Table
          columns={this.columns}
          bordered
          dataSource={dataSource}
          pagination={false}
        />
      </>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(QuickAnswer);
