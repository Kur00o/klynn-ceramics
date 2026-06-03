import { shopifyFetch } from '@/lib/shopify';
import { createCartMutation, addToCartMutation, updateCartLinesMutation, removeFromCartMutation } from './shopifyQueries';

export async function createCart() {
  const res = await shopifyFetch<any>({
    query: createCartMutation,
    variables: { lineItems: [] }
  });
  return res.body.data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const res = await shopifyFetch<any>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }]
    }
  });
  return res.body.data.cartLinesAdd.cart;
}

export async function updateCart(cartId: string, lineId: string, quantity: number) {
  const res = await shopifyFetch<any>({
    query: updateCartLinesMutation,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }]
    }
  });
  return res.body.data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineId: string) {
  const res = await shopifyFetch<any>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds: [lineId]
    }
  });
  return res.body.data.cartLinesRemove.cart;
}

export async function getCart(cartId: string) {
  // Query to get existing cart if needed
  const getCartQuery = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const res = await shopifyFetch<any>({
    query: getCartQuery,
    variables: { cartId }
  });
  return res.body.data.cart;
}
