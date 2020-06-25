import React from 'react';
import { Steps } from 'antd';

import ShopSetting from './ShopSetting';
import FinishSetting from './FinishSetting';

const { Step } = Steps;

const steps = [
  { title: 'Thông tin Shop', content: <ShopSetting /> },
  { title: 'Hoàn thành', content: <FinishSetting /> }
];

const ContextFormSetting = React.createContext();

const default_current = 0;

const FormSetting = () => {
  const [current, setCurrent] = React.useState(default_current);

  const nextCurrent = () => {
    if (current + 1 < steps.length) {
      setCurrent(current + 1);
    }
  };
  const prevCurrent = () => {
    if (current > 0) {
      setCurrent(current + 1);
    }
  };

  return (
    <ContextFormSetting.Provider value={{ nextCurrent, prevCurrent }}>
      <div style={{ maxWidth: 500, margin: '30px auto' }}>
        <Steps current={current} progressDot>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div style={{ padding: 15, marginTop: 50 }}>
          {steps[current].content}
        </div>
      </div>
    </ContextFormSetting.Provider>
  );
};

export { FormSetting as default, ContextFormSetting };
