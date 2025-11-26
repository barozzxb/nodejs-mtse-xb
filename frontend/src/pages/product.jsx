import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Pagination, Spin } from 'antd';
import axios from '../utils/axios.customize'; // hoặc path tới axios của bạn

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(false);

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
};

export default ProductPage;
