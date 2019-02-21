// step1: declare empty objects to store event ajax call, event handler
// ajax call
const makeupApp = {};

//event handler
const eventHandler = {};

// step2: submit the first form to take user's input

eventHandler.submitProductFilter = () => {
    $('form').on('submit', function(event) {
        event.preventDefault();
        //find the product type
        let $checkBoxInputs = $('input[name = product-type]:checked');
        let productTypes = $checkBoxInputs.map(number => $checkBoxInputs[number].value);
        //find the product price
        let $productPrice = $('input[name = product-price]:checked').val();

        // step4: call API with each product type as query string
        for (let i = 0; i < productTypes.length; i++) {
            makeupApp.getColors(productTypes[i], $productPrice)
                //resolve the promise, get all the hex colors
                .then((colors) => {
                    //? randomize the color
                    //?print the color on page
                    console.log(colors)
                });
        }

    });
}

// step3: take user's input and pass into API to filter the data we want.

makeupApp.url = 'https://makeup-api.herokuapp.com/api/v1/products.json'
makeupApp.getColors = function(type, price) {
    //filter user's choice of price
    let priceFilter = null;
    if (price == '$') {
        priceFilter = {
            price_less_than: 10
        };
    } else {
        priceFilter = {
            price_greater_than: 10
        };
    }

    //define the query string of URL
    return $.ajax({
        url: makeupApp.url,
        method: 'GET',
        dataType: 'json',
        data: {
            product_type: type,
            ...priceFilter
        }
        //take the hex color of related data out and store them into an array
    }).then(function(products) {
        let allColors = [];
        for (let i in products) {
            let colorCollection = products[i].product_colors;
            colorCollection.map((color) => allColors.push(color["hex_value"]));
        }
        return allColors;
    });
}

// step5: add eventlistener to 'give me another one' button
eventHandler.newPaletteGenerator = () => {
    $('button[name="palette"]').on('click'.function(event) {
        event.preventDefault();
    })
}

// step:6 add eventlistener to palette radio, to collect user's input of color
// print to SVG


// step:7 add eventlistener to confirm button, to collect user's choice of color

$(function() {
    eventHandler.submitProductFilter();

    // makeupApp.getColors('blush', '$'); // => ['#123', ...]
});