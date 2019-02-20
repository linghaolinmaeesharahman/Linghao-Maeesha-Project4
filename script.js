const makeupApp = {};

makeupApp.getProducts = function(){
    $.ajax({
        url: 'http://makeup-api.herokuapp.com/api/v1/products.json',
        method: 'GET',
        dataType: 'json',
    }).then(function (data) {
        makeupApp.displayProducts(data.product_type);
        console.log(makeupApp.displayProducts);
    });
}
