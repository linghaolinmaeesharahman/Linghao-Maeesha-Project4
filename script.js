// step1: declare empty objects to store event ajax call, event handler
// ajax call
const makeupApp = {};

//event handler
const eventHandler = {};

//call back functions
const dataProcessor = {};

dataProcessor.colorGenerator = function(array) {
    let randomColor = [];
    for (let i = 1; i <= 6; i++) {
        let randomNum = Math.floor(Math.random() * array.length);

        randomColor.push(array[randomNum]);
    }
    return randomColor;
}

//store color in local
let colorHolder = {
    blush: [],
    eyeshadow: [],
    eyebrow: [],
    lipstick: []
};

// step2: submit the first form to take user's input

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
                    console.log(productTypes[i]);
                    // randomize the color
                    let colorPalette = dataProcessor.colorGenerator(colors);
                    console.log(colorPalette);

                    //print the color on page

                    colorPalette.map((color) => {
                        //append radio button into palette
                        let $colorRadio = `<input type="radio" id=${colorPalette.indexOf(color)} name="${productTypes[i]}-hex-color" value= ${color}>`;

                        //append label into palette
                        let $colorLabel = `<label for=${colorPalette.indexOf(color)} class='color-circle'></label>`;
                        console.log(color);

                        $(`.${productTypes[i]}-palette .palette-color`).append($colorRadio).append($colorLabel);

                        $('.color-circle').css('width', '20px').css('height', '20px').css('display', 'block').css('background', color);
                    })

                });
            // eventHandler.printPalette(colors);

        };
    })
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
        let colorHolderType = colorHolder[`${type}`];
        colorHolderType.length = 0;
        for (let i in products) {
            let colorCollection = products[i].product_colors;
            colorCollection.map((color) => colorHolderType.push(color["hex_value"]));
        }
        console.log(colorHolder);
        return colorHolderType;
    });
}

// step5: clean the current palette to generate the new one
eventHandler.initPalette = function() {
    $('.palette-color').empty();
}

// step6: print the color on page
eventHandler.printPalette = function(colorArr) {
    let colorPalette = dataProcessor.colorGenerator(colorArr);
    colorPalette.map((color) => {
        //append radio button into palette
        let $colorRadio = `<input type="radio" id=${colorPalette.indexOf(color)} name="${productTypes[i]}-hex-color" value= ${color}>`;

        //append label into palette
        let $colorLabel = `<label for=${colorPalette.indexOf(color)} class='color-circle'></label>`;
        console.log(color);

        $(`.${productTypes[i]}-palette .palette-color`).append($colorRadio).append($colorLabel);

        $('.color-circle').css('width', '20px').css('height', '20px').css('display', 'block').css('background', color);
    })
}

// step7: add eventlistener to 'give me another one' button
eventHandler.newPaletteGenerator = function() {
    $('button[name="palette"]').on('click', function(event) {
        event.preventDefault();
        //find the value of clicked button
        let $anotherButton = $(this).val();

        //find the color related to this button
        let colorPalette = dataProcessor.colorGenerator(colorHolder[$anotherButton]);
        colorPalette.map((color) => {
            //append radio button into palette
            let $colorRadio = `<input type="radio" id=${colorPalette.indexOf(color)} name="${productTypes[i]}-hex-color" value= ${color}>`;

            //append label into palette
            let $colorLabel = `<label for=${colorPalette.indexOf(color)} class='color-circle'></label>`;
            console.log(color);

            $(`.${productTypes[i]}-palette .palette-color`).append($colorRadio).append($colorLabel);

            $('.color-circle').css('width', '20px').css('height', '20px').css('display', 'block').css('background', color);
        })

    })
}

// step:6 add eventlistener to palette radio, to collect user's input of color
// print to SVG


// step:7 add eventlistener to confirm button, to collect user's choice of color

$(function() {
    eventHandler.submitProductFilter();

    // makeupApp.getColors('blush', '$'); // => ['#123', ...]
});