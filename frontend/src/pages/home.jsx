import { CrownOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { useEffect, useState } from 'react';
import { Input, Card, Col, Row, Pagination, Spin } from 'antd';
import axios from '../utils/axios.customize';
import { useNavigate } from 'react-router-dom';

import {useCart as useCartHook} from '../hooks/useCartQuery';
import ProductCard from '../components/productCard';

const { Search } = Input;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [ploading, setpLoading] = useState(false);

    const [value, setValue] = useState(''); 
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const buildSearchParams = (raw) => {
        const s = (raw || '').trim().replace(/\s+/g, ' ');
        const params = new URLSearchParams();
        if (!s) {
            params.set('page', '1');
            params.set('limit', '10');
            return params.toString();
        }
        const parts = s.split(' ').map(p => p.trim()).filter(Boolean);
        parts.forEach(k => params.append('q', k));
        params.set('page', '1');
        params.set('limit', '10');
        return params.toString();
    };

    const fetchProducts = async (page = 1) => {
        try {
            setpLoading(true);
            const res = await axios.get(`/api/v1/products?limit=${pageSize}&page=${page}`);
            if (res && res.data) {
                setProducts(res.data.items);
                setTotalPages(res.data.totalPages);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setpLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const onSearch = (v) => {
        const q = buildSearchParams(v);
        navigate(`/products?${q}`);
    };

    const handlePageChange = (page) => {
        fetchProducts(page);
    };

    if (ploading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>

            <Row justify="center" style={{ marginTop: 24 }}>
                <Col xs={20} sm={16} md={12} lg={10}>
                    <Search
                        placeholder="Tìm sản phẩm"
                        enterButton="Tìm"
                        size="large"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onSearch={onSearch}
                        allowClear
                    />
                </Col>
            </Row>

            <div style={{ padding: 20 }}>
                <Result
                    icon={<CrownOutlined />}
                    title="JSON Web Token (ReactJS/NodeJS)" />
            </div>
            <Row gutter={[16, 16]}>
                {products.map((product) => (
                        <ProductCard product={product} key={product._id}/>
                ))}
            </Row>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
}

export default HomePage;