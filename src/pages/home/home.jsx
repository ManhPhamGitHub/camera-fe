import './home.scss';
import { useEffect, useState } from 'react';
import { httpGet, httpPut } from '../../services/request';
import { getAPIHostName, removeTimeFromDate, fallbackToDefaultAvatar, translateStatus } from '../../utils';
import { notification, Input } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import Button from '../../components/button/button';
import { uploadImage } from '../../config/aws';

const Home = () => {
  const [previewImg, setPreviewImg] = useState();
  const [img, setImg] = useState(null);
  const [userInfor, setUserInfor] = useState({});
  const [userName, setUserName] = useState();
  useEffect(() => {
    // const getUserDetail = () => {
    //   const url = `${getAPIHostName()}/users/find/${userId}`;
    //   setPageLoading(true);
    //   httpGet(url)
    //     .then(res => {
    //       if (res.success) {
    //         setUserInfor(res.data);
    //         setUserName(res.data.username);
    //         setAccountAvatar(res.data.user_avatar);
    //       }
    //       setPageLoading(false);
    //     })
    //     .catch(() => {
    //       notification.error({
    //         title: 'Lỗi',
    //         message: 'Không thể lấy thông tin người dùng'
    //       });
    //       setPageLoading(false);
    //     });
    // };
    // getUserDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateUser = async userId => {
    const url = `${getAPIHostName()}/users/${userId}`;
    let buildBodyToUpdate = {
      username: userName
    };
    if (img) {
      const imageName = img[0].name?.split('.');
      const fileNameRandom = `${imageName[0]}-${Date.now()}.${imageName[1]}`;
      const publicUrl = await uploadImage(fileNameRandom, img[0]);
      buildBodyToUpdate = { ...buildBodyToUpdate, user_avatar: publicUrl };
    }

    // httpPut(url, buildBodyToUpdate, accessToken)
    //   .then(res => {
    //     if (res.success) {
    //       const { user_avatar, username } = res.data;
    //       setAccountAvatar(user_avatar);
    //       setAccountName(username);
    //       setImg(null);
    //       notification.success({
    //         title: 'Thành công',
    //         message: 'Cập nhật thông tin thành công'
    //       });
    //     }
    //   })
    //   .catch(() => {
    //     notification.error({
    //       title: 'Lỗi',
    //       message: 'Cập nhật thông tin thất bại'
    //     });
    //   });
  };

  const handlePreview = img => {
    if (!img?.[0]?.type?.includes('image')) {
      notification.error({
        title: 'Lỗi',
        message: 'File không đúng định dạng'
      });
      return;
    }
    const imgSize = img[0].size;
    if (imgSize > 10e6) {
      notification.error({
        title: 'Lỗi',
        message: 'Dung lượng của ảnh phải nhỏ hơn 10MB'
      });
      return;
    } else {
      setImg(img);
      const url = URL.createObjectURL(img[0]);
      setPreviewImg(url);
    }
  };

  return (
    <div className="overview-wrapper">
      <div className="overview__heading">Tổng quan nhân viên</div>
      <div className="overview__content">
        <div className="overview__content-avatar">
          <input
            className="overview__inp-change-avatar"
            type="file"
            onChange={e => handlePreview(e.target.files)}
            accept="image/*"
          ></input>
          <img src={previewImg} alt="User avatar" className="avatar__img" loading="lazy" />
          <CameraOutlined className="avatar__camera" />
        </div>

        <div className="overview__content-detail">
          <div className="overview__content-detail-wrapper">
            <div className="overview__content-detail-heading">
              <div>Thông tin nhân viên</div>
            </div>
            <div>
              <div>Tên nhân viên</div>
              <input defaultValue={userName} onInput={e => setUserName(e.target.value)} />
            </div>
            <div>
              <div>Email</div>
              <Input size={'medium'} value={userInfor.email} disabled></Input>
            </div>
            <div>
              <div>Quyền hạn</div>
              <Input size={'medium'} value={userInfor.role} disabled></Input>
            </div>
            <div>
              <div>Tình trạng hoạt động</div>
              <Input size={'medium'} value={translateStatus(userInfor.status) || 'Active'} disabled></Input>
            </div>
            <div>
              <div>Ngày vào làm</div>
              <Input size={'medium'} value={removeTimeFromDate(userInfor.createdAt)} disabled></Input>
            </div>

            <div className="overview__edit">
              <Button className="overview__edit-cancel" onClick={() => setImg(null)}>
                Huỷ
              </Button>
              <Button
                className="overview__edit-ok"
                onClick={() => {
                  handleUpdateUser(userInfor._id);
                }}
                disable={!userName && !img}
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
