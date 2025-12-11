import React, { useContext } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { loginAPI } from '../utils/api.js';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';


import { AuthContext } from '../components/context/auth.context'

const LoginPage = () => {
    const navigate = useNavigate();

    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;
        const res = await loginAPI(email, password);
        if (res && res.data.EC === 0) {
            localStorage.setItem("access_token", res.data.access_token);
            console.log("Success calling...")
            notification.success({
                message: "LOGIN USER",
                description: "Success"
            });

            setAuth({
                isAuthenticated: true,
                user: {
                    email: res?.user?.email ?? "",
                    name: res?.user?.name ?? ""
                }
            })
            navigate("/");
        } else {
            console.log("Error calling...", res.data.EM);
            toast.error(res.data.EM);
            notification.error({
                message: "LOGIN USER",
                description: res?.EM ?? "error"
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

                    <legend>Đăng nhập</legend>

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

                        <Form.Item >
                            <Button type='primary' htmlType='submit'>
                                Login
                            </Button>
                        </Form.Item>

                    </Form>

                    <Link to={"/"}> Quay lại trang chủ</Link>

                    <Divider />

                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link to={"/register"}>Đăng ký</Link>
                    </div>

                </fieldset>
            </Col>
        </Row>
    );
}

export default LoginPage;