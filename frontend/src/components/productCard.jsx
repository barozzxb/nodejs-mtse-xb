import { useCart } from '../hooks/useCartQuery';
import { Col } from 'antd';
import { Card, Button } from 'antd';

const ProductCard = ({ product }) => {
    const { addItem, refetch } = useCart();
    return (
        <Col xs={24} sm={12} md={8} lg={6}>
            <Card title={product.name} bordered hoverable>
                <p><strong>Genre:</strong> {product.genre}</p>
                <p><strong>Price:</strong> {product.price.toLocaleString()} VND</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p>{product.description}</p>
                <Button type="primary" onClick={() => {
                    addItem({
                        variables: {
                            input: {
                                productId: product._id,
                                name: product.name,
                                price: product.price,
                                quantity: 1,
                            },
                        },
                    }).then(() => {refetch();});
                }} >Add to cart</Button>
            </Card>
        </Col>
    );
};

export default ProductCard;