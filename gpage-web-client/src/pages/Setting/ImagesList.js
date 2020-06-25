import React from 'react';
import { useSelector } from 'react-redux';
import { Icon, message, Tooltip } from 'antd';

import { fireStorage } from '../../api/firebase';
import { refs } from '../../api';
import { StyleImage, WrapImage } from './style';

const imageStorage = fireStorage.ref();

type ImageProps = {
  addAttach: any,
  removeAttach: any,
  select: any,
  image: any
};

const Image = ({ addAttach, removeAttach, select, image }: ImageProps) => {
  const [loading, setLoading] = React.useState(false);
  const user = useSelector(({ authReducer }) => authReducer.user);

  const handleSelect = () => {
    if (select) {
      removeAttach(image);
    } else {
      addAttach(image);
    }
  };

  const removeImage = () => {
    if (select) {
      removeAttach();
    }
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

  return (
    <Tooltip placement="top" title={image.name}>
      <WrapImage>
        <Icon
          type="close-circle"
          onClick={removeImage}
          style={{ position: 'absolute', top: 5, right: 20, zIndex: 10 }}
        />
        <StyleImage
          select={select}
          src={image.src}
          onClick={handleSelect}
          role="presentation"
        >
          {loading && (
            <div className="spin">
              <Icon type="loading" />
            </div>
          )}
          <span>{image.name}</span>
        </StyleImage>
      </WrapImage>
    </Tooltip>
  );
};

const ImagesList = ({ images, attachs, addAttach, removeAttach }) => {
  if (images.length === 0) return null;

  return images.map(image => {
    const select = attachs.find(a => a.id === image.id);

    return (
      <Image
        image={image}
        addAttach={addAttach}
        removeAttach={removeAttach}
        select={!!select}
      />
    );
  });
};

export default ImagesList;
