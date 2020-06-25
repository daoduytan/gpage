// @flow
import React from 'react';
import {
  find,
  pick,
  flatten,
  uniqBy,
  toNumber,
  sortBy,
  reverse
} from 'lodash/fp';
import moment from 'moment';
import { connect } from 'react-redux';

import { refs } from '../../api';
import { Scrollbars, Loading } from '../../components';
import * as actions from '../../reducers/authState/authActions';
import { Column } from './style';
import ConversationSearch from './ConversationSearch';
import ConversationItem from './ConversationItem';
import { ConvsContext, UPDATE_MESSAGE } from './context';
import Sidebar from './Sidebar';
import ConversationBlank from './ConversationBlank';
import util from './util';

const endpoint = `senders{name,email,address,picture},subject,is_subscribed,snippet,messages{message,sticker,attachments,created_time,shares{link,description,name,title},from},updated_time,link`;

type ConversationListProps = {
  user: {
    role: string,
    uid: string,
    init: boolean,
    play: any,
    facebook: any,
    facebookPages: any,
    shift: any,
    subscrided: boolean,
    isLoaded: boolean
  },
  loadUserDone: any
};

type ConversationListState = {
  loading: boolean,
  conversations: any,
  filterConversations: any,
  filter: any,
  search_text: string
};

class ConversationList extends React.Component<
  ConversationListProps,
  ConversationListState
