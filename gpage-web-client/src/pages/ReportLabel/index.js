import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Alert } from 'antd';

import { BaseLayout } from '../../layout';
import { TitlePage, ContentPage } from '../../layout/style';
import { Scrollbars, Loading, CustomTable } from '../../components';
import constants from '../../constants';
import { NotificationContext } from '../Customer/context';
import FormFilter from '../ReportConversation/FormFilter';
import { refs } from '../../api';

type ReportLabelProps = {
  user: {
    shopId: string,
    facebookPages: any
  }
};

class ReportLabel extends React.Component<ReportLabelProps> {
  // eslint-disable-next-line react/static-property-placement
  static contextType = NotificationContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingFilter: false,
      filter: {
        page: null,
        type: 'month',
        date: new Date()
      },
      arrCons: [],
      defautlLabels: [],
      dataLabels: []
    };
  }

  componentDidMount() {
    const { user } = this.props;
    const { facebookPages } = user;

    refs.usersRefs
      .doc(user.shopId)
      .collection('list_labels')
      .get()
      .then(snapShot => {
        const dataLabels = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          data: []
        }));

        this.setState(
          prevState => ({
            defautlLabels: dataLabels,
            dataLabels,
            filter: { ...prevState.filter, page: facebookPages[0] }
          }),
          () => {
            const { filter } = this.state;
            const { page } = filter;

            refs.activitysRefs
              .where('pageId', '==', page.id)
              .get()
              .then(snapshot => {
                const arrCons = snapshot.docs.map(doc => doc.data());
                this.setState({ arrCons, loading: false }, () =>
                  this.processFilter()
                );
              });
          }
        );
      });
  }

  setFilter = filter => {
    this.setState(prevState => {
      if (filter.page.id !== prevState.filter.page.id) {
        refs.activitysRefs
          .where('pageId', '==', filter.page.id)
          .get()
          .then(snapshot => {
            const arrCons = snapshot.docs.map(doc => doc.data());
            this.setState({ arrCons });
          });
      }

      return { filter };
    });
  };

  processFilter = () => {
    const { filter } = this.state;
    const { type } = filter;

    this.setState(
      prevState => ({
        loadingFilter: true,
        dataLabels: prevState.defautlLabels
      }),
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

  handleFilterDate = date => {
    const { arrCons, dataLabels } = this.state;

    const dayFormat = moment(date);

    const valueStart = moment(dayFormat)
      .startOf('date')
      .valueOf();

    const valueEnd = moment(dayFormat)
      .endOf('date')
      .valueOf();

    const data = dataLabels.map(label => {
      const filterArr = arrCons.filter(a => {
        if (!a.labels) return false;
        const exist = a.labels.find(
          l => l.id === label.id && l.date >= valueStart && l.date <= valueEnd
        );

        if (exist) return true;

        return false;
      });

      return {
        ...label,
        data: [{ number: filterArr.length, date: dayFormat.valueOf() }]
      };
    });

    return data;
  };

  // filter with type day
  filterWithDate = () => {
    const { filter } = this.state;
    const { date } = filter;
    const data = this.handleFilterDate(date);
    this.setState({ dataLabels: data, loadingFilter: false });
  };

  // filter with type week
  filterWithWeek = () => {
    const { filter } = this.state;
    const { date } = filter;
    const weekStart = moment(date).startOf('week');

    for (let index = 0; index <= 6; index += 1) {
      const dateValue = moment(weekStart).add(index, 'days');

      const data = this.handleFilterDate(dateValue);

      data.forEach(d => {
        this.setState(prevState => {
          const newDataLabels = prevState.dataLabels.map(l => {
            if (l.id !== d.id) return l;

            return { ...l, data: [...l.data, ...d.data] };
          });

          return { dataLabels: newDataLabels };
        });

        if (index === 6) {
          this.setState({ loadingFilter: false });
        }
      });
    }
  };

  // filter with type month
  filterWithMonth = () => {
    const { filter } = this.state;
    const { date } = filter;

    const dateInMonth = moment().daysInMonth();
    const month = moment(date).format('MM');
    const year = moment(date).format('YYYY');

    const startDate = `1/${month}/${year}`;

    for (let index = 0; index < dateInMonth; index += 1) {
      const dateValue = moment(startDate, 'DD/MM/YYYY').add(index, 'days');

      const data = this.handleFilterDate(dateValue);

      data.forEach(d => {
        this.setState(prevState => {
          const newDataLabels = prevState.dataLabels.map(l => {
            if (l.id !== d.id) return l;

            return { ...l, data: [...l.data, ...d.data] };
          });

          return { dataLabels: newDataLabels };
        });

        if (index === dateInMonth - 1) {
          this.setState({ loadingFilter: false });
        }
      });
    }
  };

  // filter with type custom
  filterWithCustom = () => {
    const { filter } = this.state;
    const { date } = filter;

    const valueStartDate = moment(date[0]).valueOf();
    const valueEndDate = moment(date[1]).valueOf();

    const diff = Math.floor((valueEndDate - valueStartDate) / 86400000);

    for (let index = 0; index <= diff; index += 1) {
      const dateValue = moment(valueStartDate).add(index, 'days');

      const data = this.handleFilterDate(dateValue);
      data.forEach(d => {
        this.setState(prevState => {
          const newDataLabels = prevState.dataLabels.map(l => {
            if (l.id !== d.id) return l;

            return { ...l, data: [...l.data, ...d.data] };
          });

          return { dataLabels: newDataLabels };
        });

        if (index === diff) {
          this.setState({ loadingFilter: false });
        }
      });
    }
  };

  date = () => {
    const { dataLabels } = this.state;

    return dataLabels[0].data.map(d => moment(d.date).format('DD/MM/YYYY'));
  };

  renderContent = () => {
    const { dataLabels, loadingFilter } = this.state;
    const options = {
      title: { text: 'Biểu đồ' },
      subtitle: { text: 'Báo cáo từng ngày' },
      xAxis: { categories: this.date() },
      yAxis: { title: { text: 'Số lượng' } },
      series: dataLabels.map(d => ({
        name: d.text,
        color: d.bg,
        data: d.data.map(i => i.number)
      }))
    };

    if (loadingFilter) return <Loading />;

    return (
      <>
        <HighchartsReact highcharts={Highcharts} options={options} />
        <div style={{ height: 30 }} />

        <CustomTable style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Ngày</th>
              {dataLabels[0].data.map(d => (
                <th key={d.date}>{moment(d.date).format('DD')}</th>
              ))}
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {dataLabels.map(label => {
              return (
                <tr key={label.id}>
                  <th>
                    <span
                      style={{
                        padding: '2px 5px',
                        borderRadius: 2,
                        display: 'inline-block',
                        background: label.bg,
                        color: label.color
                      }}
                    >
                      {label.text}
                    </span>
                  </th>

                  {label.data.map(d => (
                    <td key={d.date}>{d.number}</td>
                  ))}
                  <td>
                    {label.data.reduce((value, o) => o.number + value, 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </CustomTable>
      </>
    );
  };

  render() {
    const { filter, loading } = this.state;

    if (loading) return <Loading />;

    const { notifications } = this.context;
    const text = `${constants.title} - Nhãn hội thoại`;
    const number = notifications.length;
    const title = `${number === 0 ? '' : `(${number})`}${text}`;

    return (
      <BaseLayout title={title}>
        <TitlePage>
          <span className="title">Nhãn hội thoại</span>
        </TitlePage>
        <Scrollbars style={{ height: 'calc(100vh - 100px)' }}>
          <ContentPage>
            <FormFilter
              filter={filter}
              submitFilter={this.processFilter}
              setFilter={this.setFilter}
            />
            <div style={{ height: 30 }} />

            <div style={{ position: 'relative', minHeight: 150 }}>
              {this.renderContent()}
            </div>
            <div style={{ height: 30 }} />

            <Alert
              message="Chú ý:"
              description={
                <>
                  <p>Số lượt nhãn gắn sẽ tính theo thời gian của từng ngày.</p>
                  <p>Nhấn vào tên nhãn để ẩn hoặc hiển thị các đường biểu đồ</p>
                </>
              }
              type="info"
              showIcon
            />
          </ContentPage>
        </Scrollbars>
      </BaseLayout>
    );
  }
}

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(ReportLabel);
