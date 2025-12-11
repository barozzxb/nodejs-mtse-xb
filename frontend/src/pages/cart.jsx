import { useState, useEffect, useRef } from 'react';
import { CartList } from 'cart-lib-xb';
import { useCart as useCartHook } from '../hooks/useCartQuery';
import { orderAPI } from '../utils/api';
import PageHeaderNav from '../components/HeadLine';
import { Row, Col, Card, Divider, Typography, Space, Button as AntButton } from 'antd';
const { Title, Text } = Typography;
import { toast } from 'react-toastify';


export default function CartScreen() {
  const { items: fetchedItems, updateItem, removeItem, refetch } = useCartHook();
  const [items, setItems] = useState([]);

  const prevFetchedJsonRef = useRef('');
  useEffect(() => {
    try{
      const next = JSON.stringify(fetchedItems ?? []);
      if (next !== prevFetchedJsonRef.current) {
        prevFetchedJsonRef.current = next;
        setItems(fetchedItems ?? []);
      }
    } catch (err) {
      setItems(fetchedItems ?? []);
    }
  }, [fetchedItems]);

  const toggleSelect = (id, selected) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected } : item
      )
    );
  };

  const updateQuantity = (id, quantity) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemove = async (id) => {
    await removeItem({ variables: { id } });
    setItems(prev => prev.filter(item => item.id !== id));
    toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
  }

  const total = items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const selectedItems = items
      .filter(item => item.selected)
      .map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));



    const res = await orderAPI(selectedItems);

    if (res.ok) {
      alert("Đặt hàng thành công!");
      refetch();
    } else {
      alert("Lỗi: " + res.data.EM);
    }
  };

  return (
    <>
      <PageHeaderNav title="Giỏ hàng" />
      <Row gutter={[16, 24]}>
        <Col xs={24} lg={16}>
          <Card
            style={{ borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', padding: 16 }}
          >
            <Title level={4} style={{ margin: '8px 0 12px' }}>Giỏ hàng của bạn</Title>

            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
              {items?.length ?? 0} sản phẩm
            </Text>

            <Divider style={{ margin: '12px 0' }} />

            <CartList
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemove={handleRemove}
              onToggleSelect={toggleSelect}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <div
            style={{
              position: 'sticky',
              top: 24,
              alignSelf: 'flex-start'
            }}
          >
            <Card
              style={{
                borderRadius: 12,
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                padding: 16
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Thành tiền</Text>
                  <Text strong style={{ fontSize: 18 }}>₫{(total || 0).toLocaleString()}</Text>
                </div>

                <Divider style={{ margin: 0 }} />

                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Phí vận chuyển và giảm giá sẽ được tính ở bước thanh toán.
                  </Text>
                </div>

                <div style={{ marginTop: 6 }}>
                  <button
                    disabled={total === 0}
                    onClick={handleCheckout}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: total === 0 ? '#ccc' : '#1677ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      cursor: total === 0 ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      boxShadow: total === 0 ? 'none' : '0 4px 12px rgba(22,119,255,0.18)'
                    }}
                  >
                    Thanh toán
                  </button>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <AntButton type="link" onClick={() => window.location.assign('/products')}>
                    Tiếp tục mua sắm
                  </AntButton>
                </div>
              </Space>
            </Card>
            {(items?.length ?? 0) === 0 && (
              <Card
                style={{ marginTop: 12, borderRadius: 12, textAlign: 'center', padding: 16 }}
              >
                <Text>Giỏ hàng của bạn đang trống.</Text>
                <div style={{ marginTop: 10 }}>
                  <AntButton type="primary" onClick={() => window.location.assign('/products')}>
                    Mua ngay
                  </AntButton>
                </div>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </>

  );
}