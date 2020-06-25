import React from 'react';
import Image from './Image';

const ImagesList = ({ select_image, images, selectImage }) => {
  if (images.length === 0)
    return (
      <div style={{ textAlign: 'center', padding: 15 }}>Chưa có hình ảnh</div>
    );

  return images.map(image => (
    <Image
      key={image.id}
      image={image}
      select={select_image && select_image.id === image.id}
      selectImage={selectImage}
    />
  ));
};

export default ImagesList;
