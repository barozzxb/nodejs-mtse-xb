import { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type CartItemType = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selected?: boolean;
};

export function createCartItem(payload: Omit<CartItemType, "id" | "selected">): CartItemType {
  return {
    id: uuidv4(),
    selected: false,
    ...payload,
  };
}

export type UseCartReturn = {
  items: CartItemType[];
  add: (item: Omit<CartItemType, "id" | "selected">) => void;
  update: (id: string, patch: Partial<Omit<CartItemType, "id">>) => void;
  remove: (id: string) => void;
  toggleSelect: (id: string, value?: boolean) => void;
  selectAll: (value: boolean) => void;
  increase: (id: string, by?: number) => void;
  decrease: (id: string, by?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  set: (payload: CartItemType[]) => void;
  clear: () => void;
  total: number;
  selectedTotal: number;
  selectedItems: CartItemType[];
};


export const useCart = (initial: CartItemType[] = []): UseCartReturn => {
  const [items, setItems] = useState<CartItemType[]>(initial);

  const add = useCallback((item: Omit<CartItemType, "id" | "selected">) => {
    const qty = Math.max(1, Math.floor(item.quantity ?? 1));
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, createCartItem({ ...item, quantity: qty })];
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<Omit<CartItemType, "id">>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleSelect = useCallback((id: string, value?: boolean) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, selected: typeof value === "boolean" ? value : !i.selected } : i
      )
    );
  }, []);

  const selectAll = useCallback((value: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, selected: value })));
  }, []);

  const increase = useCallback((id: string, by = 1) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + Math.max(1, by) } : i)));
  }, []);

  const decrease = useCallback((id: string, by = 1) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - Math.max(1, by)) } : i
      )
    );
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const q = Math.max(1, Math.floor(quantity));
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: q } : i)));
  }, []);

  const set = useCallback((payload: CartItemType[]) => setItems(payload), []);
  const clear = useCallback(() => setItems([]), []);

  const selectedItems = useMemo(() => items.filter((i) => !!i.selected), [items]);
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const selectedTotal = useMemo(() => selectedItems.reduce((s, i) => s + i.price * i.quantity, 0), [selectedItems]);

  return {
    items,
    add,
    update,
    remove,
    toggleSelect,
    selectAll,
    increase,
    decrease,
    updateQuantity,
    set,
    clear,
    total,
    selectedTotal,
    selectedItems,
  };
};
