export const getProductsQuery = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          materials: metafield(namespace: "custom", key: "materials") {
            value
          }
          care: metafield(namespace: "custom", key: "care") {
            value
          }
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          tags
          productType
          collections(first: 5) {
            edges {
              node {
                title
                handle
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getProductByHandleQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      materials: metafield(namespace: "custom", key: "materials") {
        value
      }
      care: metafield(namespace: "custom", key: "care") {
        value
      }
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      tags
      productType
      collections(first: 5) {
        edges {
          node {
            title
            handle
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const createCartMutation = `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
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
                    featuredImage {
                      url
                    }
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
  }
`;

export const addToCartMutation = `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
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
                    featuredImage {
                      url
                    }
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
  }
`;

export const updateCartLinesMutation = `
  mutation updateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
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
                    featuredImage {
                      url
                    }
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
  }
`;

export const removeFromCartMutation = `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
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
                    featuredImage {
                      url
                    }
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
  }
`;
