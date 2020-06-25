import { navigate } from '@reach/router';
import firebase from 'firebase/app';

import { fireAuth, fireStore } from './firebase';
import { getLongToken, userFormatData } from './util';

// load user
const loadUser = () =>
  fireAuth.onAuthStateChanged(async response => {
    if (!response) return null;

    const { uid } = response;
    const ref = fireStore.collection('users').doc(uid);

    const doc = await ref.get();
    if (!doc.exists) return null;

    const user = doc.data();
    const { facebook } = user;

    if (facebook) {
      const accessToken = await getLongToken(facebook.accessToken);
      ref.update({ 'facebook.accessToken': accessToken });

      const userNew = {
        ...user,
        facebook: { ...facebook, accessToken }
      };

      return userNew;
    }

    return user;
  });

const login = () => {
  const provider = new firebase.auth.FacebookAuthProvider();

  fireAuth
    .signInWithPopup(provider)
    .then(result => {
      const { additionalUserInfo, credential, user } = result;
      const { isNewUser, profile } = additionalUserInfo;
      const { uid } = user;
      const token = credential.accessToken;

      return getLongToken(token)
        .then(async accessToken => {
          // check new user
          // if not new user, update accessToken
          const ref = fireStore.collection('users').doc(uid);

          if (!isNewUser) {
            ref.update({
              facebook: {
                id: profile.id,
                accessToken
              }
            });

            return navigate('/customer/conversation');
          }

          // if new user

          const userData = userFormatData(user);

          const data = {
            ...userData,
            type: 'customer',
            facebook: {
              id: profile.id,
              accessToken
            }
          };

          // if new user update user profile
          ref.set(data);

          return data;
        })
        .catch(error => {
          console.log('error', error);
          return null;
        });

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // const token = result.credential.accessToken;
      // // The signed-in user info.
      // const user = result.user;

      // console.log(token, user);
      // ...
    })
    .catch((error) {});
};

export default { login, loadUser };
