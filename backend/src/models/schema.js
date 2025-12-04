// schema.js
import { gql } from "apollo-server";

export const typeDefs = gql`
  type CartItem {
    id: ID!
    productId: String!
    name: String!
    price: Float!
    quantity: Int!
    createdAt: String!
  }

  input AddCartItemInput {
    productId: String!
    name: String!
    price: Float!
    quantity: Int!
  }

  input UpdateCartItemInput {
    id: ID!
    quantity: Int
  }

  type Query {
    cartItems: [CartItem!]!
  }

  type Mutation {
    addCartItem(input: AddCartItemInput!): CartItem!
    updateCartItem(input: UpdateCartItemInput!): CartItem!
    removeCartItem(id: ID!): Boolean!
  }
`;
