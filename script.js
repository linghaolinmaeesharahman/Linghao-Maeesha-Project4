const makeupApp = {};

const productType = ['blush', 'lipstick', ]
makeupApp.url = 'https://makeup-api.herokuapp.com/api/v1/products.json'
makeupApp.getProducts = function(i){
    $.ajax({
        url: makeupApp.url,
        method: 'GET',
        dataType: 'json',
        data: {
            // q: product_type = productType[i]
            product_type: productType[0],
        }
        
    }).then(function (data) {
        // makeupApp.displayProducts(data.product_type);
        console.log(data);
        // make loop to get product types 
        console.log(data[0].product_type);
        console.log(makeupApp.url);
    });
}

makeupApp.displayProducts = function(data) {
    console.log(data);
};

// makeupApp.getProducts();
makeupApp.init = function () {
    makeupApp.getProducts(1);
    console.log(makeupApp.getProducts);
};

$(function () {
    makeupApp.init();
});