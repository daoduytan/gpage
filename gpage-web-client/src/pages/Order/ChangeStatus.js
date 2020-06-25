import React from 'react';
import { Select } from 'antd';
import { pick } from 'lodash';
import { useSelector } from 'react-redux';
import { refs } from '../../api';

export const options = [
  { value: 'moi', title: 'Mới', title_status: 'Tạo đơn hàng' },
  { value: 'xac_nhan', title: 'Xác nhận', title_status: 'Xác nhận đơn hàng' },
  { value: 'dong_goi', title: 'Đóng gói', title_status: 'Đang đóng gói' },
  { value: 'dang_chuyen', title: 'Đang chuyển', title_status: 'Đang chuyển' },
  { value: 'huy_hang', title: 'Hủy hàng', title_status: 'Đổi trạng thái' },
  { value: 'thanh_toan', title: 'Thanh toán', title_status: 'Thanh toán' }
];

type ChangeStatusProps = {
  order: any,
  style: any
};

const ChangeStatus = ({ order, style }: ChangeStatusProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);

  const changeStatus = status => {
    if (user) {
      const { list_order } = order;
      const refsShop = refs.usersRefs.doc(user.shopId);

      // remove product in store
      if (
        (!order.status || order.status === 'moi') &&
        (order.status === 'xac-nhan' ||
          status === 'dong_goi' ||
          status === 'dang_chuyen' ||
          status === 'thanh_toan')
      ) {
        list_order.forEach(product => {
          refsShop
            .collection('products_store')
            .where('storeId', '==', order.store.id)
            .where('productId', '==', product.id)
            .get()
            .then(snaps => {
              snaps.docs.forEach(doc => {
                const { so_luong } = doc.data();

                refsShop
                  .collection('products_store')
                  .doc(doc.id)
                  .update({
                    so_luong: so_luong - product.so_luong
                  });
              });
            });
        });
      }

      if (
        (order.status === 'thanh_toan' ||
          order.status === 'dang_chuyen' ||
          order.status === 'dong_goi' ||
          order.status === 'xac_nhan') &&
        (status === 'moi' || status === 'huy_hang')
      ) {
        list_order.forEach(product => {
          refsShop
            .collection('products_store')
            .where('storeId', '==', order.store.id)
            .where('productId', '==', product.id)
            .get()
            .then(snaps => {
              snaps.docs.forEach(doc => {
                const { so_luong } = doc.data();

                refsShop
                  .collection('products_store')
                  .doc(doc.id)
                  .update({
                    so_luong: so_luong + product.so_luong
                  });
              });
            });
        });
      }

      const history = {
        user: pick(user, ['displayName', 'shopId', 'uid']),
        time: Date.now(),
        status: {
          before: order.status || 'moi',
          after: status
        }
      };
      const orderRefs = refs.ordersRefs.doc(order.id);

      orderRefs.update({ status }).then(() => {
        orderRefs.collection('histories').add(history);
      });
    }

    // const refsShop = refs.usersRefs.doc(user.shopId);

    // refs.ordersRefs
    //   .doc(order.id)
    //   .update({
    //     status
    //   })
    //   .then(() => {
    //     const { list_order } = order;

    //     if (
    //       status === 'dong_goi' ||
    //       status === 'dang_chuyen' ||
    //       status === 'thanh_toan'
    //     ) {
    //       list_order.forEach(product => {
    //         refsShop
    //           .collection('products_store')
    //           .where('storeId', '==', order.store.id)
    //           .where('productId', '==', product.id)
    //           .get()
    //           .then(snaps => {
    //             snaps.docs.forEach(doc => {
    //               const { so_luong } = doc.data();

    //               if (
    //                 !order.status ||
    //                 order.status === 'moi' ||
    //                 order.status === 'xac_nhan'
    //               ) {
    //                 refsShop
    //                   .collection('products_store')
    //                   .doc(doc.id)
    //                   .update({
    //                     so_luong: so_luong - product.so_luong
    //                   });
    //               }
    //             });
    //           });
    //       });
    //     } else {
    //       console.log('dddddd');
    //       list_order.forEach(product => {
    //         refsShop
    //           .collection('products_store')
    //           .where('storeId', '==', order.store.id)
    //           .where('productId', '==', product.id)
    //           .get()
    //           .then(snaps => {
    //             snaps.docs.forEach(doc => {
    //               const { so_luong } = doc.data();

    //               if (
    //                 order.status === 'dong_goi' ||
    //                 order.status === 'dang_chuyen' ||
    //                 order.status === 'thanh_toan'
    //               ) {
    //                 refsShop
    //                   .collection('products_store')
    //                   .doc(doc.id)
    //                   .update({
    //                     so_luong: so_luong + product.so_luong
    //                   });
    //               }
    //             });
    //           });
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     console.log('error', error);
    //   });
  };

  return (
    <Select
      defaultValue="moi"
      value={order.status || 'moi'}
      style={style || { width: '100%' }}
      onChange={changeStatus}
    >
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.title}
        </Select.Option>
      ))}
    </Select>
  );
};

export default ChangeStatus;
