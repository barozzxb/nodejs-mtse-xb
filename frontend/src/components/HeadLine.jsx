import React from 'react';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Space, Typography } from 'antd';

const { Text } = Typography;

const PageHeaderNav = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Row
      align="middle"
      style={{
        padding: '12px 0',
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        background: '#fff',
      }}
    >
      <Col flex="none">
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>

          <Button
            type="text"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            Trang chủ
          </Button>
        </Space>
      </Col>

      {title && (
        <Col flex="auto" style={{ textAlign: 'right' }}>
          <Text strong style={{ fontSize: 16 }}>{title}</Text>
        </Col>
      )}
    </Row>
  );
};

export default PageHeaderNav;
