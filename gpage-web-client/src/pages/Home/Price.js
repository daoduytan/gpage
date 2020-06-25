import React from 'react';

import { Container } from '../../components';
import { PriceSection } from './style';
import content from './content';
import TablePrice from './TablePrice';

const Price = () => {
  return (
    <PriceSection>
      <Container>
        <h2 className="title">{content.price.title}</h2>
        <TablePrice />
        {/* <div>
          <h3>{content.price.sub_title}</h3>
          {content.price.sub_content}
        </div> */}
      </Container>
    </PriceSection>
  );
};

export default Price;
