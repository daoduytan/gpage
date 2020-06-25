import { pick } from 'lodash/fp';
import axios from 'axios';
import Axios from './axios';

import constants from '../constants';

/**
 * format user data when get user
 */

const field = [
  'displayName',
  'email',
  'emailVerified',
  'phoneNumber',
  'photoURL',
  // 'ra',
  'uid'
];

const userFormatData = user => pick(field, user);

// get long token facebook

const { FB, URL_CLIENT } = constants;
const url_base = 'https://graph.facebook.com/oauth';

const getCode = async (token: string) => {
  if (!token) return null;
  const url = `${url_base}/client_code?access_token=${token}&client_secret=${FB.FACEBOOK_SECRET_KEY}&redirect_uri=${URL_CLIENT}&client_id=${FB.FACEBOOK_APP_ID}`;

  const res = await axios.get(url);
  const { code } = res.data;
  return code;
};

const getLongToken = async (token: string) => {
  try {
    const code = await getCode(token);
    console.log(code);

    if (!code) return null;

    const url = `${url_base}/access_token?code=${code}&client_id=${FB.FACEBOOK_APP_ID}&redirect_uri=${URL_CLIENT}`;

    const res = await axios.get(url);
    const { access_token } = res.data;

    console.log('res.data', res.data);

    return {
      access_token,
      expires_in: Date.now() * 30 * 24 * 60 * 60 * 1000,
      exp_date: Date.now()
    };
  } catch (error) {
    console.log(error);
  }
};

const getLongTokenFormServer = async token => {
  try {
    const res = await Axios.post('/api/facebook/long_token', {
      token
    });

    const tokenLong = getLongToken(res.data.data.access_token);

    return tokenLong;
  } catch (error) {
    return null;
  }
};

// get app access_token
const url = `https://graph.facebook.com/oauth/access_token?client_id=${FB.FACEBOOK_APP_ID}&client_secret=${FB.FACEBOOK_SECRET_KEY}&redirect_uri=${URL_CLIENT}&grant_type=client_credentials`;

const getAppAccessToken = async () => {
  const res = await axios.get(url);
  const app_access_token = res.data.access_token;
  return app_access_token;
};

export {
  getCode,
  getLongToken,
  getLongTokenFormServer,
  userFormatData,
  getAppAccessToken
};
