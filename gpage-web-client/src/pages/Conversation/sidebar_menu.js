export default {
  parent: [
    // { icon: 'sync', title: 'Bỏ lọc', handle: () => {} },
    {
      icon: 'home',
      title: 'Tất cả hội thoại',

      active: 'all'
    },
    {
      icon: 'message',
      title: 'Bình luận',

      active: 'comment'
    },
    { icon: 'mail', title: 'Tin nhắn', active: 'message' }
  ],
  chidlren: [
    {
      icon: 'eye-invisible',
      title: 'Tin chưa đọc',
      active: 'not_read'
    },
    {
      icon: 'phone',
      title: 'Tìm có số điện thoại',
      active: 'has_phone'
    },
    {
      icon: 'mobile',
      title: 'Tìm không có số điện thoại',
      active: 'not_phone'
    },
    {
      icon: 'shake',
      title: 'Tìm chưa trả lời',
      active: 'not_answer'
    }
    // {
    //   icon: 'table',
    //   title: 'Tìm theo thời gian',
    //   active: 'time'
    // },
    // {
    //   icon: 'tag',
    //   title: 'Tìm theo nhãn hội thoại',
    //   active: 'label'
    // },
    // {
    //   icon: 'file-text',
    //   title: 'Tìm theo id bài viết',
    //   active: 'id'
    // }
  ]
};
