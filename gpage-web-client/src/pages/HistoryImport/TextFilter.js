import React from 'react';
import { Input } from 'antd';
import { FilterItem } from './style';

type TextFilterProps = {
  changeText: (text: string) => void,
  text: string
};

const TextFilter = ({ changeText, text }: TextFilterProps) => {
  const onChange = e => {
    changeText(e.target.value);
  };

  return (
    <FilterItem>
      <Input placeholder="Tìm theo tên" onChange={onChange} value={text} />
    </FilterItem>
  );
};

export default TextFilter;
