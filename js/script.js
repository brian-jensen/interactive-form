/* jshint esversion: 6 */

// Global jQuery variables
const $emailRegex = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i); // https://stackoverflow.com/a/7714013/6090751
const $creditCardRegex = new RegExp(/^[0-9]*$/gm); // https://www.regextester.com/21
const $zipCodeRegex = new RegExp(/^\d{5}$/); // https://www.rexegg.com/regex-quickstart.html
const $cvvRegex = new RegExp(/^\d{3}$/); // https://www.rexegg.com/regex-quickstart.html

// Global variables
let total = 0;
const thisMonth = new Date().getMonth() + 1; // https://www.w3schools.com/js/js_date_methods.asp
const thisYear = new Date().getFullYear(); // https://www.w3schools.com/js/js_date_methods.asp

// Global presets
$('#name').focus();
$('#payment').children().first().remove();
$("p:contains('PayPal'), p:contains('Bitcoin'), #colors-js-puns, #other-title").hide();
$('.activities').append(`<p class="black">Total: <span class="dollar">$<span><span class="total">0</span></p>`);
$('.activities legend').append(`<span class="activities-legend-span error"> - please select at least <em>one</em> activity<span>`);
$('label[for="name"]').append(`<span class="name-label-span error"> - please enter your name.<span>`);
$('label[for="mail"]').append(`<span class="email-label-span error"> - please enter a valid email address</span>`);
$('.shirt legend').append(`<span class="shirt-legend-span error"> - please select a shirt design theme</span>`);
$('label[for="cc-num"]').append(`<span class="cc-label-span error"> - must be 13 to 16 digits</span>`);
$('label[for="zip"]').append(`<span class="zip-label-span error"> - 5 digits only</span>`);
$('label[for="cvv"]').append(`<span class="cvv-label-span error"> - must be 3 digits</span>`);
$('#exp-year').after(`<span class="expiration-year-span error"> - please select a valid expiration year</span>`);
$('#exp-month').after(`<span class="expiration-month-span error"> - please select a valid expiration month</span>`);
$('button[type="submit"]').after(`<span class="register-span error"> - Please fix required items that are missing, then click Register again</span>`);

// Presets for progressively created elements
$('.cvv-label-span, .name-label-span, .email-label-span, .zip-label-span, .cc-label-span, .expiration-year-span, .expiration-month-span, .register-span').hide();

// Disable browser input value manipulation
$('input').each(function () {
  $(this).prop('autocomplete', 'off').prop('autocorrect', 'off').prop('autocapitalize', 'off').prop('spellcheck', false);
});

/******************************************
 * JOB ROLE SELECT MENU                   *
 ******************************************/
// Displays optional "Other Job Role" input field when "other" is selected as Job Role.
$('#title').on('change', function () {
  if ($(this).val() === 'other') {
    $('#other-title').removeAttr('class').prop('placeholder', 'Your Job Role');
    $('#other-title').slideDown(150, "linear");
  } else {
    $('#other-title').slideUp(150, "linear");
    $('#other-title').removeAttr('class');
  }
});


/******************************************
 * T-SHIRT INFO                           *
 ******************************************/
// Adds class to shirt color design themes.
$('#color option').each(function () {
  if ($(this).is(':contains("Puns")')) $(this).addClass('puns');
  if ($(this).is(':contains("♥")')) $(this).addClass('hearts');
});
// As the hide() method on select menu options is not supported in Safari, wrap the options that need to be hidden in span tags instead. https://stackoverflow.com/a/44332652/6090751
const wrap = () => $('#color option').each(function () {
  if ($(this).parent().is('select')) $(this).wrap('<span>');
});

