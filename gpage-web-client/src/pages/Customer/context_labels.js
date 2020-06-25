import React, { type Node } from 'react';
import { connect } from 'react-redux';

import { refs } from '../../api';

export const ContextLabel = React.createContext();

type ProviderContextLabelProps = {
  children: Node,
  user: any
};

type ProviderContextLabelState = {
  labels: any
};
class ProviderContextLabel extends React.Component<
  ProviderContextLabelProps,
  ProviderContextLabelState
> {
  constructor(props) {
    super(props);
    this.state = {
      labels: []
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      const { shopId } = user;

      refs.usersRefs
        .doc(shopId)
        .collection('list_labels')
        .where('status', '==', true)
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.setState(prevState => ({
                labels: [
                  ...prevState.labels,
                  { ...change.doc.data(), id: change.doc.id }
                ]
              }));
            }
            if (change.type === 'modified') {
              this.setState(prevState => {
                const newLabels = prevState.labels.map(l => {
                  if (l.id === change.doc.id) return change.doc.data();
                  return l;
                });

                return { labels: newLabels };
              });
            }
            if (change.type === 'removed') {
              this.setState(prevState => {
                const newLabels = prevState.labels.filter(
                  l => l.id !== change.doc.id
                );
                return { labels: newLabels };
              });
            }
          });
        });
    }
  }

  render() {
    const { labels } = this.state;
    const { children } = this.props;
    return (
      <ContextLabel.Provider value={{ labels }}>
        {children}
      </ContextLabel.Provider>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(ProviderContextLabel);
