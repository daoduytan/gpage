import React from 'react';
import { Table, Card } from 'antd';
import { Th } from '../../components';

type TableFaceboolPagesProps = {
  customer: any
};

const TableFaceboolPages = ({ customer }: TableFaceboolPagesProps) => {
  // const { loading, pages } = usePages(customer.uid);

  const pages = customer.facebookPages;

  const dataSource = pages.map((page, index) => ({
    ...page,
    stt: index + 1,
    key: page.id
  }));

  const columns = [
    { title: <Th>STT</Th>, width: 50, dataIndex: 'stt', key: 'stt' },
    { title: <Th>Tên</Th>, dataIndex: 'name', key: 'name' }
    // {
    //   title: <b>Hạn sử dụng</b>,
    //   dataIndex: '',

    //   key: 'han_su_dung',
    //   render: page => {
    //     const color = page.date_acitve > Date.now() ? 'green' : 'red';
    //     return (
    //       <span style={{ color }}>
    //         {moment(page.date_acitve).format('DD/MM/YYYY')}
    //       </span>
    //     );
    //   }
    // }
    // {
    //   title: '',
    //   dataIndex: '',
    //   width: 120,
    //   key: 'x',
    //   render: page => {
    //     const exits = find(p => p.id === page.id, pages);
    //     const numberTime = exits.date_acitve - Date.now();
    //     const number_date = Math.floor(numberTime / (24 * 60 * 60 * 1000));
    //     const percent = ((15 - number_date) * 100) / 15;

    //     return <Progress percent={Math.floor(percent)} showInfo={false} />;
    //   }
    // }
  ];

  return (
    <>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 15 }}>
        Danh sách fanpage
      </div>
      <Card bodyStyle={{ padding: 0 }} type="inner">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          // loading={loading}
        />
      </Card>
    </>
  );
};

export default TableFaceboolPages;