> {
  // eslint-disable-next-line react/static-property-placement
  static contextType = ConvsContext;

  constructor(props, context) {
    super(props);
    const [state] = context;

    const { filter, search_text, conversation_select, pages } = state;
    const time = moment().format('HH:mm');

    this.state = {
      loading: true,
      search_text,
      conversations: [],
      filter,
      pages,
      time: toNumber(time.replace(':', '')),
      conversation_select
    };

    this.isMount = false;
  }

  componentDidMount() {
    this.isMount = true;
    const { user } = this.props;
    const { init, facebookPages } = user;

    // loading conversations from firebase
    if (init && facebookPages && facebookPages.length > 0) {
      this.loadConversation(facebookPages);
    }

    if (facebookPages && facebookPages.length > 0) {
      this.realTimeData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const [state] = this.context;
    const { filter, search_text, conversation_select, pages } = state;

    const { user } = this.props;
    const { init } = user;

    if (
      (!prevState.conversation_select && conversation_select) ||
      (conversation_select &&
        conversation_select.key !== prevState.conversation_select.key)
    ) {
      this.changeConversationSelect(conversation_select);
    }

    if (init && init !== prevProps.user.init) {
      // init here
    }

    if (prevState.filter !== filter) {
      this.reloadCoversation();
    }

    if (search_text !== prevState.search_text) {
      this.reloadSearchText(search_text);
    }

    if (prevState.pages.length !== pages.length) {
      this.setPagesFilter(pages);

      // this.filterWithPage(pages);
    }
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  // filter with pages
  setPagesFilter = pages => this.setState({ pages });

  changeConversationSelect = conversation_select => {
    this.setState({ conversation_select });
  };

  reloadSearchText = search_text => this.setState({ search_text });

  reloadCoversation = () => {
    const [state] = this.context;
    const { filter } = state;
    const { user } = this.props;
    const { facebookPages } = user;

    this.setState({ filter, conversations: [], loading: true }, () => {
      this.filterConversation(facebookPages);
    });
  };

  fillterParentRef = page => {
    const { filter } = this.state;
    const { parent } = filter;

    if (parent === 'comment') {
      return refs.activitysRefs
        .where('pageId', '==', page.id)
        .where('type', '==', 'comment')
        .orderBy('updatedTime', 'desc');
    }

    if (parent === 'message') {
      return refs.activitysRefs
        .where('pageId', '==', page.id)
        .where('type', '==', 'message')
        .orderBy('updatedTime', 'desc');
    }

    return refs.activitysRefs
      .where('pageId', '==', page.id)
      .orderBy('updatedTime', 'desc');
  };

  filterConversation = pages => {
    const { user } = this.props;
    const { time } = this.state;
    const { shift } = user;

    const { isLoaded } = user;

    // console.log('filterConversation');

    // test
    this.setState({ conversations: [] }, () => {
      const conversations = [];
      pages.forEach((page, index) => {
        this.fillterParentRef(page)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              if (
                typeof isLoaded === 'undefined' ||
                (typeof isLoaded === 'boolean' && !isLoaded)
              ) {
                this.loadMessageFromFb(page, index);
              } else {
                this.setState({ loading: false });
              }
            } else {
              snapshot.forEach(doc => {
                const c = doc.data();

                if (user.role === 'admin') {
                  conversations.push({ ...c, key: doc.id });
                } else if (
                  user.role === 'member' &&
                  shift &&
                  time >= shift.start_time &&
                  time <= shift.end_time
                ) {
                  // console.log('in ca');

                  conversations.push({ ...c, key: doc.id });
                } else if (c.member && c.member.uid === user.uid) {
                  // console.log('not ca');
                  conversations.push({ ...c, key: doc.id });
                }
              });
            }

            if (this.isMount) {
              this.setState({ loading: false, conversations });
            }
          });
      });
    });
  };

  realTimeData = () => {
    // eslint-disable-next-line no-unused-vars
    const [state, dispatch] = this.context;
    const { user } = this.props;
    const { time } = this.state;
    const { facebookPages, shift } = user;

    const checkExist = idPage => {
      const exist = facebookPages.find(page => page.id === idPage);
      if (exist) return true;

      return false;
    };

    const { filter } = this.state;
    const { parent } = filter;

    // const ref = fireStore.collection('user_activity').orderBy('updatedTime', 'desc');

    const queryParent = () => {
      if (parent === 'comment')
        return refs.activitysRefs
          .orderBy('updatedTime', 'asc')
          .where('type', '==', 'comment');

      if (parent === 'message')
        return refs.activitysRefs
          .orderBy('updatedTime', 'asc')
          .where('type', '==', 'message');

      return refs.activitysRefs.orderBy('updatedTime', 'asc');
    };

    queryParent().onSnapshot(docSnapshot => {
      const changes = docSnapshot.docChanges();

      if (changes.length > 0) {
        changes.forEach(change => {
          const c = { ...change.doc.data(), key: change.doc.id };

          if (checkExist(c.pageId)) {
            if (change.type === 'added') {
              // this.setState(prevState => {
              //   return { conversations: [c, ...prevState.conversations] };
              // });

              if (user.role === 'admin') {
                // user is admin
                this.setState(prevState => {
                  return { conversations: [c, ...prevState.conversations] };
                });

                if (!c.reply && c.actionType === 'new') {
                  // play();
                }

                if (c && !c.seen) {
                  // eslint-disable-next-line react/destructuring-assignment
                  // this.props.addNotification(c.key);
                }
              } else if (
                // user is member in shift
                user.role === 'member' &&
                shift &&
                time >= shift.start_time &&
                time <= shift.end_time
              ) {
                // console.log('in ca');

                this.setState(prevState => {
                  return { conversations: [c, ...prevState.conversations] };
                });
                if (!c.replay) {
                  // play(c);
                }
                if (c && !c.seen) {
                  // eslint-disable-next-line react/destructuring-assignment
                  // this.props.addNotification(c.key);
                }
              } else if (c.member && c.member.uid === user.uid) {
                // user is member not in shift

                // console.log('notn in ca');
                this.setState(prevState => {
                  return { conversations: [c, ...prevState.conversations] };
                });
                if (c && !c.seen) {
                  // eslint-disable-next-line react/destructuring-assignment
                  // this.props.addNotification(c.key);
                }
              }
            } else if (change.type === 'modified') {
              // console.log(
              //   'modified',
              //   change.doc.data(),
              //   change.doc.id,
              //   this.props
              // );

              this.setState(prevState => {
                const { conversation_select } = prevState;

                const conversations = prevState.conversations.map(x => {
                  if (x.key === c.key) {
                    if (
                      (conversation_select &&
                        conversation_select.key !== c.key) ||
                      !conversation_select
                    ) {
                      if (!c.reply && !c.seen) {
                        // play();
                        // eslint-disable-next-line react/destructuring-assignment
                        // this.props.addNotification(c.key);
                      }
                    }

                    if (
                      conversation_select &&
                      conversation_select.key === c.key
                    ) {
                      if (typeof c.seen === 'boolean' && c.seen === false) {
                        return c;
                      }

                      refs.activitysRefs
                        .doc(conversation_select.key)
                        .update({ seen: true });
                      return { ...c, seen: true };
                    }

                    return c;
                  }

                  return x;
                });
                return { conversations };
              });

              dispatch({
                type: UPDATE_MESSAGE,
                payload: c
              });

              refs.activitysRefs.doc();
            } else {
              // console.log('removed', change.doc.data());
              this.setState(prevState => {
                const conversations = prevState.conversations.filter(
                  x => x.key !== c.key
                );
                return { conversations };
              });
            }
          }
        });
      }

      setTimeout(() => {
        this.setState({ loading: false });
      }, 300);
    });
  };

  // load message from page
  getDataMessage = (response, page) => {
    const { data } = response;

    const array = [];

    data.forEach(d => {
      const sender = find(s => s.id !== page.id, d.senders.data);
      const updatedTime = moment(d.updated_time).valueOf();

      const item = {
        ...pick(
          ['snippet', 'link', 'updated_time', 'is_subscribed', 'id', 'message'],
          d
        ),
        sender,
        id_filter: sender.id,
        seen: true,
        updatedTime,
        type: 'message',
        pageId: page.id
      };

      array.push({ ...item });

      // refs.activitysRefs.add({ ...item }).then(res => {
      //   array.push({ ...item, key: res.id });
      // });
    });

    // console.log('array', array);

    return array;
  };

  // load comment from page
  getDataComment = async (response, page) => {
    /* test */

    const { posts } = response;

    if (posts) {
      const { data } = posts;
      const arr1 = [];

      data.forEach((d, q) => {
        const n = d.comments ? d.comments.data : [];

        const arrTest = [];

        // console.log(n);

        n.forEach(m => {
          const index = arrTest.find(a => {
            // if (!a.sender) return true;

            if (!m.from) return true;

            // console.log('m.from', a.sender, m.from);

            return a.sender.id === m.from.id;
          });

          if (!index && m.message && m.message.length > 0) {
            const a = {
              id: m.id ? m.id : null,
              sender: m.from,
              snippet: m.message,
              updated_time: m.created_time,
              updatedTime: moment(m.created_time).valueOf(),
              startDate: moment(m.created_time).valueOf(),
              pageId: page.id,
              postId: d.id,
              id_filter: `${d.id}_${m.from.id}`,
              seen: true,
              type: 'comment'
            };

            // arrTest.push(a);
            arr1.push(a);
          }
        });
        if (q === data.length - 1) {
          return arr1;
        }
      });

      return arr1;
    }

    return null;
  };

  loadMessagePage = page =>
    new Promise(resolve => {
      window.FB.api(
        `/${page.id}/conversations?fields=${endpoint}&limit=10`,

        {
          access_token: page.access_token
        },
        response => {
          if (response && !response.error) {
            // console.log(response);

            const conversations = this.getDataMessage(response, page);
            resolve(conversations || []);
          }
        }
      );
    });

  loadCommentPage = page => {
    return new Promise(resolve => {
      window.FB.api(
        `/${page.id}`,
        'GET',
        {
          access_token: page.access_token,
          fields:
            'posts{comments{comments,from,message,created_time},from,message}'
        },
        async response => {
          if (response && !response.error) {
            const conversations = await this.getDataComment(response, page);

            // console.log('conversations', conversations);

            resolve(conversations || []);
          }
        }
      );
    });
  };

  updateLoadedData = () => {
    const { user, loadUserDone } = this.props;
    if (user && !user.isLoaded) {
      refs.usersRefs
        .doc(user.shopId)
        .update({
          isLoaded: true
        })
        .then(() => {
          loadUserDone({ ...user, isLoaded: true });
        });
    }
  };

  loadMessageFromFb = (page, i) => {
    const { user } = this.props;
    const { facebookPages, shopId } = user;

    Promise.all([this.loadMessagePage(page), this.loadCommentPage(page)]).then(
      res => {
        const uniqArrData = uniqBy('id', flatten(res));

        const filterData = uniqBy('id_filter', reverse(uniqArrData));

        const arrData = sortBy(['updatedTime'], filterData);

        // console.log('arrData', reverse(arrData), filterData);

        if (arrData.length === 0) {
          this.setState({ loading: false }, () => {
            this.updateLoadedData();
          });
        } else {
          arrData.forEach((a, index) => {
            window.FB.api(
              `/${a.sender.id}`,
              {
                access_token: page.access_token,
                fields: 'name,picture'
              },
              response => {
                if (response && !response.error) {
                  refs.activitysRefs.add({
                    ...a,
                    sender: { ...response, ...a.senders, update: true }
                  });
                }

                if (index === arrData.length - 1) {
                  this.setState({ loading: false });
                  this.updateLoadedData();
                }
              }
            );
          });
        }
        // update page is loaded
        const newFacebookPages = facebookPages.map(p => {
          if (p.id === page.id) return { ...page, isLoaded: true };

          return p;
        });
        refs.usersRefs.doc(shopId).update({ facebookPages: newFacebookPages });

        // disable loading

        setTimeout(() => {}, 300);
      }
    );
  };

  loadConversation = pages => {
    if (pages.length === 0) {
      this.setState({ loading: false });
    } else {
      pages.forEach((page, index) => {
        this.getList(page, index);
      });
    }
  };

  getList = async (page, index) => {
    const { isLoaded } = page;

    if (
      typeof isLoaded === 'undefined' ||
      (typeof isLoaded === 'boolean' && !isLoaded)
    ) {
      try {
        const snapshot = await this.fillterParentRef(page).get();

        if (snapshot.empty) return this.loadMessageFromFb(page, index);

        return null;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  // check exits filter children
  exitsChildrenFilter = filter_type => {
    const { filter } = this.state;
    const { children } = filter;

    return !!children.find(c => c === filter_type);
  };

  existFilterDate = () => {
    const { filter } = this.state;
    const { children } = filter;
    return children.find(c => c.date);
  };

  existFilterLabel = () => {
    const { filter } = this.state;
    const { children } = filter;
    return children.find(c => c.label);
  };

  existFilterPost = () => {
    const { filter } = this.state;
    const { children } = filter;
    return children.find(c => c.postId);
  };

  filterConsWithPages = (con, pages) => {
    // console.log(con, pages);
    const exist = pages.find(p => p.id === con.pageId);

    if (exist) return true;

    return false;
  };

  // filetr
  filter = () => {
    const { user } = this.props;
    const { search_text, conversations, pages } = this.state;
    let arr = conversations;

    if (pages.length > 0) {
      arr = conversations.filter(con => this.filterConsWithPages(con, pages));
    }

    if (search_text.length > 0) {
      const arrName = conversations.filter(c => c.sender.name === search_text);
      const arrPhone = conversations.filter(c => c.phone === search_text);

      arr = [...arrName, ...arrPhone];
    }

    if (user.role === 'member') {
      arr = arr.filter(c => {
        if (!c.member) return true;
        if (c.member && c.member.uid === user.uid) return true;
        return false;
      });
    }

    if (this.exitsChildrenFilter('not_read')) {
      arr = arr.filter(a => !a.seen);
    }
    if (this.exitsChildrenFilter('has_phone')) {
      arr = arr.filter(a => a.phone);
    }
    if (this.exitsChildrenFilter('not_phone')) {
      arr = arr.filter(a => !a.phone);
    }
    if (this.exitsChildrenFilter('not_answer')) {
      arr = arr.filter(a => !a.reply);
    }

    const filterDate = this.existFilterDate();

    if (filterDate) {
      arr = arr.filter(a => {
        return (
          moment(a.updatedTime).format('DD/MM/YYYY') ===
          moment(filterDate.date).format('DD/MM/YYYY')
        );
      });
    }

    const filterLabel = this.existFilterLabel();

    if (filterLabel) {
      arr = arr.filter(a => {
        const { labels } = a;

        if (!labels) return false;

        const exits = !!labels.find(l => l.text === filterLabel.label);
        if (exits) return true;
        return false;
      });
    }

    const filterPost = this.existFilterPost();

    if (filterPost) {
      arr = arr.filter(a => {
        const { postId } = a;
        if (!postId) return false;

        const exits = postId.includes(filterPost.postId);
        if (exits) return true;
        return false;
      });
    }

    return arr;
  };

  handleResetSearch = () => {
    const [state] = this.context;
    const { search_text } = state;
    this.setState({ search_text });
  };

  renderContent = () => {
    const { loading } = this.state;

    if (loading)
      return (
        <div style={{ flex: 1, position: 'relative' }}>
          <Loading />
        </div>
      );

    const filterCons = this.filter();

    const sortCons = filterCons.sort(util.compare);

    if (sortCons.length === 0)
      return (
        <Column border>
          <ConversationBlank />
        </Column>
      );

    return (
      <Scrollbars>
        {sortCons.map(conversation => (
          <ConversationItem
            key={`${conversation.key}`}
            conversation={conversation}
          />
        ))}
      </Scrollbars>
    );
  };

  render() {
    const { loading } = this.state;
    const { user } = this.props;

    if (typeof user.subscrided === 'boolean' && !user.subscrided) {
      return (
        <Column border>
          <ConversationBlank />
        </Column>
      );
    }

    return (
      <Column border>
        <div style={{ display: 'flex', height: 'calc(100vh - 50)' }}>
          <div style={{ width: 50 }}>
            <Sidebar
              filterRead={this.filterRead}
              handleReset={this.handleResetSearch}
              loading={loading}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="columnTop">
              <ConversationSearch />
            </div>

            {this.renderContent()}
          </div>
        </div>
      </Column>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }), {
  loadUserDone: actions.loadUserDone
});

export default enhance(ConversationList);
