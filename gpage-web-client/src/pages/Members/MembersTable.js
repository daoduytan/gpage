import React from 'react';
import { Table, Input } from 'antd';
import { connect } from 'react-redux';

import { refs } from '../../api';
import BtnRemoveMember from './BtnRemoveMember';
import MembersAddBtn from './MembersAddBtn';
import columns from './columns';

const { Search } = Input;
const size = 'default';

type MembersTableProps = {
  user: {
    shopId: String
  }
};
type MembersTableState = {
  members: any,

  selectedRowKeys: any,
  textSearch: String
};

class MembersTable extends React.Component<
  MembersTableProps,
  MembersTableState
> {
  constructor(props) {
    super(props);

    this.state = {
      textSearch: '',
      members: [],
      selectedRowKeys: []
    };
  }

  componentDidMount() {
    const { user } = this.props;

    if (user) {
      refs.usersRefs
        .where('shopId', '==', user.shopId)
        .where('role', '==', 'member')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            const member = change.doc.data();

            if (change.type === 'added') {
              this.setState(prevState => ({
                members: [...prevState.members, member]
              }));
            }
            if (change.type === 'modified') {
              this.setState(prevState => {
                const members = prevState.members.map(m => {
                  if (m.uid === member.uid) return member;
                  return m;
                });

                return { members };
              });
            }
            if (change.type === 'removed') {
              this.setState(prevState => {
                const members = prevState.members.filter(
                  m => m.uid !== member.uid
                );
                return { members };
              });
            }
          });
        });
    }
  }

  onSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

  onChange = e => this.setState({ textSearch: e.target.value });

  transferData = members =>
    members.map(member => ({ ...member, key: member.uid }));

  dataSource = () => {
    const { members, textSearch } = this.state;

    if (textSearch.length === 0) return this.transferData(members);

    const members_with_name = members.filter(member => {
      const index = member.displayName.indexOf(textSearch);
      if (index >= 0) return true;

      return false;
    });

    const members_with_phone = members.filter(member => {
      if (!member.phoneNumber) return false;

      const index = member.phoneNumber.indexOf(textSearch);
      if (index >= 0) return true;

      return false;
    });

    const members_search = [...members_with_name, ...members_with_phone];

    return this.transferData(members_search);
  };

  renderBtnAddMember = () => {
    const { user } = this.props;
    const { members } = this.state;
    const members_active = members.filter(member => {
      if (typeof member.status === 'boolean' && !member.status) return false;
      return true;
    });

    const { licence } = user;

    if (
      licence.type === 'premium' &&
      licence.number_users &&
      members_active.length >= licence.number_users
    ) {
      return null;
    }

    return <MembersAddBtn size={size} />;
  };

  render() {
    const { selectedRowKeys, textSearch } = this.state;
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange
    // };

    const { members } = this.state;

    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0 20px'
          }}
        >
          <div>
            <Search
              value={textSearch}
              onChange={this.onChange}
              style={{ minWidth: 300 }}
              size={size}
              placeholder="Tìm kiếm theo tên, số điện thoại"
            />
          </div>

          <div>
            {selectedRowKeys.length > 0 && (
              <>
                <BtnRemoveMember membersSelect={selectedRowKeys} size={size} />
                <span style={{ marginLeft: 15 }} />
              </>
            )}

            {this.renderBtnAddMember()}

            {/* <MembersAddBtn size={size} /> */}
          </div>
        </div>

        <Table
          // rowSelection={rowSelection}
          columns={columns(members)}
          dataSource={this.dataSource()}
          bordered
        />
      </>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(MembersTable);
