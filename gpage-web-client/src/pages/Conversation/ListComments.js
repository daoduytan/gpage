import React from 'react';
import { pick } from 'lodash';
import { connect } from 'react-redux';

import { Scroll } from './MessageList';
import { refs } from '../../api';
import MessageBubble from './MessageBubble';
import MessageBubbleLoading from './MessageBubbleLoading';
import { Loading } from '../../components';

type ListCommentsProps = {
  conversation_select: any,
  user: any,
  loading_send: boolean,
  setLoading: void
};

type ListCommentsState = {
  comments: any
};

class ListComments extends React.Component<
  ListCommentsProps,
  ListCommentsState
> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      comments: []
    };

    this.isMount = true;
  }

  componentDidMount() {
    this.isMount = true;
    const { conversation_select, setLoading } = this.props;

    const refactivityDoc = refs.activitysRefs.doc(conversation_select.key);

    refactivityDoc
      .collection('comments')
      .orderBy('created_time', 'asc')
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          if (
            typeof conversation_select.isLoaded === 'undefined' ||
            !conversation_select.isLoaded
          ) {
            refactivityDoc.update({ isLoaded: true });
            this.loadCommentFromFb();
          } else {
            this.setState({ loading: false });
          }
        } else {
          if (typeof conversation_select.isLoaded === 'undefined') {
            refactivityDoc.update({ isLoaded: true }).then(() => {
              this.setState({ loading: false });
            });
          } else {
            this.setState({ loading: false });
          }
        }

        if (
          conversation_select.type === 'comment' &&
          !conversation_select.post_content
        ) {
          this.loadPostContent();
        }

        // if (
        //   snapshot.empty &&
        //   (typeof conversation_select.isLoaded === 'undefined' ||
        //     !conversation_select.isLoaded)
        // ) {
        //   this.loadCommentFromFb();
        // } else if (
        //   conversation_select.type === 'comment' &&
        //   !conversation_select.post_content
        // ) {
        //   this.loadPostContent();
        // } else {
        //   this.setState({ loading: false });
        // }

        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            if (this.isMount) {
              this.setState(
                prevState => ({
                  comments: [
                    ...prevState.comments,
                    { ...change.doc.data(), comment_uid: change.doc.id }
                  ]
                }),
                () => {
                  setLoading(false);
                }
              );
            }
          }

          if (change.type === 'modified') {
            // console.log('Modified city: ', change.doc.data());
          }
          if (change.type === 'removed') {
            // console.log('Removed city: ', change.doc.data());
          }
        });
      });
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  loadPostContent = () => {
    const { conversation_select, user, selectConversation } = this.props;
    const { facebookPages } = user;
    const { pageId } = conversation_select;

    const page = facebookPages.find(p => p.id === pageId);

    const refactivityDoc = refs.activitysRefs.doc(conversation_select.key);

    window.FB.api(
      `/${conversation_select.postId}`,
      {
        access_token: page.access_token,
        fields:
          'comments{comments{attachment,message,from,id,created_time},id,from,message,attachment,created_time},message,id,from,attachments,created_time'
      },
      response => {
        /* start test */
        // update content post

        const post_content = {
          ...pick(response, ['message', 'id', 'picture', 'attachments'])
        };

        selectConversation({ ...conversation_select, post_content });

        refactivityDoc.update({
          post_content
        });
        this.setState({ loading: false });
      }
    );
  };

  loadCommentFromFb = () => {
    const { conversation_select, selectConversation, user } = this.props;
    const { facebookPages } = user;
    const { pageId } = conversation_select;

    const page = facebookPages.find(p => p.id === pageId);

    const refactivityDoc = refs.activitysRefs.doc(conversation_select.key);

    window.FB.api(
      `/${conversation_select.postId}`,
      {
        access_token: page.access_token,
        fields:
          'comments{comments{attachment,message,from,id,created_time},id,from,message,attachment,created_time},message,id,from,attachments,created_time'
      },
      response => {
        /* start test */
        // update content post

        refactivityDoc.update({
          post_content: {
            ...pick(response, ['message', 'id', 'picture', 'attachments'])
          }
        });

        const { comments } = response;

        const comment1 =
          comments && comments.data
            ? comments.data.filter(comment => {
                if (!comment.from) return false;

                return comment.from.id === conversation_select.sender.id;
              })
            : [];

        // parent comment
        const arrDataParent = comment1.map(comment => {
          const a = pick(comment, [
            'from',
            'message',
            'created_time',
            'id',
            'attachment'
          ]);
          return a;
        });

        // child comment
        const arrDataChildren = [];

        comment1.forEach(element => {
          const comments2 = element.comments;

          if (!comments2) return false;
          return comments2.data.forEach(el => {
            const c = pick(el, [
              'from',
              'message',
              'id',
              'created_time',
              'attachment',
              'sticker'
            ]);

            return arrDataChildren.push(c);
          });
        });

        const allComemnt = [...arrDataParent, ...arrDataChildren];

        // update post content to database

        // refactivityDoc.update({
        //   post_content: {
        //     ...pick(response, ['message', 'id', 'picture', 'attachments'])
        //   }
        // });

        // update comment to database

        allComemnt.forEach(comment => {
          refactivityDoc.collection('comments').add(comment);

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

          // this.setState({ loading: false });
        });

        /* end test */
      }
    );
  };

  render() {
    const { comments, loading } = this.state;
    const { conversation_select, loading_send } = this.props;
    const { pageId, post_content } = conversation_select;

    if (loading)
      return (
        <div style={{ padding: 30, position: 'relative' }}>
          <Loading />
        </div>
      );
    return (
      <Scroll>
        {post_content && (
          <div style={{ padding: 15, borderBottom: '1px solid #eee' }}>
            {post_content &&
              post_content.attachments &&
              post_content.attachments.data[0].media && (
                <img
                  src={post_content.attachments.data[0].media.image.src}
                  alt=""
                  style={{
                    maxWidth: 200,
                    display: 'block',
                    marginBottom: 15,
                    border: `1px solid #eee`,
                    borderRadius: 3
                  }}
                />
              )}

            <div>{post_content.message}</div>
          </div>
        )}
        <div style={{ padding: 15 }}>
          {comments.map(comment => (
            <MessageBubble
              key={comment.id}
              content={comment}
              isAdmin={comment.from.id === pageId}
              comment
            />
          ))}

          {loading_send && <MessageBubbleLoading />}
        </div>
      </Scroll>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(ListComments);
