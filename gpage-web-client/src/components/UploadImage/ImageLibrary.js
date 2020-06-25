import React from 'react';
import { useSelector } from 'react-redux';
import { Input, Button } from 'antd';

import { refs } from '../../api';
import Loading from '../Loading';
import { UploadBtnImage } from '../../pages/Conversation/ModalImage';
import ImagesList from './ImagesList';

const { Search } = Input;

const ImageLibrary = ({ select_image, selectImage, handleImage }) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [images, setImages] = React.useState([]);

  React.useEffect(() => {
    refs.usersRefs
      .doc(user.shopId)
      .collection('images')
      .onSnapshot(querySnapshot => {
        const images_arr = [];

        querySnapshot.forEach(doc => {
          images_arr.push({ ...doc.data(), id: doc.id });
        });

        setImages(images_arr);
        setLoading(false);
      });
  }, [user.shopId]);

  const imageFilter = () => {
    if (text.length === 0) return images;

    const arrFilter = images.filter(img => {
      const index = img.name.indexOf(text);
      if (index >= 0) return true;

      return false;
    });

    return arrFilter;
  };

  const searchImg = e => setText(e.target.value);

  const renderImages = loading ? (
    <Loading />
  ) : (
    <ImagesList
      images={imageFilter()}
      select_image={select_image}
      selectImage={selectImage}
    />
  );

  return (
    <>
      <Search placeholder="Tìm tên ảnh" onChange={searchImg} />
      <div style={{ minHeight: 300, marginTop: 20 }}>{renderImages}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <UploadBtnImage />

        <Button type="primary" onClick={handleImage}>
          Chọn ảnh
        </Button>
      </div>
    </>
  );
};

export default ImageLibrary;
