import React from 'react';
import { message } from 'antd';

import { Loading } from '../../components';
import { refs } from '../../api';
import FormCalculate from './FormCalculate';
import Services from './Services';

const useServices = () => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    refs.servicesRefs
      .orderBy('stt', 'asc')
      .where('status', '==', true)

      .get()
      .then(response => {
        const arr = response.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setServices(arr);
        setLoading(false);
      })
      .catch(error => {
        console.log('error', error);
        message.error('Có lỗi xảy ra');
        setLoading(false);
      });
  }, []);

  return {
    loading,
    services
  };
};

const TablePrice = () => {
  const { loading, services } = useServices();
  const [service_select, setServiceSelect] = React.useState(services[0]);

  const selectService = service => setServiceSelect(service);

  if (loading) return <Loading />;
  if (services.length === 0) return null;

  return (
    <div className="table-price">
      <Services services={services} selectService={selectService} />
      <FormCalculate services={services} service_select={service_select} />
    </div>
  );
};

export default TablePrice;
