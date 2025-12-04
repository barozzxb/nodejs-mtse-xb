import CartDrawer, {useCart} from 'cart-lib-xb';
import { useState } from 'react';
import {Button} from 'antd';

export default function CartPage() {
    const cart = useCart([]);

    const [open, setOpen] = useState(false);
    return (
        <div>
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
        </div>
    )
}