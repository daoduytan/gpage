import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, message } from 'antd';

import { refs } from '../../api';

type ChangeStatusMemberProps = {
  member: {
    status: boolean,
    uid: string
  },
  members: any
};

const ChangeStatusMember = ({ member, members }: ChangeStatusMemberProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { status } = member;
  const checked = !!(typeof status === 'undefined' || status);

  const changeStatus = value => {
    const members_active = members.filter(m => m.status);

    if (
      value &&
      user.licence.type === 'premium' &&
      user.licence.number_users <= members_active.length
    ) {
      message.error('Đã đủ thành viên');
    } else {
      refs.usersRefs.doc(member.uid).update({ status: value });
    }
  };

  return <Switch checked={checked} onChange={changeStatus} />;
};

export default React.memo(ChangeStatusMember);
