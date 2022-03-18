$(document).ready(function () {
  'use strict';
  console.log("ready!");
  let movies;
  $.getJSON('movies.json', function (data) {
    movies = data;
    $(document).trigger('moviesLoaded');
  });

  $(document).on('moviesLoaded', function () {
    let $filters = $('#filters');
    let $filterAdd = $('#filter-add');
    let templatesAvailable = $('.template', '.templates').not('.filter-chooser').length;

    $filterAdd.click(function () {
      let selectedFilter = $filters.find('.template:last .filter-type').val();

      if (selectedFilter === '') {
        return;
      }

      let filterInUse = $filters.children().map(function () {
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
    }).click();
  });
});
