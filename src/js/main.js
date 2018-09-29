jQuery(function ($) {
  if (window.innerWidth > 1199) {
    $('.press-list').slick({
      infinite: false,
      slidesToShow: 2,
      slidesToScroll: 2,
      dots: false,
      arrows: true
    });
  }
});
