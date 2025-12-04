import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

export const GET_CART_ITEMS = gql`
  query {
    cartItems {
      id
      productId
      name
      price
      quantity
    }
  }
`;

export const ADD_CART_ITEM = gql`
  mutation AddCartItem($input: AddCartItemInput!) {
    addCartItem(input: $input) {
      id
      productId
      name
      price
      quantity
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      id
      quantity
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($id: ID!) {
    removeCartItem(id: $id)
  }
`;

export const useCart = () => {
  const { data, loading, error, refetch } = useQuery(GET_CART_ITEMS);

  const [addItem] = useMutation(ADD_CART_ITEM);
  const [updateItem] = useMutation(UPDATE_CART_ITEM);
  const [removeItem] = useMutation(REMOVE_CART_ITEM);

  return {
    items: data?.cartItems || [],
    loading,
    error,
    refetch,
    addItem,
    updateItem,
    removeItem,
  };
};
