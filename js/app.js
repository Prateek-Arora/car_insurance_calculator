// Variable----------
const form = document.querySelector('#request-quote');

const html = new HTMLUI();





// Event Listeners---
eventListeners();

function eventListeners(){
    // When the page is loaded. 

    document.addEventListener('DOMContentLoaded', function() {

        // Create the <option> for the years.
        html.displayYears();
    
    });
    
    // When the form is submitted.
    
    form.addEventListener('submit', function(e){
        e.preventDefault();

        // Read values from form.
        const make = document.querySelector('#make').value;
        const year = document.querySelector('#year').value;

        // Read the radio buttons.
        const level = document.querySelector('input[name="level"]:checked').value;

        if(make === '' || year === '' || level === ''){
            html.displayError("All the fields are mandatory!");
        }
        else{
            // Clear the older quotations.
            const prevResult = document.querySelector('#result div');
            if(prevResult != null){
                prevResult.remove();
            }

            // Make the quotation.
            const insurance = new Insurance(make, year, level);
            const price = insurance.calculateQuotation(insurance);

            // print the result from HTMLUI().
            html.showResults(price, insurance);
        }
    })
}



// Objects-----------

// Everything related to calculations (Insurance).
function Insurance (make, year, level) {
    this.make = make;
    this.year = year;
    this.level = level;
}

// Calculate the price for insurance.
Insurance.prototype.calculateQuotation = function(insurance){
    let price;
    const base = 2000;

    // Get the make.
    const make = insurance.make;

    /*
        1. American : 15%
        2. Asian    : 5%
        3. European : 35%
    */

    switch (make) {
        case '1':
            price = base * 1.15;
            break;
        case '2':
            price = base * 1.05;
            break;
        case '3':
            price = base * 1.35;
            break;
    }

    // Get the year.
    const year = insurance.year;
    const difference = this.getYearDifference(year);

    // Cost of insurance gets depricated each year by 3%
    price = price - (difference * (price*0.03));

    // Check the level of protection.
    const level = insurance.level;
    price = this.calculateLevel(price, level);

    return price;

}

// Returns difference between years.
Insurance.prototype.getYearDifference = function(year){
    return new Date().getFullYear() - year;
}

// Adds the value to the price according to the level of protection.
Insurance.prototype.calculateLevel = function(price, level){
    /*
        Basic insurance will increase the price by 30%
        Complete insurance will increase the price by 50%
    */

    if(level === 'basic'){
        price = price * 1.3;
    }
    else if(level === 'complete'){
        price = price * 1.5;
    }

    return price;
}


// Everything related to html.
function HTMLUI () {}

// Display latest 20 years in the select bar.
HTMLUI.prototype.displayYears = function() {
 
    // Max & min years.
    const max = new Date().getFullYear(),
          min = max - 20;

    // Making a list for the 20 years.
    const selectYears = document.querySelector('#year');

    // Print the values.
    for(let i = max;i >= min;i--){
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYears.appendChild(option);
    }
}

// Prints an Error.
HTMLUI.prototype.displayError = function(message) {
    const div = document.createElement('div');
    div.classList = 'error';

    // Inserting the message.
    div.innerHTML = `
    <p> ${message} </p>
    `;

    form.insertBefore(div, document.querySelector('.form-group'));

    setTimeout(function(){
        document.querySelector('.error').remove();
    }, 3000);
}

// Prints the result into HTMLUI(). 
HTMLUI.prototype.showResults = function(price, insurance){
    // Print the result.
    const result = document.querySelector('#result');

    // Create a div in result.
    const div = document.createElement('div');

    // Get values from the insurance.
    let make = insurance.make;
    switch(make){
        case '1':
            make = 'American';
            break;
        case '2':
            make = 'Asian';
            break;
        case '3':
            make = 'European';
            break;
    }

    const year = insurance.year;
    const level = insurance.level;

    // Insert the result.
    div.innerHTML = `
        <p class = "header">Summary </p>
        <p>Make: ${make}</p>
        <p>Year: ${year}</p>
        <p>Level: ${level}</p>
        <p class = "total"> Total : $ ${price} </p>
    `;

    const spinner = document.querySelector('#loading img');
    spinner.style.display = 'block';

    setTimeout(function() {
        spinner.style.display = 'none';
        // Inserting into html.
        result.appendChild(div);
    }, 2000);

}