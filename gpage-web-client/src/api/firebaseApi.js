import axios from './axios';

export default {
  delete_conversation: data => {
    return axios({
      method: 'DELETE',
      url: `/api/delete_conversation`,
      data
    });
  }
};
