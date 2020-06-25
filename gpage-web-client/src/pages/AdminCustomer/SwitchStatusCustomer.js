import React from 'react';
import { Switch } from 'antd';

import { refs } from '../../api';
import { getAppAccessToken } from '../../api/util';

type SwitchStatusCustomerProps = {
  customer?: {
    status: boolean,
    shopId: string,
    facebookPages: any
  }
};

const SwitchStatusCustomer = ({ customer }: SwitchStatusCustomerProps) => {
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    if (customer) {
      const { status } = customer;
      if (typeof status === 'undefined') {
        setChecked(true);
      } else {
        setChecked(status);
      }

      setLoading(false);
    }
  }, [customer]);

  if (!customer) return '"';

  const { shopId, facebookPages } = customer;

  const changeStatusCustomer = value => {
    setLoading(true);

    const subscrided = value ? 're_enabled' : 'disabled';

    refs.usersRefs
      .doc(shopId)
      .update({ status: value, subscrided })
      .then(async () => {
        setLoading(false);
        try {
          const app_access_token = await getAppAccessToken();

          if (!value) {
            facebookPages.forEach(page => {
              window.FB.api(
                `/${page.id}/subscribed_apps`,
                'DELETE',
                {
                  access_token: app_access_token
                },
                response => {
                  console.log('response', response);
                }
              );
            });
          }
          setChecked(value);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      });
  };

  return (
    <Switch
      size="small"
      checked={checked}
      loading={loading}
      onChange={changeStatusCustomer}
    />
  );
};

SwitchStatusCustomer.defaultProps = {
  customer: {
    status: true
  }
};

export default React.memo(SwitchStatusCustomer);
