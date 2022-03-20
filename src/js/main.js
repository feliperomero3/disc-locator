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
    setRemoveFilterHandler();

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

    setSubmitHandler();
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

  function setRemoveFilterHandler() {
    $('#filters').on('click', '.filter-remover', function () {
      $(this).closest('.filter').remove();
    });
  }

  function setSubmitHandler() {
    $('#form-filters').submit(function (event) {
      event.preventDefault();

      let titleCondition = $filters.find('select[name="title-condition"]').val();
      let title = $filters.find('input[name="title"]').val();
      let binderMin = parseInt($filters.find('input[name="binder-min"]').val(), 10);
      let binderMax = parseInt($filters.find('input[name="binder-max"]').val(), 10);
      let yearMin = parseInt($filters.find('input[name="year-min"]').val(), 10);
      let yearMax = parseInt($filters.find('input[name="year-max"]').val(), 10);
      let viewed = $filters.find('input[name="viewed"]:checked').val();

      $('tr:has(td)', '#results').remove();

      let results = $.grep(movies, function (element) {
        return ((
          (
            titleCondition === undefined &&
            title === undefined
          ) ||
          (
            titleCondition === 'contains' &&
            element.title.indexOf(title) >= 0
          ) ||
          (
            titleCondition === 'stars-with' &&
            element.title.indexOf(title) === 0
          ) ||
          (
            titleCondition === 'ends-with' &&
            element.title.indexOf(title) === element.title.length - title.length
          ) ||
          (
            titleCondition === 'equals' &&
            element.title === title
          )
        ) &&
          (isNaN(binderMin) || element.binder >= binderMin) &&
          (isNaN(binderMax) || element.binder <= binderMax) &&
          (isNaN(yearMin) || element.year >= yearMin) &&
          (isNaN(yearMax) || element.year <= yearMax) &&
          (viewed === undefined || element.viewed === (viewed === 'true'))
        );
      });

      let row;
      for (var i = 0; i < results.length; i++) {
        row = '<td>' + results[i].title + '</td>';
        row += '<td>' + results[i].year + '</td>';
        row += '<td>' + results[i].binder + '</td>';
        row += '<td>' + results[i].page + '</td>';
        row += '<td>' + results[i].slot + '</td>';
        row += '<td>' + (results[i].viewed ? 'X' : '') + '</td>';

        $('#results').append($('<tr>').html(row));
      }
    });
  }
});