$('#design').on('change', function () {
  $('#colors-js-puns').show();
  wrap();
  // Allow user to only see colors associated with the specific shirt design theme that they choose.
  if ($(this).val() === 'js puns') {
    $('#color option').each(function () {
      if ($(this).hasClass('puns')) {
        $(this).unwrap();
        $(this).parent()[0].selectedIndex = 0;
      }
    });
  } else if ($(this).val() === 'heart js') {
    $('#color option').each(function () {
      if ($(this).hasClass('hearts')) {
        $(this).unwrap();
        $(this).parent()[0].selectedIndex = 0;
      }
    });
  } else {
    $('#colors-js-puns').hide();
  }
});
// Remove "(theme only)" text from color options
$('#color option').each(function () {
  const parseColor = $(this).text().replace(/\(.*$/g, ''); // Regex inspired from: https://stackoverflow.com/a/4058971/6090751
  $(this).text(parseColor);
});


/******************************************
 * REGISTER FOR ACTIVITIES                *
 ******************************************/
$('.activities input').on('change', function () {
  const $labelText = $(this).parent().text();
  const price = Number($labelText.split('$')[1]);
  const schedule = $labelText.split(' — ')[1].split(',')[0];
  const $label = $(`label:contains(${schedule})`); // https://stackoverflow.com/a/5330100/6090751
  // Displays error if no activities are checked.
  if ($('.activities input').not(':checked').length === $('.activities input').length) {
    $('.activities-legend-span').show();
  } else {
    $('.activities-legend-span').hide();
  }
  // Disables activities that have a schedule conflict.
  // Increases and decreases total price as activities are checked and unchecked.
  if ($(this).is(':checked')) {
    total += price;
    $label.children().prop('disabled', true);
    $label.addClass('disabled').append(`<span class="warning" title="Schedule Conflict"></span>`);
    $(this).prop('disabled', false).parent().toggleClass('disabled selected').find('span').remove();
  } else {
    total -= price;
    $label.children().prop('disabled', false);
    $label.removeAttr('class').find('span').remove();
  }
  // Displays total cost of selected activities.
  $('.total').text(total);
});


/******************************************
 * PAYMENT METHOD                         *
 ******************************************/
// Shows required information per payment method that the user selects and hides others.
$('#payment').on('change', function () {
  if ($(this).val() === "credit card") {
    $('#credit-card').show();
    $("p:contains('PayPal'), p:contains('Bitcoin')").hide();
  } else if ($(this).val() === "paypal") {
    $("p:contains('PayPal')").show();
    $("p:contains('Bitcoin'), #credit-card").hide();
  } else {
    $("p:contains('Bitcoin')").show();
    $("p:contains('PayPal'), #credit-card").hide();
  }
});


/******************************************
 * REAL-TIME FORM VALIDATION              *
 ******************************************/
$('input').on('focusin', function () {
  $(this).removeAttr('placeholder');
});
// Shows placeholder error message if the user leaves focus on an element that does not have required information filled out.
const inputFocusValidation = (item, message, conditional) => {
  if (conditional) {
    item.prev().find('span').hide();
    item.addClass('error-place error-border');
    item.val('');
    item.prop('placeholder', message);
  } else {
    item.removeAttr('class');
  }
};
// Shows error message if the user has not selected a shirt design theme
$('#design').on('change', function () {
  return  $('#design').val() === 'Select Theme' ? $('.shirt-legend-span').show():$('.shirt-legend-span').hide();
});

// Listens for focus out event on input fields that are visible.
$('#name').on('focusout', function () {
  const message = 'Please enter your name.';
  const conditional = $(this).val() === '';
  inputFocusValidation($(this), message, conditional);
});

$('#mail').on('focusout', function () {
  const message = 'Please enter a valid email address.';
  const conditional = !$(this).val().match($emailRegex);
  inputFocusValidation($(this), message, conditional);
});

$('#other-title').on('focusout', function () {
  const message = 'Please enter your job role.';
  const conditional = $(this).val() === '';
  inputFocusValidation($(this), message, conditional);
});

$('#cc-num').on('focusout', function () {
  const message = 'Please enter a valid credit card number';
  const conditional = $(this).val() === '' || !$(this).val().match($creditCardRegex) || $(this).val().length < 13 || $(this).val().length > 16;
  inputFocusValidation($(this), message, conditional);
});

$('#zip').on('focusout', function () {
  const message = 'Enter valid zip code';
  const conditional = $(this).val() === '' || !$(this).val().match($zipCodeRegex);
  inputFocusValidation($(this), message, conditional);
});

$('#cvv').on('focusout', function () {
  const message = 'Enter valid CVV';
  const conditional = $(this).val() === '' || !$(this).val().match($cvvRegex);
  inputFocusValidation($(this), message, conditional);
});

// Provides real-time error messages as the user types until conditional is met.
const inputKeyValidation = (item, conditional) => {
  return conditional ? item.prev().find('span').show():item.prev().find('span').hide();
};

// Listens for when the user presses then releases a key on the keyboard.
$('#name').on('keyup', function () {
  const conditional = $(this).val() === '';
  inputKeyValidation($(this), conditional);
});

$('#mail').on('keyup', function () {
  const conditional = !$(this).val().match($emailRegex);
  inputKeyValidation($(this), conditional);
});

$('#cc-num').on('keyup', function () {
  const conditional = !$(this).val().match($creditCardRegex) || $(this).val().length < 13 || $(this).val().length > 16;
  inputKeyValidation($(this), conditional);
});

$('#zip').on('keyup', function () {
  const conditional = !$(this).val().match($zipCodeRegex);
  inputKeyValidation($(this), conditional);
});

$('#cvv').on('keyup', function () {
  const conditional = !$(this).val().match($cvvRegex);
  inputKeyValidation($(this), conditional);
});

// Resets the Credit Card input and select options if another payment method is chosen.
$('#payment').on('change', function () {
  if ($(this).val() !== 'credit card') {
    $('#cc-num, #zip, #cvv').val('').removeAttr('class placeholder');
    $('#exp-month')[0].selectedIndex = 0;
    $('#exp-year')[0].selectedIndex = 0;
    $('.expiration-year-span').hide();
  }
});

// Validates that the user entered an expiration date that is greater or equal to current month and year, called when the user clicks the "Register" button.
const dateValidation = () => {
  const $month = Number($('#exp-month').val());
  const $year = Number($('#exp-year').val());

  if ($year > thisYear || $year >= thisYear && $month >= thisMonth) {
    $('.expiration-year-span, .expiration-month-span').hide();
  } else if ($year >= thisYear && $month < thisMonth) {
    $('.expiration-year-span').hide();
    $('.expiration-month-span').show();
  } else {
    $('.expiration-year-span').show();
  }

  if ($('.error').is(':visible')) {
    $('.register-span').show();
  } else {
    $('.register-span').hide();
  }

};
// Re-validates the expiration month when the user changes it.
$('#exp-month').on('change', function () {
  dateValidation();
});
// Re-validates the expiration year when the user changes it.
$('#exp-year').on('change', function () {
  dateValidation();
});


// Checks if any errors exist on page when user clicks the "Register" button.
const submitValidation = () => {

  // Forces input focus and focus out on any empty input fields on the page. Triggers error if any are empty.
  $('input').each(function () {
    if ($(this).val() === '' && $(this).is(':visible')) {
      $(this).focus();
      $(this).blur();
    }
  });

  // Checks if the Other Title input field is visible and empty. Triggers error if it is.
  if ($('#other-title').is(':visible') && $('#other-title').val() === '') {
    $('.register-span').show();
  } else {
    $('.register-span').hide();
  }

  // Checks if any input fields are currently triggering an error.
  $('.error-place').each(function () {
    if ($('#other-title').is(':hidden') && $('.error-place').length > 1) {
      $('.register-span').show();
    } else {
      $('.register-span').hide();
      if ($('#other-title').is(':visible') && $('#other-title').val() === '') {
        $('.register-span').show();
      } else {
        $('.register-span').hide();
      }
    }
  });

  // Checks for any Select or Checkbox items that are triggering errors
  if ($('.error').is(':visible')) {
    $('.register-span').show();
  } else {
    $('.register-span').hide();
  }

};

// Checks for errors when user clicks the "Register" button.
$('button[type="submit"]').on('click', function (event) {
  event.preventDefault();
  submitValidation();
  dateValidation();
  // If no errors are found on the page, submits form and displays "Registration Submitted!" message for 2 seconds then refreshes browser.
  if ($('.register-span').is(':hidden')) {
    $('button[type="submit"]').prop('disabled', true);
    $('button[type="submit"]').text('Registration Submitted!');
    $('button[type="submit"]').css('background-color', '#69c773');
    setTimeout(function () {
      window.location.reload(true);
    }, 2000);
  }
});

/******************************************
 * ON PAGE LOAD                           *
 ******************************************/
// Resets all form fields on page load.
$(document).ready(function () {
  $('form')[0].reset();
});
