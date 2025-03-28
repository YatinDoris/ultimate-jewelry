const { getVariComboPriceQty } = require("./variationWiseQty");

const getSellingPrice = (price, discount = 0) => {
  const cprice = Number(price);
  const cdiscount = Number(discount);
  const sellingPrice = cprice - (cprice * cdiscount) / 100;
  return Number(sellingPrice.toFixed(2));
};

const calculateProductPrice = (product, selectedVariations) => {
  const { price = 0 } = getVariComboPriceQty(
    product.variComboWithQuantity,
    selectedVariations
  );

  return {
    price: price,
    sellingPrice: getSellingPrice(price, product?.discount),
  };
};

const calculateAmount = (activeProductsList, cartList) => {
  const tempArray = cartList
    .map((cartItem) => {
      const foundProduct = activeProductsList.find(
        (product) => product.id === cartItem.productId
      );
      if (!foundProduct) return;
      const { sellingPrice } = calculateProductPrice(
        foundProduct,
        cartItem.variations
      );
      return {
        quantityWiseSellingPrice:
          Number(sellingPrice) * Number(cartItem.quantity),
      };
    })
    .filter((item) => item);

  const total = tempArray.reduce((accumulator, object) => {
    return accumulator + object.quantityWiseSellingPrice;
  }, 0);

  return +Number(total).toFixed(2);
};

module.exports = { getSellingPrice, calculateProductPrice, calculateAmount };
