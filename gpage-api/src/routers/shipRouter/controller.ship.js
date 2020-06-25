const request = require('request');
const firebase = require('firebase-admin');
const { includes } = require('lodash');
const util = require('./util');

const db = firebase.firestore();

const shipController = {
  // get ward list with distrist giaohangnhanh
  get_ward_ghn: (req, res) => {
    const bodyJson = JSON.stringify({
      ...req.body,
      token: process.env.GIAOHANGNHANH_TOKEN,
    }); // {token , DistristID}

    return request(
      {
        url: `${process.env.GIAOHANGNHANH_SHIP_URL}/GetWards`,
        method: 'POST',
        body: bodyJson,
      },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return res.send(error);
        }

        return res.send(body);
      }
    );
  },

  get_ships: async (req, res) => {
    const { giaohangnhanh, giaohangtietkiem } = req.body;

    const a = [];

    const servicesGhn = await util.load_services_ghn(giaohangnhanh);

    servicesGhn.forEach(item => a.push(item));

    const servicesGhtk = await util.load_services_ghtk(giaohangtietkiem);
    a.push(servicesGhtk);

    return res.json({ status: true, data: a });
  },

  // create order to giaohangnhanh
  create_order_ghn: async (req, res) => {
    const response = await util.create_order.ghn(req.body);

    res.send(response);
  },

  // cancel order giaohangnhanh
  cancel_order_ghn: async (req, res) => {
    const response = await util.cancel_order.ghn({
      ...req.body,
      token: process.env.GIAOHANGNHANH_TOKEN,
    });

    res.send(response);
  },

  // create order to giaohangtietkiem
  create_order_ghtk: async (req, res) => {
    try {
      const response = await util.create_order.ghtk({
        ...req.body,
        token: process.env.GIAOHANGTIETKIEM_TOKEN,
      });

      return res.send(response);
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  // cancel order giaohangnhanh
  cancel_order_ghtk: async (req, res) => {
    try {
      const response = await util.cancel_order.ghtk({
        ...req.body,
        token: process.env.GIAOHANGTIETKIEM_TOKEN,
      });

      return res.send(response);
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },

  // giaohanhnhanh webhook
  webhook_ghn: (req, res) => {
    const { OrderCode, CurrentStatus } = req.body;

    db.collection('orders')
      .where('order_ship.OrderCode', '==', OrderCode)
      .get()
      .then(response => {
        if (!response.empty) {
          response.docs.forEach(doc => {
            const order = doc.data();

            const status_transport = [
              'Picking',
              'Storing',
              'Storing',
              'Delivering',
            ];
            const status_finish = ['Delivered', 'Finish'];

            const status = () => {
              if (includes(status_transport, CurrentStatus))
                return 'thanh_toan';
              if (includes(status_finish, CurrentStatus)) return 'thanh_toan';

              return order.status;
            };

            db.collection('orders')
              .doc(doc.id)
              .update({
                order_ship: {
                  ...order.order_ship,
                  CurrentStatus,
                },
                status: status(),
              });
          });
        }
      });

    res.send('oke');
  },
  webhook_ghtk: (req, res) => {
    const { partner_id, status_id } = req.body;

    if (partner_id) {
      const status_transport = [
        '2',
        '3',
        '4',
        '5',
        '7',
        '8',
        '9',
        '10',
        '12',
        '13',
        '20',
        '123',
        '128',
        '49',
      ];

      const status_finish = ['11', '6'];
      const status_cancel = ['21'];

      db.collection('orders')
        .doc(partner_id)
        .get()
        .then(doc => {
          if (doc.exists) {
            const order = doc.data();

            const status = () => {
              if (includes(status_transport, status_id)) return 'dang_chuyen';
              if (includes(status_finish, status_id)) return 'thanh_toan';
              if (includes(status_cancel, status_id)) return 'huy_hang';

              return order.status;
            };

            db.collection('orders')
              .doc(partner_id)
              .update({
                order_ship: {
                  ...order.order_ship,
                  status_id,
                },
                status: status(),
              });
          }
        });
    }

    return res.status(200).json({ status: true });
  },
};

module.exports = shipController;
