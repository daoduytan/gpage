// @flow
import React, { useRef, useEffect, useCallback } from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { filter } from 'lodash/fp';

import { NoteItemStyle } from '../style';
import { fireStore } from '../../../api/firebase';
import { useConvs } from '../context';

const FormItem = Form.Item;

type NoteItemProps = {
  note: {
    date: number,
    text: string
  },
  handleRemove: Function
};

const NoteItem = ({ note, handleRemove }: NoteItemProps) => {
  return (
    <NoteItemStyle key={note.date}>
      {note.text}
      <Button icon="delete" size="small" onClick={handleRemove} />
    </NoteItemStyle>
  );
};

type CustomerNoteProps = {
  form: {
    getFieldDecorator: Function,
    validateFields: Function,
    resetFields: Function
  },
  conversation: {
    key: String,
    notes: any
  }
};

const CustomerNote = ({ form }: CustomerNoteProps) => {
  const inputRef = useRef();
  const { getFieldDecorator, validateFields, resetFields } = form;
  const { state } = useConvs();
  const conversation = state.conversation_select;

  const notes = conversation.notes || [];
  const ref = fireStore.collection('user_activity').doc(conversation.key);

  const handleRemove = note => {
    const newNote = filter(n => n.date !== note.date, notes);

    ref.update({
      notes: newNote
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    validateFields((err, values) => {
      if (!err) {
        const note = {
          text: values.note,
          date: Date.now()
        };

        ref
          .update({
            notes: [...notes, note]
          })
          .then(resetFields());
      }
    });
  };

  const renderNotes = () => {
    if (!notes) return null;

    return notes.map(note => (
      <NoteItem
        key={note.date}
        note={note}
        handleRemove={() => handleRemove(note)}
      />
    ));
  };

  const focusInput = useCallback((e: any) => {
    if (e.code === 'F6') return inputRef.current.focus();

    return null;
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', focusInput);

    return () => {
      document.removeEventListener('keydown', focusInput);
    };
  }, [focusInput]);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormItem style={{ marginBottom: 10 }}>
          {getFieldDecorator('note')(
            <Input
              ref={inputRef}
              placeholder="(F6 Nhập ghi chú)"
              addonBefore={<Icon type="snippets" style={{ fontSize: 12 }} />}
            />
          )}
        </FormItem>
      </Form>

      {renderNotes()}
    </>
  );
};

export default Form.create()(CustomerNote);
