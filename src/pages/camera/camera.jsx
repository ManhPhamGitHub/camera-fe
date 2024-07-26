import './camera.scss';
import { useEffect, useState } from 'react';
import { httpGet, httpPost, httpPut } from '../../services/request';
import { getAPIHostName, removeTimeFromDate, hasEmptyProperties } from '../../utils';
import {
  Space,
  Table,
  Tag,
  Col,
  Row,
  Input,
  Select,
  Card,
  Button,
  Switch,
  notification,
  Upload,
  Modal,
  Tooltip
} from 'antd';
import { SendOutlined, UploadOutlined, SettingOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const url = `${getAPIHostName()}/camera/config`;

const Camera = () => {
  const defaultSettingCam = [
    { channel: 'discord', config: { link: '' } },
    { channel: 'email', config: { link: '' } }
  ];
  const [camSelected, setCamSelected] = useState();
  const [settingCam, setSettingCam] = useState(defaultSettingCam);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cameraConfig, setCamConfig] = useState([]);
  const [uploadMessage, setUploadMessage] = useState();

  const getCamConfig = () => {
    httpGet(`${url}?active=${false}`)
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

  useEffect(() => {
    getCamConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCamConfig = camSelected => {
    const url = `${getAPIHostName()}/camera`;
    httpPost(url, camSelected)
      .then(res => {
        if (res.status === 1) {
          notification.success({
            title: 'Thành công',
            message: 'Cập nhật thông tin thành công'
          });
          setCamSelected(null);
          setUploadMessage('');
          getCamConfig();
        } else {
          notification.error({
            title: 'Lỗi',
            message: 'Cập nhật thông tin thất bại'
          });
        }
      })
      .catch(() => {
        notification.error({
          title: 'Lỗi',
          message: 'Cập nhật thông tin thất bại'
        });
      });
  };

  const handleUpdateUser = async userId => {
    const listInput = ['name', 'ipAddress', 'output', 'input', 'crf', 'providerName', 'resolution', 'description'];

    if (!Object.keys(camSelected).length || listInput.filter(e => !camSelected[e]).length > 0) {
      notification.error({
        title: 'Lỗi',
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }

    updateCamConfig(camSelected);
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
      render: (_, record) => <Tag color="green">{removeTimeFromDate(record?.cam.startTime)}</Tag>
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
          <Switch checked={record?.cam.active} onChange={checked => handleSwitchChange(checked, record)} />
        </div>
      )
    }
  ];

  const handleSwitchChange = async (checked, record) => {
    await updateCamConfig({ ...record, active: checked });
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
        config: record.provider.config,
        resolution: record.resolution,
        crf: record.crf,
        idCam: record.cam.id
      });
      if (record.notis.length > 0) {
        if (record.notis.length < 2 && record.notis[0].channel === 'discord') {
          record.notis.push({ channel: 'email', config: { link: '' } });
        } else if (record.notis.length < 2 && record.notis[0].channel === 'email') {
          record.notis.push({ channel: 'discord', config: { link: '' } });
        }

        setSettingCam(record.notis);
      }
    }
  };
  // if (cameraConfig.length === 0) return <></>;

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
        if (res.status === 1 && res.data.status === true) {
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
    const url = `${getAPIHostName()}/camera/${camSelected.idCam}/noti`;
    httpPut(url, settingCam)
      .then(res => {
        if (res.status === 1) {
          notification.success({
            title: 'Thành công',
            message: 'Cập nhật thông tin thành công'
          });
          setIsModalOpen(false);
        } else {
          notification.error({
            title: 'Lỗi',
            message: 'Cập nhật thông tin thất bại'
          });
        }
      })
      .catch(error => {
        console.log('error', error);
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
      {/* <a href="https://github.com/login/oauth/authorize?client_id=Iv23lilYDG3TcfcXZNCh&scope=repo,admin:repo_hook">
        Camera
      </a>
      <a
        href="https://gitlab.com/oauth/authorize?client_id=5bfd621387a641d5fc19be4fb451005852bd78558919cbf607093ae617cb93b7&redirect_uri=http://42.96.58.232:8000/api/v1/camera/callback
&response_type=code"
      >
        git lab
      </a> */}
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
            <div style={{ display: 'flex', margin: '20px 0' }}>
              <div style={{ width: '50%', marginRight: 20 }}>
                <Input
                  onChange={handleOnchange}
                  id={'ipAddress'}
                  value={camSelected?.ipAddress}
                  placeholder="ipAddress"
                  prefix={<SendOutlined />}
                />
              </div>
              <div style={{ width: '30%' }}>
                <Tooltip title="BitRate Camera , khuyến nghị sử dụng mặc định là 23 , bitrate càng cao chất lượng hình ảnh thấp và dung lượng file sẽ thấp và ngược lại">
                  <Input
                    type="number"
                    onChange={handleOnchange}
                    id={'crf'}
                    value={camSelected?.crf}
                    placeholder="crf"
                    prefix={<SendOutlined />}
                  />
                </Tooltip>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '50%', marginRight: 20 }}>
                <Input
                  onChange={handleOnchange}
                  id={'output'}
                  value={camSelected?.output}
                  placeholder="Output"
                  prefix={<SendOutlined />}
                />
              </div>
              <div style={{ width: '30%' }}>
                <Tooltip title="Độ phân giải">
                  <Select
                    value={camSelected?.resolution}
                    id={'providerName'}
                    style={{ width: '100%' }}
                    placeholder="Resolution"
                    options={[
                      { value: '480p', label: '480p' },
                      { value: '720p', label: '720p' },
                      { value: '1080p', label: '1080p' }
                    ]}
                    onChange={value => setCamSelected({ ...camSelected, resolution: value })}
                  />
                </Tooltip>
              </div>
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
                    id={'providerName'}
                    style={{ width: '100%' }}
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
        {settingCam.map((item, index) => {
          return (
            <div>
              <div style={{ marginBottom: 20 }}>
                <Select
                  value={item?.channel}
                  style={{ width: 120, marginRight: 10 }}
                  options={[{ value: 'discord', label: 'discord' }]}
                  // onChange={value => setSettingCam({ ...settingCam, channel: value })}
                />
              </div>
              <Input
                value={item.config.link}
                placeholder="Link or receiver"
                onChange={e =>
                  setSettingCam(prevState => {
                    prevState[index].config.link = e.target.value;
                    prevState[index].idCam = camSelected.idCam;
                    return [...prevState];
                  })
                }
              />
            </div>
          );
        })}
      </Modal>
    </Row>
  );
};

export default Camera;
