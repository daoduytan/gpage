// status giao hang hang nhanh
const giaohangnhanh = [
  {
    value: 'ReadyToPick',
    title: 'Đã tạo đơn hàng',
    code: 101,
    type: 'giaohangnhanh'
  },
  {
    value: 'Picking',
    title: 'Đang đi lấy hàng',
    code: 102,
    type: 'giaohangnhanh'
  },
  {
    value: 'Storing',
    title: 'Đã nhận hàng và nhập kho',
    code: '201',
    type: 'giaohangnhanh'
  },
  {
    value: 'Delivering',
    title: 'Đang giao hàng',
    code: '202',
    type: 'giaohangnhanh'
  },
  {
    value: 'Delivered',
    title: 'Đã giao hàng',
    code: '203',
    type: 'giaohangnhanh'
  },
  {
    value: 'Return',
    title: 'Đơn hàng trả lại',
    code: '301',
    type: 'giaohangnhanh'
  },
  {
    value: 'Returned',
    title: 'Đơn hàng đã được trả lại cho người bán',
    code: '302',
    type: 'giaohangnhanh'
  },
  {
    value: 'WaitingToFinish',
    title: 'Đơn hàng đang xử lý',
    code: '204',
    type: 'giaohangnhanh'
  },
  {
    value: 'Finish',
    title: 'Đơn hàng đã hoàn thành',
    code: '310'
  },
  {
    value: 'Cancel',
    title: 'Đơn hàng bị hủy',
    code: '0'
  },
  {
    value: 'LostOrder',
    title: 'Đơn hàng bị thất lạc',
    code: '111',
    type: 'giaohangnhanh'
  }
];

// status giao hang tiet kiem
const giaohangtietkiem = [
  {
    value: '-1',
    title: 'Hủy đơn hàng',
    code: '-1',
    type: 'giaohangtietkiem'
  },
  {
    value: '1',
    title: 'Chưa tiếp nhận',
    code: '1',
    type: 'giaohangtietkiem'
  },
  {
    value: '2',
    title: 'Đã tiếp nhận',
    code: '2',
    type: 'giaohangtietkiem'
  },
  {
    value: '3',
    title: 'Đã lấy hàng/Đã nhập kho',
    code: '3',
    type: 'giaohangtietkiem'
  },
  {
    value: '4',
    title: 'Đã điều phối giao hàng/Đang giao hàng',
    code: '4',
    type: 'giaohangtietkiem'
  },
  {
    value: '5',
    title: 'Đã giao hàng/Chưa đối soát',
    code: '5',
    type: 'giaohangtietkiem'
  },
  {
    value: '6',
    title: 'Đã đối soát',
    code: '6',
    type: 'giaohangtietkiem'
  },
  {
    value: '7',
    title: 'Không lấy được hàng',
    code: '7',
    type: 'giaohangtietkiem'
  },
  {
    value: '8',
    title: 'Hoãn lấy hàng',
    code: '8',
    type: 'giaohangtietkiem'
  },
  {
    value: '9',
    title: 'Không giao được hàng',
    code: '9',
    type: 'giaohangtietkiem'
  },
  {
    value: '10',
    title: 'Delay giao hàng',
    code: '10',
    type: 'giaohangtietkiem'
  },
  {
    value: '11',
    title: 'Đã đối soát công nợ trả hàng',
    code: '11',
    type: 'giaohangtietkiem'
  },
  {
    value: '12',
    title: 'Đã điều phối lấy hàng/Đang lấy hàng',
    code: '12',
    type: 'giaohangtietkiem'
  },
  {
    value: '13',
    title: 'Đơn hàng bồi hoàn',
    code: '13',
    type: 'giaohangtietkiem'
  },
  {
    value: '20',
    title: 'Đang trả hàng (COD cầm hàng đi trả)',
    code: '20',
    type: 'giaohangtietkiem'
  },
  {
    value: '21',
    title: 'Đã trả hàng (COD đã trả xong hàng)',
    code: '21',
    type: 'giaohangtietkiem'
  },
  {
    value: '123',
    title: 'Shipper báo đã lấy hàng',
    code: '123',
    type: 'giaohangtietkiem'
  },
  {
    value: '127',
    title: 'Shipper (nhân viên lấy/giao hàng) báo không lấy được hàng',
    code: '127',
    type: 'giaohangtietkiem'
  },
  {
    value: '128',
    title: 'Shipper báo delay lấy hàng',
    code: '128',
    type: 'giaohangtietkiem'
  },
  {
    value: '45',
    title: 'Shipper báo đã giao hàng',
    code: '45',
    type: 'giaohangtietkiem'
  },
  {
    value: '49',
    title: 'Shipper báo không giao được giao hàng',
    code: '49',
    type: 'giaohangtietkiem'
  },
  {
    value: '410',
    title: 'Shipper báo delay giao hàng',
    code: '410',
    type: 'giaohangtietkiem'
  }
];

export { giaohangnhanh, giaohangtietkiem };
