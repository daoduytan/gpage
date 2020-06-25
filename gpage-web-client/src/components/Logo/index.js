import React, { memo } from 'react';
import { Link } from '@reach/router';

import constants from '../../constants';
import logo_dark from '../../assets/logo.png';
import logo_light from '../../assets/logo2.png';

type LogoProps = {
  light?: boolean
};

const Logo = ({ light, ...props }: LogoProps) => {
  const logo = light ? logo_light : logo_dark;
  return (
    <Link to="/">
      <img src={logo} alt={constants.title} {...props} />
    </Link>
  );
};

Logo.defaultProps = {
  light: false
};

export default memo(Logo);
