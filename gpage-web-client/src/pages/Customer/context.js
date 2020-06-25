import React, { type Node } from 'react';
import { Helmet } from 'react-helmet';

import Push from 'push.js';
import { toNumber } from 'lodash/fp';
import moment from 'moment';
import { connect } from 'react-redux';
import { Location } from '@reach/router';
import { message } from 'antd';

import * as actions from '../../reducers/authState/authActions';
import logo from '../../assets/logo2.png';
import sound from '../../assets/sound.ogg';
import constants from '../../constants';
import { refs } from '../../api';

const NotificationContext = React.createContext();

type ProviderCustomerProps = {
  children: Node,
  user: any,
  location: any,
  loadUserDone: any
};

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }), {
  loadUserDone: actions.loadUserDone
});

class ProviderContextContainer extends React.Component<ProviderCustomerProps> {
  constructor(props) {
    super(props);
    const time = moment().format('HH:mm');

    this.state = {
      timeout: false,
      notifications: [],
      conversation: null,
      time: toNumber(time.replace(':', ''))
    };

    this.audio = new Audio(sound);
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      window.Notification.requestPermission();
      this.realtimeNotification();
    }
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) {
    const { location, user, loadUserDone } = this.props;
    const { timeout } = this.state;

    // check user in shift
    if (user && user.shift) {
      const { end_time } = user.shift;

      const format_end_time = `${end_time}`.replace(/(\d{2})/, '$1:');

      const now = Date.now();
      const numberNowTime = toNumber(
        moment(now)
          .format('HH:mm')
          .replace(':', '')
      );

      const endTimeShift =
        moment(format_end_time, 'HH:mm').valueOf() + 60 * 1000;
      const formatMinute = parseInt((endTimeShift - now) / (60 * 1000), 10);
      const minute = endTimeShift - now > 0 ? formatMinute : 0;

      if (timeout === prevState.timeout) {
        if (numberNowTime < end_time) {
          if (!prevState.timeout) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ timeout: true }, () => {
              // eslint-disable-next-line react/destructuring-assignment
              if (this.state.timeout) {
                if (minute <= 15) {
                  const text = `Bạn còn ${minute} phút là hết ca`;
                  message.warning(text);
                }

                if (!user.in_shift) {
                  refs.usersRefs.doc(user.uid).update({ in_shift: true });
                  loadUserDone({ ...user, in_shift: true });
                }
              }
            });
          }
        } else if (numberNowTime > end_time) {
          if (user.in_shift) {
            refs.usersRefs.doc(user.uid).update({ in_shift: false });
            loadUserDone({ ...user, in_shift: false });
            setTimeout(() => {
              window.location.reload(true);
            }, 500);
          }
        }
      }
    }
    // end check user in shift

    const { conversation } = this.state;
    if (location.pathname !== '/customer/conversation' && conversation) {
      this.removeConversation();
    }
  }

  removeConversation = () => this.setState({ conversation: null });

  realtimeNotification = () => {
    const { user } = this.props;
    const { time } = this.state;
    const { shift } = user;

    refs.activitysRefs.onSnapshot(docSnapshot => {
      const changes = docSnapshot.docChanges();
      if (changes.length > 0) {
        changes.forEach(change => {
          const key = change.doc.id;

          const change_data = { ...change.doc.data(), key };

          const exist = this.checkExist(change_data.pageId);

          const bodyNotification = {
            body: change_data.message
              ? change_data.message.text
              : 'Thông báo mới',
            icon: logo,
            timeout: 4000
          };

          if (exist) {
            if (change.type === 'added') {
              if (user.role === 'admin') {
                if (!change_data.reply && change_data.actionType === 'new') {
                  this.play();
                }

                if (change_data && !change_data.seen) {
                  // this.setNotifications(change_data);
                  // Push.create('Thông báo', bodyNotification);
                }
              } else if (
                // user is member in shift
                user.role === 'member' &&
                shift &&
                time >= shift.start_time &&
                time <= shift.end_time
              ) {
                if (!change_data.reply && change_data.actionType === 'new') {
                  this.play();
                }

                if (change_data && !change_data.seen) {
                  // this.setNotifications(change_data.key);
                  this.setNotifications(change_data);
                  // Push.create('Thông báo', bodyNotification);
                }
              } else if (
                change_data.member &&
                change_data.member.uid === user.uid
              ) {
                // user is member not in shift

                if (!change_data.reply && change_data.actionType === 'new') {
                  this.play();
                }
                if (change_data && !change_data.seen) {
                  // this.setNotifications(change_data.key);
                  // this.setNotifications(change_data);
                  // Push.create('Thông báo', bodyNotification);
                }
              }
            } else if (change.type === 'modified') {
              const { conversation } = this.state;

              if ((conversation && conversation.key !== key) || !conversation) {
                if (!change_data.reply && !change_data.seen) {
                  if (user.role === 'admin') {
                    this.play();

                    // this.setNotifications(change_data.key);

                    this.setNotifications(change_data);

                    Push.create(constants.title, bodyNotification);
                  } else if (user.role === 'member') {
                    if (
                      shift &&
                      time >= shift.start_time &&
                      time <= shift.end_time
                    ) {
                      if (
                        !change_data.reply &&
                        change_data.actionType === 'add'
                      ) {
                        this.play();
                        if (change_data && !change_data.seen) {
                          // this.setNotifications(change_data.key);

                          this.setNotifications(change_data);
                          // Push.create('Thông báo', bodyNotification);
                        }
                      }
                    } else if (
                      change_data.member &&
                      change_data.member.uid === user.uid
                    ) {
                      if (
                        !change_data.reply &&
                        change_data.actionType === 'add'
                      ) {
                        this.play();
                        if (change_data && !change_data.seen) {
                          // this.setNotifications(change_data.key);
                          this.setNotifications(change_data);

                          Push.create('Thông báo', bodyNotification);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });
      }
    });
  };

  checkExist = pageId => {
    const { user } = this.props;
    // const { facebookPages } = user;

    const facebookPages = user.facebookPages ? user.facebookPages : [];

    const exist = facebookPages.find(page => page.id === pageId);
    if (exist) return true;

    return false;
  };

  play = () => this.audio.play();

  setNotifications = notification => {
    this.setState(prevState => {
      // const new_notifications = uniq([...prevState.notifications, key]);

      // const new_notifications = uniqBy('key', [
      //   ...prevState.notifications,
      //   notification
      // ]);

      const new_notifications = [...prevState.notifications, notification];

      return {
        notifications: new_notifications
      };
    });
  };

  removeNotification = key => {
    const { notifications } = this.state;

    if (notifications.length > 0) {
      this.setState(prevState => {
        const new_notifications = prevState.notifications.filter(
          n => n.key !== key
        );
        return {
          notifications: new_notifications
        };
      });
    }
  };

  selectConversation = conversation => {
    this.setState({ conversation });
  };

  render() {
    const { children } = this.props;
    const { notifications } = this.state;
    const number = notifications.length;

    const title =
      number === 0 ? constants.title : `(${number}) ${constants.title}`;

    const values = {
      notifications,
      setNotifications: this.setNotifications,
      selectConvs: this.selectConversation,
      removeNotification: this.removeNotification
    };

    return (
      <NotificationContext.Provider value={values}>
        <Helmet>
          <title>{title}</title>
        </Helmet>

        {children}
      </NotificationContext.Provider>
    );
  }
}

const LocationHocContext = props => {
  return (
    <Location>
      {({ location }) => {
        return <ProviderContextContainer {...props} location={location} />;
      }}
    </Location>
  );
};

const ProviderNotificationContext = enhance(LocationHocContext);

const useNotification = () => {
  const audio = new Audio(sound);
  const values = React.useContext(NotificationContext);

  const {
    notifications,
    setNotifications,
    removeNotification,
    selectConvs
  } = values;

  const play = () => audio.play();

  return {
    play,
    selectConvs,
    notifications,
    setNotifications,
    removeNotification
  };
};

export { NotificationContext, ProviderNotificationContext, useNotification };
