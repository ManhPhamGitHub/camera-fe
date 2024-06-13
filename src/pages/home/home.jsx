import './home.scss';
import { useState, useEffect } from 'react';
import { dateFormmated, currentHours, getAPIUrl, getAPIHostName } from '../../utils';
import { Modal, notification, Carousel } from 'antd';
import 'hls-video-element';
import { httpGet } from '../../services/request';
import HLSVideoPlayer from './hls';
const contentStyle = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79'
};
const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState();
  const [cameraConfig, setCamConfig] = useState([]);

  useEffect(() => {
    const getCamConfig = () => {
      const url = `${getAPIHostName()}/camera/config`;
      httpGet(url)
        .then(res => {
          console.log('resres', res);
          if (res.status === 1) {
            setCamConfig(res.data);
            setCameraOpen(res.data[0]);
          }
        })
        .catch(() => {
          notification.error({
            title: 'Lỗi',
            message: 'Không thể lấy thông tin người dùng'
          });
        });
    };
    getCamConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('cameraConfig', cameraConfig);
  if (!cameraConfig.length) return <></>;
  return (
    <div>
      <HLSVideoPlayer
        videoUrl={`${getAPIUrl()}/storage/${
          cameraOpen.cam.name
        }/${dateFormmated}/${currentHours}/output_${dateFormmated}_${currentHours}.m3u8`}
      />
      <Carousel arrows infinite={false}>
        {cameraConfig.map(camera => (
          <div key={camera.id} style={contentStyle}>
            <h3>{camera.cam.name}</h3>
            <p>{camera.cam.description}</p>
            <button onClick={() => setCameraOpen(camera)}>Xem</button>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Home;
