import React from 'react';
import { useSelector } from 'react-redux';
import { Select } from 'antd';
import { navigate } from '@reach/router';

import { BaseLayout } from '../../layout';
import { TitlePage, ContentPage } from '../../layout/style';
import { Scrollbars, Loading } from '../../components';
import { refs } from '../../api';
import TableProductStore from './TableProductStore';

type StoreDetailProps = { id: string };

const StoreDetail = ({ id }: StoreDetailProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(true);
  const [stores, setStores] = React.useState([]);

  React.useEffect(() => {
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('store')
        .get()
        .then(snapshot => {
          const arr = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setStores(arr);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [user]);

  const changeStore = value => {
    navigate(`${value}`);
  };

  if (loading)
    return (
      <div style={{ position: 'relative', height: 100 }}>
        <Loading />
      </div>
    );

  const store = stores.find(s => s.id === id);

  if (!store)
    return (
      <div style={{ padding: '50px 15px', textAlign: 'center' }}>
        Kho không tồn tại
      </div>
    );

  return (
    <BaseLayout>
      <TitlePage>
        <Select defaultValue={id} onChange={changeStore} style={{ width: 200 }}>
          {stores.map(s => (
            <Select.Option key={s.id}>{s.ten}</Select.Option>
          ))}
        </Select>
      </TitlePage>
      <ContentPage>
        <Scrollbars style={{ height: 'calc(100vh - 100px)' }}>
          <TableProductStore storeId={id} />
        </Scrollbars>
      </ContentPage>
    </BaseLayout>
  );
};

export default StoreDetail;
