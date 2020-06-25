const date = 15;

const checkExpired = (date_active: number) => {
  const time = date * 24 * 60 * 60 * 1000;
  const date_expired = date_active + time;
  const now = Date.now();
  if (date_expired - now > 0) return false;

  return true;
};

// eslint-disable-next-line import/prefer-default-export
export { checkExpired };
