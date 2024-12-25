import { App, Button, Divider, Form, FormProps, Input } from "antd"
import './login.scss'
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAPI } from "@/services/api";

type FieldType = {
    username?: string | undefined;
    password?: string | undefined;
};

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { message, notification } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setIsLoading(true)
            const res = await loginAPI( values.username ?? '', values.password ?? '')
            if (res.data) {
                setIsLoading(false)
                localStorage.setItem("access_token", res.data.access_token)
                message.success("Đăng nhập thành công!")
                navigate("/")
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra!',
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 3
                })
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }
    
    return (
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large text-center flex justify-center">Đăng Nhập</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-login"   
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="username"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: "email", message: "Email không đúng định dạng!" }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                                    Đăng Nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Bạn chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage