import React, { useMemo } from "react";
import { Row, Col, Checkbox, Typography, Empty } from "antd";
import Card from "../ui/Card";
import Button from "../ui/Button";
import CartItem, { CartItemType } from "./CartItem";

const { Text, Title } = Typography;

export type CartListProps = {
  items: CartItemType[];
  onUpdateQuantity?: (id: string | number, quantity: number) => void;
  onRemove?: (id: string | number) => void;
  onToggleSelect?: (id: string | number, selected: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  className?: string;
};

const currency = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

const CartList: React.FC<CartListProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  onToggleSelect,
  onSelectAll,
  className = "",
}) => {
  const totalAmount = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const allSelected = items.length > 0 && items.every((i) => i.selected);
  const anySelected = items.some((i) => i.selected);

  return (
    <Card
      className={className}
      title={
        <Row justify="space-between" align="middle" style={{ width: "100%" }}>
          <Col>
            <Row align="middle" gutter={12}>
              <Col>
                <Title level={5} style={{ margin: 0 }}>
                  Giỏ hàng
                </Title>
                <Text type="secondary">{totalItems} sản phẩm</Text>
              </Col>
            </Row>
          </Col>

          <Col>
            {onSelectAll && (
              <Checkbox
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              >
                <Text type="secondary">Chọn tất cả</Text>
              </Checkbox>
            )}
          </Col>
        </Row>
      }
      bordered
      bodyStyle={{ padding: 12 }}
    >
      {/* List / Empty */}
      {items.length === 0 ? (
        <div style={{ padding: 32 }}>
          <Empty description="Giỏ hàng rỗng" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => (
            <div key={item.id} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
              <CartItem
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
                onToggleSelect={onToggleSelect}
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer / Summary */}
      <div style={{ marginTop: 16 }}>
        <Row justify="space-between" align="middle" style={{ background: "#fafafa", padding: 12, borderRadius: 8, border: "1px solid #f0f0f0" }}>
          <Col>
            <div>
              <Text style={{ fontSize: 14 }}>
                Tổng:{" "}
                <strong style={{ fontSize: 18, marginLeft: 8 }}>
                  {currency(totalAmount)}
                </strong>
              </Text>
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
                <Button onClick={() => window.history.back()}>Tiếp tục mua sắm</Button>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    alert("Checkout - implement in consumer app");
                  }}
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
  );
};

export default CartList;
