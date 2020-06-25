import axios from './axios';

export default {
  signup: data => {
    return axios({
      method: 'POST',
      url: '/api/signup',
      data
    });
  },
  create_user: data => {
    return axios({
      method: 'POST',
      url: '/api/signup',
      data
    });
  },
  login: data => {
    return axios({
      method: 'POST',
      url: '/api/signup',
      data
    });
  }
};
