import axios from './axios';

export default {
  findAvailableServices: data =>
    axios({
      method: 'POST',
      url: `/api/ship/services`,
      data
    }),
  getWardsGhn: data =>
    axios({
      method: 'POST',
      url: `/api/ship/ghn/ward`,
      data
    }),
  // create order ghn
  createOrderGhn: data =>
    axios({
      method: 'POST',
      url: `/api/ship/create_order/ghn`,
      data
    }),

  // cancel order ghn
  cancelOrderGhn: data =>
    axios({
      method: 'POST',
      url: `/api/ship/cancel_order/ghn`,
      data
    }),

  // create order ghtk
  createOrderGhtk: data =>
    axios({
      method: 'POST',
      url: `/api/ship/create_order/ghtk`,
      data
    }),
  // cancel order ghtk
  cancelOrderGhtk: data =>
    axios({
      method: 'POST',
      url: `/api/ship/cancel_order/ghtk`,
      data
    })
};
