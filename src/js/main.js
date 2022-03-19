$(document).ready(function () {
  'use strict';
  console.log("ready!");
  let $filters = $('#filters');
  let $filterAdd = $('#filter-add');
  let movies;
  $.getJSON('movies.json', function (data) {
    movies = data;
    $(document).trigger('moviesLoaded');
  });

  $(document).on('moviesLoaded', function () {
    setChangeHandler();

    let templatesAvailable = $('.template', '.templates').not('.filter-chooser').length;

    $filterAdd.click(setClickHandler($filters, templatesAvailable)).click();
  });

  function setClickHandler($filters, templatesAvailable) {
    let selectedFilter = $filters.find('.template:last .filter-type').val();

    if (selectedFilter === '') {
      return;
    }

    let filterInUse = $filters.children().map(function () {
      let innerObj = $(this);
      let childrenWithClass = $(this).children('.template');
      return $(this).children('.template').attr('class').match(/\b(template-.+?)\b/g)[0];
    }).get();

    if (filterInUse.length === templatesAvailable) {
      return;
    }

    let $filterChooser = $('div.template.filter-chooser').clone().removeClass('filter-chooser').addClass('filter');

    $filterChooser.find('option[data-template-type]').filter(function () {
      return filterInUse.indexOf($(this).data('template-type')) >= 0;
    }).remove();

    $filterChooser.appendTo($filters);

  }

  function setChangeHandler() {
    $('#filters').on('change', '.filter-type', function () {
      let $this = $(this);
      let $filter = $this.closest('.filter');
      let filterType = $this.find(':selected').data('template-type');

      $('.qualifier', $filter).remove();
      $('div.template.' + filterType).clone().addClass('qualifier').appendTo($filter);
      $this.find('option[value=""').remove();
    });
  }
});
