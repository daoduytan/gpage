// @flow
import React, { useState } from 'react';
import { Modal, Icon, Card, Button } from 'antd';
import moment from 'moment';
import { filter } from 'lodash/fp';

import { refs } from '../../../api';
import { useConvs } from '../context';
import { hocModalBad } from '../hocModal';

type CardBadProps = {
  bad: any
};

const CardBad = ({ bad }: CardBadProps) => {
  const { state } = useConvs();
  const conversation = state.conversation_select;
  const [loading, setLoading] = useState(false);
  const { bads, key } = conversation;

  const handleRemoveBad = () => {
    setLoading(true);
    const newBads = filter(b => b.date !== bad.date, bads);

    refs.activitysRefs
      .doc(key)
      .update({
        bads: newBads
      })
      .then(() => setLoading(false));
  };

  return (
    <Card
      loading={loading}
      key={bad.date}
      title={bad.user}
      type="inner"
      size="small"
      style={{ marginBottom: 5 }}
      extra={
        <div>
          {moment(bad.date).format('DD/MM/YYYY HH:mm')}
          <Button
            size="small"
            icon="delete"
            style={{ marginLeft: 10 }}
            onClick={handleRemoveBad}
          />
        </div>
      }
    >
      <div style={{ marginBottom: 10 }}>
        <Icon type="phone" theme="filled" /> Cảnh báo SĐT: {conversation.phone}
      </div>
      <div>
        <Icon type="message" theme="filled" /> Lý do: {bad.text}
      </div>
    </Card>
  );
};

const ListBadCustomer = ({ ...rest }) => {
  const { state } = useConvs();
  const conversation = state.conversation_select;
  const { bads } = conversation;

  const renderBads = () => {
    if (!bads || bads.length === 0) return <div>Không có thông báo xấu</div>;

    return bads.map(bad => <CardBad key={bad.date} bad={bad} />);
  };

  return (
    <Modal title="Xem các cảnh báo" {...rest} footer={null}>
      {renderBads()}
    </Modal>
  );
};

const ListBadCustomerTitle = () => {
  const { state } = useConvs();
  const conversation = state.conversation_select;
  const { bads } = conversation;
  const number = bads ? bads.length : 0;
  return (
    <div style={{ marginLeft: 15, cursor: 'pointer', color: 'orange' }}>
      {`${number} báo xấu`}
    </div>
  );
};

const ModalListBadCustomer = hocModalBad(ListBadCustomer, () => (
  <ListBadCustomerTitle />
));

export default ModalListBadCustomer;
