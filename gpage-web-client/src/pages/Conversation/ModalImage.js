// @flow
import React, { useState, useEffect, useContext } from 'react';
import { Icon, Modal, Button, Input, message, Badge } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { forEach } from 'lodash';

import { fireStorage } from '../../api/firebase';
import { Context } from './ConversationAction';
import { Loading } from '../../components';
import theme from '../../theme';
import hocModal from './hocModal';
import { refs } from '../../api';

// styles
const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderWrap = styled(Wrap)`
  .close {
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    cursor: pointer;
  }
`;

const InputFileWrap = styled.div`
  overflow: hidden;
  position: relative;

  input {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
  }
`;

// label
const LabelModalImage = () => {
  const { attachs } = React.useContext(Context);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Icon type="picture" style={{ marginRight: 10 }} /> Gửi ảnh{' '}
      {attachs.length > 0 && (
        <Badge count={attachs.length} style={{ marginLeft: 5 }} />
      )}
    </div>
  );
};
// upload
const imageStorage = fireStorage.ref();

export const UploadBtnImage = () => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = useState(false);

  const handleUploadImage = e => {
    const file = e.target.files;
    let index = 0;

    setLoading(true);

    forEach(file, i => {
      const ref = `${user.shopId}/${i.name}`;

      imageStorage
        .child(ref)
        .put(i)
        .then(snapshot => {
          index += 1;
          // console.log('snapshot', index, snapshot);
          snapshot.ref.getDownloadURL().then(downloadURL => {
            refs.usersRefs
              .doc(user.shopId)
              .collection('images')
              .add({
                name: i.name,
                src: downloadURL
              })
              .then()
              .catch(error => console.log('error', error));
          });
          if (index === file.length) {
            setLoading(false);
          }
        });
    });
  };

  return (
    <InputFileWrap>
      <Button type="danger" loading={loading}>
        Upload ảnh mới
      </Button>
      <input type="file" onChange={handleUploadImage} multiple />
    </InputFileWrap>
  );
};

// image
type ImageProps = {
  image: {
    src: String,
    name: String,
    id: Number
  }
};

const image_size = 100;

const WrapImage = styled.div`
  display: inline-block;
  position: relative;
`;

const StyleImage = styled.div`
  display: inline-block;
  width: ${image_size}px;
  height: ${image_size}px;
  margin-right: ${theme.size.space}px;
  background: ${({ src }) => `#f9f9f9 url(${src}) no-repeat center`};
  background-size: cover;
  border-style: solid;
  border-width: ${({ select }) => (select ? 2 : 1)}px;
  border-color: ${({ select }) =>
    select ? theme.color.primary : theme.color.border};
  border-radius: ${theme.size.borderRadius}px;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  .spin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  span {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 10px;
    padding: 3px 5px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Image = ({ image }: ImageProps) => {
  const [loading, setLoading] = React.useState(false);
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [select, setSelect] = useState(false);
  const { setAttachs, attachs } = useContext(Context);

  const handleSelect = () => {
    if (select) {
      setSelect(false);
      const newAttachs = attachs.filter(a => a.id !== image.id);
      setAttachs(newAttachs);
    } else {
      setSelect(true);
      setAttachs([...attachs, image]);
    }
  };

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
            console.log('323213');
            message.error('Lỗi xóa ảnh');
            setLoading(false);
          });
      })
      .catch(() => {
        console.log('3444444');
        message.error('Lỗi xóa ảnh');
      });
  };

  return (
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
  );
};

// image list
type ImagesListProps = {
  images: Array,
  addImg: Function,
  removeImg: Function
};

export const ImagesList = ({ images, addImg, removeImg }: ImagesListProps) => {
  const renderImage = () => {
    if (images.length === 0)
      return (
        <div style={{ textAlign: 'center', padding: 15 }}>Chưa có hình ảnh</div>
      );
    return images.map(image => (
      <Image
        image={image}
        key={image.id}
        addImg={addImg}
        removeImg={removeImg}
      />
    ));
  };

  return renderImage();
};

type BtnSendImgProps = { onCancel: Function };
const BtnSendImg = ({ onCancel }: BtnSendImgProps) => {
  const { attachs, handleReply } = useContext(Context);
  const onClick = () => {
    handleReply();
    onCancel();
  };
  return (
    <Button type="primary" onClick={onClick}>
      {attachs.length} Gửi ảnh đã chọn
    </Button>
  );
};

type ModalImageProps = { visible: boolean, onCancel: Function, title?: string };

const ModalImage = ({ visible, onCancel, title }: ModalImageProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const { setAttachs } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
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

  const handleSearch = e => {
    setText(e.target.value);
  };

  const imageFilter = () => {
    if (text.length === 0) return images;

    const arrFilter = images.filter(img => {
      const index = img.name.indexOf(text);
      if (index >= 0) return true;

      return false;
    });

    return arrFilter;
  };

  const handleCancel = () => {
    onCancel();
    setAttachs([]);
  };

  const renderImages = loading ? (
    <Loading />
  ) : (
    <ImagesList images={imageFilter()} />
  );

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={handleCancel}
      closable={false}
      footer={null}
    >
      <div>
        <HeaderWrap>
          <Input
            size="large"
            placeholder="Tìm kiếm"
            value={text}
            onChange={handleSearch}
          />
          <div className="close" onClick={onCancel} role="presentation">
            <Icon type="close" />
          </div>
        </HeaderWrap>

        <div style={{ minHeight: 350, padding: '15px 0' }}>{renderImages}</div>

        <Wrap>
          <UploadBtnImage />
          <BtnSendImg onCancel={onCancel} />
        </Wrap>
      </div>
    </Modal>
  );
};

ModalImage.defaultProps = { title: '' };

export default hocModal(ModalImage, LabelModalImage);
