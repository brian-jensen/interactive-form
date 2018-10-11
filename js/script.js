/* jshint esversion: 6 */

// Global jQuery variables
const $allInputs = $('input');
const $nameLabel = $('label[for="name"]');
const $nameInput = $('#name');
const $emailLabel = $('label[for="mail"]');
const $emailInput = $('#mail');
const $emailRegex = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i); // https://stackoverflow.com/a/7714013/6090751
const $jobRole = $('#title');
const $register = $('button[type="submit"]');
const $shirtLegend = $('.shirt legend');
const $otherTitle = $('#other-title');
const $designSelect = $('#design');
const $designOptions = $('#design option');
const $colorsDiv = $('#colors-js-puns');
const $colorOptions = $('#color option');
const $activities = $('.activities');
const $activitiesLabels = $('.activities label');
const $activitiesInputs = $('.activities input');
const $activitiesLegend = $('.activities legend');
const $paymentSelect = $('#payment');
const $creditCard = $('#credit-card');
const $creditCardLabel = $('label[for="cc-num"]');
const $creditCardInput = $('#cc-num');
const $creditCardRegex = new RegExp(/^[0-9]*$/gm); // https://www.regextester.com/21
const $zipCodeLabel = $('label[for="zip"]');
const $zipCodeInput = $('#zip');
const $zipCodeRegex = new RegExp(/^\d{5}$/); // https://www.rexegg.com/regex-quickstart.html
const $cvvLabel = $('label[for="cvv"]');
const $cvvInput = $('#cvv');
const $cvvRegex = new RegExp(/^\d{3}$/); // https://www.rexegg.com/regex-quickstart.html
const $paypal = $("p:contains('PayPal')");
const $bitcoin = $("p:contains('Bitcoin')");
const $expirationMonthSelect = $('#exp-month');
const $expirationYearSelect = $('#exp-year');

// Global variables
let total = 0;
const thisMonth = new Date().getMonth() + 1; // https://www.w3schools.com/js/js_date_methods.asp
const thisYear = new Date().getFullYear(); // https://www.w3schools.com/js/js_date_methods.asp

// Global presets
$paypal.hide();
$bitcoin.hide();
$colorsDiv.hide();
$otherTitle.hide();
$nameInput.focus();
$paymentSelect.children().first().remove();
$activities.append(`<p class="black">Total: <span class="dollar">$<span><span class="total">0</span></p>`);
$activitiesLegend.append(`<span class="activities-legend-span error"> - please select at least <em>one</em> activity<span>`);
$nameLabel.append(`<span class="name-label-span error"> - please enter your name.<span>`);
$emailLabel.append(`<span class="email-label-span error"> - please enter a valid email address</span>`);
$shirtLegend.append(`<span class="shirt-legend-span error"> - please select a shirt design theme</span>`);
$creditCardLabel.append(`<span class="cc-label-span error"> - must be 13 to 16 digits</span>`);
$zipCodeLabel.append(`<span class="zip-label-span error"> - 5 digits only</span>`);
$cvvLabel.append(`<span class="cvv-label-span error"> - must be 3 digits</span>`);
$expirationYearSelect.after(`<span class="expiration-year-span error"> - please select a valid expiration year</span>`);
$expirationMonthSelect.after(`<span class="expiration-month-span error"> - please select a valid expiration month</span>`);
$register.after(`<span class="register-span error"> - Please fix required items that are missing, then click Register again</span>`);

// jQuery global variables for progressively created DOM elements
const $grandTotal = $('.total');
const $nameLabelSpan = $('.name-label-span');
const $emailLabelSpan = $('.email-label-span');
const $shirtLegendSpan = $('.shirt-legend-span');
const $activitiesSpan = $('.activities-legend-span');
const $creditCardLabelSpan = $('.cc-label-span');
const $zipCodeLabelSpan = $('.zip-label-span');
const $cvvLabelSpan = $('.cvv-label-span');
const $expirationYearSpan = $('.expiration-year-span');
const $expirationMonthSpan = $('.expiration-month-span');
const $registerSpan = $('.register-span');

// Presets for progressively created elements
$cvvLabelSpan.hide();
$nameLabelSpan.hide();
$emailLabelSpan.hide();
$zipCodeLabelSpan.hide();
$creditCardLabelSpan.hide();
$expirationYearSpan.hide();
$expirationMonthSpan.hide();
$registerSpan.hide();

// Disable browser input value manipulation
$allInputs.each(function () {
  $(this).prop('autocomplete', 'off')
    .prop('autocorrect', 'off')
    .prop('autocapitalize', 'off')
    .prop('spellcheck', false);
});

