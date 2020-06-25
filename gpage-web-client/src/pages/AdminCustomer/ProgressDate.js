import React from 'react';
import moment from 'moment';
import { Progress } from 'antd';

type ProgressDateProps = {
  customer: {
    licence: {
      start_date: number,
      time: number
    }
  }
};

const ProgressDate = ({ customer }: ProgressDateProps) => {
  const { start_date } = customer.licence;
  if (!start_date) return null;

  let percent;
  let status;

  const date = customer.licence.time || 15;
  const time = date * 24 * 60 * 60 * 1000;
  const date_expired = start_date + time;

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
      <span>{moment(start_date).format('DD/MM/YYYY')}</span>
      <div>
        <Progress
          percent={percent}
          status={status}
          showInfo={false}
          size="small"
          style={{ margin: 0 }}
        />
      </div>
      <span style={{ color: 'red' }}>
        {moment(date_expired).format('DD/MM/YYYY')}
      </span>
    </div>
  );
};

export default React.memo(ProgressDate);
