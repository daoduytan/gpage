// @flow
import React from 'react';
import {
  Tooltip,
  Icon,
  Modal,
  Popover,
  Input,
  Button,
  Divider,
  Calendar
} from 'antd';
import moment from 'moment';
import queryString from 'query-string';
import { useSelector } from 'react-redux';

import menus from './sidebar_menu';
import { Sidebar } from '../../components';
import { SidebarItem } from '../../components/Sidebar/style';
import { useConvs } from './context';
import { LabelFilterStyle } from './style';
import { refs } from '../../api';
import { Item, ItemChild } from './SidebarItemFilter';

const FilterDate = ({ loading }: { loading: boolean }) => {
  const { state, handleChangeChildren } = useConvs();
  const [visible, setVisible] = React.useState(false);

  const { children } = state.filter;

  const toggle = () => setVisible(!visible);

  const selectDate = value => {
    const date = moment(value).valueOf();
    handleChangeChildren({ date });
    toggle();
  };

  const className = children.find(c => c.date) ? 'active' : null;

  return (
    <>
      <Popover
        placement="topLeft"
        // content={<DatePicker size="large" onChange={selectDate} />}
        content={
          <Calendar fullscreen={false} mode="month" onChange={selectDate} />
        }
        trigger="click"
        visible={visible}
        onVisibleChange={toggle}
      >
        <Tooltip placement="right" title="Tìm theo thời gian">
          <SidebarItem className={className} loading={loading}>
            <Icon type="table" />
          </SidebarItem>
        </Tooltip>
      </Popover>
    </>
  );
};

// label filter
type LabelFilterItemProps = {
  label: {
    text: String
  },
  active: Boolean,
  handleSelect: Function
};

const LabelFilterItem = React.memo(
  ({ label, active, handleSelect }: LabelFilterItemProps) => {
    const onClick = () => {
      handleSelect({ label: label.text });
    };

    return (
      <LabelFilterStyle onClick={onClick} role="presentation" active={active}>
        {label.text}
      </LabelFilterStyle>
    );
  }
);

