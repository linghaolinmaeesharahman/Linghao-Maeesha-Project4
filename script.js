// step1: declare empty objects to store event ajax call, event handler
// ajax call
const makeupApp = {};

//event handler
const eventHandler = {};

//call back functions
const dataProcessor = {};

//generate 6 colors from each color arrays
dataProcessor.colorGenerator = function(array) {
    let randomColor = [];
    for (let i = 1; i <= 6; i++) {
        let randomNum = Math.floor(Math.random() * array.length);

        randomColor.push(array[randomNum]);
    }
    return randomColor;
}

//generate 1 product from product array
dataProcessor.productGenerator = function(array) {
    let randomNum = Math.floor(Math.random() * array.length);
    let randomProduct = array[randomNum];
    return randomProduct;
}

//store color in local
let colorHolder = {
    blush: [],
    eyeshadow: [],
    eyebrow: [],
    lipstick: []
};

//store product in local
let productHolder = {
    blush: [],
    eyeshadow: [],
    eyebrow: [],
    lipstick: []
};

// step2: build api call so they can be called in event listener

makeupApp.url = 'https://makeup-api.herokuapp.com/api/v1/products.json'
makeupApp.getProducts = function(type, price) {
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
    });
}

// step3: filter the api data.

makeupApp.getColors = function(type, price) {
    return makeupApp.getProducts(type, price)
        .then(products => {
            // console.log(products);

            let colorHolderType = colorHolder[`${type}`];
            colorHolderType.length = 0;
            for (let i in products) {
                let colorCollection = products[i].product_colors;
                colorCollection.map((color) => colorHolderType.push(color["hex_value"]));
            }
            return colorHolderType;
        });
}

makeupApp.getProductsByColor = function(type, price, color) {
    return makeupApp.getProducts(type, price)
        .then(products => {
            return products.filter(product => {
                return product.product_colors.some((item) => {
                    return item.hex_value === color;
                })

            });
        });
}


// step4: submit the first form to take user's input

eventHandler.submitProductFilter = function() {
    $('form').on('submit', function(event) {
        event.preventDefault();
        //find the product type
        let $checkBoxInputs = $('input[name = product-type]:checked');
        let productTypes = $checkBoxInputs.map(number => $checkBoxInputs[number].value);
        //find the product price
        let $productPrice = $('input[name = product-price]:checked').val();

        // clean the palette section inorder to print new result
        eventHandler.initPalette();

        // step4: call API with each product type as query string
        for (let i = 0; i < productTypes.length; i++) {
            makeupApp.getColors(productTypes[i], $productPrice)
                //resolve the promise, get all the hex colors
                .then((colors) => {
                    // randomize the color
                    let colorPalette = dataProcessor.colorGenerator(colors);

                    //print the color on page

                    colorPalette.map((color) => {
                        //give each radio an id, so they can attach to each label
                        let radioId = "radio-" + productTypes[i] + colorPalette.indexOf(color);
                        //append radio button into palette
                        let $colorRadio = `<input type="radio" id=${radioId} name=${productTypes[i]} value= ${color}>`;

                        //append label into palette
                        let $colorLabel = `<label for=${radioId} class='color-circle'></label>`;

                        $(`.${productTypes[i]}-palette .palette-color`)
                            .append($colorRadio)
                            .append($colorLabel);

                        //change the label to each hex color
                        $(`.${productTypes[i]}-palette label[for=${radioId}]`)
                            .css('background', color);
                    })
                });
        };
    })
}

// step5: clean the current palette to generate the new one
eventHandler.initPalette = function() {
    $('.palette-color').empty();
}

// step:6 add eventlistener to palette radio, to collect user's input of color
// print to SVG

eventHandler.printColorToFace = function() {
    $('.palette-color').on('click', 'input', function() {
        //find the value of clicked radio hex code 

        let inputColor = $(this).val();

        let inputType = $(this).attr("name");

        if (inputType === 'blush') {
            $('.st2').css('fill', inputColor);
        }

        if (inputType === 'eyebrow') {
            $('.st4').css('fill', inputColor);
        }

        if (inputType === 'lipstick') {
            $('#lip').css('fill', inputColor);
        }

        if (inputType === 'eyeshadow') {
            $('.st3').css('fill', inputColor);
        }
    })
}

// step7: add event listener to clear face button to clear the color
eventHandler.clearColor = function() {
    $('button[type="reset"]').on('click', function() {

        $('#lip').css('fill', 'none');
        $('.st2').css('fill', 'none');
        $('.st3').css('fill', 'none');
        $('.st4').css('fill', 'none');
    })
}

