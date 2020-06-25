import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Alert } from 'antd';

import { BaseLayout } from '../../layout';
import { TitlePage, ContentPage } from '../../layout/style';
import { Scrollbars, CustomTable, Loading } from '../../components';
import { refs } from '../../api';
import constants from '../../constants';
import { NotificationContext } from '../Customer/context';
import FormFilter from './FormFilter';

type ReportConversationProps = {
  user: any
};
type ReportConversationState = {
  loading: Boolean,
  loadingFilter: Boolean,
  filter: {
    page: any,
    type: String,
    date: Number
  },
  dataMessage: any,
  dataComment: any
};

class ReportConversation extends React.Component<
  ReportConversationProps,
  ReportConversationState
> {
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
      dataMessage: [],
      dataComment: []
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

  processFilter = () => {
    const { filter } = this.state;
    const { type } = filter;

    this.setState(
      { dataComment: [], dataMessage: [], loadingFilter: true },
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

  getData = (type, date, page) => {
    const dayFormat = moment(date);
    const valueStart = moment(dayFormat)
      .startOf('date')
      .valueOf();

    const valueEnd = moment(dayFormat)
      .endOf('date')
      .valueOf();

    return new Promise(resolve => {
      refs.activitysRefs
        .where('pageId', '==', page.id)
        .where('type', '==', type)
        .where('startDate', '>=', valueStart)
        .where('startDate', '<=', valueEnd)
        .get()
        .then(snaps => {
          const dateData = {
            date: moment(date).valueOf(),
            number: snaps.docs.length
          };

          resolve(dateData);
        });
    });
  };

  // get data comment
  getDataComment = (date, page) => {
    return this.getData('comment', date, page);
  };

  // get data message
  getDataMessage = (date, page) => {
    return this.getData('message', date, page);
  };

  handleFilterDate = date => {
    const { filter } = this.state;
    const { page } = filter;
    return Promise.all([
      this.getDataComment(date, page),
      this.getDataMessage(date, page)
    ]);
  };

  // filter with type date
  filterWithDate = () => {
    const { filter } = this.state;
    const { date } = filter;

    this.handleFilterDate(date).then(dataArr =>
      this.setState({
        loadingFilter: false,
        dataComment: [dataArr[0]],
        dataMessage: [dataArr[1]]
      })
    );
  };

  // filter with type week
  filterWithWeek = () => {
    const { filter } = this.state;
    const { date } = filter;
    const weekStart = moment(date).startOf('week');

    for (let index = 0; index <= 6; index += 1) {
      const dateValue = moment(weekStart).add(index, 'days');

      this.handleFilterDate(dateValue).then(dataArr => {
        this.setState(prevState => ({
          dataComment: [...prevState.dataComment, dataArr[0]],
          dataMessage: [...prevState.dataMessage, dataArr[1]]
        }));

        if (index === 6) {
          this.setState({ loadingFilter: false });
        }
      });
    }
  };

  filterWithMonth = () => {
    const { filter } = this.state;
    const { date } = filter;

    const dateInMonth = moment().daysInMonth();
    const month = moment(date).format('MM');
    const year = moment(date).format('YYYY');

    const startDate = `1/${month}/${year}`;

    for (let index = 0; index < dateInMonth; index += 1) {
      const dateValue = moment(startDate, 'DD/MM/YYYY').add(index, 'days');

      this.handleFilterDate(dateValue).then(dataArr => {
        this.setState(prevState => ({
          dataComment: [...prevState.dataComment, dataArr[0]],
          dataMessage: [...prevState.dataMessage, dataArr[1]]
        }));

        if (index === dateInMonth - 1) {
          this.setState({ loadingFilter: false });
        }
      });
    }
  };

  filterWithCustom = () => {
    const { filter } = this.state;
    const { date } = filter;

    const valueStartDate = moment(date[0]).valueOf();
    const valueEndDate = moment(date[1]).valueOf();

    const diff = Math.floor((valueEndDate - valueStartDate) / 86400000);

    for (let index = 0; index <= diff; index += 1) {
      const dateValue = moment(valueStartDate).add(index, 'days');

      this.handleFilterDate(dateValue).then(dataArr => {
        this.setState(prevState => ({
          dataComment: [...prevState.dataComment, dataArr[0]],
          dataMessage: [...prevState.dataMessage, dataArr[1]]
        }));

        if (index === diff) {
          this.setState({ loadingFilter: false });
        }
      });
    }
  };

  date = () => {
    const { dataComment } = this.state;

    return dataComment.map(d => moment(d.date).format('DD/MM/YYYY'));
  };

  comment = () => {
    const { dataComment } = this.state;

    return dataComment.map(d => d.number);
  };

  message = () => {
    const { dataMessage } = this.state;

    return dataMessage.map(d => d.number);
  };

  renderContent = () => {
    const { dataMessage, dataComment, loadingFilter } = this.state;

    const options = {
      title: { text: 'Biểu đồ' },
      subtitle: { text: 'Báo cáo từng ngày' },
      xAxis: { categories: this.date() },
      yAxis: { title: { text: 'Số lượng' } },
      series: [
        { name: 'Số lượng bình luận mới', data: this.comment() },
        { name: 'Số lượng inbox mới', data: this.message() }
      ]
    };

    if (loadingFilter) return <Loading />;

    return (
      <div style={{ minHeight: 600 }}>
        <HighchartsReact highcharts={Highcharts} options={options} />

        <div style={{ height: 30 }} />

        <CustomTable style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Thời gian</th>
              {dataMessage.map(d => (
                <th key={d.date}>{moment(d.date).format('DD')}</th>
              ))}
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Số lượng bình luận mới</th>
              {dataComment.map(d => (
                <td key={d.date}>{d.number}</td>
              ))}
              <td>{dataComment.reduce((value, o) => o.number + value, 0)}</td>
            </tr>
            <tr>
              <th>Số lượng inbox mới</th>
              {dataMessage.map(d => (
                <td key={d.date}>{d.number}</td>
              ))}
              <td>{dataMessage.reduce((value, o) => o.number + value, 0)}</td>
            </tr>
          </tbody>
        </CustomTable>
      </div>
    );
  };

  render() {
    const { filter, loading } = this.state;

    if (loading) return <Loading />;

    const { notifications } = this.context;
    const text = `${constants.title} - Tương tác`;
    const number = notifications.length;
    const title = `${number === 0 ? '' : `(${number})`}${text}`;

    return (
      <BaseLayout title={title}>
        <TitlePage>
          <span className="title">Tương tác</span>
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

            <Alert
              message="Chú ý:"
              description={
                <>
                  <p>
                    - Bình luận mới: Là tổng bình luận theo người trên tất các
                    bài viết không bao gồm những bình luận con.
                  </p>
                  <p>
                    - Inbox mới: Là tổng số người lần đầu inbox tới (Tính trên
                    hệ thống Vpage).
                  </p>

                  <p>
                    - Cột tổng Là tổng của tất cả các ngày đang xem tính theo
                    dòng.
                  </p>
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

export default enhance(ReportConversation);
