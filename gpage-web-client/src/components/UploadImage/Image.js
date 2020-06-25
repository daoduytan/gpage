import React from 'react';
import { Icon, message, Tooltip } from 'antd';
import { useSelector } from 'react-redux';

import { ImageStyle, WrapImage } from './style';
import { fireStorage } from '../../api/firebase';
import { refs } from '../../api';

const imageStorage = fireStorage.ref();

type ImageProps = {
  image: {
    name: string,
    src: string,
    id: string
  },
  select: Boolean,
  selectImage: any
};

const Image = ({ image, selectImage, select }: ImageProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);

  const removeImage = () => {
    const desertRef = imageStorage.child(`${user.shopId}/${image.name}`);

    desertRef
      .delete()
      .then(() => {
        refs.usersRefs
          .doc(user.shopId)
          .collection('images')
          .doc(image.id)
          .delete()
          .then(() => {
            setLoading(false);
            message.success('Đã xóa ảnh');
          })
          .catch(() => {
            message.error('Lỗi xóa ảnh');
            setLoading(false);
          });
      })
      .catch(() => {
        message.error('Lỗi xóa ảnh');
      });
  };

  const handleSelectImage = () => {
    if (select) return selectImage(null);
    return selectImage(image);
  };

  return (
    <Tooltip placement="top" title={image.name}>
      <WrapImage>
        <Icon
          type="close-circle"
          onClick={removeImage}
          style={{ position: 'absolute', top: 5, right: 20, zIndex: 10 }}
        />
        <ImageStyle src={image.src} select={select} onClick={handleSelectImage}>
          {loading && (
            <div className="spin">
              <Icon type="loading" />
            </div>
          )}
          <span>{image.name}</span>
        </ImageStyle>
      </WrapImage>
    </Tooltip>
  );
};

export default Image;
