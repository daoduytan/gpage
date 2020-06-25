import axios from './axios';

export default {
  get_member: token => {
    return axios({
      method: 'GET',
      url: `/api/get_member`,
      headers: { Authorization: `bearer ${token}` }
    });
  },
  login_member: data => {
    return axios({
      method: 'POST',
      url: `/api/login_member`,

      data
    });
  },
  create_member: data => {
    return axios({
      method: 'POST',
      url: `/api/create_member`,

      data
    });
  },
  delete_member: data =>
    axios({
      method: 'DELETE',
      url: `/api/delete_member`,
      data
    })
};
