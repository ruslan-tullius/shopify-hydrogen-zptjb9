import {Heading} from '~/components';
import {useUrl, useNavigate} from '@shopify/hydrogen';
import {DropdownSelect} from './elements/DropdownSelect';

function PriceFilter() {
  const {pathname, searchParams} = useUrl();
  const navigate = useNavigate();

  const changeMinPrice = (event) => {
    searchParams.set('min_price', event.target.value);
    navigate(`${pathname}?${searchParams.toString()}`);
  };
  const changeMaxPrice = (event) => {
    searchParams.set('max_price', event.target.value);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="grid-flow-row grid gap-2 gap-y-2 md:gap-2 lg:gap-6 grid-cols-2">
      <div>
        <label
          htmlFor="minPrice"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Price from
        </label>
        <input
          id="minPrice"
          name="minPrice"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="number"
          defaultValue={searchParams.get('min_price')}
          placeholder="$"
          onChange={changeMinPrice}
        />
      </div>
      <div>
        <label
          htmlFor="maxPrice"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Price to
        </label>
        <input
          id="maxPrice"
          name="maxPrice"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="number"
          defaultValue={searchParams.get('max_price')}
          placeholder="$"
          onChange={changeMaxPrice}
        />
      </div>
    </div>
  );
}
function SelectFilter({label, values}) {
  const {pathname, searchParams} = useUrl();
  const navigate = useNavigate();
  const lowerLabel = label.toLowerCase().replace(/ /g, '_');

  const changeSelect = (event) => {
    const paramName = event.target.getAttribute('data-filter-type');
    const paramValue = event.target.value;
    const existingValues = searchParams.getAll(paramName);

    if (!existingValues.includes(paramValue)) {
      searchParams.append(paramName, paramValue);
    } else {
      searchParams.delete(paramName);
      existingValues
        .filter((v) => v !== paramValue)
        .forEach((v) => {
          searchParams.append(paramName, v);
        });
    }

    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <div>
      <label
        htmlFor={lowerLabel}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>


    </div>
  );
}

export function ProductFilter({collection}) {
  const filters = collection.products.filters.filter((item) =>
    [
      'filter.v.price',
      'filter.p.product_type',
      'filter.v.option.color',
    ].includes(item.id),
  );

  return (
    <nav className="p-12 w-full">
      <Heading as="h4" size="lead" className="pb-4">
        Filter By
      </Heading>
      <div className="flex flex-row items-center">
        <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filters.map((filter) => (
            <div key={filter.id}>
              {filter.type === 'PRICE_RANGE' && <PriceFilter {...filter} />}
              {filter.type === 'LIST' && <SelectFilter {...filter} />}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
