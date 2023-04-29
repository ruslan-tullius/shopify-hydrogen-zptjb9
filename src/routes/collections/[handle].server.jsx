import {Suspense, useMemo} from 'react';
import {
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  useUrl,
} from '@shopify/hydrogen';

import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { PageHeader, ProductGrid, Section, Text, ProductFilter } from '~/components';
import { NotFound, Layout } from '~/components/index.server';

const pageBy = 48;

export default function Collection({params}) {
  const {searchParams} = useUrl();


  const {handle} = params;
  const {
    language: {isoCode: language},
    country: {isoCode: country},
  } = useLocalization();

  const filters = [];

  if (searchParams.has('min_price') || searchParams.has('max_price')) {
    const price = {};
    if (searchParams.has('min_price')) {
      price.min = Number(searchParams.get('min_price')) || 0;
    }
    if (searchParams.has('max_price')) {
      price.max = Number(searchParams.get('max_price')) || 0;
    }
    filters.push({
      price,
    });
  }

  for (const filter of searchParams.entries()) {
    if (filter[0] === 'product_type') {
      filters.push({
        productType: filter[1],
      });
    }

    if (filter[0] === 'color') {
      filters.push({
        variantOption: {name: 'color', value: filter[1]},
      });
    }
  }

  const {
    data: {collection},
  } = useShopQuery({
    query: COLLECTION_QUERY,
    variables: {
      handle,
      language,
      filters,
      country,
      pageBy,
    },
    preload: true,
  });
  console.log('filters', filters)
  console.log('collection.products.length', collection.products.nodes.length)
  if (!collection) {
    return <NotFound type="collection" />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.collection,
      resourceId: collection.id,
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="collection" data={collection} />
      </Suspense>
      <PageHeader heading={collection.title}>
        {collection?.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <Text format width="narrow" as="p" className="inline-block">
                {collection.description}
              </Text>
            </div>
          </div>
        )}
      </PageHeader>
      <Section>
        <ProductFilter collection={collection} />
        <ProductGrid
          key={collection.id}
          collection={collection}
          url={`/collections/${handle}?country=${country}`}
        />
      </Section>
    </Layout>
  );
}

// API endpoint that returns paginated products for this collection
// @see templates/demo-store/src/components/product/ProductGrid.client.tsx
export async function api(request, { params, queryShop }) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    });
  }
  const url = new URL(request.url);

  const cursor = url.searchParams.get('cursor');
  const country = url.searchParams.get('country');
  const { handle } = params;

  return await queryShop({
    query: PAGINATE_COLLECTION_QUERY,
    variables: {
      handle,
      cursor,
      pageBy,
      country,
    },
  });
}

const COLLECTION_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(first: $pageBy, after: $cursor, filters: $filters) {
        nodes {
          ...ProductCard
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const PAGINATE_COLLECTION_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionPage(
    $handle: String!
    $pageBy: Int!
    $cursor: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: $pageBy, after: $cursor) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
