const request = require('request');

const SHIP_URL = {
  ghn: process.env.GIAOHANGNHANH_SHIP_URL,
  ghtk: process.env.GIAOHANGTIETKIEM_SHIP_URL,
};

console.log('SHIP_URL', SHIP_URL);

const create_order = {
  ghn: data =>
    new Promise((resolve, reject) => {
      request(
        {
          url: `${process.env.GIAOHANGNHANH_SHIP_URL}/CreateOrder`,
          method: 'POST',
          body: JSON.stringify({
            ...data,
            token: process.env.GIAOHANGNHANH_TOKEN,
            AffiliateID: parseInt(process.env.GIAOHANGNHANH_CLIENTID, 10),
          }),
        },
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return reject(error);
          }

          return resolve(body);
        }
      );
    }),
  ghtk: data => {
    console.log('dasdasd', data);

    const { token, order, products } = data;

    return new Promise((resolve, reject) => {
      request(
        {
          url: `${process.env.GIAOHANGTIETKIEM_SHIP_URL}/services/shipment/order/?ver=1.5`,
          headers: {
            'Content-Type': 'application/json',
            Token: token,
          },
          body: JSON.stringify({
            products,
            order,
          }),
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(body);
        }
      );
    });
  },
};

const cancel_order = {
  ghn: data =>
    new Promise((resolve, reject) => {
      request(
        {
          url: `${SHIP_URL.ghn}/CancelOrder`,
          method: 'POST',
          body: JSON.stringify({
            ...data,
          }),
        },
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return reject(error);
          }

          return resolve(body);
        }
      );
    }),
  ghtk: data => {
    const { token, label } = data;
    return new Promise((resolve, reject) => {
      request(
        {
          url: `${SHIP_URL.ghtk}/services/shipment/cancel/${label}`,
          method: 'POST',
          headers: {
            Token: token,
          },
        },
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return reject(error);
          }
          return resolve(body);
        }
      );
    });
  },
};

module.exports = {
  load_services_ghn: (
    rest //  ({ ship,...rest }) =>
  ) => {
    const { Weight, ToDistrictID, FromDistrictID } = rest;

    const bodyJson = JSON.stringify({
      Weight,
      ToDistrictID,
      FromDistrictID,
      token: process.env.GIAOHANGNHANH_TOKEN,
      // token: ship.token,
    });

    return new Promise((resolve, reject) => {
      request(
        {
          url: `${process.env.GIAOHANGNHANH_SHIP_URL}/FindAvailableServices`,
          method: 'POST',
          body: bodyJson,
        },
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return reject(error);
          }
          const { data } = JSON.parse(body);
          const ghnhData = data.map(d => ({
            ...d,
            id: 'giaohangnhanh',
            no: 1,
          }));

          return resolve([...ghnhData] || []);
        }
      );
    });
  },
  // giao hàng tiết kiệm
  load_services_ghtk: rest => {
    const url = `${process.env.GIAOHANGTIETKIEM_SHIP_URL}/services/shipment/fee?district=${rest.district}&province=${rest.province}&pick_district=${rest.pick_district}&pick_province=${rest.pick_province}&weight=${rest.weight}`;

    console.log('rest', rest);

    return new Promise((resolve, reject) => {
      request(
        {
          url: encodeURI(url),
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Token: process.env.GIAOHANGTIETKIEM_TOKEN,
            // Token: ship.token,
          },
        },
        (error, response, body) => {
          console.log('error', error);

          if (error || response.statusCode !== 200) {
            return reject(error);
          }
          // console.log('ghtk', JSON.parse(body));
          const data = {
            ...JSON.parse(body).fee,
            id: 'giaohangtietkiem',
            no: 2,
            Name: '',
            ServiceFee: JSON.parse(body).fee.fee,
            ServiceID: 'giaohangtietkiem',
          };

          return resolve(data || []);
        }
      );
    });
  },

  create_order,
  cancel_order,
};
