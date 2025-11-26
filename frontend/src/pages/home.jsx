import { CrownOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { useEffect, useState } from 'react';
import { Input, Card, Col, Row, Pagination, Spin } from 'antd';
import axios from '../utils/axios.customize';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [loading, setLoading] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [value, setValue] = useState(''); // <-- ensure value defined
    const navigate = useNavigate();

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
                    <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                        <Card title={product.name} bordered hoverable>
                            <p><strong>Genre:</strong> {product.genre}</p>
                            <p><strong>Price:</strong> {product.price.toLocaleString()} VND</p>
                            <p><strong>Brand:</strong> {product.brand}</p>
                            <p>{product.description}</p>
                        </Card>
                    </Col>
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