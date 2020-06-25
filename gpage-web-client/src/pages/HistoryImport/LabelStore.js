import React from 'react';
import { useStores } from '../Customer/context_store';

type LabelStoreProps = {
  storeId: string
};

const LabelStore = ({ storeId }: LabelStoreProps) => {
  const { stores } = useStores();

  if (!storeId) return '"';

  const store = stores.find(s => s.id === storeId);

  if (!store) return '"';

  return <div>{store.ten}</div>;
};

export default React.memo(LabelStore);
