import classNames from 'classnames/bind';
import styles from './MainHome.module.scss';
import SlideHome from './SlideHome/SlideHome';
import ProductsHome from './ProductsHome/ProductsHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faRotateRight, faThumbsUp, faTruck } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);

function MainHome() {
    return (
        <div className={cx('wrapper')}>
            <div>
                <SlideHome />
            </div>
            <div className={cx('title')}>
                <h3>COMPUTERSHOP - Đại lý uỷ quyền chính thức của (AAR)</h3>
            </div>
            <div>
                <ProductsHome />
            </div>
        </div>
    );
}

export default MainHome;
