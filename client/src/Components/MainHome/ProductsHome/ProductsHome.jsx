import classNames from 'classnames/bind';
import styles from './ProductsHome.module.scss';
import CardBody from '../../CardBody/CardBody';
import { Link } from 'react-router-dom';
import { useStore } from '../../../hooks/useStore';
import { AppstoreOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function ProductsHome() {
    const { dataCategory } = useStore();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                {dataCategory.map((item) => (
                    <div key={item._id}>
                        <h2 id={cx('title')}>
                            <AppstoreOutlined />
                            {item.nameCategory}
                        </h2>
                        <div className={cx('card-body')}>
                            {item.products.map((item2) => (
                                <CardBody key={item2._id} item={item2} />
                            ))}
                        </div>
                        <div className={cx('button-group')}>
                            <Link to={`/category/${item._id}`}>
                                <button>Xem tất cả</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductsHome;
