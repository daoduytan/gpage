import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { pick } from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { Select, Empty, Card, Button, Col } from 'antd';

import { BaseLayout } from '../../layout';
import { TitlePage, ContentPage } from '../../layout/style';
import { Scrollbars, Loading, CustomTable } from '../../components';
import { refs } from '../../api';
import { formatMoney } from '../../ultils';
import constants from '../../constants';
import FormFilter from '../ReportConversation/FormFilter';
import { NotificationContext } from '../Customer/context';
import SelectMember from './SelectMember';
import SelectStore from './SelectStore';

type ReportOrderProps = {
  user: {
    shopId: string,
    facebookPages: any
  }
};

type ReportOrderState = {
  loading: boolean,
  filter: any,
  loadingFilter: boolean,
  arrData: any
};

class ReportOrder extends React.Component<ReportOrderProps, ReportOrderState> {
  // eslint-disable-next-line react/static-property-placement
  static contextType = NotificationContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      filter: {
        page: null,
        type: 'day',
        date: new Date(),
        member: 'all',
        type_value: 'tien',
        store: 'all'
      },
      arrData: [],
      loadingFilter: false,
      products: []
    };
  }

  componentDidMount() {
    const { user } = this.props;
    const { facebookPages } = user;

    refs.usersRefs
      .doc(user.shopId)
      .collection('products')
      .get()
      .then(snapshot => {
        const products = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          data: []
        }));
        this.setState(
          prevState => ({
            arrData: products,
            products,
            loading: false,
            filter: { ...prevState.filter, page: facebookPages[0] }
          }),
          () => this.processFilter()
        );
      });
  }

  setFilter = filter => {
    this.setState({ filter });
  };

  onChangeTypeValue = type_value =>
    this.setState(
      prevState => ({
        filter: { ...prevState.filter, type_value }
      }),
      this.processFilter()
    );

  processFilter = () => {
    const { filter } = this.state;
    const { type } = filter;

    this.setState(
      prevState => ({ arrData: prevState.products, loadingFilter: true }),
      () => {
        // filter with day
        if (type === 'day') this.filterWithDate();
        // filter with week
        if (type === 'week') this.filterWithWeek();
        // filter with month
        if (type === 'month') this.filterWithMonth();
        if (type === 'custom') this.filterWithCustom();
      }
    );
  };

  handleFilterDate = date_filter => {
    const { products, filter } = this.state;

    const { user } = this.props;
    const { type_value } = filter;

    const dayFormat = moment(date_filter);
    const valueStart = moment(dayFormat)
      .startOf('date')
      .valueOf();

    const valueEnd = moment(dayFormat)
      .endOf('date')
      .valueOf();

    return new Promise(resolve => {
      refs.ordersRefs
        .where('shopId', '==', user.shopId)
        .where('date', '>=', valueStart)
        .where('date', '<=', valueEnd)
        .get()
        .then(res => {
          let arrData = [];
          arrData = products.map(product => ({
            ...pick(product, ['ten', 'id']),
            data: [{ number: 0, date: moment(date_filter).valueOf() }]
          }));

          // if (filter.member !== 'all') {
          //   arrData = arrData.filter();
          // }

          if (res.empty) {
            resolve(arrData);
          } else {
            let allOrderProduct = [];
            res.docs.forEach(doc => {
              const { list_order, member, store } = doc.data();

              const new_list_order = list_order.map(o => ({
                ...o,
                member,
                store
              }));

              allOrderProduct = [...allOrderProduct, ...new_list_order];
            });

            if (filter.member !== 'all') {
              allOrderProduct = allOrderProduct.filter(order => {
                if (order.member.uid === filter.member) return true;
                return false;
              });
            }

            if (filter.store !== 'all') {
              allOrderProduct = allOrderProduct.filter(order => {
                if (!order.store) return false;
                if (order.store.id === filter.store) return true;
                return false;
              });
            }

            const a = arrData.map(item => {
              const arrOrderProduct = allOrderProduct.filter(
                o => o.key === item.id
              );

              const number =
                type_value === 'tien'
                  ? arrOrderProduct.reduce(
                      (value, o) => o.so_luong * o.gia_ban + value,
                      0
                    )
                  : arrOrderProduct.reduce((value, o) => o.so_luong + value, 0);

              return {
                ...pick(item, ['ten', 'id']),
                data: [{ number, date: moment(date_filter).valueOf() }]
              };
            });

            resolve(a);
          }
        });
    });
  };

  // filter with date
  filterWithDate = () => {
    const { filter } = this.state;
    const { date } = filter;

    this.handleFilterDate(date).then(arrDataDate => {
      this.setState({ arrData: arrDataDate, loadingFilter: false });
    });
  };

  // filter with week
  filterWithWeek = () => {
    const { filter } = this.state;
    const { date } = filter;
    const weekStart = moment(date).startOf('week');

    for (let index = 0; index <= 6; index += 1) {
      const dateValue = moment(weekStart).add(index, 'days');

      this.handleFilterDate(dateValue).then(arrDataDay => {
        arrDataDay.forEach(a => {
          this.setState(prevState => {
            const newArrData = prevState.arrData.map(i => {
              if (i.id !== a.id) return i;

              return { ...i, data: [...i.data, ...a.data] };
            });

            return { arrData: newArrData };
          });
        });

        if (index === 6) {
          this.setState({ loadingFilter: false });
        }
      });
    }
  };

  // filter with month
  filterWithMonth = () => {
    const { filter } = this.state;
    const { date } = filter;

    const dateInMonth = moment().daysInMonth();
    const month = moment(date).format('MM');
    const year = moment(date).format('YYYY');

    const startDate = `1/${month}/${year}`;

    for (let index = 0; index < dateInMonth; index += 1) {
      const dateValue = moment(startDate, 'DD/MM/YYYY').add(index, 'days');

      this.handleFilterDate(dateValue).then(arrDataDay => {
        arrDataDay.forEach(a => {
          this.setState(prevState => {
            const newArrData = prevState.arrData.map(i => {
              if (i.id !== a.id) return i;

              return { ...i, data: [...i.data, ...a.data] };
            });

            return { arrData: newArrData };
          });
        });

        if (index === dateInMonth - 1) {
          this.setState({ loadingFilter: false });
        }
      });
    }
  };

  // filter with custom
  filterWithCustom = () => {
    const { filter } = this.state;
    const { date } = filter;

    const valueStartDate = moment(date[0]).valueOf();
    const valueEndDate = moment(date[1]).valueOf();

    const diff = Math.floor((valueEndDate - valueStartDate) / 86400000);

    for (let index = 0; index <= diff; index += 1) {
      const dateValue = moment(valueStartDate).add(index, 'days');

      this.handleFilterDate(dateValue).then(arrDataDay => {
        arrDataDay.forEach(a => {
          this.setState(prevState => {
            const newArrData = prevState.arrData.map(i => {
              if (i.id !== a.id) return i;

              return { ...i, data: [...i.data, ...a.data] };
            });

            return { arrData: newArrData };
          });
        });

        if (index === diff) {
          this.setState({ loadingFilter: false });
        }
      });
    }
  };

  // revenue
  revenue = () => {
    const { arrData } = this.state;
    return arrData.map(item => item.value);
  };

  date = () => {
    const { arrData } = this.state;
    return arrData[0].data.map(d => moment(d.date).format('DD/MM/YYYY'));
  };

  // render content
  renderContent = () => {
    const { loadingFilter, arrData, filter, products } = this.state;
    const { type_value } = filter;

    if (products.length === 0) {
      return (
        <Card>
          <Empty description="Chưa có sản phẩm">
            <Link to="/customer/products/product-manager">
              <Button size="large" type="primary">
                Thêm sản phẩm
              </Button>
            </Link>
          </Empty>
        </Card>
      );
    }

    if (loadingFilter) return <Loading />;

    // console.group('arrData', arrData);

    const options = {
      title: { text: 'Biểu đồ' },
      subtitle: { text: 'Báo cáo từng ngày' },
      xAxis: { categories: this.date() },
      yAxis: { title: { text: type_value === 'tien' ? 'Tiền' : 'Số lượng' } },
      series: arrData.map(d => ({
        name: d.ten,
        data: d.data.map(i => i.number)
      }))
    };

    return (
      <>
        <HighchartsReact highcharts={Highcharts} options={options} />
        <div style={{ height: 30 }} />

        <CustomTable style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Ngày</th>
              {arrData[0].data.map(d => (
                <th key={d.date}>{moment(d.date).format('DD')}</th>
              ))}
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {arrData.map(label => {
              return (
                <tr key={label.id}>
                  <th>{label.ten}</th>

                  {label.data.map(d => (
                    <td key={d.date}>{formatMoney(d.number)}</td>
                  ))}
                  <td>
                    {formatMoney(
                      label.data.reduce((value, o) => o.number + value, 0)
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </CustomTable>
        <div style={{ height: 30 }} />
      </>
    );
  };

  filterMember = member => {
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        member
      }
    }));
  };

  filterStore = store => {
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        store
      }
    }));
  };

  render() {
    const { loading, filter } = this.state;

    if (loading) return <Loading />;

    const { notifications } = this.context;
    const text = `${constants.title} - Doanh thu`;
    const number = notifications.length;
    const title = `${number === 0 ? '' : `(${number})`}${text}`;

    return (
      <BaseLayout title={title}>
        <TitlePage>
          <span className="title">Doanh thu</span>
        </TitlePage>
        <Scrollbars style={{ height: 'calc(100vh - 100px)' }}>
          <ContentPage>
            <FormFilter
              filter={filter}
              submitFilter={this.processFilter}
              setFilter={this.setFilter}
              hasChildren
            >
              <Col span={4}>
                <SelectMember
                  selectMember={this.filterMember}
                  value={filter.member}
                />
              </Col>

              <Col span={3}>
                <SelectStore
                  selectStore={this.filterStore}
                  value={filter.store}
                />
              </Col>

              <Col span={3}>
                <Select
                  onChange={this.onChangeTypeValue}
                  defaultValue={filter.type_value}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="tien">Giá</Select.Option>
                  <Select.Option value="so_luong">Số lượng</Select.Option>
                </Select>
              </Col>
            </FormFilter>
            <div style={{ height: 30 }} />

            <div style={{ position: 'relative', minHeight: 150 }}>
              {this.renderContent()}
            </div>
          </ContentPage>
        </Scrollbars>
      </BaseLayout>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(ReportOrder);
