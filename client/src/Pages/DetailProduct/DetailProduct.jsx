import classNames from 'classnames/bind';
import styles from './DetailProduct.module.scss';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';

import { useEffect, useRef, useState } from 'react';
import { requestAddToCart, requestCreateComment, requestGetProductById } from '../../Config/request';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { message, Rate, Form, Input, Button, List, Avatar, Space } from 'antd';
import { Comment } from '@ant-design/compatible';
import { useStore } from '../../hooks/useStore';

import CardBody from '../../Components/CardBody/CardBody';

const cx = classNames.bind(styles);

function DetailProduct() {
    const ref = useRef();

    const { id } = useParams();

    const navigate = useNavigate();

    const [dataProduct, setDataProduct] = useState({});
    const [dataCoupon, setDataCoupon] = useState([]);
    const [dataPreview, setDataPreview] = useState([]);
    const [dataComment, setDataComment] = useState([]);
    const [dataProductRelated, setDataProductRelated] = useState([]);

    const { fetchCart, dataUser } = useStore();

    const onCoppyCoupon = (nameCoupon) => {
        navigator.clipboard.writeText(nameCoupon);
        message.success('Sao chép mã giảm giá thành công');
    };

    const fetchData = async () => {
        const res = await requestGetProductById(id);
        document.title = `Sản phẩm | ${res.metadata.data.name} `;
        setDataProduct(res.metadata.data);
        setDataCoupon(res.metadata.dataCoupon);
        setDataPreview(res.metadata.dataPreview);
        setDataProductRelated(res.metadata.productRelated);
        setDataComment(res.metadata.dataComment);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const data = {
                productId: id,
                quantity: 1,
            };
            await requestAddToCart(data);
            message.success('Thêm vào giỏ hàng thành công');
            fetchCart();
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const handleBuyNow = async () => {
        try {
            const data = {
                productId: id,
                quantity: 1,
            };
            await requestAddToCart(data);
            message.success('Mua hàng thành công');
            fetchCart();
            navigate('/cart');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const [comment, setComment] = useState('');
    const [replyComment, setReplyComment] = useState('');

    const handleCreateComment = async (e) => {
        if (e.key === 'Enter') {
            const data = {
                postId: id,
                content: comment,
                parentId: selectedComment,
            };
            await requestCreateComment(data);
            fetchData();
            setComment('');
            setSelectedComment(null);
            message.success('Bình luận thành công');
        }
    };

    const handleCreateReplyComment = async (e) => {
        if (e.key === 'Enter') {
            const data = {
                postId: id,
                content: replyComment,
                parentId: selectedComment,
            };
            await requestCreateComment(data);
            fetchData();
            setReplyComment('');
            setSelectedComment(null);
            message.success('Trả lời bình luận thành công');
        }
    };
    const [selectedComment, setSelectedComment] = useState(null);

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>

            <main className={cx('main')} ref={ref}>
                <div className={cx('inner')}>
                    <div className={cx('swiper')}>
                        <Swiper
                            slidesPerView={1}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                            speed={1000}
                            spaceBetween={30}
                            effect={'fade'}
                            navigation={true}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[EffectFade, Navigation, Pagination, Autoplay]}
                            className="mySwiper"
                        >
                            {dataProduct?.images?.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <img src={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className={cx('product-info')}>
                        <h1>{dataProduct?.name}</h1>
                        <p>
                            {dataProduct?.priceDiscount > 0
                                ? dataProduct?.priceDiscount?.toLocaleString()
                                : dataProduct?.price?.toLocaleString()}
                            đ
                        </p>
                        <ul>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>Giao hàng ngày mở bán tại Việt Nam 16/05/2025</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>Sản phẩm chính hãng mới 100% nguyên seal</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>Giá đã bao gồm VAT</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>Bảo hành 12 tháng chính hãng</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>Giảm giá 10% khi mua phụ kiện kèm theo</span>
                            </li>
                        </ul>

                        <div className={cx('color-options')}>
                            <h3>Mã giảm giá</h3>
                            {dataCoupon.length > 0 ? (
                                dataCoupon.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => onCoppyCoupon(item.nameCoupon)}
                                        className={cx('color-btn')}
                                    >
                                        {item.nameCoupon} - Giảm {item.discount?.toLocaleString()}đ
                                    </button>
                                ))
                            ) : (
                                <p>Không có mã giảm giá phù hợp</p>
                            )}
                        </div>
                        {dataUser._id ? (
                            <div className={cx('button-group')}>
                                <button onClick={handleBuyNow}>Mua ngay</button>
                                <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                            </div>
                        ) : (
                            <div className={cx('button-group')}>
                                <Link to="/login">
                                    <button>Đăng nhập để mua hàng</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <div className={cx('specs')}>
                <h4>Thông số kỹ thuật</h4>
                <div>
                    <h5>Bộ xử lý CPU</h5>
                    <p>{dataProduct?.attributes?.cpu}</p>
                </div>

                <div>
                    <h5>Ram</h5>
                    <p>{dataProduct?.attributes?.ram}</p>
                </div>

                <div>
                    <h5>Màn hình</h5>
                    <p>{dataProduct?.attributes?.screen}</p>
                </div>
                <div>
                    <h5>GPU</h5>
                    <p>{dataProduct?.attributes?.gpu}</p>
                </div>
                <div>
                    <h5>Ổ cứng</h5>
                    <p>{dataProduct?.attributes?.storage}</p>
                </div>
                <div>
                    <h5>Kích thước</h5>
                    <p>{dataProduct?.attributes?.weight} gram</p>
                </div>
                <div>
                    <h5>Camera</h5>
                    <p>{dataProduct?.attributes?.camera}</p>
                </div>
                <div>
                    <h5>Pin</h5>
                    <p>{dataProduct?.attributes?.battery}</p>
                </div>
            </div>
            {dataPreview.length > 0 && (
                <div className={cx('reviews-section')}>
                    <div className={cx('reviews-container')}>
                        <h4>Đánh giá sản phẩm</h4>

                        <List
                            className={cx('reviews-list')}
                            itemLayout="horizontal"
                            dataSource={dataPreview}
                            renderItem={(item) => (
                                <Comment
                                    author={<a>{item.fullName}</a>}
                                    avatar={<Avatar src={item.avatar} alt={item.fullName} />}
                                    content={
                                        <>
                                            <Rate disabled defaultValue={item.rating} />
                                            <p>{item.comment}</p>
                                        </>
                                    }
                                    datetime={new Date(item.createdAt).toLocaleString()}
                                />
                            )}
                        />
                    </div>
                </div>
            )}

            <div className={cx('comment-list')}>
                <h5>Bình luận</h5>
                {dataUser._id ? (
                    <div className={cx('comment-section')}>
                        <img
                            src={
                                dataUser?.avatar
                                    ? `http://localhost:3000/uploads/avatars/${dataUser.avatar}`
                                    : 'https://doanwebsite.com/assets/userNotFound-DUSu2NMF.png'
                            }
                            alt=""
                        />
                        <div className={cx('comment-form')}>
                            <input
                                type="text"
                                placeholder="Viết bình luận..."
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={handleCreateComment}
                                value={comment}
                            />
                        </div>
                    </div>
                ) : null}
                {dataComment.map((item) => (
                    <div className={cx('comment-item')}>
                        <img
                            src={
                                item.avatar
                                    ? `http://localhost:3000/uploads/avatars/${item.avatar}`
                                    : 'https://doanwebsite.com/assets/userNotFound-DUSu2NMF.png'
                            }
                            alt=""
                        />
                        <div>
                            <h4>
                                {item.fullName} - {new Date(item.createdAt).toLocaleString()}
                            </h4>
                            <p>{item.content}</p>
                            {dataUser.isAdmin || dataUser._id === item.userId ? (
                                <button onClick={() => setSelectedComment(item._id)}>Phản hồi</button>
                            ) : null}

                            {item.replies.map((item2) => (
                                <div className={cx('comment-item')}>
                                    <img
                                        src={
                                            item2.avatar
                                                ? `http://localhost:3000/uploads/avatars/${item2.avatar}`
                                                : 'https://doanwebsite.com/assets/userNotFound-DUSu2NMF.png'
                                        }
                                        alt=""
                                    />
                                    <div>
                                        <h4>
                                            {item2.fullName} - {new Date(item2.createdAt).toLocaleString()}
                                        </h4>
                                        <p>{item2.content}</p>
                                    </div>
                                </div>
                            ))}
                            {selectedComment === item._id && (
                                <div
                                    style={{
                                        paddingTop: '10px',
                                    }}
                                    className={cx('comment-section')}
                                >
                                    <img
                                        style={{ width: '35px', height: '35px' }}
                                        src={
                                            dataUser?.avatar
                                                ? `http://localhost:3000/uploads/avatars/${dataUser.avatar}`
                                                : 'https://doanwebsite.com/assets/userNotFound-DUSu2NMF.png'
                                        }
                                        alt=""
                                    />
                                    <div className={cx('comment-form')}>
                                        <input
                                            style={{ width: '100%' }}
                                            type="text"
                                            placeholder="Trả lời bình luận..."
                                            onChange={(e) => setReplyComment(e.target.value)}
                                            onKeyDown={handleCreateReplyComment}
                                            value={replyComment}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Sản phẩm liên quan</h4>
            <div className={cx('product-related-list')}>
                {dataProductRelated.map((item) => (
                    <CardBody key={item._id} item={item} />
                ))}
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default DetailProduct;
