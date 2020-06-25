import React from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { fireStorage } from '../../api/firebase';
import theme from '../../theme';
import { refs } from '../../api';

// image
const UploadImageStyle = styled.div`
  border: 1px dashed ${theme.color.border};
  border-radius: 3px;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: ${theme.color.primary};
  }

  input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    rigth: 0;
    bottom: 0;
    cursor: pointer;
  }

  &:hover {
    .gray {
      background: rgba(0, 0, 0, 0.4);
      display: flex;
    }
  }
`;

const padding = 3;

const Image = styled.div`
  position: absolute;
  top: ${padding}px;
  left: ${padding}px;
  right: ${padding}px;
  bottom: ${padding}px;
  border-radius: 3px;
  display: flex;

  background: ${({ src }) => {
    return `url(${src.src}) no-repeat center`;
  }};
  background-size: cover;

  .gray {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    display: none;
  }
`;

// upload image
type UploadImageProps = {
  size?: Number,
  image: String,
  upload: Function
};

const UploadImage = ({ size, image, upload }: UploadImageProps) => {
  const user = useSelector(({ authReducer }) => authReducer.user);
  const [loading, setLoading] = React.useState(false);

  const handleUploadImage = e => {
    const file = e.target.files[0];
    setLoading(true);
    const ref = `products/${file.name}`;
    fireStorage
      .ref()
      .child(ref)
      .put(file)
      .then(snapshot => {
        // console.log('snapshot', index, snapshot);
        snapshot.ref.getDownloadURL().then(downloadURL => {
          const imageRes = {
            id: Date.now(),
            name: file.name,
            src: downloadURL
          };

          refs.usersRefs
            .doc(user.shopId)
            .collection('images')
            .add(imageRes)
            .then(() => {
              upload(imageRes);
              setLoading(false);
            })
            .catch(error => console.log('dad', error));
        });
      });
  };

  const render = () => {
    if (loading) return <Icon type="loading" />;

    if (!image || image.length === 0) return <Icon type="plus" />;

    return (
      <Image src={image}>
        <div className="gray">
          <Icon type="plus" style={{ color: '#fff' }} />
        </div>
      </Image>
    );
  };

  return (
    <UploadImageStyle size={size}>
      {render()}

      <input type="file" onChange={handleUploadImage} multiple />
    </UploadImageStyle>
  );
};

UploadImage.defaultProps = {
  size: 100
};

export default UploadImage;
