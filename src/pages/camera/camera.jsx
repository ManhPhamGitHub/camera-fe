import './camera.scss';
import { useEffect, useState } from 'react';
import { httpGet, httpPost, httpPut } from '../../services/request';
import { getAPIHostName, removeTimeFromDate, fallbackToDefaultAvatar, translateStatus } from '../../utils';
import { uploadImage } from '../../config/aws';
import { Space, Table, Tag, Col, Row, Input, Select, Card, Button, Switch, notification } from 'antd';
import { SendOutlined } from '@ant-design/icons';
const Camera = () => {
  const [img, setImg] = useState(null);
  const [camSelected, setCamSelected] = useState();
  const [camUpdate, setCamUpdate] = useState(null);

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
    const url = `${getAPIHostName()}/camera`;

    httpPost(url, {})
      .then(res => {
        if (res.success) {
          notification.success({
            title: 'Thành công',
            message: 'Cập nhật thông tin thành công'
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
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => <Switch defaultChecked />
    }
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }
  ];

  const handleRowClick = record => {
    if (record.key === camSelected?.key) {
      setCamSelected(null);
    } else {
      setCamSelected(record);
    }
  };

  const rowClassName = record => {
    return record.key === camSelected?.key ? 'selected-row' : '';
  };

  const CheckConnection = () => {
    const url = `${getAPIHostName()}/camera/check-connection?url='123'`;
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

  const onChangeCam = () =>{
    setcamUpdate(!camUpdate)
  }
  return (
    <Row justify={'space-between'}>
      <Col span={8}>
        <Button>Add</Button>
        <Table
          dataSource={data}
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
        ;
      </Col>
      {camSelected?.key ? (
        <Col span={12}>
          <Card
            style={{ width: '100%' }}
            title="Default size card"
            extra={
              <Button
                onClick={() => {
                  handleUpdateUser(camSelected.key);
                }}
              >
                Save
              </Button>
            }
          >
            <h2>Camera selected: </h2>
            <div style={{ width: '50%' }}>
              <Input placeholder="Name" prefix={<SendOutlined />} />
            </div>
            <div style={{ width: '50%' }}>
              <Input placeholder="Output" prefix={<SendOutlined />} />
            </div>
            <div style={{ width: '50%' }}>
              <Input placeholder="Input" prefix={<SendOutlined />} />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '50%', marginRight: 20 }}>
                <Input placeholder="Link" prefix={<SendOutlined />} />
              </div>
              <Button onClick={CheckConnection}>Check connection</Button>
            </div>
            <div style={{ width: '50%' }}>
              <Select
                defaultValue="google"
                style={{ width: 120 }}
                options={[
                  { value: 'google', label: 'google' },
                  { value: 'cloudinary', label: 'cloudinary' }
                ]}
              />
            </div>
          </Card>
        </Col>
      ) : null}
    </Row>
  );
};

export default Camera;
