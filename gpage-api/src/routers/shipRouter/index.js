// const request = require('request');
const shipController = require('./controller.ship');

const shipRouter = app => {
  // get ward list with distrist giaohangnhanh
  app.post('/api/ship/ghn/ward', shipController.get_ward_ghn);
  // get ships
  app.post('/api/ship/services', shipController.get_ships);

  // create order to giaohangnhanh
  app.post('/api/ship/create_order/ghn', shipController.create_order_ghn);

  // cancel order giaohangnhanh
  app.post('/api/ship/cancel_order/ghn', shipController.cancel_order_ghn);

  // create order to giaohangtietkiem
  app.post('/api/ship/create_order/ghtk', shipController.create_order_ghtk);
  // cancel order giaohangnhanh
  app.post('/api/ship/cancel_order/ghtk', shipController.cancel_order_ghtk);

  // webhook giaohangnhanh
  app.post('/ghn/webhook', shipController.webhook_ghn);

  // webhook giaohangtietkiem
  app.post('/updateShipment', shipController.webhook_ghtk);
};

module.exports = shipRouter;
