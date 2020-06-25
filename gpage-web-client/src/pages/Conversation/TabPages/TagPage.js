import React from 'react';
import { Avatar, Badge, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import { refs } from '../../../api';
import { loadUserDone } from '../../../reducers/authState/authActions';
import { useNotification } from '../../Customer/context';
import { useConvs } from '../context';
import { ButtonTagPage } from './style';

type TabPageProps = {
  page: {
    avatar: string,
    name: string,
    id: string,
    access_token: string
  }
};

const TagPage = ({ page }: TabPageProps) => {
  const { notifications } = useNotification();
  const { state, addPage, removePage, selectConversation } = useConvs();
  const [page_local, setPageLocal] = React.useState(page);
  const [loading, setLoading] = React.useState(true);
  const user = useSelector(({ authReducer }) => authReducer.user);
  const dispatch = useDispatch();

  const { pages } = state;

  const exist = pages.find(p => p.id === page.id);

  const toggleSelectPage = () => {
    if (exist) {
      selectConversation(null);
      return removePage(page);
    }
    return addPage(page);
  };

  React.useEffect(() => {
    if (!page_local.picture) {
      window.FB.api(
        `/${page.id}`,

        {
          fields: ['name', 'picture'],
          access_token: page.access_token
        },
        response => {
          if (response && !response.error) {
            const { facebookPages } = user;

            const newFacebookPages = facebookPages.map(p => {
              if (p.id === page.id) return { ...p, picture: response.picture };
              return p;
            });

            dispatch(
              loadUserDone({ ...user, facebookPages: newFacebookPages })
            );

            setPageLocal({ ...page, picture: response.picture });

            refs.usersRefs
              .doc(user.shopId)
              .update({ facebookPages: newFacebookPages })
              .then(() => setLoading(false));
          }
        }
      );
    } else {
      setLoading(false);
    }
  }, [page, page_local.picture, user]);

  const filterNotificationPage = notifications.filter(
    p => p.pageId === page.id
  );

  const active = user.facebookPages.length === 1 || exist;

  return (
    <ButtonTagPage onClick={toggleSelectPage} active={active}>
      {loading ? (
        <Skeleton
          avatar
          size="small"
          loading={loading}
          paragraph={false}
          title={false}
          style={{ marginRight: 10 }}
        />
      ) : (
        <Avatar
          size="small"
          style={{ marginRight: 10 }}
          src={page_local.picture && page_local.picture.data.url}
        />
      )}
      <span className="text">{page.name}</span>
      {filterNotificationPage.length > 0 && (
        <Badge
          count={filterNotificationPage.length}
          style={{ marginLeft: 10 }}
        />
      )}
    </ButtonTagPage>
  );
};

export default React.memo(TagPage);
