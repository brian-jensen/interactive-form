/* jshint esversion: 6 */

// Global jQuery variables
const $firstInput = $('form input').eq(0);
const $otherTitle = $('#other-title');
const $designOptions = $('#design option');
const $colorsDiv = $('#colors-js-puns');
const $colorOptions = $('#color option');
const $activities = $('.activities');
const $activitiesLabels = $('.activities label');
const $activitiesInputs = $('.activities input');

// Global variables
let total = 0;

// Presets
$firstInput.focus();
$otherTitle.hide();
$colorsDiv.hide();
$activities.append('<p class="black">Total: <span class="dollar">$<span><span class="total">0</span></p>');


/******************************************
 * JOB ROLE SELECT MENU                   *
 ******************************************/
$('#title').on('change', function () {
  if ($(this).val() === 'other') {
    $otherTitle.slideDown(150, "linear");
  } else {
    $otherTitle.slideUp(150, "linear");
  }
});

/******************************************
 * T-SHIRT INFO                           *
 ******************************************/
$colorOptions.each(function () {
  if ($(this).is(':contains("Puns")')) {
    $(this).addClass('puns');
  }
  if ($(this).is(':contains("♥")')) {
    $(this).addClass('hearts');
  }
});

const wrap = () => $colorOptions.each(function () {
  if ($(this).parent().is('select')) $(this).wrap('<span>');
});

$('#design').on('change', function () {
  $colorsDiv.show();
  wrap();

  if ($(this).val() === "js puns") {
    $colorOptions.each(function () {
      if ($(this).hasClass('puns')) {
        $(this).unwrap();
        $('#color')[0].selectedIndex = 0;
      }
    });
  } else if ($(this).val() === "heart js") {
    $colorOptions.each(function () {
      if ($(this).hasClass('hearts')) {
        $(this).unwrap();
        $('#color')[0].selectedIndex = 0;
      }
    });
  } else {
    $colorsDiv.hide();
  }
});

$colorOptions.each(function () {
  const parseColor = $(this).text().replace(/\(.*$/g, ''); // regex inspired from: https://stackoverflow.com/a/4058971/6090751
  $(this).text(parseColor);
});


/******************************************
 * REGISTER FOR ACTIVITIES                *
 ******************************************/
$activitiesInputs.on('change', function(){
  const $grandTotal = $('.total');
  const $labelText = $(this).parent().text();
  const price = Number($labelText.split('$')[1]);
  const schedule = $labelText.split(' — ')[1].split(',')[0];
  const $label = $(`label:contains(${schedule})`); // https://stackoverflow.com/a/5330100/6090751

  if ($(this).is(':checked')) {
      total += price;
      $label.addClass('disabled').append(`<span class="warning" title="Schedule Conflict"></span>`);
      $label.children().prop('disabled', true);
      $(this).prop('disabled', false).parent().toggleClass('disabled selected').find('span').remove();
  } else {
      total -= price;
      $label.removeAttr('class').find('span').remove();
      $label.children().prop('disabled', false);
  }

  $grandTotal.text(total);
});
      

/******************************************
 * ON PAGE LOAD                           *
 ******************************************/
$(document).ready(function () {
  $('form')[0].reset();
});