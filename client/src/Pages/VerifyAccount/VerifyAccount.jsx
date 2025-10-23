import classNames from 'classnames/bind';
import styles from './VerifyAccount.module.scss';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { Form, Input, Button, message } from 'antd';
import { KeyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import successGif from '../../assets/images/success.gif';
import { requestVerifyAccount } from '../../Config/request';

const cx = classNames.bind(styles);

function VerifyAccount() {
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const handleVerifyOtp = async (values) => {
        setLoading(true);
        try {
            await requestVerifyAccount(values.otp);
            message.success('Xác thực tài khoản thành công!');
            setIsVerified(true);

            // Chuyển về trang đăng nhập sau 2 giây
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            navigate('/');
        } catch (error) {
            message.error(error?.response?.data?.message || 'Mã OTP không chính xác. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await requestResendOtp({ email });
            message.success('Mã OTP mới đã được gửi đến email của bạn!');
        } catch (error) {
            message.error(error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    if (isVerified) {
        return (
            <div className={cx('wrapper')}>
                <header>
                    <Header />
                </header>
                <div className={cx('inner')}>
                    <div className={cx('success-container')}>
                        <img src={successGif} alt="Success" className={cx('success-image')} />
                        <h2 className={cx('success-title')}>Xác thực thành công!</h2>
                        <p className={cx('success-description')}>
                            Tài khoản của bạn đã được xác thực. Bạn sẽ được chuyển đến trang đăng nhập...
                        </p>
                        <CheckCircleOutlined className={cx('success-icon')} />
                    </div>
                </div>
                <footer>
                    <Footer />
                </footer>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>
            <div className={cx('inner')}>
                <Form name="verify-account-form" className={cx('verify-form')} onFinish={handleVerifyOtp} form={form}>
                    <div className={cx('form-header')}>
                        <KeyOutlined className={cx('header-icon')} />
                        <h2>Xác thực tài khoản</h2>
                        <p className={cx('description')}>
                            {email
                                ? `Mã OTP đã được gửi đến email ${email}`
                                : 'Nhập mã OTP đã được gửi đến email của bạn'}
                        </p>
                    </div>

                    <Form.Item
                        name="otp"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã OTP!' },
                            {
                                pattern: /^[0-9]{6}$/,
                                message: 'Mã OTP phải gồm 6 chữ số!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<KeyOutlined />}
                            placeholder="Nhập mã OTP 6 chữ số"
                            size="large"
                            maxLength={6}
                            className={cx('otp-input')}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={cx('submit-button')}
                            size="large"
                            block
                            loading={loading}
                        >
                            Xác thực
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default VerifyAccount;
