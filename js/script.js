$(document).ready(function(){

    /*
        Move focus on the name field on page load and hide the field for 'Other' job initially.
    */  

    $('#name').focus();
    $('#other-title').hide();

    /*
        Validation object to track the entire's form validation:
    */  

    const valid = {
        name: false,
        mail: false,
        design: false,
        activities: false,
        'cc-num': false,
        zip: false,
        cvv: false
    };


    /*
        Helper methods to handle displaying error styles if input is invalid.
    */

    const $mail = $('#mail');

    const displayInvalid = (item) => {
        item.css({'border': 'solid 3px red'});
        if(item.attr('id') === 'mail') {
            $('#email-hint').remove();
            if($mail.val().length < 1) {
                $mail.after('<p id="email-hint">Field cannot be blank.</p>');
            } else {
                $mail.after('<p id="email-hint">Emails must be formatted as name@company.com (john@treehouse.com).</p>');
            }
        }
    }

    const displayValid = (item) => {
        item.css({'border': 'none'});
    }

    /*
        Validate name in real time:
    */
   
    $('#name').on('input', function() {
        if(this.value.length < 1) {
            displayInvalid($(this));
        } else {
            displayValid($(this));
            valid.name = true;
        }
    });


    /*
        *Extra Credit 2 and 3:* 
        Validate email in real time along with a message to format the email in the correct format:
    */

    $mail.on('input', function(){
        if(!validateEmail(this.value)) {
            displayInvalid($(this));
        } else {
            displayValid($(this));
            $('#email-hint').remove();
            valid.mail = true;
        }
    });

    const validateEmail = (email) => {
        return /^[^@]+@[^@.]+\.[a-z]{3}$/i.test(email);
    }

    /*
        Handle job role selection change:
        This function hides the job role text field initially and toggles it's display
        depending on the user's selection of the 'Other' job role.
    */   

    $('#title').on('change', function(){
        if(this.value === 'other') {
            $('#other-title').show();
        } else {
            $('#other-title').hide();
        }
    });

    /*
        Handle t-shirt design selection change:
        The concept was to capture all the options from the HTML initially, to create separate objects containing
        the design options for js puns and heart js design options, and then to dynamically change the color options
        based on the user's selection of design.
        *Extra Credit 1*: The Color label and select menu is hidden until the user selects a design.
    */

    $('#colors-js-puns').hide();

    const $htmlOptions = $('#color')[0].options;

    let jsPunsColors = {};
    let heartJsColors = {};

    for(let i = 0; i < 3; i++) {
        jsPunsColors[$htmlOptions[i].text] = $htmlOptions[i].value;
    }

    for(let i = 3; i < $htmlOptions.length; i++) {
        heartJsColors[$htmlOptions[i].text] = $htmlOptions[i].value;
    }

    $('#design').on('change', function(){
        const design = this.value;

        if(design === 'js puns' || design === 'heart js') {
            $('#colors-js-puns').show();
            valid.design = true;
            displayValid($(this));
        } else {
            $('#colors-js-puns').hide();
            displayInvalid($(this));
        }

        if(design === 'js puns') {
            refreshColorOptions(jsPunsColors);
        } else if(design === 'heart js') {
            refreshColorOptions(heartJsColors);
        }
    });

    /*
        refreshColorOptions(colorsObject) is a helper method that empties the existing color
        options and displays the options that are passed in as an object parameter.
    */

    const refreshColorOptions = (colorsObject) => {
        $('#color').empty();
        for(let key in colorsObject){
            $('#color').append($(`<option value='${colorsObject[key]}'>${key}</option>`));
        }
    }

    /*
        The credit card payment method is selected by default.
        The Select Payment Method option is disabled.
    */

    $('#payment').val('credit card').prop('selected', 'true');
    $('#payment').children()[0].disabled = true;


    /*
        Display either the Credit card, Paypal, or Bitcoin divs depending on the user's selection:
    */

    const $creditCardDiv = $('#credit-card');
    const $paypalDiv = $('#credit-card').next();
    const $bitCoinDiv = $paypalDiv.next();

    $('#payment').on('change', function(){
        handlePaymentSelectionChange();
    })

    const handlePaymentSelectionChange = () => {
        const $paymentMethod = $('#payment').val();
        if($paymentMethod === 'credit card') {
            $creditCardDiv.show();
            $paypalDiv.hide();
            $bitCoinDiv.hide();
            enableCCValidation();
        } else if($paymentMethod === 'paypal') {
            $paypalDiv.show();
            $creditCardDiv.hide();
            $bitCoinDiv.hide();
            disableCCValidation();
        } else {
            $bitCoinDiv.show();
            $creditCardDiv.hide();
            $paypalDiv.hide();
            disableCCValidation();
        }
    }

    const disableCCValidation = () => {
        valid["cc-num"] = 'na';
        valid.cvv = 'na';
        valid.zip = 'na';
    }

    const enableCCValidation = () => {
        valid["cc-num"] = false;
        valid.cvv = false;
        valid.zip = false;
    }

    handlePaymentSelectionChange();

    /*
        Validate credit card number:
    */
   
    const validateCCNum = () => {
        const regex = /^\d{13,16}$/;
        const ccNum = $('#cc-num').val();
        return regex.test(ccNum);
    }

    $('#cc-num').on('input', function(){
        if(!validateCCNum()) {
            displayInvalid($(this));
        } else {
            displayValid($(this));
            valid["cc-num"] = true;
        }
    });

    /*
        Validate credit card zip code:
    */

    const validateZipCode = () => {
        const regex = /^\d{5}$/;
        const zipCode = $('#zip').val();
        return regex.test(zipCode);
    }

    $('#zip').on('input', function(){
        if(!validateZipCode()) {
            displayInvalid($(this));
        } else {
            displayValid($(this));
            valid.zip = true;
        }
    });


    /*
        Validate credit card zip cvv:
    */

    const validateCVV = () => {
        const regex = /^\d{3}$/;
        const cvv = $('#cvv').val();
        return regex.test(cvv);
    }

    $('#cvv').on('input', function(){
        if(!validateCVV()) {
            displayInvalid($(this)); 
        } else {
            displayValid($(this));
            valid.cvv = true;
        }
    });

    /*
        Validate registration/activities, calculat the total cost, and disable checkboxes
        that cause scheduling conflicts:
    */

    const $activities = $('.activities');
    const checkBoxes = $('form').find(':checkbox');
    $activities.append('<p id="total-cost">$0.00</p>');
    const totalCost = $('#total-cost');

    $activities.on('change', function(){
        let cost = costCalculator();
        // if(checkBoxes[0].checked) {
        //     valid.activities = true;
        //     displayValid($(this));
        // }
        checkBoxDisabler(1, 3);
        checkBoxDisabler(2, 4);
        totalCost.text(`$${cost}.00`);
    });

    const costCalculator = () => {
        let totalCost = 0;
        let registered = false;
        for(let i = 0; i < checkBoxes.length; i++) {
            if(checkBoxes[i].checked) {
                registered = true;
                if(i === 0) {
                    totalCost += 200;
                } else {
                    totalCost += 100;
                }
            }
        }
        if(registered) {
            valid.activities = true;
            displayValid($activities);
        }
        return totalCost;
    }

    const checkBoxDisabler = (num1, num2) => {
        checkBoxes[num2].disabled = checkBoxes[num1].checked;
        checkBoxes[num1].disabled = checkBoxes[num2].checked;
    }

    /*
        Handle form submission:
    */

    const $form = $('form');

    $form.on('submit', function(e){
        let validForm = true;
        for(let key in valid) {
            // console.log(`${key} = ${valid[key]}`);
            if(valid[key] === false) {
                validForm = false;
                displayInvalid($(`#${key}`));
                if(key === 'activities') {
                    displayInvalid($('.activities'));
                }
            }
        }
        if(!validForm) {
            e.preventDefault();
        }
    });
});