// step8: add eventlistener to 'give me another one' button
eventHandler.newPaletteGenerator = function() {
    $('button[name="palette"]').on('click', function() {
        //find the value of clicked button
        let $anotherButton = $(this).val();

        //clean the color-palette from last input
        $(`.${$anotherButton}-palette .palette-color`).empty();

        //find the color related to this button
        let colorPalette = dataProcessor.colorGenerator(colorHolder[$anotherButton]);

        colorPalette.map((color) => {
            //give each radio an id, so they can attach to each label
            let radioId = "radio-" + $anotherButton + colorPalette.indexOf(color);

            //append radio button into palette
            let $colorRadio = `<input type="radio" name=${$anotherButton} id=${radioId} value= ${color}>`;

            //append label into palette
            let $colorLabel = `<label for=${radioId} class='color-circle'></label>`;

            $(`.${$anotherButton}-palette .palette-color`)
                .append($colorRadio)
                .append($colorLabel);

            //change the color of current label 
            $(`.${$anotherButton}-palette label[for=${radioId}]`).css('background', color);
        })

    })
}

// step:9 add eventlistener to confirm button, to collect user's choice of color
eventHandler.confirmProduct = function() {
    $('button[name = "confirm-button"]').on('click', function() {

        //take the user's choice of colors
        let $userBlush = $('.blush-palette input[type = "radio"]:checked').val();
        let $userEyebrow = $('.eyebrow-palette input[type = "radio"]:checked').val();
        let $userEyeshadow = $('.eyeshadow-palette input[type = "radio"]:checked').val();
        let $userLipstick = $('.lipstick-palette input[type = "radio"]:checked').val();

        //take the user's choice of types
        let $checkBoxInputs = $('input[name = product-type]:checked');
        let productTypes = $checkBoxInputs.map(number => $checkBoxInputs[number].value);

        //take the user's choice of price
        let $productPrice = $('input[name = product-price]:checked').val();

        //loop through types that have been selected, 
        for (let i = 0; i < productTypes.length; i++) {
            //takethe user's choice of color, under each type
            let userColor;

            if (productTypes[i] === 'blush') {
                userColor = $userBlush;
            } else if (productTypes[i] === 'eyebrow') {
                userColor = $userEyebrow;
            } else if (productTypes[i] === 'eyeshadow') {
                userColor = $userEyeshadow;
            } else if (productTypes[i] === 'lipstick') {
                userColor = $userLipstick;
            } else {
                alert('Please choose a color!');
            };

            //call api
            makeupApp.getProductsByColor(productTypes[i], $productPrice, userColor)
                .then(products => {
                    for (let j = 0; j < products.length; j++) {
                        productHolder[productTypes[i]].push(products[j]);

                        //random generate 1 product
                        for (let productType in productHolder) {
                            if (productHolder[productType].length != 0) {

                                let generatedProduct = dataProcessor.productGenerator(productHolder[productType]);

                                //print the result on page

                                let $brand = generatedProduct.brand;
                                let $name = generatedProduct.name;
                                let $price = generatedProduct.price;
                                let $currency = generatedProduct.currency;
                                let $imgUrl = generatedProduct.image_link;
                                let $link = generatedProduct.product_link;

                                $(`.${productType}-result .brand-name`).text($brand);
                                $(`.${productType}-result .product-name`)
                                    .text($name)
                                    .attr('href', $link);
                                $(`.${productType}-result img`).attr('src', $imgUrl);
                                $(`.${productType}-result .product-price`).text($price);
                                $(`.${productType}-result .product-price span`).text($currency);

                            }
                        }
                    }
                });
        }
    })
}

// step 10: add eventlistener to new option button, to generate another new product

eventHandler.newProductGenerator = function() {
    $('button[name = "result-button"]').on('click', function() {
        let $currentType = $(this).val();
        let productArray = productHolder[$currentType];
        let generatedProduct = dataProcessor.productGenerator(productArray);

        if (productArray.length < 2) {
            alert('Sorry, this is the only product that holds this color.');
        }

        let $brand = generatedProduct.brand;
        let $name = generatedProduct.name;
        let $price = generatedProduct.price;
        let $currency = generatedProduct.currency;
        let $imgUrl = generatedProduct.image_link;
        let $link = generatedProduct.product_link;

        $(`.${$currentType}-result .brand-name`).text($brand);
        $(`.${$currentType}-result .product-name`)
            .text($name)
            .attr('href', $link);
        $(`.${$currentType}-result img`).attr('src', $imgUrl);
        $(`.${$currentType}-result .product-price`).text($price);
        $(`.${$currentType}-result .product-price .currency`).text($currency);
    })
}

// step11: init the page once refreshed


// step12: add eventlistener to confirm button, to collect user's choice of color

$(function() {
    eventHandler.submitProductFilter();
    eventHandler.newPaletteGenerator();
    eventHandler.printColorToFace();
    eventHandler.clearColor();
    eventHandler.confirmProduct();
    eventHandler.newProductGenerator();
});

// scroll functions

$('.submit-btn').click(function () {
    $('html, body').animate({
        scrollTop: $('.palette').offset().top
    }, 1000);
});

$('.confirm-btn').click(function () {
    $('html, body').animate({
        scrollTop: $('.result').offset().top
    }, 1000);
});