import React from 'react';
import moment from 'moment';
import { Progress } from 'antd';

type ExpriredProps = {
  licence: {
    date_active: number,
    time: number
  }
};

const Expired = ({ licence }: ExpriredProps) => {
  if (!licence.date_active) return '"';

  let percent;
  let status;

  // const isExpried = checkExpired(date_active);
  const date = licence.time;

  const time = date * 24 * 60 * 60 * 1000;

  const date_expired = licence.date_active + time;

  if (date_expired - Date.now() > 0) {
    const time_expired = date_expired - Date.now();
    percent = (1 - time_expired / time) * 100;
    status = 'active';
  } else {
    percent = 100;
    status = 'exception';
  }

  return (
    <div style={{ fontSize: 12, fontWeight: 600 }}>
      <span>{moment(licence.date_active).format('DD/MM/YYYY')}</span>
      <div>
        <Progress
          percent={percent}
          status={status}
          showInfo={false}
          size="small"
          style={{ margin: '0', width: 70 }}
        />
      </div>
      <span style={{ color: 'red' }}>
        {moment(date_expired).format('DD/MM/YYYY')}
      </span>
    </div>
  );
};

export default React.memo(Expired);
