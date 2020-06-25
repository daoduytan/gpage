import React, { type Node } from 'react';
import { connect } from 'react-redux';

import { refs } from '../../api';

const ContextSuppliers = React.createContext();

type ProviderContextSuppliersProps = {
  children: Node,
  user: { shopId: string }
};

type ProviderContextSuppliersState = {
  suppliers: any
};

class ProviderContextSuppliers extends React.Component<
  ProviderContextSuppliersProps,
  ProviderContextSuppliersState
> {
  constructor(props) {
    super(props);

    this.state = {
      suppliers: []
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('supplier')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.setState(prevState => ({
                suppliers: [
                  ...prevState.suppliers,
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
                const newSuppliers = prevState.suppliers.map(s => {
                  if (s.id === change.doc.id)
                    return {
                      ...change.doc.data(),
                      id: change.doc.id,
                      key: change.doc.id
                    };
                  return s;
                });

                return { suppliers: newSuppliers };
              });
            }
            if (change.type === 'removed') {
              this.setState(prevState => {
                const newSuppliers = prevState.suppliers.filter(
                  l => l.id !== change.doc.id
                );
                return { suppliers: newSuppliers };
              });
            }
          });
        });
    }
  }

  render() {
    const { children } = this.props;
    const { suppliers } = this.state;

    console.log('dasdasdas', suppliers);

    const value = { suppliers };

    return (
      <ContextSuppliers.Provider value={value}>
        {children}
      </ContextSuppliers.Provider>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export const useSuppliers = () => {
  const value = React.useContext(ContextSuppliers);
  return { ...value };
};

export default enhance(ProviderContextSuppliers);
