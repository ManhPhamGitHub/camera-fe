import './camera.scss';
import { useEffect, useState } from 'react';
import { httpGet, httpPut } from '../../services/request';
import { getAPIHostName, removeTimeFromDate, fallbackToDefaultAvatar, translateStatus } from '../../utils';
import { uploadImage } from '../../config/aws';
import { Space, Table, Tag, Col, Row, Input, Select, Card, Button, Switch } from 'antd';
import { SendOutlined } from '@ant-design/icons';
const Camera = () => {
  const [img, setImg] = useState(null);
  const [camSelected, setCamSelected] = useState();
  const [selectedRowKey, setSelectedRowKey] = useState(null);

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
    // const url = `${getAPIHostName()}/users/${userId}`;
    // let buildBodyToUpdate = {
    //   username: userName
    // };
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
          <Card style={{ width: '100%' }} title="Default size card" extra={<Button>Save</Button>}>
            <h2>Camera selected: </h2>
            <Input placeholder="Channel" prefix={<SendOutlined />} />
            <Input placeholder="Link" prefix={<SendOutlined />} />
            <Input placeholder="Input" prefix={<SendOutlined />} />
            <Input placeholder="Output" prefix={<SendOutlined />} />
            <Input placeholder="Link" prefix={<SendOutlined />} />
            <Select
              defaultValue="google"
              style={{ width: 120 }}
              options={[
                { value: 'google', label: 'google' },
                { value: 'cloudinary', label: 'cloudinary' }
              ]}
            />
          </Card>
        </Col>
      ) : null}
    </Row>
  );
};

export default Camera;
