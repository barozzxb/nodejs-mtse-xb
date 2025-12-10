import React, { useMemo } from "react";
import { Row, Col, Typography } from "antd";
import CartList from "./CartList";
import { CartItemType } from '../../hooks/useCart';
import Button from "../ui/Button";
import Card from "../ui/Card";

const { Text } = Typography;

export type CartPageProps = {
  items: CartItemType[];
  onUpdateQuantity?: (id: string | number, quantity: number) => void;
  onRemove?: (id: string | number) => void;
  onToggleSelect?: (id: string | number, selected: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
};

const currency = (v: number) => 
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  onToggleSelect,
  onSelectAll
}) => {

  const totalAmount = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const allSelected = items.length > 0 && items.every((i) => i.selected);
  const anySelected = items.some((i) => i.selected);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <Card
        title={
          <Row justify="space-between" align="middle" style={{ width: "100%" }}>
            <Col>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Text strong style={{ fontSize: 20 }}>Giỏ hàng</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>{totalItems} sản phẩm</Text>
              </div>
            </Col>

            <Col>
              {onSelectAll && (
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                  />
                  <span style={{ fontSize: 14 }}>Chọn tất cả</span>
                </label>
              )}
            </Col>
          </Row>
        }
        bordered
        bodyStyle={{ padding: 12 }}
      >
        <CartList
          items={items}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          onToggleSelect={onToggleSelect}
          onSelectAll={onSelectAll}
        />

        <div style={{ marginTop: 12 }}>
          <Row
            justify="space-between"
            align="middle"
            style={{
              background: "#fafafa",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #f0f0f0",
            }}
          >
            <Col>
              <div style={{ fontSize: 15 }}>
                Tổng:&nbsp;
                <strong style={{ fontSize: 18 }}>
                  {currency(totalAmount)}
                </strong>
              </div>
              <div style={{ marginTop: 6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {anySelected ? "Có sản phẩm được chọn" : "Chưa có sản phẩm được chọn"}
                </Text>
              </div>
            </Col>

            <Col>
              <Row gutter={8} align="middle">
                <Col>
                  <Button onClick={() => window.history.back()}>
                    Tiếp tục mua sắm
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={() => alert("Checkout - implement in consumer app")}
                    disabled={!anySelected}
                  >
                    Thanh toán
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default CartPage;
