import React, { type Node } from 'react';
import { connect } from 'react-redux';
import { refs } from '../../api';

export const ContextStore = React.createContext();

type ProviderContextStoreProps = {
  user: {
    shopId: string
  },
  children: Node
};

type ProviderContextStoreState = {
  stores: any
};

class ProviderContextStore extends React.Component<
  ProviderContextStoreProps,
  ProviderContextStoreState
> {
  constructor(props) {
    super(props);
    this.state = { stores: [] };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('store')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.setState(prevState => ({
                stores: [
                  ...prevState.stores,
                  {
                    ...change.doc.data(),
                    id: change.doc.id,
                    key: change.doc.id
                  }
                ]
              }));
            }
            if (change.type === 'modified') {
              this.setState(prevState => {
                const newStores = prevState.stores.map(s => {
                  if (s.id === change.doc.id)
                    return {
                      ...change.doc.data(),
                      id: change.doc.id,
                      key: change.doc.id
                    };
                  return s;
                });

                return { stores: newStores };
              });
            }
            if (change.type === 'removed') {
              this.setState(prevState => {
                const newStores = prevState.stores.filter(
                  l => l.id !== change.doc.id
                );
                return { stores: newStores };
              });
            }
          });
        });
    }
  }

  render() {
    const { children } = this.props;
    const { stores } = this.state;
    const value = { stores };
    return (
      <ContextStore.Provider value={value}>{children}</ContextStore.Provider>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export const useStores = () => {
  const value = React.useContext(ContextStore);

  return { ...value };
};

export default enhance(ProviderContextStore);
