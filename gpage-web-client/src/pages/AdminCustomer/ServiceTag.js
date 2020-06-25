import React from 'react';
import { Tag } from 'antd';

import theme from '../../theme';

type ServiceTagProps = {
  licence: {
    service_id: string,
    type: string
  },
  services: any
};

const ServiceTag = ({ licence, services }: ServiceTagProps) => {
  if (licence.type === 'trial') return '"';
  const service = services.find(s => s.key === licence.service_id);
  if (!service) return '"';

  return <Tag color={theme.color.primary}>{service.name}</Tag>;
};

export default React.memo(ServiceTag);
