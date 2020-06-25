import React, { type Node } from 'react';
import { Icon } from 'antd';
import Scrollbars from 'react-custom-scrollbars';

import { useConvs } from './context';
import { Loading } from '../../components';

const ListMessages = React.lazy(() => import('./ListMessages'));
const ListComments = React.lazy(() => import('./ListComments'));

export class Scroll extends React.Component<{ children: Node }> {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    // scroll bottom
    const { current } = this.scrollRef;
    current.scrollTop(current.getScrollHeight());
  }

  componentDidUpdate() {
    // scroll bottom
    const { current } = this.scrollRef;
    current.scrollTop(current.getScrollHeight());
  }

  render() {
    const { children } = this.props;
    return (
      <Scrollbars
        style={{ flex: 1 }}
        ref={this.scrollRef}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        {children}
      </Scrollbars>
    );
  }
}

const NoCons = React.memo(() => (
  <div
    style={{
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <div style={{ fontSize: 18, textAlign: 'center', padding: '50px 15px' }}>
      <Icon
        type="inbox"
        style={{ fontSize: 50, marginBottom: 15, display: 'block' }}
      />
      Vui lòng chọn một hội thoại để thao tác.
    </div>
  </div>
));

type MessageListProps = {
  loading_send: boolean,
  selectConversation: void
};

const MessageList = ({ loading_send, setLoadingSend }: MessageListProps) => {
  const { state, selectConversation } = useConvs();
  const { conversation_select } = state;

  if (!conversation_select) return <NoCons />;

  const renderMessageList = () => {
    return (
      <Scroll>
        <React.Suspense fallback={<Loading />}>
          {conversation_select && conversation_select.type === 'comment' ? (
            <ListComments
              conversation_select={conversation_select}
              selectConversation={selectConversation}
              setLoading={setLoadingSend}
              loading_send={loading_send}
            />
          ) : (
            <ListMessages
              conversation_select={conversation_select}
              selectConversation={selectConversation}
              setLoading={setLoadingSend}
              loading_send={loading_send}
            />
          )}
        </React.Suspense>
      </Scroll>
    );
  };

  return renderMessageList();
};

export default MessageList;
