import classNames from 'classnames/bind';
import styles from './Category.module.scss';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';

import { Select } from 'antd';
import CardBody from '../../Components/CardBody/CardBody';
import { useEffect, useRef, useState } from 'react';
import { requestFilterProduct } from '../../Config/request';
import { useParams } from 'react-router-dom';
const cx = classNames.bind(styles);

function Category() {
    const [dataProduct, setDataProduct] = useState([]);

    const { id } = useParams();

    const handlePriceRange = async (range) => {
        try {
            const res = await requestFilterProduct({ priceRange: range, categoryId: id });
            setDataProduct(res.metadata);
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    };

    const handleChange = async (value) => {
        try {
            const pricedes = value === 'jack' ? 'desc' : 'asc';
            const res = await requestFilterProduct({ pricedes, categoryId: id });
            setDataProduct(res.metadata);
        } catch (error) {
            console.error('Error sorting products:', error);
        }
    };

    const ref = useRef();

    useEffect(() => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestFilterProduct({ categoryId: id });
            setDataProduct(res.metadata);
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')} ref={ref}>
            <header>
                <Header />
            </header>

            <main className={cx('main')}>
                <div className={cx('inner')}>
                    <div className={cx('fillter')}>
                        <div>
                            <button onClick={() => handlePriceRange()}>Mặc định</button>
                            <button onClick={() => handlePriceRange('under20')}>Dưới 20 triệu</button>
                            <button onClick={() => handlePriceRange('20to40')}>20 - 40 triệu</button>
                            <button onClick={() => handlePriceRange('above40')}>Trên 40 triệu</button>
                        </div>

                        <div>
                            <Select
                                defaultValue="lucy"
                                style={{ width: 200 }}
                                onChange={handleChange}
                                options={[
                                    { value: 'jack', label: 'Giá từ cao đến thấp' },
                                    { value: 'lucy', label: 'Giá từ thấp đến cao' },
                                ]}
                            />
                        </div>
                    </div>

                    <div>
                        {dataProduct.map((item) => (
                            <CardBody item={item} />
                        ))}
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Category;
