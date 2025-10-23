import classNames from 'classnames/bind';
import styles from './SlideHome.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';

import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';

import Banner1 from '../../../assets/images/banner1.jpg';
import Banner2 from '../../../assets/images/banner2.jpg';
import Banner3 from '../../../assets/images/banner3.jpg';
import Banner4 from '../../../assets/images/banner4.jpg';
import Banner5 from '../../../assets/images/banner5.jpg';
import Banner6 from '../../../assets/images/banner6.jpg';

const cx = classNames.bind(styles);

function SlideHome() {
    return (
        <div className={cx('wrapper')}>
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
                <SwiperSlide>
                    <img
                        id={cx('banner-image')}
                        src={'https://macone.vn/wp-content/uploads/2025/03/Banner-slideshow-air-801.jpg'}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        id={cx('banner-image')}
                        src={'https://macone.vn/wp-content/uploads/2025/03/Banner-slideshow-air-02.jpg'}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}

export default SlideHome;
