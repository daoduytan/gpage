const menu_other = [
  { icon: 'team', to: 'other/members', title: 'Nhân viên' },
  { icon: 'user', to: 'other/customer', title: 'Khách hàng' },
  { icon: 'setting', to: 'other/setting', title: 'Cài đặt' }
];

const menu_report = [
  { icon: 'message', to: 'report/conversation', title: 'Tương tác' },
  { icon: 'tag', to: 'report/label', title: 'Nhãn hội thoại' },
  { icon: 'dollar', to: 'report/revenue', title: 'Doanh thu' }
];

const menu_product = [
  { icon: 'appstore', to: 'products/product-manager', title: 'Sản phẩm' },
  { icon: 'shop', to: 'products/store-manager', title: 'Kho hàng' },
  { icon: 'snippets', to: 'products/supplier-manager', title: 'Nhà cung cấp' },
  { icon: 'history', to: 'products/history', title: 'Lịch sử nhập hàng' }
];

const menuCustomer = [
  { to: 'conversation', icon: 'message', title: 'Hội thoại' },
  { to: 'order', icon: 'shopping', title: 'Đơn hàng' },
  { to: 'products', icon: 'shop', title: 'Sản phẩm', child: menu_product },
  { to: 'report', icon: 'pie-chart', title: 'Báo cáo', child: menu_report },
  { to: 'other', icon: 'appstore', title: 'Khác', child: menu_other }
];

export { menuCustomer, menu_other, menu_report, menu_product };
