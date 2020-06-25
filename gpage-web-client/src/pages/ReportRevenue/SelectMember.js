import React from 'react';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { refs } from '../../api';

type SelectMemberProps = {
  selectMember: () => void,
  value: string
};

const SelectMember = ({ selectMember, value }: SelectMemberProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    if (user) {
      refs.usersRefs
        .where('shopId', '==', user.shopId)

        .get()
        .then(response => {
          if (response && !response.error) {
            const arr_members = response.docs.map(doc => doc.data());
            setMembers(arr_members);
          }
        });
    }
  }, [user]);

  return (
    <Select style={{ width: '100%' }} onChange={selectMember} value={value}>
      <Select.Option value="all">Tất cả nhân viên</Select.Option>
      {members.map(member => (
        <Select.Option key={member.uid}>{member.displayName}</Select.Option>
      ))}
    </Select>
  );
};

export default SelectMember;
