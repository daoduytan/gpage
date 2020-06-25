import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { refs } from '../../api';
import { Loading } from '../../components';
import MessageBubble from './MessageBubble';
import MessageBubbleLoading from './MessageBubbleLoading';
import { Scroll } from './MessageList';

type ListMessagesProps = {
  conversation_select: {
    key: any,
    type: string,
    pageId: string,
    id: string
  },
  setLoading: void,
  loading_send: boolean,
  user: {
    facebookPages: any
  }
};

type ListMessagesState = {
  messages: any,
  loading: boolean
};

class ListMessages extends React.Component<
  ListMessagesProps,
  ListMessagesState
> {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      loading: true
    };

    this.isMount = false;
  }

  componentDidMount() {
    this.isMount = true;
    const { conversation_select, setLoading } = this.props;

    const refactivityDoc = refs.activitysRefs.doc(conversation_select.key);

    refactivityDoc
      .collection('messages')
      .orderBy('created_time')
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          if (
            typeof conversation_select.isLoaded === 'undefined' ||
            !conversation_select.isLoaded
          ) {
            this.loadMessageFromFb();
          } else {
            this.setState({ loading: false });
          }
        } else {
          snapshot.docChanges().forEach(doc => {
            if (doc.type === 'added') {
              if (this.isMount) {
                this.setState(
                  prevState => ({
                    messages: [...prevState.messages, doc.doc.data()]
                  }),
                  () => {
                    if (setLoading) {
                      setLoading(false);
                    }
                  }
                );
              }
            }
          });

          if (typeof conversation_select.isLoaded === 'undefined') {
            refactivityDoc.update({ isLoaded: true }).then(() => {
              this.setState({ loading: false });
            });
          } else {
            this.setState({ loading: false });
          }
        }

        // if (
        //   snapshot.empty &&
        //   (typeof conversation_select.isLoaded === 'undefined' ||
        //     !conversation_select.isLoaded)
        // ) {
        //   this.loadMessageFromFb();
        // } else {
        //   this.setState({ loading: false });
        //   snapshot.docChanges().forEach(doc => {
        //     if (doc.type === 'added') {
        //       if (this.isMount) {
        //         this.setState(
        //           prevState => ({
        //             messages: [...prevState.messages, doc.doc.data()]
        //           }),
        //           () => {
        //             if (setLoading) {
        //               setLoading(false);
        //             }
        //           }
        //         );
        //       }
        //     }
        //   });
        // }
      });
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  loadMessageFromFb = () => {
    const { conversation_select, user, selectConversation } = this.props;

    const { pageId, id, key } = conversation_select;
    const { facebookPages } = user;

    const page = facebookPages.find(p => p.id === pageId);

    if (!page) return null;

    this.setState({ loading: true }, () => {
      console.log('id', id);

      window.FB.api(
        `/${id}/messages`,
        'GET',
        {
          fields:
            'message,from,sticker,attachments{file_url,id,image_data},created_time',
          limit: '50',
          access_token: page.access_token
        },
        response => {
          if (response && !response.error) {
            if (response.empty) {
              this.setState({ loading: false });
            } else {
              response.data.forEach((message, index) => {
                refs.activitysRefs
                  .doc(key)
                  .collection('messages')
                  .add({
                    ...message,
                    created_time: moment(message.created_time).valueOf()
                  });

                if (index === response.data.length - 1) {
                  refs.activitysRefs
                    .doc(conversation_select.key)
                    .update({ isLoaded: true })
                    .then(() => {
                      selectConversation({
                        ...conversation_select,
                        isLoaded: true
                      });
                      this.setState({ loading: false });
                    });
                }
              });
            }
          } else {
            this.setState({ loading: false });
            console.log('error', response);
          }
        }
      );
    });
  };

  render() {
    const { loading, messages } = this.state;
    const { conversation_select, loading_send } = this.props;

    if (loading)
      return (
        <div style={{ padding: '30px ', position: 'relative' }}>
          <Loading />
        </div>
      );

    const { type, pageId } = conversation_select;

    return (
      <Scroll>
        <div style={{ padding: 15, overflow: 'hidden' }}>
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              content={message}
              isAdmin={message.from.id === pageId}
              comment={type === 'comment'}
            />
          ))}

          {loading_send && <MessageBubbleLoading />}
        </div>
      </Scroll>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(ListMessages);
