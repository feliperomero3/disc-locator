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
    removeFilterHandler();

    $filterAdd.click(function () {
      let selectedFilter = $filters.find('.template:last .filter-type').val();

      if (selectedFilter === '') {
        return;
      }

      let filtersInUse = $filters.children().map(function () {
        return $(this).children('.template').attr('class').match(/\b(template-.+?)\b/g)[0];
      }).get();

      let templatesAvailable = $('.template', '.templates').not('.filter-chooser').length;

      if (filtersInUse.length === templatesAvailable) {
        return;
      }

      let $filterChooser = $('div.template.filter-chooser').clone().removeClass('filter-chooser').addClass('filter');

      $filterChooser.find('option[data-template-type]').filter(function () {
        return filtersInUse.indexOf($(this).data('template-type')) >= 0;
      }).remove();

      $filterChooser.appendTo($filters);

    }).click();
  });

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

  function removeFilterHandler() {
    $('#filters').on('click', '.filter-remover', function () {
      $(this).closest('.filter').remove();
    });
  }
});
