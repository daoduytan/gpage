import React from 'react';
import { refs } from '../../api';

const useCustomer = id => {
  const [loading, setLoading] = React.useState(true);
  const [customer, setCustomer] = React.useState(null);
  const ref = React.useRef(false);

  React.useEffect(() => {
    ref.current = true;

    if (id) {
      refs.usersRefs.doc(id).onSnapshot(doc => {
        if (doc.exists) {
          setCustomer({ ...doc.data() });
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      ref.current = false;
    };
  }, [id]);

  return {
    loading,
    customer
  };
};

// get pages
const usePages = id => {
  const [loading, setLoading] = React.useState(true);
  const [pages, setPages] = React.useState([]);
  const ref = React.useRef(false);

  React.useEffect(() => {
    ref.current = true;
    if (id) {
      refs.usersRefs
        .doc(id)
        .collection('pages_actived')
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            setLoading(false);
          } else {
            const arrPages = snapshot.docs.map(doc => ({
              ...doc.data(),
              key: doc.id
            }));
            if (ref.current) {
              setPages(arrPages);
              setLoading(false);
            }
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return {
    loading,
    pages
  };
};

// modal
const useModal = () => {
  const [visible, setVisible] = React.useState(false);

  const toggle = () => setVisible(!visible);

  return {
    visible,
    toggle
  };
};

const useServices = () => {
  const [loading, setLoading] = React.useState(true);
  const [services, setServices] = React.useState([]);
  const ref = React.useRef(false);

  React.useEffect(() => {
    ref.current = true;
    refs.servicesRefs
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          setLoading(false);
        } else {
          const arrServices = snapshot.docs.map(doc => ({
            ...doc.data(),

            key: doc.id
          }));
          if (ref.current) {
            setServices(arrServices);
            setLoading(false);
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      ref.current = false;
    };
  }, []);

  return {
    loading,
    services
  };
};

export { useCustomer, usePages, useModal, useServices };
