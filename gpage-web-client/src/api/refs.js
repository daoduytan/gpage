import { fireStore } from './firebase';

export default {
  usersRefs: fireStore.collection('users'),
  activitysRefs: fireStore.collection('user_activity'),
  servicesRefs: fireStore.collection('services'),
  pageHideRefs: fireStore.collection('pages_hide'),
  ordersRefs: fireStore.collection('orders')
};
