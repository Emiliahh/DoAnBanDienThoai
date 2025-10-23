import classNames from 'classnames/bind';
import styles from './InfoUser.module.scss';

import { Button, Input, message, Form, Upload, Avatar, Row, Col, Card, Typography } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useStore } from '../../../../hooks/useStore';
import { useEffect, useState } from 'react';
import { requestUpdateInfoUser } from '../../../../Config/request';
import ModalUpdatePassword from './ModalUpdatePassword/ModalUpdatePassword';
import OrderHistory from '../OrderHistory/OrderHistory';

const cx = classNames.bind(styles);
const { Title } = Typography;

function InfoUser({ isOpen, setIsOpen, activeTab }) {
    const { dataUser } = useStore();
    const [form] = Form.useForm();

    const [fullName, setFullName] = useState(dataUser.fullName);
    const [email, setEmail] = useState(dataUser.email);
    const [phone, setPhone] = useState(dataUser.phone);
    const [address, setAddress] = useState(dataUser.address || 'Chưa cập nhật');
    const [avatar, setAvatar] = useState(dataUser.avatar);
    const [images, setImages] = useState([]);

    useEffect(() => {
        setFullName(dataUser.fullName);
        setEmail(dataUser.email);
        setPhone(dataUser.phone);
        setAddress(dataUser.address || 'Chưa cập nhật');
        setAvatar(`http://localhost:3000/uploads/avatars/${dataUser.avatar}`);

        form.setFieldsValue({
            fullName: dataUser.fullName,
            email: dataUser.email,
            phone: dataUser.phone,
            address: dataUser.address || 'Chưa cập nhật',
        });
    }, [dataUser, form]);

    const handleUpdateInfoUser = async (values) => {
        try {
            const formData = new FormData();
            formData.append('fullName', values.fullName);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('address', values.address);
            formData.append('avatar', images);

            await requestUpdateInfoUser(formData);
            message.success('Cập nhật thông tin người dùng thành công');
            window.location.reload();
        } catch (error) {
            message.error('Cập nhật thông tin người dùng thất bại');
        }
    };

    const uploadProps = {
        name: 'avatar',
        beforeUpload: (file) => {
            setImages(file);

            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('Bạn chỉ có thể tải lên file hình ảnh!');
                return false;
            }
            // Here you would typically handle the file upload
            // For now we'll just create a preview URL
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setAvatar(reader.result);
            };
            return false;
        },
    };

    return (
        <div className={cx('wrapper')}>
            {activeTab === 'profile' ? (
                <Card>
                    <Title level={4}>Thông tin cá nhân</Title>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    size={120}
                                    icon={<UserOutlined />}
                                    src={avatar}
                                    style={{ marginBottom: '16px' }}
                                />
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />}>Cập nhật ảnh đại diện</Button>
                                </Upload>
                            </div>
                        </Col>
                        <Col xs={24} md={16}>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleUpdateInfoUser}
                                initialValues={{
                                    fullName,
                                    email,
                                    phone,
                                    address,
                                }}
                            >
                                <Form.Item
                                    name="fullName"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                >
                                    <Input size="large" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>

                                <Form.Item name="address" label="Địa chỉ">
                                    <Input.TextArea size="large" rows={3} />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" block>
                                        Cập nhật thông tin
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Card>
            ) : (
                <OrderHistory />
            )}
            <ModalUpdatePassword isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}

export default InfoUser;
