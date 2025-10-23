import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Input, Card, Tag, Modal, Form, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    requestCreateCategory,
    requestDeleteCategory,
    requestGetAllCategory,
    requestUpdateCategory,
} from '../../../Config/request';

import { useStore } from '../../../hooks/useStore';

const CategoryManagement = () => {
    // Mock data for categories

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    const { dataCategory, fetchCategory } = useStore();

    // Table columns
    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'nameCategory',
            key: 'nameCategory',
            sorter: (a, b) => a.nameCategory.localeCompare(b.nameCategory),
        },
        {
            title: 'Số sản phẩm',
            dataIndex: 'products',
            key: 'products',
            render: (products) => products.length,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa danh mục này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Handlers for category actions
    const handleAdd = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingCategory(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            status: record.status,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (key) => {
        await requestDeleteCategory(key);
        fetchCategory();
        message.success('Xóa danh mục thành công');
    };

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                if (editingCategory) {
                    const data = {
                        id: editingCategory._id,
                        nameCategory: values.name,
                    };
                    await requestUpdateCategory(data);
                    fetchCategory();
                    message.success('Cập nhật danh mục thành công');
                } else {
                    const data = {
                        nameCategory: values.name,
                    };
                    await requestCreateCategory(data);
                    fetchCategory();
                    message.success('Thêm danh mục thành công');
                }
                setIsModalVisible(false);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Card title="Quản lý danh mục">
                <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm danh mục
                    </Button>
                </Space>
            </Card>

            <Table
                columns={columns}
                dataSource={dataCategory}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
            />

            <Modal
                title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingCategory ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" name="category_form">
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement;
