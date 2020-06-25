// @flow
import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Checkbox, message } from 'antd';
import { navigate, Link } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { map, find, pick } from 'lodash/fp';
import moment from 'moment';

import authTypes from '../../reducers/authState/authTypes';
import { BaseLayout } from '../../layout';
import { refs } from '../../api';
import { getAppAccessToken } from '../../api/util';
import { loadUserDone } from '../../reducers/authState/authActions';
import { useServices } from '../AdminDetailCustomer/hooks';
import { PageWrap, TextRight } from './style';

const size = 'large';

/**
 * 1. Load page
 * 2. Select page
 * 3. Subscribe page
 */

const TableListPages = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loading_sub, setLoadingSub] = useState(false);
  const [pages, selectPages] = useState([]);
  const [pagesSelect, selectPagesSelect] = useState([]);
  const [pageActived, setPageActived] = useState([]);
  const { services } = useServices();

  const { facebook, shopId } = user;
  const { id, accessToken } = facebook;

  // console.log('services', services, user);

  // load page active
  useEffect(() => {
    refs.usersRefs
      .doc(shopId)
      .collection('pages_actived')
      .get()
      .then(snaps => {
        if (snaps.empty) return null;

        const arrPages = snaps.docs.map(doc => ({ ...doc.data() }));

        return setPageActived(arrPages);
      });
  }, [shopId]);

  // load page of user manager
  useEffect(() => {
    // load page active
    window.FB.api(
      `/${id}/accounts`,
      'GET',
      { access_token: accessToken.access_token },
      response => {
        const pagesFormat = map(p => ({ ...p, key: p.id }), response.data);

        selectPages(pagesFormat);
        setLoading(false);
      }
    );
  }, [accessToken.access_token, id]);

  /**
   * handleSubscride
   * 1. remove conversation in page
   * 2. subscribe page select
   */

  // const removeConversationPage = (pageId, cb) => {
  //   refs.activitysRefs
  //     .where('pageId', '==', pageId)
  //     .get()
  //     .then(snaps => {
  //       snaps.docs.forEach(doc => {
  //         fireStore
  //           .collection('user_activity')
  //           .doc(doc.id)
  //           .delete();
  //       });
  //       cb();
  //     });
  // };

  const selectPageandSubscride = async () => {
    // const { facebookPages } = user;
    const facebookPages = user.facebookPages || [];
    const facebookPagesNew = [];

    try {
      // get app_access_token

      // const res = await axios.get(url);
      const app_access_token = await getAppAccessToken();

      // unsubscribed page
      facebookPages.forEach(page => {
        const exist = find(p => p.id === page.id, pagesSelect);
        if (!exist) {
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
        }
      });

      pagesSelect.forEach(page => {
        // add to active pages
        const exits = find(p => p.id === page.id, pageActived);

        if (!exits) {
          const date =
            !user.licence || user.licence.type === 'trial'
              ? 15
              : user.licence.time;
          const time = date * 24 * 60 * 60 * 1000;

          const page_active = {
            ...pick(['id', 'name'], page),
            date_active: Date.now() + time
          };

          refs.usersRefs
            .doc(user.shopId)
            .collection('pages_actived')
            .add(page_active);
        }

        window.FB.api(
          `/${page.id}/subscribed_apps`,
          'POST',
          {
            // subscribed_fields:
            //   'feed,name,picture,conversations,messages,publisher_subscriptions',

            subscribed_fields: 'feed,messages,message_echoes',

            // page_messaging_subscriptions
            access_token: page.access_token
          },

          response => {
            if (response && !response.error) {
              const page_exist = find(p => p.id === page.id, facebookPages);

              const page_item = page_exist || {
                name: page.name,
                access_token: page.access_token,
                id: page.id
              };

              facebookPagesNew.push(page_item);

              if (facebookPagesNew.length === pagesSelect.length) {
                refs.usersRefs.doc(shopId).update({
                  facebookPages: facebookPagesNew,
                  subscrided: 'enabled',
                  licence: {
                    ...user.licence,
                    date_active: user.licence.date_active
                      ? user.licence.date_active
                      : Date.now()
                  }
                });
                navigate('/customer/conversation');

                dispatch({
                  type: authTypes.LOAD_USER_SUCCESS,
                  payload: {
                    ...user,
                    subscrided: true,
                    facebookPages: facebookPagesNew,
                    subscribe: 'enabled',
                    licence: {
                      ...user.licence,
                      date_active: user.licence.date_active
                        ? user.licence.date_active
                        : Date.now()
                    }
                  }
                });
              }
            } else {
              // console.log(response.error);
            }
          }
        );
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSubscride = () => {
    setLoadingSub(true);

    refs.usersRefs
      .doc(user.shopId)
      .update({ isLoaded: false })
      .then(() => {
        loadUserDone({ ...user, isLoaded: false });
        selectPageandSubscride();
      });

    // if (user.facebookPages) {
    //   // remove all conversation
    //   let i = 0;
    //   user.facebookPages.forEach(p => {
    //     removeConversationPage(p.id, () => {
    //       i += 1;

    //       if (i === user.facebookPages.length) {
    //         // select page and sybscrided
    //         selectPageandSubscride();
    //       }
    //     });
    //   });
    // } else {
    //   selectPageandSubscride();
    // }
  };

  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     selectPagesSelect(selectedRows);
  //   },

  //   getCheckboxProps: record => ({
  //     disabled: record.name === 'Disabled User',
  //     name: record.name
  //   })
  // };

  const columns = [
    {
      title: '',
      width: 50,
      dataIndex: '',
      key: '9',
      render: page => {
        const { licence } = user;

        const exist = pagesSelect.find(p => {
          return p.id === page.id;
        });

        const disabled = () => {
          // if user trial
          if (!licence || licence.type === 'trial') {
            return false;
            // chưa có page actived
            // if (!pageActived || pageActived.length === 0) {
            //   if (pagesSelect.length === 0) return false;

            //   if (exist) return false;
            //   return true;
            // }

            // // chưa có page active
            // const exist_page_trial = pageActived.find(p => {
            //   return p.id === page.id;
            // });

            // if (exist_page_trial) return false;

            // return true;
          }

          // if user is premium
          if (licence && licence.type === 'premium') {
            // if (!pageActived || pageActived.length === 0) {
            //   if (pagesSelect.length === 0) return false;

            //   if (exist) return false;

            //   return true;
            // }
            // const exist_page_trial = pageActived.find(p => {
            //   return p.id === page.id;
            // });

            // if (exist_page_trial) return false;

            return false;
          }

          return false;
        };

        // const service = services.find(s => s.key === user.licence.service);

        // const disabled =
        //   service && pagesSelect.length === service.number_page && !exits;

        return <Checkbox checked={!!exist} disabled={disabled()} />;
      }
    },
    {
      title: <b>Tên fanpage</b>,
      dataIndex: 'name'
    },
    {
      title: '',
      dataIndex: '',
      key: 'han_su_dung',
      render: page => {
        const { licence } = user;
        const { type } = licence;
        const exits = find(p => p.id === page.id, pageActived);

        if (!exits && type === 'trial')
          return <TextRight>Chưa kích hoạt</TextRight>;

        const date_active = licence.date_active || Date.now();

        const data_expired = date_active + 15 * 24 * 60 * 60 * 1000;

        if (exits && type === 'trial') {
          const color = data_expired > Date.now() ? 'green' : 'red';

          // console.log('data_expired', data_expired);

          return (
            <TextRight style={{ color }}>
              {moment(data_expired).format('DD/MM/YYYY')}
            </TextRight>
          );
        }
        return '';
      }
    }
  ];

  const handleSelectPageTrial = page => {
    // co page active
    // if (pageActived && pageActived.length > 0) {
    //   const exist_page_trial = pageActived.find(p => {
    //     return p.id === page.id;
    //   });

    //   if (exist_page_trial) {
    //     const exist = pagesSelect.find(p => p.id === page.id);

    //     if (exist) {
    //       const newPageSelect = pagesSelect.filter(p => p.id !== page.id);
    //       return selectPagesSelect(newPageSelect);
    //     }

    //     return selectPagesSelect([...pagesSelect, page]);
    //   }

    //   return null;
    // }

    if (pagesSelect.length === 0) {
      return selectPagesSelect([...pagesSelect, page]);
    }

    const exist = pagesSelect.find(p => p.id === page.id);

    if (exist) {
      const newPageSelect = pagesSelect.filter(p => p.id !== page.id);
      return selectPagesSelect(newPageSelect);
    }

    return null;
  };

  const handleSelectPagePremium = page => {
    if (pagesSelect.length === 0) {
      return selectPagesSelect([...pagesSelect, page]);
    }

    const exist = pagesSelect.find(p => p.id === page.id);

    if (exist) {
      const newPageSelect = pagesSelect.filter(p => p.id !== page.id);
      return selectPagesSelect(newPageSelect);
    }

    if (pagesSelect.length < user.licence.number_page) {
      return selectPagesSelect([...pagesSelect, page]);
    }

    message.warning(`Chỉ chọn được tối đa ${user.licence.number_page} page`);

    return null;
  };

  const handleSelectPage = page => {
    const { licence } = user;
    if (!licence || licence.type === 'trial') {
      return handleSelectPageTrial(page);
    }

    return handleSelectPagePremium(page);
  };

  const service = services.find(s => s.key === user.licence.service);
  // const message = <>Tài khoản của bạn là tài khoản dùng thử</>;

  if (
    user.licence.type === 'premium' &&
    (!user.licence.number_page || user.licence.number_page === 0)
  ) {
    return <div>Tài khoản của bạn chưa được gia hạn</div>;
  }

  return (
    <BaseLayout title="Chọn fanpage">
      <PageWrap>
        <h3 className="title">Chọn fanpage cần quản lý</h3>

        {service && (
          <p>({`Bạn đang sử dụng ${service.name} có ${service.note}`})</p>
        )}
        {/* <div style={{ marginBottom: 15 }}>
          <Alert message={message} type="info" />
        </div> */}

        <Table
          bodyStyle={{ border: '1px solid #eee', background: '#fff' }}
          columns={columns}
          onRow={page => {
            return {
              onClick: () => {
                handleSelectPage(page);

                // const exist = pagesSelect.find(p => p.id === page.id);

                // if (exist) {
                //   const newPageSelect = pagesSelect.filter(
                //     p => p.id !== page.id
                //   );
                //   return selectPagesSelect(newPageSelect);
                // }
                // return selectPagesSelect([...pagesSelect, page]);
              }
            };
          }}
          // rowSelection={rowSelection}
          dataSource={pages}
          pagination={false}
          loading={loading}
        />

        <Row gutter={15}>
          <Col xs={24} sm={12} style={{ marginTop: 15 }}>
            <Button
              block
              size={size}
              type="primary"
              onClick={handleSubscride}
              loading={loading_sub}
              disabled={pagesSelect.length === 0}
            >
              Truy cập
            </Button>
          </Col>
          <Col xs={24} sm={12} style={{ marginTop: 15 }}>
            <Link to="/customer/conversation">
              <Button size={size} block>
                Trở lại
              </Button>
            </Link>
          </Col>
        </Row>
      </PageWrap>
    </BaseLayout>
  );
};

export default TableListPages;
