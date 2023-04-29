import {Link} from '@shopify/hydrogen';

import {Grid, ProductCard} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';

export function ProductGrid({collection}) {
  const products = collection?.products?.nodes || [];

  const haveProducts = products.length > 0;

  if (!haveProducts) {
    return (
      <>
        <p>No products found on this collection</p>
        <Link to="/products">
          <p className="underline">Browse catalog</p>
        </Link>
      </>
    );
  }

  return (
    <>
      <Grid layout="products">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            loading={getImageLoadingPriority(i)}
          />
        ))}
      </Grid>
    </>
  );
}
