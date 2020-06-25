// @flow
import React, { memo } from 'react';
import { findIndex, chunk } from 'lodash/fp';

import { LabelListWrap } from './style';
import Label from './Label';
import ModalLabel from './ModalLabel';
import { useConvs } from './context';
import { ContextLabel } from '../Customer/context_labels';

// Labels
type LabelsProps = {
  labels: any
};

export const Labels = memo(({ labels }: LabelsProps) => {
  const { state } = useConvs();
  const { conversation_select } = state;

  const checkLabels = l => {
    const index = findIndex(d => d.id === l.id, conversation_select.labels);

    if (index < 0) return false;
    return true;
  };

  const listLabels = labels.map(label => {
    if (checkLabels(label)) return { ...label, active: true };
    return { ...label, active: false };
  });

  return listLabels.map(l => (
    <Label
      key={l.id}
      label={l}
      style={{ background: l.bg, color: l.color }}
      active={l.active}
    />
  ));
});

// LabelList

const LabelList = () => {
  const { labels } = React.useContext(ContextLabel);

  const chunk_arr_labels = chunk(5, labels);
  const child_labels = chunk_arr_labels.length > 0 ? chunk_arr_labels[0] : [];
  const labelsShow = child_labels.filter(label => label.status);

  return (
    <LabelListWrap
      style={{ gridTemplateColumns: `repeat(${labelsShow.length + 1}, 1fr)` }}
    >
      <Labels labels={labelsShow} />
      <ModalLabel labels={labels} />
    </LabelListWrap>
  );
};

export default LabelList;
