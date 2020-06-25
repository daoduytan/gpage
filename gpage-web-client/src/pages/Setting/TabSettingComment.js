import React from 'react';
import { Select, Divider, Switch } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import { refs } from '../../api';
import { loadUserDone } from '../../reducers/authState/authActions';

import FormSettingKeyWord from './FormSettingKeyword';
import { TabContentWrap, ListSetting } from './style';

const TabSettingComment = () => {
  const [loading, setLoading] = React.useState(false);
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();
  const { facebookPages } = user;

  const [page_select, setPageSelect] = React.useState(() => {
    if (facebookPages.length === 0) return null;
    return facebookPages[0];
  });

  const handleSelectPage = idPage => {
    const page = facebookPages.find(p => p.id === idPage);
    if (!page) return null;
    return setPageSelect(page);
  };

  // toggle hide phone
  const settingHideCommentPhone = value => {
    const new_page_select = { ...page_select, hide_phone: value };
    setPageSelect(new_page_select);

    const new_facebookPages = facebookPages.map(page => {
      if (page.id === page_select.id) return new_page_select;
      return page;
    });

    refs.usersRefs.doc(user.shopId).update({
      facebookPages: new_facebookPages
    });
    dispatch(loadUserDone({ ...user, facebookPages: new_facebookPages }));

    refs.pageHideRefs.doc(page_select.id).set({ ...new_page_select });
  };

  // toggle hide email
  const settingHideCommentEmail = value => {
    const new_page_select = { ...page_select, hide_email: value };
    setPageSelect(new_page_select);

    const new_facebookPages = facebookPages.map(page => {
      if (page.id === page_select.id) return new_page_select;
      return page;
    });

    refs.usersRefs.doc(user.shopId).update({
      facebookPages: new_facebookPages
    });
    dispatch(loadUserDone({ ...user, facebookPages: new_facebookPages }));

    refs.pageHideRefs.doc(page_select.id).set({ ...new_page_select });
  };

  // add text blacklist
  const addTextBlacklist = value => {
    setLoading(true);
    const new_page_select = { ...page_select, blacklist: value };

    setPageSelect(new_page_select);

    const new_facebookPages = facebookPages.map(page => {
      if (page.id === page_select.id) return new_page_select;
      return page;
    });

    const arrBlacklist = value
      .split(',')
      .filter(w => {
        if (w.trim().length === 0) return false;
        return true;
      })
      .map(w => w.trim());

    const new_page_select1 = {
      ...new_page_select,
      blacklist: arrBlacklist
    };

    refs.usersRefs
      .doc(user.shopId)
      .update({
        facebookPages: new_facebookPages
      })
      .then(() => {
        dispatch(loadUserDone({ ...user, facebookPages: new_facebookPages }));

        refs.pageHideRefs
          .doc(page_select.id)
          .set({ ...new_page_select1 })
          .then(() => {
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  };

  if (!user) return null;

  if (facebookPages.length === 0) return 'Khong co page';

  return (
    <TabContentWrap>
      <Select
        defaultValue={page_select.id}
        onChange={handleSelectPage}
        style={{ minWidth: 150 }}
      >
        {facebookPages.map(page => {
          return (
            <Select.Option key={page.id} value={page.id}>
              {page.name}
            </Select.Option>
          );
        })}
      </Select>

      <Divider />

      <ListSetting>
        <h3>Cài đặt tự động ẩn bình luận</h3>
        <div className="item">
          <div className="row">
            <Switch
              checked={!!page_select.hide_phone}
              onChange={settingHideCommentPhone}
            />{' '}
            <span>Ẩn những bình luận chứa số điện thoại</span>
          </div>
          <div className="row">
            <Switch
              checked={!!page_select.hide_email}
              onChange={settingHideCommentEmail}
            />{' '}
            <span>Ẩn những bình luận chứa email</span>
          </div>
        </div>

        <h3>Cài đặt ẩn bình luận theo từ khóa</h3>

        <div className="item">
          <FormSettingKeyWord
            blacklist={
              page_select && page_select.blacklist ? page_select.blacklist : ''
            }
            addTextBlacklist={addTextBlacklist}
            loading={loading}
          />
        </div>
      </ListSetting>
    </TabContentWrap>
  );
};

export default TabSettingComment;
