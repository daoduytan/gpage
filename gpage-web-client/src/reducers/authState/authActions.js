import { navigate } from '@reach/router';
import firebase from 'firebase/app';
import { toNumber, replace } from 'lodash';
import moment from 'moment';

import types from './authTypes';
import { fireAuth, fireStore } from '../../api/firebase';
import { getLongToken, userFormatData } from '../../api/util';
import { refs, customerApi } from '../../api';

export const loadUserDone = user => ({
  type: types.LOAD_USER_SUCCESS,
  payload: user
});
const loadUserFailed = () => ({ type: types.LOAD_USER_FAILED });

const loadingUser = () => ({ type: types.LOADING });

const loadUser = () => dispatch => {
  dispatch(loadingUser());

  const token = localStorage.getItem('token');

  if (token) {
    // if user is login with member
    return customerApi.get_member(token).then(async res => {
      // const { user } = res.data;
      const userRes = res.data.user;

      const shopDoc = await refs.usersRefs.doc(userRes.shopId).get();

      const resShifts = await refs.usersRefs
        .doc(userRes.shopId)
        .collection('shifts')
        .get();

      const getUser = () => {
        if (!userRes.shifts || userRes.shifts.length === 0) {
          return {
            ...shopDoc.data(),
            ...userRes,
            shift: null
          };
        }

        const time_now = toNumber(
          `${moment(Date.now()).format('HH:mm')}`.replace(':', '')
        );

        const shifts_user = userRes.shifts.map(s => {
          const exist = resShifts.docs.find(s1 => {
            return s1.id === s;
          });

          return exist.data();
        });

        const shifts = shifts_user.filter(s => {
          const { start_time, end_time } = s;
          const number_start_time = toNumber(start_time.replace(':', ''));
          const number_end_time = toNumber(end_time.replace(':', ''));

          if (time_now <= number_end_time && time_now >= number_start_time) {
            return true;
          }
          return false;
        });

        // const shift = resShifts.docs.find(s => s.id === userRes.shift).data();

        const shift = shifts[0];

        if (!shift) {
          return { ...shopDoc.data(), ...userRes, shift: null };
        }

        const filter_pages = () => {
          if (!shift.pages) {
            return [];
          }

          return shift.pages.filter(page => {
            const exist = shopDoc
              .data()
              .facebookPages.find(p => p.id === page.id);

            if (exist) return true;
            return false;
          });
        };

        const facebookPages = filter_pages().map(page => {
          const exist = shopDoc
            .data()
            .facebookPages.find(p => p.id === page.id);
          return exist;
        });

        return {
          ...shopDoc.data(),
          ...userRes,
          facebookPages,
          shift: {
            ...shift,
            start_time: toNumber(replace(shift.start_time, ':', '')),
            end_time: toNumber(replace(shift.end_time, ':', ''))
          }
        };
      };

      return dispatch(loadUserDone(getUser()));
    });
  }

  return fireAuth.onAuthStateChanged(async response => {
    if (!response || response.error) return dispatch(loadUserFailed());

    const { uid } = response;
    const ref = refs.usersRefs.doc(uid);
    const doc = await ref.get();

    // if not user
    if (!doc.exists) return dispatch(loadUserFailed());

    /**
     * if has user, check role user customer
     * 1. Member
     * 2. Admin
     */

    const user = doc.data();
    const { type, role, facebook } = user;

    if (type === 'admin') {
      return dispatch(loadUserDone(user));
    }

    // if user is member
    if (role === 'member') {
      return refs.usersRefs
        .doc(user.shopId)
        .get()
        .then(docRes => {
          return dispatch(loadUserDone({ ...docRes.data(), ...user }));
        });
    }

    // if user is admin customer
    if (!facebook) return dispatch(loadUserFailed());

    const { accessToken } = facebook;

    if (!accessToken) {
      const long_token = await getLongToken(facebook.accessToken);

      if (!long_token) return dispatch(loadUserFailed());

      ref.update({ 'facebook.accessToken': long_token });

      const user_new = {
        ...user,
        facebook: { ...facebook, accessToken: long_token }
      };

      return dispatch(loadUserDone(user_new));
    }

    // check exp time token
    const { exp_date, expires_in } = accessToken;

    if (Date.now() - exp_date >= expires_in) {
      const long_token = await getLongToken(facebook.accessToken);

      if (!long_token) return dispatch(loadUserFailed());

      ref.update({ 'facebook.accessToken': long_token });

      const user_new = {
        ...user,
        facebook: { ...facebook, accessToken: long_token }
      };

      return dispatch(loadUserDone(user_new));
    }

    return dispatch(loadUserDone(user));
  });
};

/**
 * Login with facebook
 */
// const scope =
//   'publish_pages,manage_pages,pages_show_list,public_profile,email,pages_messaging,publish_to_groups';

const scope = 'publish_pages,manage_pages,pages_messaging';
const login = () => dispatch => {
  dispatch(loadingUser());

  const provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    auth_type: 'rerequest',
    auth_nonce: '{random-nonce}'
  });

  provider.addScope(scope);

  // check user login yet
  fireAuth
    // .signInWithRedirect(provider)
    .signInWithPopup(provider)
    .then(res => {
      const { additionalUserInfo, credential, user } = res;
      const { isNewUser, profile } = additionalUserInfo;
      const { uid } = user;
      const token = credential.accessToken;

      return getLongToken(token)
        .then(async accessToken => {
          const ref = fireStore.collection('users').doc(uid);
          // check new user
          // if not new user, update accessToken

          if (!isNewUser) {
            ref.update({
              facebook: {
                id: profile.id,
                accessToken
              }
            });
          } else {
            ref.set({
              facebook: {
                id: profile.id,
                accessToken
              }
            });
          }

          if (!isNewUser) {
            // ref.update({
            //   facebook: {
            //     id: profile.id,
            //     accessToken
            //   }
            // });
            return navigate('/customer/conversation');
          }

          const userData = userFormatData(user);
          const data = {
            ...userData,
            type: 'customer',
            role: 'admin',
            isLoaded: false,
            shopId: uid,
            licence: {
              type: 'trial',
              time: 15 // day
              // number_pages
            },
            facebook: {
              id: profile.id,
              accessToken
            }
          };

          // if new user update user profile
          return fireStore
            .collection('users')
            .doc(uid)
            .set(data)
            .then(() => {
              dispatch(loadUserDone(data));
              navigate('/customer/conversation');
            });
        })
        .catch(() => {
          dispatch(loadUserDone(null));
        });
    })
    .catch(() => {
      dispatch(loadUserFailed());
    });
};

const logoutSucess = () => ({ type: types.LOGOUT });

const logout = () => dispatch => {
  const token = localStorage.getItem('token');
  if (token) localStorage.removeItem('token');

  // const { authReducer } = getState();
  // const { user } = authReducer;

  fireAuth
    .signOut()
    .then(() => dispatch(logoutSucess()))
    .catch(error => console.log(error));
};

// eslint-disable-next-line
export { login, loadUser, logout };
