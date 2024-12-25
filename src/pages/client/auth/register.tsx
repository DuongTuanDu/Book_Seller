import { App, Button, Divider, Form, FormProps, Input, message } from "antd"
import './register.scss'
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerAPI } from "@/services/api";

type FieldType = {
    fullName?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    phone?: string | undefined;
};

const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setIsLoading(true)
            const res = await registerAPI(values.fullName ?? '', values.email ?? '', values.password ?? '', values.phone ?? '')
            if (res.data) {
                message.success("Đăng ký tài khoản thành công!")
                setIsLoading(false)
                navigate("/login")
            } else {
                setIsLoading(false)
                message.error("Email đã tồn tại, vui lòng sử dụng email khác!")
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }
    
    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-register"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Họ tên"
                                name="fullName"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="email"
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
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Đã có tài khoản ?
                                <span>
                                    <Link to='/login' > Đăng Nhập </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage