import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { find, filter } from 'lodash';

import { LabelStyle } from './style';
import { useConvs } from './context';
import { refs } from '../../api';

type LabelProps = {
  label: string,
  handleSetLabel: Function,
  callback?: boolean,
  active?: boolean
};

const Label = ({ label, callback, active, ...rest }: LabelProps) => {
  const { uid, displayName, role } = useSelector(
    ({ authReducer }) => authReducer.user
  );
  const { state } = useConvs();
  const conversation = state.conversation_select;

  const onClick = () => {
    if (!callback) return null;

    // const { pageId, sender } = conversation;
    return refs.activitysRefs
      .doc(conversation.key)
      .get()
      .then(doc => {
        if (!doc.exists) return null;

        const { labels, member } = doc.data();
        const oldLabels = labels || [];
        const isHasLabel = !!find(oldLabels, l => l.id === label.id);
        const newLabels = isHasLabel
          ? filter(oldLabels, l => l.id !== label.id)
          : [...oldLabels, { ...label, date: Date.now() }];

        // if admin of shop
        if (role === 'admin') {
          return refs.activitysRefs.doc(doc.id).update({
            actionType: 'edit',
            labels: newLabels
          });
        }

        // if member of shop
        if (role === 'member') {
          // not member support customer

          if (!member) {
            return refs.activitysRefs.doc(doc.id).update({
              actionType: 'edit',
              member: {
                uid,
                displayName
              },
              labels: newLabels
            });
          }

          // has member support customer
          if (member.uid === uid) {
            if (newLabels.length === 0)
              return refs.activitysRefs.doc(doc.id).update({
                actionType: 'edit',
                member: null,
                labels: newLabels
              });
            return refs.activitysRefs.doc(doc.id).update({
              actionType: 'edit',
              labels: newLabels
            });
          }
          return null;
        }

        return null;
      });
  };

  return (
    <LabelStyle {...rest} onClick={onClick} active={active}>
      {label.text}
    </LabelStyle>
  );
};

Label.defaultProps = {
  callback: true,
  active: false
};

export default memo(Label);
