import { CrownOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { useEffect, useState } from 'react';
import { Input, Card, Col, Row, Pagination, Spin } from 'antd';
import axios from '../utils/axios.customize';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

import CartDrawer, {useCart} from 'cart-lib-xb';
import ProductCard from '../components/productCard';

const { Search } = Input;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [loading, setLoading] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [value, setValue] = useState(''); 
    const navigate = useNavigate();

    const cart = useCart([]);
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
        parts.forEach(k => params.append('keyword', k));
        params.set('page', '1');
        params.set('limit', '10');
        return params.toString();
    };

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const onSearch = (v) => {
        const qs = buildSearchParams(v);
        navigate(`/products?${qs}`);
    };

    const handlePageChange = (page) => {
        fetchProducts(page);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>

            <Button onClick={() => setOpen(true)}>Open Cart ({cart.items.length})</Button>

            <CartDrawer
                open={open}
                onClose={() => setOpen(false)}
                items={cart.items}
                onUpdateQuantity={(id, qty) => cart.update(id, { quantity: qty })}
                onRemove={(id) => cart.remove(id)}
                onToggleSelect={(id) => cart.toggleSelect(id)}
                onSelectAll={(checked) => {
                    cart.items.forEach(i => cart.update(i.id, { selected: checked }));
                }}
            />

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