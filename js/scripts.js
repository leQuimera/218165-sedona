'use strict';

(function() {
  var navigation = document.querySelector('.page-nav');
  var toggler = navigation.querySelector('.page-nav__toggle');
  var menuList = navigation.querySelector('.page-nav__list');

  var onMenuOperation = function (evt) {
    evt.preventDefault();
    menuList.classList.toggle('page-nav__list--closed');
    toggler.classList.toggle('page-nav__toggle--closed');
  }

  toggler.addEventListener('click', onMenuOperation);
})();
