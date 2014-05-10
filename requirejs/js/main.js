(function() {
  console.log('/js/main.js')

  requirejs.config({
    baseUrl: '/js', // redundant, just for example
    paths: {
      text: 'lib/require/text.min'
    }
  });

  define(['text!/templates/cars/list.html'], function(CarList) {
    console.log(CarList);
  });
})();
