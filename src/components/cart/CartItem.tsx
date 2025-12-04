import React from "react";
import { Row, Col, Checkbox, Typography, Button, InputNumber, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

export type CartItemType = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  selected?: boolean;
};

export type CartItemProps = {
  item: CartItemType;
  onUpdateQuantity?: (id: string | number, quantity: number) => void;
  onRemove?: (id: string | number) => void;
  onToggleSelect?: (id: string | number, selected: boolean) => void;
  className?: string;
};

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onToggleSelect,
  className = "",
}) => {
  const handleQtyChange = (value: number | null) => {
    const qty = Math.max(1, Number(value ?? 1));
    onUpdateQuantity?.(item.id, qty);
  };

  const handleDecrease = () => {
    const next = Math.max(1, item.quantity - 1);
    onUpdateQuantity?.(item.id, next);
  };

  const handleIncrease = () => {
    const next = item.quantity + 1;
    onUpdateQuantity?.(item.id, next);
  };

  return (
    <div className={className} style={{ padding: "12px 0" }}>
      <Row align="middle" justify="space-between">
        {/* Left */}
        <Col flex={1}>
          <Row align="middle" gutter={12}>
            <Col>
              <Checkbox
                checked={!!item.selected}
                onChange={(e) => onToggleSelect?.(item.id, e.target.checked)}
              />
            </Col>

            <Col>
              <div>
                <Text strong>{item.name}</Text>
                <div>
                  <Text style={{ fontSize: 14 }}>
                    ₫{item.price.toLocaleString()}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Right: Quantity + Delete */}
        <Col>
          <Space size="small">
            <Button size="small" onClick={handleDecrease}>
              -
            </Button>

            <InputNumber
              min={1}
              controls={false}
              value={item.quantity}
              onChange={handleQtyChange}
              style={{ width: 70 }}
            />

            <Button size="small" onClick={handleIncrease}>
              +
            </Button>

            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove?.(item.id)}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default CartItem;
