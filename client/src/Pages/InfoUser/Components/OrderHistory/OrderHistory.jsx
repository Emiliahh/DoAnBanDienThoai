import { Button, message, Table, Modal, Rate, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { requestCancelOrder, requestCreateProductPreview, requestGetHistoryOrder } from '../../../../Config/request';
import classNames from 'classnames/bind';
import styles from './OrderHistory.module.scss';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);
const { TextArea } = Input;

function OrderHistory() {
    const [dataOrder, setDataOrder] = useState([]);
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [rating, setRating] = useState(5);
    const [reviewContent, setReviewContent] = useState('');

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'products',
            key: 'products',
            render: (products) => (
                <div className={cx('products-list')}>
                    {products.map((product, index) => (
                        <div key={product.productId} className={cx('product-item')}>
                            <img src={product.image} alt={product.name} />
                            <div className={cx('product-info')}>
                                <span className={cx('product-name')}>{product.name}</span>
                                <span className={cx('product-price')}>{product.price.toLocaleString('vi-VN')} đ</span>
                                <span>Số lượng : {product.quantity} sản phẩm</span>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (totalPrice) => <span className={cx('total-price')}>{totalPrice.toLocaleString('vi-VN')} đ</span>,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusOrder',
            key: 'statusOrder',
            render: (status) => {
                let color = '';
                let text = '';

                switch (status) {
                    case 'pending':
                        color = '#faad14';
                        text = 'Đang xử lý';
                        break;
                    case 'completed':
                        color = '#1677ff';
                        text = 'Đã xác nhận';
                        break;
                    case 'shipping':
                        color = '#722ed1';
                        text = 'Đang vận chuyển';
                        break;
                    case 'delivered':
                        color = '#52c41a';
                        text = 'Đã giao hàng';
                        break;
                    case 'cancelled':
                        color = '#ff4d4f';
                        text = 'Đã hủy';
                        break;
                    default:
                        color = '#000000';
                        text = status;
                }

                return (
                    <span
                        style={{
                            color: color,
                            fontWeight: 600,
                        }}
                    >
                        {text}
                    </span>
                );
            },
        },
        {
            title: 'Phương thức',
            dataIndex: 'typePayments',
            key: 'typePayments',
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('HH:mm DD/MM/YYYY'),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) =>
                record.statusOrder === 'pending' ? (
                    <Button onClick={() => handleCancelOrder(record.orderId)} type="primary" danger>
                        Huỷ đơn
                    </Button>
                ) : record.statusOrder === 'delivered' ? (
                    <Button onClick={() => handleOpenReviewModal(record)} type="primary">
                        Đánh giá sản phẩm
                    </Button>
                ) : (
                    <></>
                ),
        },
    ];

    const fetchData = async () => {
        const res = await requestGetHistoryOrder();
        setDataOrder(res.metadata.orders);
    };

    const handleCancelOrder = async (id) => {
        try {
            const data = {
                orderId: id,
            };
            await requestCancelOrder(data);
            fetchData();
            message.success('Đơn hàng đã được hủy');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const handleOpenReviewModal = (order) => {
        setSelectedOrder(order);
        setSelectedProduct(null);
        setRating(5);
        setReviewContent('');
        setIsReviewModalVisible(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalVisible(false);
        setSelectedOrder(null);
        setSelectedProduct(null);
        setRating(5);
        setReviewContent('');
    };

    const handleSubmitReview = async () => {
        if (!selectedProduct) {
            message.error('Vui lòng chọn sản phẩm cần đánh giá');
            return;
        }

        try {
            const data = {
                productId: selectedProduct,
                rating,
                comment: reviewContent,
            };
            await requestCreateProductPreview(data);
            message.success('Đánh giá sản phẩm thành công');
            handleCloseReviewModal();
        } catch (error) {
            message.error('Có lỗi xảy ra khi gửi đánh giá');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h5>Đơn hàng</h5>
            <div>
                <Table
                    dataSource={dataOrder}
                    columns={columns}
                    rowKey="orderId"
                    pagination={false}
                    rowClassName={cx('table-row')}
                />
            </div>

            <Modal
                title="Đánh giá sản phẩm"
                open={isReviewModalVisible}
                onCancel={handleCloseReviewModal}
                onOk={handleSubmitReview}
                okText="Gửi đánh giá"
                cancelText="Hủy"
                width={600}
            >
                <div className={cx('review-modal')}>
                    <div className={cx('product-select')}>
                        <div className={cx('products-grid')}>
                            {selectedOrder?.products
                                .filter((product) => product.dataPreview.length < 1)
                                .map((product) => (
                                    <div
                                        key={product.productId}
                                        className={cx('product-card', {
                                            selected: selectedProduct === product.productId,
                                        })}
                                        onClick={() => setSelectedProduct(product.productId)}
                                    >
                                        <img src={product.image} alt={product.name} />
                                        <div className={cx('product-details')}>
                                            <h4>{product.name}</h4>
                                            <span className={cx('price')}>
                                                {product.price.toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className={cx('review-form')}>
                        <div className={cx('rate-label')}>Đánh giá của bạn:</div>
                        <Rate value={rating} onChange={setRating} />

                        <div className={cx('review-content')}>
                            <TextArea
                                rows={4}
                                placeholder="Nhập nội dung đánh giá của bạn..."
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default OrderHistory;
