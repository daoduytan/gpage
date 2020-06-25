import React from 'react';
import { Modal, Icon } from 'antd';

import { UploadImageStyle, ImageSelect } from './style';
import ImageLibrary from './ImageLibrary';

type UploadImageProps = { size?: number, upload: any, image: any };

const UploadImage = ({ image, size, upload }: UploadImageProps) => {
  const [visible, setVisible] = React.useState(false);
  const [select_image, setSelectImage] = React.useState(image);
  const toggle = () => setVisible(!visible);

  const selectImage = img => {
    setSelectImage(img);
  };

  const handleImage = () => {
    upload(select_image);
    toggle();
  };

  const render = select_image ? (
    <ImageSelect src={select_image.src}>
      <div className="gray">
        <Icon type="plus" style={{ color: '#fff' }} />
      </div>
    </ImageSelect>
  ) : (
    <Icon type="plus" />
  );

  return (
    <>
      <UploadImageStyle size={size} onClick={toggle}>
        {render}
      </UploadImageStyle>

      <Modal
        visible={visible}
        title="Thư viện ảnh"
        onCancel={toggle}
        footer={null}
        width={800}
      >
        <ImageLibrary
          select_image={select_image}
          selectImage={selectImage}
          handleImage={handleImage}
        />
      </Modal>
    </>
  );
};

UploadImage.defaultProps = {
  size: 100
};

export default UploadImage;
