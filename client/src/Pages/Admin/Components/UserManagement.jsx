import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Input, Modal, Form, Select, message } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { requestGetAllUser, requestUpdateUser } from '../../../Config/request';

const EditUserModal = ({ visible, onCancel, onOk, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                fullName: initialValues.name,
                email: initialValues.email,
                phone: initialValues.phone,
                isAdmin: initialValues.isAdmin,
            });
        }
    }, [visible, initialValues]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onOk(values);
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa thông tin người dùng"
            open={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item name="fullName" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="isAdmin" label="Quyền" rules={[{ required: true, message: 'Vui lòng chọn quyền!' }]}>
                    <Select>
                        <Select.Option value={true}>Quản trị</Select.Option>
                        <Select.Option value={false}>Người dùng</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const UserManagement = () => {
    const [dataUsers, setDataUsers] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Quyền',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            render: (text) => (text ? 'Quản trị' : 'Người dùng'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                    Chỉnh sửa
                </Button>
            ),
        },
    ];

    const fetchData = async () => {
        const res = await requestGetAllUser();
        setDataUsers(res.metadata.users);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditModalVisible(true);
    };

    console.log(selectedUser);

    const handleEditSubmit = async (values) => {
        try {
            const data = {
                id: selectedUser.id,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                isAdmin: values.isAdmin,
            };
            await requestUpdateUser(data);
            message.success('Cập nhật thông tin thành công!');
            setEditModalVisible(false);
            fetchData(); // Refresh data after update
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật thông tin!');
        }
    };

    const data = dataUsers.map((user) => ({
        key: user._id,
        id: user._id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
    }));

    return (
        <div>
            <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>Quản lý người dùng</h2>
                <Input placeholder="Tìm kiếm người dùng" prefix={<SearchOutlined />} />
            </Space>
            <Table columns={columns} dataSource={data} />

            <EditUserModal
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onOk={handleEditSubmit}
                initialValues={selectedUser}
            />
        </div>
    );
};

export default UserManagement;
