import './home.scss';
import { useEffect, useState, useRef } from 'react';
import { httpGet, httpPut } from '../../services/request';
import { getAPIHostName, removeTimeFromDate, fallbackToDefaultAvatar, translateStatus } from '../../utils';
import { Row, Grid } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import Button from '../../components/button/button';
import { uploadImage } from '../../config/aws';
import 'hls-video-element';
// import { VideoJS } from './video';
import Videojs from './video';
import videojs from 'video.js';
import HLSVideoPlayer from './hls';

const Home = () => {
  const playerRef = useRef(null);

  const videoJsOptions = {
    // autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    // controls: true,
    // autoplay: true,
    preload: 'auto',
    // fluid: true,
    sources: [
      {
        src: 'https://storage.googleapis.com/ducmanhpham/2024-06-07/14/output_2024-06-07_14.m3u8',
        type: 'application/x-mpegURL'
      }
    ]
  };

  const handlePlayerReady = player => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <>
      <div>
        <Videojs options={videoJsOptions} onReady={handlePlayerReady} />
        <HLSVideoPlayer
          videoUrl={'https://storage.googleapis.com/ducmanhpham/2024-06-07/14/output_2024-06-07_14.m3u8'}
        />
      </div>
    </>
  );
};

export default Home;
