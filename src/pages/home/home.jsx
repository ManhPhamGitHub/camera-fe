import './home.scss';
import { useState, useEffect, useRef } from 'react';
import { dateFormmated, currentHours, getAPIUrl, getAPIHostName } from '../../utils';
import { Modal, notification, Carousel, Card, Button } from 'antd';
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

const { Meta } = Card;

const Home = () => {
  const [cameraOpen, setCameraOpen] = useState();
  const [cameraConfig, setCamConfig] = useState([]);

  useEffect(() => {
    const getCamConfig = () => {
      const url = `${getAPIHostName()}/camera/config`;
      httpGet(url)
        .then(res => {
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
  const carouselRef = useRef(null);
  const slidesToShow = 3;
  const next = () => {
    carouselRef.current.next();
  };

  const prev = () => {
    carouselRef.current.prev();
  };
  console.log('cameraConfig', cameraConfig);
  // if (!cameraConfig.length) return <></>;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
        <HLSVideoPlayer
          videoUrl={`${getAPIUrl()}/storage/${
            cameraOpen?.cam.name
          }/${dateFormmated}/${currentHours}/output_${dateFormmated}_${currentHours}.m3u8`}
        />
      </div>
      <div style={{ position: 'relative' }}>
        <Button onClick={prev} style={{ position: 'absolute', top: 50, left: 0 }}>
          Prev
        </Button>
        <Carousel style={{ margin: '0 50px' }} ref={carouselRef} slidesToScroll={slidesToShow} slidesToShow={3}>
          {cameraConfig.map(camera => (
            <div style={{ width: '100%' }} key={camera.id}>
              <Card hoverable style={{ width: '90%', margin: 'auto' }} onClick={() => setCameraOpen(camera)}>
                <Meta title={camera.cam.name} description={camera.cam.description} />
                <p>IP Address: {camera.cam.ipAddress}</p>
                <p>Start Time: {new Date(camera.cam.startTime).toLocaleString()}</p>
                <p>Active: {camera.cam.active ? 'Yes' : 'No'}</p>
              </Card>
            </div>
          ))}
        </Carousel>
        <Button onClick={next} style={{ position: 'absolute', top: 50, right: 0 }}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Home;
