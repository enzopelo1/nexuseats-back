import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import type { AuthTokens } from '@/types';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const tokens = localStorage.getItem('tokens');
  const accessToken = tokens ? (JSON.parse(tokens) as AuthTokens).accessToken : '';
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// ── Queries GraphQL pour le catalogue ──
export const GET_RESTAURANT_MENUS = gql`
  query GetRestaurantMenus($restaurantId: Int!) {
    restaurant(id: $restaurantId) {
      id
      name
      menus {
        id
        name
        items {
          id
          name
          description
          price
          imageUrl
          category
          available
        }
      }
    }
  }
`;

