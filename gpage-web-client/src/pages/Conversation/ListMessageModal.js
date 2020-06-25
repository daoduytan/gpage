import React from 'react';
import { Loading } from '../../components';
import { refs } from '../../api';
import ListMessages from './ListMessages';

type ListMessageModalProps = {
  conversation_select: {
    sender: any,
    pageId: string
  }
};

type ListMessageModalState = {
  loading: boolean,
  user: any
};

class ListMessageModal extends React.Component<
  ListMessageModalProps,
  ListMessageModalState
> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null
    };
  }

  componentDidMount() {
    const { user } = this.state;
    const { conversation_select } = this.props;
    const { sender, pageId } = conversation_select;

    refs.activitysRefs
      .where('pageId', '==', pageId)
      .where('type', '==', 'message')
      .where('sender.id', '==', sender.id)
      .onSnapshot(response => {
        if (response.empty) {
          this.setState({ loading: false });
        } else if (!user || user.key !== response.docs[0].id) {
          const userRes = {
            ...response.docs[0].data(),
            key: response.docs[0].id,
            type: 'message'
          };
          this.setState({ user: userRes, loading: false });
        }
      });
  }

  render() {
    const { loading, user } = this.state;

    if (loading)
      return (
        <div style={{ position: 'relative' }}>
          <Loading />
        </div>
      );

    if (!user) return null;

    return <ListMessages conversation_select={user} />;
  }
}

export default ListMessageModal;
