(function ($) {
  'use strict';

  $.extend(true, $.trumbowyg, {
    langs: {
      // jshint camelcase:false
      en: {
        giphy: 'Insert GIF',
      },
      fr: {
        giphy: 'Insérer un GIF',
      },
    }
  });
  // jshint camelcase:true

  var defaultOptions = {
    rating: 'g',
    apiKey: null,
  };

  // Add dropdown with font sizes
  $.extend(true, $.trumbowyg, {
    plugins: {
      giphy: {
        init: function (trumbowyg) {
          trumbowyg.o.plugins.giphy = $.extend({},
            defaultOptions,
            trumbowyg.o.plugins.giphy || {}
          );

          if (trumbowyg.o.plugins.giphy.apiKey === null) {
            throw new Error('You must set a Giphy API Key');
          }

          trumbowyg.addBtnDef('giphy', {
            fn: function() {
              var BASE_URL = 'https://api.giphy.com/v1/gifs/search?api_key=' + trumbowyg.o.plugins.giphy.apiKey;

              var DEFAULT_URL = BASE_URL.replace('/search', '/trending');

              $.ajax({
                url: DEFAULT_URL,
                dataType: 'json',

                success: function (response) {
                  var html = response.data
                    .filter(function (gifData) {
                      return gifData.images.downsized.url !== '';
                    })
                    .map(function (gifData) {
                      return '<div class="img-container"><img src=' + gifData.images.downsized.url + '/></div>';
                    })
                    .join('')
                  ;

                  var searchInput = '<input name="" class="' + trumbowyg.o.prefix + 'giphy-search" placeholder="Search a GIF">';

                  html = searchInput + '<div class="' + trumbowyg.o.prefix + 'giphy-modal-scroll"><div class="' + trumbowyg.o.prefix + 'giphy-modal">' + html + '</div></div>';

                  trumbowyg.openModal(null, html, false);
                },
                error: function (response) {
                  console.error(response.data);
                },
              });
            },
          });
        }
      }
    }
  });
})(jQuery);
