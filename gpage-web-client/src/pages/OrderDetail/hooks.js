import React from 'react';
import { refs } from '../../api';

const useOrder = ({ id, user }) => {
  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    const loadOrder = () => {
      if (!user || !id) return null;

      return refs.ordersRefs
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            setLoading(false);
            setOrder({ ...doc.data(), id: doc.id });
          } else {
            setLoading(false);
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    };
    loadOrder();
  }, [id, user]);

  return {
    loading,
    order
  };
};

export default useOrder;
