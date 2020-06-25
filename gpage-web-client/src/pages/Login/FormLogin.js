import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { toNumber, replace } from 'lodash';
import moment from 'moment';

import { refs, customerApi } from '../../api';
import { loadUserDone } from '../../reducers/authState/authActions';

const { Password } = Input;
const size = 'large';

type FormLoginProps = {
  form: any
};

const FormLogin = ({ form }: FormLoginProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields(async (error, values) => {
      if (!error) {
        setLoading(true);

        try {
          const res = await customerApi.login_member({
            email: values.email,
            password: values.password
          });

          const { user } = res.data;

          const doc = await refs.usersRefs.doc(user.shopId).get();

          const resShifts = await refs.usersRefs
            .doc(user.shopId)
            .collection('shifts')
            .get();

          const getUser = () => {
            const time_now = toNumber(
              `${moment(Date.now()).format('HH:mm')}`.replace(':', '')
            );

            if (!user.shifts || user.shifts.length === 0) {
              return { ...doc.data(), ...user, shift: null };
            }

            const shifts_user = user.shifts.map(s => {
              const exist = resShifts.docs.find(s1 => s1.id === s);

              return exist.data();
            });

            console.log('shifts_user', shifts_user);

            const shifts = shifts_user.filter(s => {
              const { start_time, end_time } = s;
              const number_start_time = toNumber(start_time.replace(':', ''));
              const number_end_time = toNumber(end_time.replace(':', ''));
              if (
                time_now <= number_end_time &&
                time_now >= number_start_time
              ) {
                return true;
              }
              return false;
            });

            console.log('shift', shifts);

            const shift = shifts[0];

            if (!shift) {
              return { ...doc.data(), ...user, shift: null };
            }

            // const shift = resShifts.docs.find(s => s.id === user.shift).data();

            const filter_pages = shift.pages
              ? shift.pages.filter(page => {
                  const exist = doc
                    .data()
                    .facebookPages.find(p => p.id === page.id);
                  if (exist) return true;
                  return false;
                })
              : [];

            const facebookPages = filter_pages.map(page => {
              const exist = doc
                .data()
                .facebookPages.find(p => p.id === page.id);
              return exist;
            });

            console.log({
              ...doc.data(),
              ...user,
              facebookPages,
              shift: {
                ...shift,
                start_time: toNumber(replace(shift.start_time, ':', '')),
                end_time: toNumber(replace(shift.end_time, ':', ''))
              }
            });

            return {
              ...doc.data(),
              ...user,
              facebookPages,
              shift: {
                ...shift,
                start_time: toNumber(replace(shift.start_time, ':', '')),
                end_time: toNumber(replace(shift.end_time, ':', ''))
              }
            };
          };

          localStorage.setItem('token', getUser().token);

          dispatch(loadUserDone(getUser()));
          setLoading(false);
        } catch (err) {
          console.log('err', err);
          message.error(err.response.data.message);
          setLoading(false);
        }
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [{ required: true, message: 'Điền địa chỉ email' }]
        })(<Input placeholder="Email" size={size} />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Điền mật khẩu' }]
        })(<Password placeholder="Mật khẩu" size={size} />)}
      </Form.Item>
      <Button type="primary" loading={loading} htmlType="submit" size={size}>
        Đăng nhập
      </Button>
    </Form>
  );
};

export default Form.create()(FormLogin);
