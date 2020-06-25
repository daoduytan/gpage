import React from 'react';
import { Element } from 'react-scroll';

import DefaultLayout from '../../layout/DefaultLayout';
import constants from '../../constants';
import Banner from './Banner';
import Function from './Function';
import DetailFunction from './DetailFunction';
import Price from './Price';

const Home = () => {
  return (
    <DefaultLayout title={constants.title}>
      <Banner />

      <Element name="tinh_nang">
        <Function />
      </Element>
      <DetailFunction />
      <Element name="bang_gia">
        <Price />
      </Element>
    </DefaultLayout>
  );
};

export default Home;
