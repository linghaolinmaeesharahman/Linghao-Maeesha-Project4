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

                    //print the color on page

                    colorPalette.map((color) => {
                        //give each radio an id, so they can attach to each label
                        let radioId = "radio-" + productTypes[i] + colorPalette.indexOf(color);
                        //append radio button into palette
                        let $colorRadio = `<input type="radio" id=${radioId} name="${productTypes[i]}-hex-color" value= ${color}>`;

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

// step:6 add eventlistener to palette radio, to collect user's input of color
// print to SVG


// step7: add eventlistener to 'give me another one' button
eventHandler.newPaletteGenerator = function() {
    $('button[name="palette"]').on('click', function(event) {
        event.preventDefault();
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
            let $colorRadio = `<input type="radio" name=${$anotherButton}-palette id=${radioId} value= ${color}>`;

            //append label into palette
            let $colorLabel = `<label for=${radioId} class='color-circle'></label>`;
            console.log(color);

            $(`.${$anotherButton}-palette .palette-color`)
                .append($colorRadio)
                .append($colorLabel);

            //change the color of current label 
            $(`.${$anotherButton}-palette label[for=${radioId}]`).css('background', color);
        })

    })
}



// take out radio name and value 
// take out value of product type and color 
// print onto face

// })

getColor = function() {
    $('.palette-color').on('click', 'input', function () {
        console.log('click');
        //find the value of clicked radio hex code 

        $('#lip').css('fill', $(this).val());
    }) 
}

getColor();

// step:9 add eventlistener to confirm button, to collect user's choice of color


$(function() {
    eventHandler.submitProductFilter();
    eventHandler.newPaletteGenerator();
});