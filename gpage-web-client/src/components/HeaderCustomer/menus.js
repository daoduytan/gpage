const menus = [
  {
    to: 'conversation',
    icon: 'message',
    title: 'Hội thoại'
  },
  {
    to: 'order',
    icon: 'shopping',
    title: 'Đơn hàng'
  },
  {
    to: 'order-draft',
    icon: 'copy',
    title: 'Đơn nháp'
  },
  {
    to: 'bc',
    icon: 'pie-chart',
    title: 'Báo cáo'
  },
  {
    to: 'other',
    icon: 'appstore',
    title: 'Khác',
    child: [
      {
        icon: 'setting',
        to: 'other/setting',
        title: 'Cài đặt'
      }
    ]
  }
];

export default menus;
