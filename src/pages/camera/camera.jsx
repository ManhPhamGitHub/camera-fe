import './camera.scss';
import { useEffect, useState } from 'react';
import { httpGet, httpPost, httpPut } from '../../services/request';
import { getAPIHostName, removeTimeFromDate, hasEmptyProperties } from '../../utils';
import { Space, Table, Tag, Col, Row, Input, Select, Card, Button, Switch, notification, Upload, Modal } from 'antd';
import { SendOutlined, UploadOutlined, SettingOutlined } from '@ant-design/icons';
import { channel } from 'process';
const { TextArea } = Input;

const Camera = () => {
  const defaultSettingCam = { channel: 'discord', config: { link: '' } };
  const [camSelected, setCamSelected] = useState();
  const [settingCam, setSettingCam] = useState(defaultSettingCam);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cameraConfig, setCamConfig] = useState([]);
  const [uploadMessage, setUploadMessage] = useState();

  useEffect(() => {
    const getCamConfig = () => {
      const url = `${getAPIHostName()}/camera/config`;
      httpGet(url)
        .then(res => {
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
  console.log('camSelected', camSelected);

  const handleUpdateUser = async userId => {
    const url = `${getAPIHostName()}/camera`;
    if (hasEmptyProperties(camSelected)) {
      notification.error({
        title: 'Lỗi',
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }
    httpPost(url, camSelected)
      .then(res => {
        if (res.success) {
          notification.success({
            title: 'Thành công',
            message: 'Cập nhật thông tin thành công'
          });
          camSelected(null);
        }
      })
      .catch(() => {
        notification.error({
          title: 'Lỗi',
          message: 'Cập nhật thông tin thất bại'
        });
      });
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: ['cam', 'name'],
      key: 'cam.name'
    },
    {
      title: 'description',
      dataIndex: ['cam', 'description'],
      key: 'cam.description'
    },
    {
      title: 'startTime',
      dataIndex: ['cam', 'startTime'],
      key: 'cam.startTime',
      render: (_, record) => <Tag color="green">{removeTimeFromDate(record.cam.startTime)}</Tag>
    },
    {
      title: 'ipAddress',
      dataIndex: ['cam', 'ipAddress'],
      key: 'cam.ipAddress'
    },
    {
      title: 'Action',
      key: 'action',
      render: (event, record) => (
        <div onClick={e => e.stopPropagation()}>
          <Switch checked={record.cam.active} onChange={checked => handleSwitchChange(checked, record)} />
        </div>
      )
    }
  ];

  const handleSwitchChange = (checked, record) => {
    setCamConfig(prevState => {
      return prevState.map(item => {
        if (item.id === record.id) {
          return {
            ...item,
            cam: {
              ...item.cam,
              active: checked
            }
          };
        }
      });
    });
  };

  const handleRowClick = record => {
    if (record.id === camSelected?.id) {
      setCamSelected(null);
    } else {
      setCamSelected({
        id: record.id,
        name: record.cam.name,
        ipAddress: record.cam.ipAddress,
        description: record.cam.description,
        input: record.input,
        output: record.output,
        providerName: record.provider.providerName,
        config: record.provider.config
      });
      setSettingCam({
        idCam: record.cam.id,
        channel: record.notis.length ? record.notis[0].channel : 'discord',
        config: { link: record.notis.length ? record.notis[0].config.link : '' }
      });
    }
  };
  const rowClassName = record => {
    return record.id === camSelected?.id ? 'selected-row' : '';
  };
  if (cameraConfig.length === 0) return <></>;

  const CheckConnection = () => {
    if (!camSelected?.input || !camSelected?.input.includes('rtsp')) {
      notification.error({
        title: 'Lỗi',
        message: 'Input is not valid'
      });
      return;
    }

    const url = `${getAPIHostName()}/camera/check-connection?url=${camSelected?.input}`;
    httpGet(url)
      .then(res => {
        console.log('resres', res);
        if (res.status === 1 && res.data.success === true) {
          notification.success({
            title: 'Connect success',
            message: 'Connect success'
          });
        } else {
          notification.error({
            title: 'Lỗi',
            message: 'Connect fail'
          });
        }
      })
      .catch(() => {
        notification.error({
          title: 'Lỗi',
          message: 'Connect fail'
        });
      });
  };

  const handleOnchange = e => {
    console.log('e', e.target);
    setCamSelected({
      ...camSelected,
      [e.target.id]: e.target.value
    });
  };

  const handleFileChange = async info => {
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      const file = info.file.originFileObj;
      const reader = new FileReader();

      reader.onload = e => {
        try {
          const json = JSON.parse(e.target.result);
          setCamSelected({ ...camSelected, identify: json });
          setUploadMessage(info.file.name);
          // notification.success({ message: `${info.file.name} file uploaded successfully` });
        } catch (error) {
          notification.error({ message: 'Error parsing JSON file' });
        }
      };

      reader.readAsText(file);
    } else if (info.file.status === 'error') {
      notification.error({ message: `${info.file.name} file upload failed.` });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const url = `${getAPIHostName()}/camera/${settingCam.idCam}`;

    httpPut(url, settingCam)
      .then(res => {
        if (res.success) {
          notification.success({
            title: 'Thành công',
            message: 'Cập nhật thông tin thành công'
          });
          setIsModalOpen(false);
          setSettingCam(defaultSettingCam);
          camSelected(null);
        }
      })
      .catch(() => {
        notification.error({
          title: 'Lỗi',
          message: 'Cập nhật thông tin thất bại'
        });
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Row justify={'space-between'}>
      <Col span={8}>
        <Button onClick={() => (camSelected ? setCamSelected(null) : setCamSelected({}))}>Add</Button>
        <Table
          dataSource={cameraConfig}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                handleRowClick(record);
              }
            };
          }}
          rowClassName={rowClassName}
        />
      </Col>
      {camSelected ? (
        <Col span={12}>
          <Card
            style={{ width: '100%' }}
            title="Update camera"
            extra={
              <div>
                <Button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  icon={<SettingOutlined />}
                  style={{ marginRight: 10 }}
                ></Button>
                <Button
                  onClick={() => {
                    handleUpdateUser(camSelected.key);
                  }}
                >
                  Save
                </Button>
              </div>
            }
          >
            <h2>Camera selected: </h2>
            <div style={{ width: '50%' }}>
              <Input
                id="name"
                value={camSelected?.name}
                placeholder="Name"
                prefix={<SendOutlined />}
                onChange={handleOnchange}
              />
            </div>
            <div style={{ width: '50%', margin: '20px 0' }}>
              <Input
                id={'ipAddress'}
                value={camSelected?.ipAddress}
                placeholder="ipAddress"
                prefix={<SendOutlined />}
                onChange={handleOnchange}
              />
            </div>
            <div style={{ width: '50%' }}>
              <Input
                onChange={handleOnchange}
                id={'output'}
                value={camSelected?.output}
                placeholder="Output"
                prefix={<SendOutlined />}
              />
            </div>
            <div style={{ display: 'flex', margin: '20px 0' }}>
              <div style={{ width: '50%', marginRight: 20 }}>
                <Input
                  onChange={handleOnchange}
                  id={'input'}
                  value={camSelected?.input}
                  placeholder="Input"
                  prefix={<SendOutlined />}
                />
              </div>
              <Button onClick={CheckConnection}>Check connection</Button>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '50%' }}>
                <div>
                  <Select
                    value={camSelected?.providerName}
                    defaultValue="google-cloud"
                    id={'providerName'}
                    style={{ width: 120 }}
                    options={[{ value: 'google-cloud', label: 'google-cloud' }]}
                    onChange={value => setCamSelected({ ...camSelected, providerName: value })}
                  />
                </div>
                <div style={{ margin: '20px  0' }}>
                  <Input
                    value={camSelected?.config?.name}
                    placeholder="storage name"
                    prefix={<SendOutlined />}
                    onChange={e =>
                      setCamSelected({
                        ...camSelected,
                        config: { ...camSelected.config, name: e.target.value, link: 'https://storage.googleapis.com' }
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Upload
                  accept=".json"
                  showUploadList={false}
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess('ok');
                    }, 0);
                  }}
                  onChange={handleFileChange}
                >
                  <div style={{ marginLeft: 20 }}>
                    <Button style={{ height: 50 }} icon={<UploadOutlined />}>
                      Identity
                    </Button>
                    {uploadMessage ? <p style={{ color: 'green' }}>{uploadMessage}</p> : null}
                  </div>
                </Upload>
              </div>
            </div>
            <div>
              <TextArea
                id={'description'}
                value={camSelected?.description}
                placeholder="description"
                prefix={<SendOutlined />}
                onChange={handleOnchange}
              />
            </div>
          </Card>
        </Col>
      ) : null}
      <Modal title="Notification Setting" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <Select
            value={settingCam.channel}
            style={{ width: 120 }}
            options={[
              { value: 'discord', label: 'discord' },
              { value: 'email', label: 'email', disabled: true }
            ]}
            onChange={value => setSettingCam({ ...settingCam, channel: value })}
          />
        </div>
        <Input
          value={settingCam.config.link}
          placeholder="Link URL or email"
          onChange={e =>
            setSettingCam({
              ...settingCam,
              config: {
                ...settingCam?.config,
                link: e.target.value
              }
            })
          }
        />
      </Modal>
    </Row>
  );
};

export default Camera;
