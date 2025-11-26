import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Spin, Pagination, Empty, Breadcrumb, InputNumber, Select, Button, Space } from 'antd';
import axios from '../utils/axios.customize';

const { Option } = Select;

const normalize = (res) => {
  if (!res) return null;
  return res.data ?? res;
};

const ProductCard = ({ p }) => (
  <Card title={p.name} bordered hoverable>
    <p><strong>Genre:</strong> {p.genre}</p>
    <p><strong>Price:</strong> {Number(p.price).toLocaleString?.() ?? p.price} VND</p>
    <p><strong>Brand:</strong> {p.brand}</p>
    <p style={{ color: '#555' }}>{p.description}</p>
  </Card>
);

export default function ProductSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const keywords = searchParams.getAll('keyword');
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 5);
  const genre = searchParams.get('genre') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filterGenre, setFilterGenre] = useState(genre);
  const [filterMin, setFilterMin] = useState(minPrice);
  const [filterMax, setFilterMax] = useState(maxPrice);

  const buildQueryString = (overrides = {}) => {
    const params = new URLSearchParams();
    const kw = overrides.keywords ?? keywords;
    (Array.isArray(kw) ? kw : []).forEach(k => params.append('keyword', k));
    const g = overrides.genre ?? filterGenre;
    if (g) params.set('genre', g);
    const min = overrides.minPrice ?? filterMin;
    if (min) params.set('minPrice', String(min));
    const max = overrides.maxPrice ?? filterMax;
    if (max) params.set('maxPrice', String(max));
    params.set('page', String(overrides.page ?? page));
    params.set('limit', String(overrides.limit ?? limit));
    return params.toString();
  };

  const fetchData = useCallback(async (opts = {}) => {
    try {
      setLoading(true);
      const qs = buildQueryString(opts);
      const hasKeywords = (opts.keywords ?? keywords)?.length > 0;
      const url = hasKeywords ? `/api/v1/products/find?${qs}` : `/api/v1/products?${qs}`;
      const res = await axios.get(url);
      const data = normalize(res);
      const payload = data?.items ? data : data?.data ?? data;
      setItems(payload?.items || []);
      setTotal(payload?.total || 0);
      setTotalPages(payload?.totalPages || Math.ceil((payload?.total || 0) / (opts.limit || limit)) || 1);
    } catch (err) {
      console.error('fetchData error', err);
      setItems([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [keywords, filterGenre, filterMin, filterMax, page, limit]);

  useEffect(() => {
    fetchData();
  }, [searchParams.toString()]);

  const onPageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    navigate({ pathname: '/products/find', search: next.toString() });
  };

  const onApplyFilter = () => {
    const qs = buildQueryString({ page: 1 });
    navigate(`/products?${qs}`);
  };

  const title = keywords.length ? `Kết quả cho: ${keywords.join(' ')}` : 'Tất cả sản phẩm';

  return (
    <div style={{ padding: 20 }}>
      <Breadcrumb style={{ marginBottom: 12 }}>
        <Breadcrumb.Item onClick={() => navigate('/')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Products</Breadcrumb.Item>
      </Breadcrumb>

      <h2 style={{ marginBottom: 12 }}>{title}</h2>

      {/* FILTER */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Select
            value={filterGenre}
            placeholder="Chọn thể loại"
            style={{ width: '100%' }}
            onChange={v => setFilterGenre(v)}
            allowClear
          >
            <Option value="FASH">Thời trang</Option>
            <Option value="TECH">Công nghệ</Option>
            <Option value="HOME">Gia dụng</Option>
          </Select>
        </Col>
        <Col xs={12} sm={4}>
          <InputNumber
            value={filterMin}
            placeholder="Giá từ"
            min={0}
            style={{ width: '100%' }}
            onChange={v => setFilterMin(v)}
          />
        </Col>
        <Col xs={12} sm={4}>
          <InputNumber
            value={filterMax}
            placeholder="Đến"
            min={0}
            style={{ width: '100%' }}
            onChange={v => setFilterMax(v)}
          />
        </Col>
        <Col xs={24} sm={4}>
          <Button type="primary" style={{ width: '100%' }} onClick={onApplyFilter}>
            Áp dụng
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : items.length === 0 ? (
        <Empty description="Không tìm thấy sản phẩm" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {items.map(p => (
              <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard p={p} />
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
