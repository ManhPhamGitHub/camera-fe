import React, { useState, useRef, useEffect } from 'react';
import { Collapse, Modal, Button, Input, notification } from 'antd';
import videojs from 'video.js';
import Videojs from './video';
import { httpGet } from '../../services/request';
import { getAPIHostName } from '../../utils';

const { Panel } = Collapse;

const CameraCollapse = () => {
  const [visible, setVisible] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [cameraConfig, setCamConfig] = useState([]);

  useEffect(() => {
    const getCamConfig = () => {
      const url = `${getAPIHostName()}/camera/config`;
      httpGet(url)
        .then(res => {
          console.log('resres', res);
          if (res.status === 1) {
            setCamConfig(res.data);
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

  const showModal = storage => {
    setSelectedStorage(storage);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedStorage(null);
  };

  const playerRef = useRef(null);

  // /home/manhpd/manh.pd/test/camera/dist/storage/string/2024-06-12/output_2024-06-12_15.m3u8
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
  const groupByDate = storages => {
    return storages.reduce((acc, storage) => {
      const date = storage.name.split('_')[1];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(storage);
      return acc;
    }, {});
  };
  console.log('selectedStorage', selectedStorage);
  if (cameraConfig.length === 0) return <></>;
  return (
    <div>
      <Collapse>
        {cameraConfig.map(item => (
          <Panel header={item.cam.name} key={item.id}>
            <p>
              <b>IP Address:</b> {item.cam.ipAddress}
            </p>
            <p>
              <b>Start Time:</b> {new Date(item.cam.startTime).toLocaleString()}
            </p>
            <p>
              <b>Active:</b> {item.cam.active ? 'Yes' : 'No'}
            </p>
            <Input
              placeholder="Search by date (YYYY-MM-DD)"
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
            />
            <Collapse>
              {Object.entries(groupByDate(item.storages))
                .filter(([date]) => !searchDate || date.includes(searchDate))
                .map(([date, storages]) => (
                  <Panel header={date} key={date}>
                    {storages.map(storage =>
                      storage.path.includes('m3u8') ? (
                        <Button
                          style={{
                            boxShadow: '5px 10px #888888;',
                            border: '1px solid #888888',
                            margin: '15px',
                            color: 'black',
                            width: '30%'
                          }}
                          key={storage.id}
                          type="link"
                          onClick={() => showModal(storage)}
                        >
                          {storage.name}
                        </Button>
                      ) : null
                    )}
                  </Panel>
                ))}
            </Collapse>
          </Panel>
        ))}
      </Collapse>

      <Modal
        className="test123"
        // style={{ width: '600px' }}
        visible={visible}
        title={cameraConfig[0].cam.name}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Videojs
          source={[
            {
              src: `${selectedStorage?.url}/${selectedStorage?.path}`,
              type: 'application/x-mpegURL'
            }
          ]}
          onReady={handlePlayerReady}
        />
      </Modal>
    </div>
  );
};

export default CameraCollapse;
