import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { createUserAPI } from '../utils/api.js';
import { Link, useNavigate } from 'react-router-dom';


const RegisterPage = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const { name, email, password } = values;
        const res = await createUserAPI(name, email, password);
        if (res) {
            notification.success({
                message: "CREATE USER",
                description: "Success"
            });
            navigate("/login");
        } else {
            notification.error({
                message: "CREATE USER",
                description: "error"
            })
        }
    };
    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1x solid #ccc",
                    borderRadius: "5px"
                }}>

                    <legend>Đăng ký tài khoản</legend>

                    <Form name="basic" onFinish={onFinish} autoComplete='off' layout='vertical'>

                        <Form.Item label='Email' name="email" rules={[{
                            required: true,
                            message: 'Vui lòng nhập email',
                        },
                        ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label='Password' name="password" rules={[{
                            required: true,
                            message: 'Vui lòng nhập mật khẩu',
                        },
                        ]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item label='Name' name="name" rules={[{
                            required: true,
                            message: 'Vui lòng nhập tên',
                        },
                        ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item >
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </Form.Item>

                    </Form>

                    <Link to={"/"}> Quay lai trang chu</Link>

                    <Divider />

                    <div style={{ textAlign: "center" }}>
                        Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
                    </div>

                </fieldset>
            </Col>
        </Row>
    );
}

export default RegisterPage;