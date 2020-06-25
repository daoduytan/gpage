// @flow
import React, { Suspense, lazy } from 'react';
import { Router } from '@reach/router';
import { connect } from 'react-redux';

import { Loading } from '../components';
import * as actions from '../reducers/authState/authActions';
import NotFound from '../pages/NotFound';

import {
  GuestRouter,
  AdminRouter,
  GuestAdminRouter,
  CustomerRouter
} from './authRouter';
import { CustomerAdminRouter } from './customerRouter';

// login
const Login = lazy(() => import('../pages/Login'));

// admin
const AdminLogin = lazy(() => import('../pages/AdminLogin'));
const AdminSignup = lazy(() => import('../pages/AdminSignup'));
const AdminHome = lazy(() => import('../pages/AdminHome'));
const AdminServices = lazy(() => import('../pages/AdminServices'));

const Home = lazy(() => import('../pages/Home'));

// customer
const Customer = lazy(() => import('../pages/Customer'));
const SelectPages = lazy(() => import('../pages/SelectPages'));
const Conversation = lazy(() => import('../pages/Conversation'));
const Other = lazy(() => import('../pages/Other'));
const Setting = lazy(() => import('../pages/Setting'));
const CustomerSetting = lazy(() => import('../pages/CustomerSetting'));
const ExpriedMember = lazy(() => import('../pages/ExpriedMember'));
const CustomerBlock = lazy(() => import('../pages/CustomerBlock'));
const OtherCustomer = lazy(() => import('../pages/OtherCustomer'));
const ReportRevenue = lazy(() => import('../pages/ReportRevenue'));
const Exprired = lazy(() => import('../pages/Exprired'));

// products
const Products = lazy(() => import('../pages/Products'));
const StoreManager = lazy(() => import('../pages/StoreManager'));
const StoreDetail = lazy(() => import('../pages/StoreDetail'));
const Suppliers = lazy(() => import('../pages/Suppliers'));
const ProductManager = lazy(() => import('../pages/ProductManager'));
const HistoryImport = lazy(() => import('../pages/HistoryImport'));

const Order = lazy(() => import('../pages/Order'));
const OrderHome = lazy(() => import('../pages/Order/OrderHome'));
const OrderDetail = lazy(() => import('../pages/OrderDetail'));
const OrderNew = lazy(() => import('../pages/OrderNew'));
const AddSupplier = lazy(() => import('../pages/AddSupplier'));
const Members = lazy(() => import('../pages/Members'));
const Report = lazy(() => import('../pages/Report'));
const ReportConversation = lazy(() => import('../pages/ReportConversation'));
const ReportLabel = lazy(() => import('../pages/ReportLabel'));

// admin
const Admin = lazy(() => import('../pages/Admin'));
const AdminCustomer = lazy(() => import('../pages/AdminCustomer'));
const AdminDetailCustomer = lazy(() => import('../pages/AdminDetailCustomer'));
const AdminMember = lazy(() => import('../pages/AdminMember'));

// term
const Term = lazy(() => import('../pages/Term'));

// privacy policy
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));

// support
const Help = lazy(() => import('../pages/Help'));

// payments
const Payments = lazy(() => import('../pages/Payments'));

// help signin
const HelpSignin = lazy(() => import('../pages/HelpSignin'));

type AppRouterProps = {
  loadUser: Function,
  loading: Boolean
};

const AppRouter = ({ loadUser, loading }: AppRouterProps) => {
  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Home path="/" />
        <CustomerRouter component={CustomerSetting} path="/setting-shop" />
        <CustomerBlock path="/block" />
        <CustomerRouter path="/customer" component={Customer}>
          <Exprired path="exprired" />

          <ExpriedMember path="exprired-member" />
          <Conversation path="conversation" />
          <Order path="order">
            <OrderHome path="/" />
            <OrderDetail path="/:id" />
            <OrderNew path="new" />
            <NotFound default />
          </Order>
          <Products path="products">
            <ProductManager path="product-manager" />
            <StoreManager path="store-manager" />
            <StoreDetail path="store-manager/:id" />
            <Suppliers path="supplier-manager" />
            <HistoryImport path="history" />

            <NotFound default />
          </Products>

          <AddSupplier path="add_supplier" />

          <CustomerAdminRouter component={Other} path="other">
            <Setting path="setting" />
            <Members path="members" />
            <OtherCustomer path="customer" />
            <NotFound default />
          </CustomerAdminRouter>

          <CustomerAdminRouter component={Report} path="report">
            <ReportConversation path="conversation" />
            <ReportLabel path="label" />
            <ReportRevenue path="revenue" />
            <NotFound default />
          </CustomerAdminRouter>
          <CustomerAdminRouter path="/select-pages" component={SelectPages} />

          <NotFound default />
        </CustomerRouter>

        <GuestRouter component={Login} path="login" />

        <AdminRouter component={Admin} path="admin">
          <AdminHome path="/overview" />
          <AdminCustomer path="customer" />
          <AdminDetailCustomer path="customer/:id" />
          <AdminServices path="services" />
          <AdminMember path="member" />
          <NotFound default />
        </AdminRouter>

        <GuestAdminRouter component={AdminLogin} path="admin-login" />
        <AdminSignup path="admin-signup" />

        <Term path="term" />
        <PrivacyPolicy path="privacy-policy" />
        <Help path="help" />
        <Payments path="payments" />
        <HelpSignin path="help-signin" />

        <NotFound default />
      </Router>
    </Suspense>
  );
};

const enhance = connect(
  ({ authReducer }) => ({ loading: authReducer.loading }),
  { loadUser: actions.loadUser }
);

export default enhance(AppRouter);