/******************************************
 * JOB ROLE SELECT MENU                   *
 ******************************************/
// Displays optional "Other Job Role" input field when "other" is selected as Job Role.
$jobRole.on('change', function () {
  if ($(this).val() === 'other') {
    $otherTitle.removeAttr('class').prop('placeholder', 'Your Job Role');
    $otherTitle.slideDown(150, "linear");
  } else {
    $otherTitle.slideUp(150, "linear");
    $otherTitle.removeAttr('class');
  }
});


/******************************************
 * T-SHIRT INFO                           *
 ******************************************/
// Adds class to shirt color design themes.
$colorOptions.each(function () {
  if ($(this).is(':contains("Puns")')) $(this).addClass('puns');
  if ($(this).is(':contains("♥")')) $(this).addClass('hearts');
});
// As the hide() method on select menu options is not supported in Safari, wrap the options that need to be hidden in span tags instead. https://stackoverflow.com/a/44332652/6090751
const wrap = () => $colorOptions.each(function () {
  if ($(this).parent().is('select')) $(this).wrap('<span>');
});

$('#design').on('change', function () {
  $colorsDiv.show();
  wrap();
  // Allow user to only see colors associated with the specific shirt design theme that they choose.
  if ($(this).val() === 'js puns') {
    $colorOptions.each(function () {
      if ($(this).hasClass('puns')) {
        $(this).unwrap();
        $(this).parent()[0].selectedIndex = 0;
      }
    });
  } else if ($(this).val() === 'heart js') {
    $colorOptions.each(function () {
      if ($(this).hasClass('hearts')) {
        $(this).unwrap();
        $(this).parent()[0].selectedIndex = 0;
      }
    });
  } else {
    $colorsDiv.hide();
  }
});
// Remove "(theme only)" text from color options
$colorOptions.each(function () {
  const parseColor = $(this).text().replace(/\(.*$/g, ''); // Regex inspired from: https://stackoverflow.com/a/4058971/6090751
  $(this).text(parseColor);
});


/******************************************
 * REGISTER FOR ACTIVITIES                *
 ******************************************/
$activitiesInputs.on('change', function () {

  const $labelText = $(this).parent().text();
  const price = Number($labelText.split('$')[1]);
  const schedule = $labelText.split(' — ')[1].split(',')[0];
  const $label = $(`label:contains(${schedule})`); // https://stackoverflow.com/a/5330100/6090751
  // Displays error if no activities are checked.
  if ($activitiesInputs.not(':checked').length === $activitiesInputs.length) {
    $activitiesSpan.show();
  } else {
    $activitiesSpan.hide();
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
  $grandTotal.text(total);
});


/******************************************
 * PAYMENT METHOD                         *
 ******************************************/
// Shows required information per payment method that the user selects and hides others.
$paymentSelect.on('change', function () {
  if ($(this).val() === "credit card") {
    $paypal.hide();
    $bitcoin.hide();
    $creditCard.show();
  } else if ($(this).val() === "paypal") {
    $paypal.show();
    $bitcoin.hide();
    $creditCard.hide();
  } else {
    $paypal.hide();
    $bitcoin.show();
    $creditCard.hide();
  }
});


/******************************************
 * REAL-TIME FORM VALIDATION              *
 ******************************************/
$allInputs.on('focusin', function () {
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
$designSelect.on('change', function () {
  if ($designSelect.val() === 'Select Theme') {
    $shirtLegendSpan.show();
  } else {
    $shirtLegendSpan.hide();
  }
});

// Listens for focus out event on input fields that are visible.
$nameInput.on('focusout', function () {
  const message = 'Please enter your name.';
  const conditional = $(this).val() === '';
  inputFocusValidation($(this), message, conditional);
});

$emailInput.on('focusout', function () {
  const message = 'Please enter a valid email address.';
  const conditional = !$(this).val().match($emailRegex);
  inputFocusValidation($(this), message, conditional);
});

$otherTitle.on('focusout', function () {
  const message = 'Please enter your job role.';
  const conditional = $(this).val() === '';
  inputFocusValidation($(this), message, conditional);
});

$creditCardInput.on('focusout', function () {
  const message = 'Please enter a valid credit card number';
  const conditional = $(this).val() === '' || !$(this).val().match($creditCardRegex) || $(this).val().length < 13 || $(this).val().length > 16;
  inputFocusValidation($(this), message, conditional);
});

$zipCodeInput.on('focusout', function () {
  const message = 'Enter valid zip code';
  const conditional = $(this).val() === '' || !$(this).val().match($zipCodeRegex);
  inputFocusValidation($(this), message, conditional);
});

$cvvInput.on('focusout', function () {
  const message = 'Enter valid CVV';
  const conditional = $(this).val() === '' || !$(this).val().match($cvvRegex);
  inputFocusValidation($(this), message, conditional);
});

// Provides real-time error messages as the user types until conditional is met.
const inputKeyValidation = (item, conditional) => {
  if (conditional) {
    item.prev().find('span').show();
  } else {
    item.prev().find('span').hide();
  }
};

// Listens for when the user presses then releases a key on the keyboard.
$nameInput.on('keyup', function () {
  const conditional = $(this).val() === '';
  inputKeyValidation($(this), conditional);
});

$emailInput.on('keyup', function () {
  const conditional = !$(this).val().match($emailRegex);
  inputKeyValidation($(this), conditional);
});

$creditCardInput.on('keyup', function () {
  const conditional = !$(this).val().match($creditCardRegex) || $(this).val().length < 13 || $(this).val().length > 16;
  inputKeyValidation($(this), conditional);
});

$zipCodeInput.on('keyup', function () {
  const conditional = !$(this).val().match($zipCodeRegex);
  inputKeyValidation($(this), conditional);
});

$cvvInput.on('keyup', function () {
  const conditional = !$(this).val().match($cvvRegex);
  inputKeyValidation($(this), conditional);
});

// Resets the Credit Card input and select options if another payment method is chosen.
$paymentSelect.on('change', function () {
  if ($(this).val() !== 'credit card') {
    $creditCardInput.val('').removeAttr('class placeholder');
    $zipCodeInput.val('').removeAttr('class placeholder');
    $cvvInput.val('').removeAttr('class placeholder');
    $expirationMonthSelect[0].selectedIndex = 0;
    $expirationYearSelect[0].selectedIndex = 0;
    $expirationYearSpan.hide();
  }
});

// Validates that the user entered an expiration date that is greater or equal to current month and year, called when the user clicks the "Register" button.
const dateValidation = () => {
  const $month = Number($expirationMonthSelect.val());
  const $year = Number($expirationYearSelect.val());

  if ($year > thisYear || $year >= thisYear && $month >= thisMonth) {
    $expirationYearSpan.hide();
    $expirationMonthSpan.hide();
  } else if ($year >= thisYear && $month < thisMonth) {
    $expirationYearSpan.hide();
    $expirationMonthSpan.show();
  } else {
    $expirationYearSpan.show();
  }

  if ($error.is(':visible')) {
    $registerSpan.show();
  } else {
    $registerSpan.hide();
  }

};
// Re-validates the expiration month when the user changes it.
$expirationMonthSelect.on('change', function () {
  dateValidation();
});
// Re-validates the expiration year when the user changes it.
$expirationYearSelect.on('change', function () {
  dateValidation();
});


// Checks if any errors exist on page when user clicks the "Register" button.
const submitValidation = () => {
  $error = $('.error');
  $errorPlace = $('.error-place');

  // Forces input focus and focus out on any empty input fields on the page. Triggers error if any are empty.
  $allInputs.each(function () {
    if ($(this).val() === '' && $(this).is(':visible')) {
      $(this).focus();
      $(this).blur();
    }
  });

  // Checks if the Other Title input field is visible and empty. Triggers error if it is.
  if ($otherTitle.is(':visible') && $otherTitle.val() === '') {
    $registerSpan.show();
  } else {
    $registerSpan.hide();
  }

  // Checks if any input fields are currently triggering an error.
  $errorPlace.each(function () {
    if ($otherTitle.is(':hidden') && $errorPlace.length > 1) {
      $registerSpan.show();
    } else {
      $registerSpan.hide();
      if ($otherTitle.is(':visible') && $otherTitle.val() === '') {
        $registerSpan.show();
      } else {
        $registerSpan.hide();
      }
    }
  });

  // Checks for any Select or Checkbox items that are triggering errors
  if ($error.is(':visible')) {
    $registerSpan.show();
  } else {
    $registerSpan.hide();
  }

};

// Checks for errors when user clicks the "Register" button.
$register.on('click', function (event) {
  event.preventDefault();
  submitValidation();
  dateValidation();
  // If no errors are found on the page, submits form and displays "Registration Submitted!" message for 2 seconds then refreshes browser.
  if ($registerSpan.is(':hidden')) {
    $register.prop('disabled', true);
    $register.text('Registration Submitted!');
    $register.css('background-color', '#69c773');
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
