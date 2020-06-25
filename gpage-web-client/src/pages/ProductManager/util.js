import { removeAlias } from '../../ultils';

const getIndex = (text_filter, text) => text_filter.indexOf(text);

const filterProduct = (product, type, text) => {
  const product_name = product[type];
  if (!product_name) return false;

  const produdct_name_format = removeAlias(product_name).toLowerCase();

  const text_format = removeAlias(text).toLowerCase();

  const index = getIndex(produdct_name_format, text_format);

  if (index < 0) return false;
  return true;
};

// eslint-disable-next-line import/prefer-default-export
export { filterProduct };
