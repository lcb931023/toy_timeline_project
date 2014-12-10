'use strict';
var jpp = jpp || {};

// we namespace all the JS code to a 'jpp' object
// why jpp? Jewish Play Project
// we call jpp.main.init() on windowload


jpp.main = {
  init: function() {

    // each <body> has a "data-page" to know what page we're on
    var page = document.querySelector('body').getAttribute('data-page');

    switch (page) {
      case 'index':
        console.log('index');
        jpp.main.initCarousel();
        break;
      case 'about':
        console.log('about');
        break;
      case 'people':
        console.log('people');
        break;
      case 'news':
        console.log('news');
        break;
      default:
        //console.log('lol');
        break;
    }


    // setup the navigtion (toggle the mobile nav)
    // the #nav-toggle is hidden on large screens so this won't apply then
    document.querySelector('#nav-toggle').onclick = function (event) {

      // toggle class "show" on the nav-list
      var nav = document.querySelector('#nav-list');
      if (nav.className === 'show') nav.className = '';
      else nav.className = 'show';

      // toggle class "show-x" on the toggle <span>
      // 'this' is the HTML element in this case
      if (this.className === 'show-x') this.className = '';
      else this.className = 'show-x';
    }

  },
  initCarousel: function() {
    var carousel = $("#carousel");
    carousel.owlCarousel({
      items : 10, //10 items above 1000px browser width
      itemsDesktop : [1000,5], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,3], // betweem 900px and 601px
      itemsTablet: [600,2], //2 items between 600 and 0
      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
    });
  }
};


window.onload = jpp.main.init;
