'use strict';

var toggler = document.querySelector('.page-nav__toggle');
var menuList = document.querySelector('.page-nav__list');

toggler.classList.add('page-nav__toggle--closed');
menuList.classList.add('page-nav__list--closed');

var initMap = function () {
  var mapOptions = {
    zoom: 7,
    center: {lat: 34.857323, lng: -111.794933},
    disableDefaultUI: true
  }

  var map = new google.maps.Map(document.querySelector('.driving__map'), mapOptions);
  var image = "img/icon-map-marker.svg";
  var myLatLng = new google.maps.LatLng(34.857323, -111.794933);
  var beachMarker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: image,
    animation: google.maps.Animation.DROP
  });
}

var onMenuOperation = function (evt) {

  evt.preventDefault();
  menuList.classList.toggle('page-nav__list--closed');
  toggler.classList.toggle('page-nav__toggle--closed');
}

toggler.addEventListener('click', onMenuOperation);
