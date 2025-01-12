import { getBooksAPI, getCategoryAPI } from '@/services/api';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import {
    Row, Col, Form, Checkbox, Divider, InputNumber,
    Button, Rate, Tabs, Pagination, Spin
} from 'antd';
import type { FormProps } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import 'styles/home.scss';

type FieldType = {
    range: {
        from: number;
        to: number
    }
    category: string[]
};


const HomePage = () => {
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {


    }

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items = [
        {
            key: "sort=-sold",
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: 'sort=-updatedAt',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: 'sort=price',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];


    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto', overflow: "hidden" }}>
                    <Row gutter={[20, 20]}>
                        <Col md={4} sm={0} xs={0}>
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <span> <FilterTwoTone />
                                        <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                    </span>
                                    <ReloadOutlined title="Reset" onClick={() => {
                                        form.resetFields();
                                    }}
                                    />
                                </div>
                                <Divider />
                                <Form
                                    onFinish={onFinish}
                                    form={form}
                                >
                                    <Form.Item
                                        name="category"
                                        label="Danh mục sản phẩm"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Checkbox.Group>
                                            <Row>
                                                <Col span={24}>
                                                    <Checkbox value="all">Tất cả</Checkbox>
                                                </Col>
                                                <Col span={24}>
                                                    <Checkbox value="new">Mới</Checkbox>
                                                </Col>
                                                <Col span={24}>
                                                    <Checkbox value="best">Phổ biến</Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Khoảng giá"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Row gutter={[10, 10]} style={{ width: "100%" }}>
                                            <Col xl={11} md={24}>
                                                <Form.Item name={["range", 'from']}>
                                                    <InputNumber
                                                        name='from'
                                                        min={0}
                                                        placeholder="đ TỪ"
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xl={2} md={0}>
                                                <div > - </div>
                                            </Col>
                                            <Col xl={11} md={24}>
                                                <Form.Item name={["range", 'to']}>
                                                    <InputNumber
                                                        name='to'
                                                        min={0}
                                                        placeholder="đ ĐẾN"
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <div>
                                            <Button onClick={() => form.submit()}
                                                style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                                        </div>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Đánh giá"
                                        labelCol={{ span: 24 }}
                                    >
                                        <div>
                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                            <span className="ant-rate-text"></span>
                                        </div>
                                        <div>
                                            <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                            <span className="ant-rate-text">trở lên</span>
                                        </div>
                                        <div>
                                            <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                            <span className="ant-rate-text">trở lên</span>
                                        </div>
                                        <div>
                                            <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                            <span className="ant-rate-text">trở lên</span>
                                        </div>
                                        <div>
                                            <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                            <span className="ant-rate-text">trở lên</span>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>

                        <Col md={20} xs={24} >
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <Row >
                                    <Tabs
                                        defaultActiveKey="sort=-sold"
                                        items={items}
                                        onChange={onChange}
                                        style={{ overflowX: "auto" }}
                                    />
                                </Row>
                                <Row className='customize-row'>
                                    <div
                                        className="column">
                                        <div className='wrapper'>
                                            <div className='thumbnail'>
                                                <img src="http://localhost:8080/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg" alt="thumbnail book" />
                                            </div>
                                            <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                            <div className='price'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                            </div>
                                            <div className='rating'>
                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                <span>Đã bán 1K</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="column">
                                        <div className='wrapper'>
                                            <div className='thumbnail'>
                                                <img src="http://localhost:8080/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg" alt="thumbnail book" />
                                            </div>
                                            <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                            <div className='price'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                            </div>
                                            <div className='rating'>
                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                <span>Đã bán 1K</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="column">
                                        <div className='wrapper'>
                                            <div className='thumbnail'>
                                                <img src="http://localhost:8080/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg" alt="thumbnail book" />
                                            </div>
                                            <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                            <div className='price'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                            </div>
                                            <div className='rating'>
                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                <span>Đã bán 1K</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="column">
                                        <div className='wrapper'>
                                            <div className='thumbnail'>
                                                <img src="http://localhost:8080/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg" alt="thumbnail book" />
                                            </div>
                                            <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                            <div className='price'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                            </div>
                                            <div className='rating'>
                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                <span>Đã bán 1K</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="column">
                                        <div className='wrapper'>
                                            <div className='thumbnail'>
                                                <img src="http://localhost:8080/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg" alt="thumbnail book" />
                                            </div>
                                            <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                            <div className='price'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                            </div>
                                            <div className='rating'>
                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                <span>Đã bán 1K</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="column">
                                        <div className='wrapper'>
                                            <div className='thumbnail'>
                                                <img src="http://localhost:8080/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg" alt="thumbnail book" />
                                            </div>
                                            <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính</div>
                                            <div className='price'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                            </div>
                                            <div className='rating'>
                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                <span>Đã bán 1K</span>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div style={{ marginTop: 30 }}></div>
                                <Row style={{ display: "flex", justifyContent: "center" }}>
                                    <Pagination
                                        defaultCurrent={6}
                                        total={500}
                                        responsive
                                    />
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default HomePage;