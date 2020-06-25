import React from 'react';

import srv1 from '../../assets/srv1.png';
import srv2 from '../../assets/srv2.png';
import srv3 from '../../assets/srv3.png';
import srv4 from '../../assets/srv4.png';
import srv5 from '../../assets/srv5.png';
import srv6 from '../../assets/srv6.png';

import aft1 from '../../assets/aft1.png';
import aft2 from '../../assets/aft2.png';
import aft3 from '../../assets/aft3.png';
import aft4 from '../../assets/aft4.png';
import aft5 from '../../assets/aft5.png';
import aft6 from '../../assets/aft6.png';

import box1 from '../../assets/box1.png';
import box2 from '../../assets/box2.png';
import box3 from '../../assets/box3.png';
import box4 from '../../assets/box4.png';
import box5 from '../../assets/box5.png';
import box6 from '../../assets/box6.png';

export default {
  banner: {
    h1: 'Phần mềm quản lý Fanpage Facebook',
    p:
      'Quản lý nhiều page cùng lúc, tập hợp tất cả các bình luận, tin nhắn. Gắn nhãn, phân nhóm tin nhắn, hỗ trợ phân luồng công việc hiệu quả.',
    button: 'Dùng thử miễn phí'
  },
  function: {
    title:
      'Tối đa hiệu quả việc kinh doanh trên Facebook với bộ công cụ mạnh mẽ',
    box_contents: [
      {
        id: '1',
        img: srv1,
        title: 'Ẩn bình luận thông minh',
        dec: 'Tự động ẩn bình luận để tránh tình trạng cướp khách.'
      },
      {
        id: '2',
        img: srv2,
        title: 'Quản lý bình luận, tin nhắn',
        dec:
          'Quản lý nhiều page cùng lúc, tập hợp tất cả các bình luận, tin nhắn. Gắn nhãn, phân nhóm tin nhắn, hỗ trợ phân luồng công việc hiệu quả.'
      },
      {
        id: '3',
        img: srv3,
        title: 'Thư viện ảnh, tin nhắn mẫu',
        dec:
          'Tạo thư viện ảnh chung, dễ dàng tìm kiếm giúp hỗ trợ nhân viên bán hàng tư vấn hiệu quả, nhanh chóng, linh hoạt.'
      },
      {
        id: '4',
        img: srv4,
        title: 'Quản lý đơn hàng, khách hàng',
        dec:
          'Tạo đơn hàng ngay tại cửa sổ hội thoại tư vấn. Quản lý khách hàng và đơn hàng khách đặt.'
      },
      {
        id: '5',
        img: srv5,
        title: 'Quản lý giao hàng',
        dec:
          'Lựa chọn hãng vận chuyển tối ưu về phí và thời gian giao hàng. Tra cứu vận đơn và đối soát thanh toán nhanh chóng, chính xác.'
      },
      {
        id: '6',
        img: srv6,
        title: 'Báo cáo',
        dec: 'Tổng hợp lượng tương tác, đơn hàng, doanh thu từ kênh Facebook.'
      }
    ]
  },

  detail_function: {
    contents: [
      {
        id: '1',
        icon: aft2,
        img: box2,
        title: 'ẨN BÌNH LUẬN THÔNG MINH',
        list: [
          'Tự động nhận diện và ẩn bình luận chứa số điện thoại để tránh tình trạng bị cướp khách.',
          'Cho phép xóa bình luận ngay tại trình quản lý.',
          'Cài đặt ẩn hiện bình luận theo nhu cầu riêng.'
        ]
      },
      {
        id: '2',
        icon: aft1,
        img: box1,
        title: 'QUẢN LÝ BÌNH LUẬN, TIN NHẮN',
        list: [
          'Quản lý nhiều page cùng lúc.',
          'Tự động thu thập tất cả tin nhắn, bình luận.',
          'Gắn tag phân chia luồng công việc, tránh trùng khách.',
          'Phân nhóm tin nhắn, bình luận chưa đọc để dễ theo dõi.',
          'Bộ lọc tin nhắn, bình luận thông minh, nhiều tiêu chí.'
        ]
      },

      {
        id: '3',
        icon: aft3,
        img: box3,
        title: 'THƯ VIỆN ẢNH, TIN NHẮN MẪU',
        list: [
          'Tạo thư viện ảnh sản phẩm chung giúp nhân viên tư vấn nhanh, xác các sản phẩm còn bán được.',
          'Tạo tin nhắn mẫu giúp nâng cao năng suất của nhân viên bán hàng.'
        ]
      },
      {
        id: '4',
        icon: aft4,
        img: box4,
        title: 'QUẢN LÝ ĐƠN HÀNG, KHÁCH HÀNG',
        list: [
          'Tự động bắt thông tin khách hàng dựa trên nội dung tin nhắn, bình luận hoặc các thông tin public của khách hàng và tạo đơn hàng ngay tại khung hội thoại.',
          'Kiểm tra độ tin cậy của khách hàng dựa trên lịch sử mua hàng.',
          'Dễ dàng truy xuất thông tin khách hàng để hỗ trợ sale, marketing.'
        ]
      },
      {
        id: '5',
        icon: aft5,
        img: box5,
        title: 'QUẢN LÝ GIAO HÀNG',
        list: [
          'Tích hợp cổng kết nối vận chuyển tới các hãng vận chuyển lớn nhất.',
          'Tự động tính phí vận chuyển, đề xuất hãng vận chuyển phù hợp nhất.',
          'Tự đồng bộ dữ liệu với phần mềm quản lý bán hàng.',
          'Dễ dàng tra cứu đối soát thanh toán.'
        ]
      },
      {
        id: '6',
        icon: aft6,
        img: box6,
        title: ' BÁO CÁO',
        list: [
          'Báo cáo số lượng bình luận, tin nhắn theo thời gian thực.',
          'Báo cáo số đơn hàng từ fanpage.',
          'Tự đồng bộ dữ liệu với phần mềm quản lý bán hàng.',
          'Báo cáo doanh thu bán hàng từ Facebook.'
        ]
      }
    ]
  },
  price: {
    title: 'BẢNG GIÁ',
    sub_title: 'Hình thức thanh toán',
    sub_content: (
      <>
        <p>Quý khách chuyển khoản tiền cước sử dụng Vpage về tài khoản:</p>
        <p>- Tài khoản ngân hàng số : 194175159</p>
        <p>
          - Ngân hàng TMCP Việt Nam Thịnh Vượng VPBank - Chi nhánh Ngô Quyền
        </p>
        <p> - Chủ tài khoản : Công ty cổ phần Nhanh.vn</p>
      </>
    )
  }
};
