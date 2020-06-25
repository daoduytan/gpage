import React from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

import FormFilter from '../ReportConversation/FormFilter';
import { Loading } from '../../components';
import columns from './columns';
import { refs } from '../../api';

type TableCustomerProps = {
  user: {
    shopId: string,
    facebookPages: any
  }
};
type TableCustomerState = {
  loading: boolean,
  loadingFilter: boolean,
  filter: {
    page: any,
    date: any,
    type: string
  },
  customers: any
};

class TableCustomer extends React.Component<
  TableCustomerProps,
  TableCustomerState
> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingFilter: true,
      filter: {
        page: null,
        date: new Date(),
        type: 'month'
      },
      customers: []
    };
  }

  componentDidMount() {
    const { user } = this.props;
    const { facebookPages } = user;

    this.setState(
      prevState => ({
        loading: false,
        filter: { ...prevState.filter, page: facebookPages[0] }
      }),
      () => this.processFilter()
    );
  }

  setFilter = filter => {
    this.setState({ filter });
  };

  submitFilter = () => {
    this.setState({ loadingFilter: true }, () => {
      this.processFilter();
    });
  };

  processFilter = () => {
    const { filter } = this.state;
    const { type } = filter;
    this.setState({ customers: [] }, () => {
      // filter with day
      if (type === 'day') this.filterWithDate();
      // filter with week
      if (type === 'week') this.filterWithWeek();
      // filter with month
      if (type === 'month') this.filterWithMonth();
      if (type === 'custom') this.filterWithCustom();
    });
  };

  // handlefiter
  handleFilter = (valueStart, valueEnd) => {
    const { user } = this.props;
    const { shopId } = user;
    const { filter } = this.state;
    const { page } = filter;

    refs.ordersRefs
      .where('shopId', '==', shopId)
      .where('pageId', '==', page.id)
      .where('date', '>=', valueStart)
      .where('date', '<=', valueEnd)
      .get()
      .then(response => {
        const customers = response.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        this.setState({ customers, loadingFilter: false });
      });
  };

  // filterWithDate
  filterWithDate = () => {
    const { filter } = this.state;
    const { date } = filter;

    const valueStart = moment(date)
      .startOf('date')
      .valueOf();

    const valueEnd = moment(date)
      .endOf('date')
      .valueOf();

    this.handleFilter(valueStart, valueEnd);
  };

  // filterWithWeek
  filterWithWeek = () => {
    const { filter } = this.state;
    const { date } = filter;

    const weekStart = moment(date).startOf('week');
    const weekEnd = moment(weekStart).add(6, 'days');

    const valueStart = moment(weekStart)
      .startOf('date')
      .valueOf();

    const valueEnd = moment(weekEnd)
      .endOf('date')
      .valueOf();

    this.handleFilter(valueStart, valueEnd);
  };

  // filterWithMonth
  filterWithMonth = () => {
    const { filter } = this.state;
    const { date } = filter;

    const dateInMonth = moment().daysInMonth();
    const month = moment(date).format('MM');
    const year = moment(date).format('YYYY');

    const startDate = `1/${month}/${year}`;
    const endDate = `${dateInMonth}/${month}/${year}`;

    const valueStart = moment(startDate, 'DD/MM/YYYY')
      .startOf('date')
      .valueOf();

    const valueEnd = moment(endDate, 'DD/MM/YYYY')
      .endOf('date')
      .valueOf();

    // console.log(
    //   'valueStart, valueEnd',
    //   valueStart,
    //   valueEnd,
    //   dateInMonth,
    //   endDate
    // );

    this.handleFilter(valueStart, valueEnd);
  };

  // filterWithcustom

  filterWithCustom = () => {
    const { filter } = this.state;
    const { date } = filter;

    const valueStart = moment(date[0]).valueOf();
    const valueEnd = moment(date[1]).valueOf();

    this.handleFilter(valueStart, valueEnd);
  };

  dataSource = () => {
    const { customers } = this.state;
    return customers.map(c => ({ ...c, key: c.id }));
  };

  renderContent = () => {
    const { loadingFilter } = this.state;

    return (
      <Table
        bordered
        columns={columns}
        dataSource={this.dataSource()}
        loading={loadingFilter}
      />
    );
  };

  render() {
    const { filter, loading } = this.state;
    if (loading) return <Loading />;

    return (
      <>
        <FormFilter
          filter={filter}
          setFilter={this.setFilter}
          submitFilter={this.submitFilter}
        />
        <div style={{ position: 'relative', height: 300, marginTop: 20 }}>
          {this.renderContent()}
        </div>
      </>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(TableCustomer);
