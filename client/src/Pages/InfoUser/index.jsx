import classNames from 'classnames/bind';
import styles from './InfoUser.module.scss';
import Header from '../../Components/Header/Header';

import InfoUser from './Components/InfoUser/InfoUser';
import { useStore } from '../../hooks/useStore';
import { useState } from 'react';
import { requestLogout } from '../../Config/request';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function InfoUserPage() {
    const { dataUser } = useStore();

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await requestLogout();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>

            <main className={cx('main')}>
                <div className={cx('container')}>
                    <div className={cx('left')}>
                        <div className={cx('avatar')}>
                            <img
                                src={
                                    `http://localhost:3000/uploads/avatars/${dataUser.avatar}` ||
                                    'https://doanwebsite.com/assets/userNotFound-DUSu2NMF.png'
                                }
                                alt="avatar"
                            />
                        </div>
                        <div className={cx('info')}>
                            <h4>{dataUser.fullName}</h4>
                            <ul>
                                <li
                                    className={activeTab === 'profile' ? cx('active') : ''}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    Trang cá nhân
                                </li>
                                <li
                                    className={activeTab === 'orders' ? cx('active') : ''}
                                    onClick={() => setActiveTab('orders')}
                                >
                                    Quản lý đơn hàng
                                </li>
                                <li onClick={() => setIsOpen(true)}>Đổi mật khẩu</li>
                                <li onClick={handleLogOut}>Đăng xuất</li>
                            </ul>
                        </div>
                    </div>
                    <div className={cx('right')}>
                        <InfoUser
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default InfoUserPage;
