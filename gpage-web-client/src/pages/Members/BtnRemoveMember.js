import React from 'react';
import { Button } from 'antd';

type BtnRemoveMemberProps = { membersSelect: any, size: string };

const BtnRemoveMember = ({ membersSelect, size }: BtnRemoveMemberProps) => {
  const [loading, setLoading] = React.useState(false);

  const removeMembers = () => {
    // setLoading(true);
    // console.log(membersSelect);
  };

  const disabled = membersSelect.length === 0;

  return (
    <Button
      type="danger"
      size={size}
      disabled={disabled || loading}
      loading={loading}
      onClick={removeMembers}
    >
      Xóa thành viên
    </Button>
  );
};

export default BtnRemoveMember;
