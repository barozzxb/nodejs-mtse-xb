import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Spin, Pagination, Empty, Select, Button, InputNumber, Input } from 'antd';
import axios from '../utils/axios.customize';
import ProductCard from '../components/productCard.jsx';
import PageHeaderNav from '../components/HeadLine.jsx';

const { Search } = Input;
const { Option } = Select;

const normalize = (res) => {
  if (!res) return null;
  return res.data ?? res;
};

export default function ProductSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 5);
  const genre = searchParams.get('genre') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [value, setValue] = useState(q);
  const [filterGenre, setFilterGenre] = useState(genre);
  const [filterMin, setFilterMin] = useState(minPrice);
  const [filterMax, setFilterMax] = useState(maxPrice);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const mergeParams = (overrides = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    const setOrDelete = (key, val) => {
      if (val === undefined || val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    };

    Object.entries(overrides).forEach(([k, v]) => setOrDelete(k, v));

    return params;
  };

  useEffect(() => {
    setValue(q);
    setFilterGenre(genre);
    setFilterMin(minPrice);
    setFilterMax(maxPrice);
  }, [q, genre, minPrice, maxPrice]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const qs = searchParams.toString();
        const url = `/api/v1/products/search?${qs}`;

        const res = await axios.get(url);
        const data = normalize(res);
        const payload = data?.DT ?? {};

        setItems(payload.items ?? []);
        setTotal(payload.total ?? 0);
        setTotalPages(Math.max(1, Math.ceil((payload.total ?? 0) / limit)));
      } catch (err) {
        console.error('fetchData error', err);
        setItems([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams.toString(), limit]);

  const onPageChange = (newPage) => {
    const params = mergeParams({ page: newPage });
    setSearchParams(params);
  };

  const onApplyFilter = () => {
    const params = mergeParams({
      genre: filterGenre,
      minPrice: filterMin,
      maxPrice: filterMax,
      page: 1,
    });
    setSearchParams(params);
  };

  const onSearch = (text) => {
    const raw = (text || '').trim();
    const params = new URLSearchParams();

    if (raw) params.set('q', raw);

    if (filterGenre) params.set('genre', filterGenre);
    if (filterMin !== '') params.set('minPrice', String(filterMin));
    if (filterMax !== '') params.set('maxPrice', String(filterMax));
    params.set('limit', '5');
    params.set('page', '1');

    setSearchParams(params);
  };

  const title = q ? `Kết quả tìm kiếm: ${q}` : 'Tất cả sản phẩm';

  return (
    <>
      <PageHeaderNav title="Sản phẩm"/>
      <div style={{ padding: 20 }}>
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

        <h2 style={{ marginBottom: 12 }}>{title}</h2>

        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={8}>
            <Select
              value={filterGenre || undefined}
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
              value={filterMin === '' ? undefined : Number(filterMin)}
              placeholder="Giá từ"
              min={0}
              style={{ width: '100%' }}
              onChange={v => setFilterMin(v === undefined || v === null ? '' : v)}
            />
          </Col>
          <Col xs={12} sm={4}>
            <InputNumber
              value={filterMax === '' ? undefined : Number(filterMax)}
              placeholder="Đến"
              min={0}
              style={{ width: '100%' }}
              onChange={v => setFilterMax(v === undefined || v === null ? '' : v)}
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
                <ProductCard key={p._id} product={p} />
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
    </>
  );
}
