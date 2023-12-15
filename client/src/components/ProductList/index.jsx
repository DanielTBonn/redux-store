import React from 'react';
import { useEffect } from 'react';
import ProductItem from '../ProductItem';
// import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

import { useSelector } from 'react-redux';

import { store } from '../../utils/reducers';

function ProductList() {

  const products = useSelector(state => state.products);
  const currentCategory = useSelector(state => state.currentCategory);

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      console.log('in data')
      store.dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      console.log('in !loading')
      idbPromise('products', 'get').then((products) => {
        store.dispatch({
          type: UPDATE_PRODUCTS,
          products: products,
        });
      });
    }


  }, [data, loading, store.dispatch, products.length, currentCategory, store.getState]);

  function filterProducts() {
    console.log("inside filter prods", products)

    if (!currentCategory) {
      return products;
    }
    console.log("inside filter prods", products)
    return products.filter(
      (product) => product.category._id === currentCategory
    );
  }
  

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