const FilterLabel = ({ loading }: { loading: boolean }) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { state, handleChangeChildren } = useConvs();
  const [visible, setVisible] = React.useState(false);
  const [labels, setLabels] = React.useState([]);
  const [label_select, setLabelSelect] = React.useState(null);

  const { filter } = state;
  const { children } = filter;

  React.useEffect(() => {
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('list_labels')
        .get()
        .then(snaps => {
          if (!snaps.empty) {
            const resLabels = snaps.docs.map(doc => ({ ...doc.data() }));

            setLabels(resLabels);
          }
        });
    }
  }, [user]);

  React.useEffect(() => {
    const exits = children.find(o => o.label);
    if (exits) {
      setLabelSelect(exits);
    } else {
      setLabelSelect(null);
    }
  }, [children]);

  const toggle = () => setVisible(!visible);

  const handleSelect = label => {
    setLabelSelect(label);
  };

  const filterLabel = () => {
    handleChangeChildren(label_select);
    toggle();
  };

  const className = children.find(o => o.label) ? 'active' : null;

  return (
    <>
      <Tooltip placement="right" title="Tìm theo nhãn hội thoại">
        <SidebarItem className={className} onClick={toggle} loading={loading}>
          <Icon type="tag" />
        </SidebarItem>
      </Tooltip>

      <Modal
        width={300}
        onCancel={toggle}
        onOk={filterLabel}
        okText="Lọc"
        cancelText="Hủy"
        visible={visible}
        title="Tìm theo nhãn hội thoại"
      >
        <div style={{ marginLeft: -2, marginRigth: -2 }}>
          {labels.map(label => (
            <LabelFilterItem
              key={label.text}
              label={label}
              active={label_select && label_select.label === label.text}
              handleSelect={handleSelect}
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

// filter post id
const FilterPost = ({ loading }: { loading: boolean }) => {
  const { state, handleChangeChildren } = useConvs();
  const [visible, setVisible] = React.useState(false);
  const [url, setUrl] = React.useState('');

  const toggle = () => setVisible(!visible);
  const { filter } = state;
  const { children } = filter;

  const changeUrl = e => {
    setUrl(e.target.value);
  };

  const onCancel = () => toggle();

  const filterPostId = () => {
    const { query } = queryString.parseUrl(url);

    if (Object.keys(query).length === 0) {
      // post format posts/id
      const arr_string = url.split('/');
      const postId = arr_string[arr_string.length - 1];

      if (postId) {
        handleChangeChildren({ postId });
      }
      toggle();
    } else {
      // post format story_fbid
      const { story_fbid } = query;

      if (story_fbid) {
        handleChangeChildren({ postId: story_fbid });
      }
    }
  };

  const cancelFilterPostId = () => {
    setUrl('');
    handleChangeChildren({ postId: '' });
    toggle();
  };

  const className = children.find(o => o.postId) ? 'active' : null;

  return (
    <>
      <Tooltip placement="right" title="Tìm theo id bài viết">
        <SidebarItem className={className} onClick={toggle} loading={loading}>
          <Icon type="file-text" />
        </SidebarItem>
      </Tooltip>

      <Modal
        width={450}
        onCancel={onCancel}
        onOk={filterPostId}
        visible={visible}
        title="Tìm theo id bài viết"
        footer={null}
      >
        <div>Hướng dẫn lấy link</div> <br />
        <img
          style={{ display: 'block', width: '100%' }}
          src="https://vpage.nhanh.vn/images/guide/getlinkpost.jpg"
          alt=""
        />
        <br />
        <div>Nhập link bài viết:</div> <br />
        <div>
          <Input value={url} onChange={changeUrl} autoFocus={visible} />
        </div>
        <Divider />
        <div style={{ textAlign: 'right' }}>
          <Button
            type="danger"
            style={{ marginRight: 10 }}
            onClick={cancelFilterPostId}
          >
            Hủy
          </Button>
          <Button type="primary" onClick={filterPostId}>
            Lọc
          </Button>
        </div>
      </Modal>
    </>
  );
};

// loading={loading}

// const Delete = () => {
//   const user = useSelector(({ authReducer }) => authReducer.user);
//   const deleteCs = () => {
//     console.log(user);
//     const { facebookPages } = user;
//     facebookPages.forEach(page => {
//       refs.activitysRefs
//         .where('pageId', '==', page.id)
//         .get()
//         .then(docs => {
//           if (!docs.empty) {
//             docs.forEach(doc => {
//               // refs.activitysRefs.doc(doc.id).delete();
//               const { type } = doc.data();
//               console.log(type);
//               if (type === 'comment') {
//                 refs.activitysRefs
//                   .doc(doc.id)
//                   .collection('comments')
//                   .get()
//                   .then(docComments => {
//                     docComments.docs.forEach(comment => {
//                       refs.activitysRefs
//                         .doc(doc.id)
//                         .collection('comments')
//                         .doc(comment.id)
//                         .delete();
//                     });
//                     refs.activitysRefs.doc(doc.id).delete();
//                   });
//               } else {
//                 refs.activitysRefs
//                   .doc(doc.id)
//                   .collection('messages')
//                   .get()
//                   .then(docComments => {
//                     docComments.docs.forEach(comment => {
//                       refs.activitysRefs
//                         .doc(doc.id)
//                         .collection('messages')
//                         .doc(comment.id)
//                         .delete();
//                     });
//                     refs.activitysRefs.doc(doc.id).delete();
//                   });
//               }
//             });
//           }
//         });
//     });
//     // refs.activitysRefs.
//   };
//   return <button onClick={deleteCs}>x</button>;
// };

export default ({ loading }: { loading: boolean }) => {
  return (
    <Sidebar>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'pink',
            opacity: 0,
            cursor: 'no-drop'
          }}
        />
      )}

      {/* <Delete /> */}
      <Item reset menu={{ icon: 'sync', title: 'Bỏ lọc' }} loading={loading} />

      {menus.parent.map(menu => (
        <Item key={menu.title} menu={menu} loading={loading} />
      ))}

      {menus.chidlren.map(menu => (
        <ItemChild menu={menu} key={menu.title} loading={loading} />
      ))}

      <FilterDate />
      <FilterLabel />
      <FilterPost />
    </Sidebar>
  );
};
