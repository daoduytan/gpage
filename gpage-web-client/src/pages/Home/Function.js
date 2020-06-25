import React from 'react';
import { Link } from 'react-scroll';

import { FunctionSection } from './style';
import content from './content';
import { Container } from '../../components';

const Function = () => {
  return (
    <FunctionSection>
      <Container>
        <h2 className="title">{content.function.title}</h2>

        <div className="contentBox">
          {content.function.box_contents.map(item => (
            <div key={item.id} className="box">
              <img src={item.img} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.dec}</p>
              <Link to={item.id} spy smooth duration={500} offset={-82}>
                Xem thêm
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </FunctionSection>
  );
};

export default Function;
