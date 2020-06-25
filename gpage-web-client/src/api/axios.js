import axios from 'axios';
import constants from '../constants';

export default axios.create({
  // baseURL: 'http://localhost:5000/'
  baseURL: constants.URL_API
});
