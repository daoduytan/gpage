import React from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { refs } from '../../api';

type SelectShiftProps = { user: any, member: any };
type SelectShiftState = { shifts: any };

class SelectShift extends React.Component<SelectShiftProps, SelectShiftState> {
  constructor(props) {
    super(props);

    this.state = {
      shifts: []
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      refs.usersRefs
        .doc(user.shopId)
        .collection('shifts')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.setState(prevState => ({
                shifts: [
                  ...prevState.shifts,
                  { ...change.doc.data(), id: change.doc.id }
                ]
              }));
            }
            if (change.type === 'modified') {
              this.setState(prevState => {
                const newShifts = prevState.shifts.map(s => {
                  if (s.id === change.doc.id) return change.doc.data();
                  return s;
                });

                return { shifts: newShifts };
              });
            }
            if (change.type === 'removed') {
              this.setState(prevState => {
                const newShifts = prevState.shifts.filter(
                  s => s.id !== change.doc.id
                );
                return { shifts: newShifts };
              });
            }
          });
        });
    }
  }

  onChangeShift = shiftId => {
    const { member } = this.props;

    refs.usersRefs
      .doc(member.uid)
      .update({ shifts: shiftId })
      .then(res => console.log(res))
      .catch(error => console.log(error));
  };

  render() {
    const { shifts } = this.state;
    const { member } = this.props;

    return (
      <Select
        mode="multiple"
        defaultValue={member.shifts || []}
        style={{ width: '100%' }}
        onChange={this.onChangeShift}
      >
        {shifts.map(s => (
          <Select.Option key={s.id} value={s.id}>
            {s.name}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(SelectShift);
