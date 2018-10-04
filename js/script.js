// Global jQuery variables
const $firstInput = $('form input').eq(0);
const $otherTitle = $('#other-title');
const $designOptions = $('#design option');
const $colorsDiv = $('#colors-js-puns');
const $colorOptions = $('#color option');

// Presets
$firstInput.focus();
$otherTitle.hide();
$colorsDiv.hide();

/******************************************
 * JOB ROLE SELECT MENU                   *
 ******************************************/
$('#title').on('change', function () {
  if ($(this).val() === 'other') {
    $otherTitle.slideDown(150, "linear");
  } else {
    $otherTitle.slideUp(100, "linear");
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
  const $hearts = [];
  wrap();

  if ($(this).val() === "js puns") {
    $colorOptions.each(function () {
      if ($(this).hasClass('puns')) {
        $(this).unwrap();
        $('#color')[0].selectedIndex = 0;
      }
    });
  } else if ($(this).val() === "heart js") {
    $colorOptions.each(function (index) {
      if ($(this).hasClass('hearts')) {
        $hearts.push(index);
        $(this).unwrap();
        $('#color')[0].selectedIndex = 0;
      }
    });
  } else {
    $colorsDiv.hide();
  }
});

$colorOptions.each(function () {
  const parseColor = $(this).text().replace(/\(.*$/g, '');
  $(this).text(parseColor);
});

/******************************************
 * ON PAGE LOAD                                *
 ******************************************/
$(document).ready(function () {
  $('form')[0].reset();
});
