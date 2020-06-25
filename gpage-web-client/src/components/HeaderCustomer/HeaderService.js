import React from 'react';
import { Icon } from 'antd';

import { refs } from '../../api';
import ProgressDate from '../../pages/AdminCustomer/ProgressDate';

type HeaderServiceProps = {
  user: {
    licence: {
      service_id: string
    }
  }
};

const HeaderService = ({ user }: HeaderServiceProps) => {
  const [loading, setLoading] = React.useState(true);
  const [service, setService] = React.useState(null);

  React.useEffect(() => {
    if (user.licence.service_id) {
      setLoading(true);
      refs.servicesRefs.get().then(res => {
        const services = res.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const service_select = services.find(
          s => s.id === user.licence.service_id
        );

        setService(service_select);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user.licence.service_id]);

  if (loading) return <Icon type="loading" />;

  const renderNameService = service && (
    <div style={{ margin: '10px 0', fontWeight: 600 }}>{service.name}</div>
  );

  return (
    <div style={{ textAlign: 'center' }}>
      {renderNameService}

      <div>
        <small style={{ color: 'blue' }}>Hạn sử dụng</small>
        <ProgressDate customer={user} />
      </div>
    </div>
  );
};

export default React.memo(HeaderService);
