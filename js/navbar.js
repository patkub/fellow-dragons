$(function() {
  // collapse navbar after navigate
  $('.navbar-collapse a').click(function(){
    $(".navbar-collapse").collapse('hide');
  });

  var MQL = 1170;

  // primary navigation slide-in effect
  if ($(window).width() > MQL) {
    var headerHeight = this.$.navbar.height();
    $(window).on('scroll', {
        previousTop: 0
    },
    function() {
      var currentTop = $(window).scrollTop();
      // check if user is scrolling up
      if (currentTop < this.previousTop) {
          // if scrolling up...
          if (currentTop > 0 && this.$.navbar.hasClass('is-fixed')) {
              this.$.navbar.addClass('is-visible');
          } else {
              this.$.navbar.removeClass('is-visible is-fixed');
          }
      } else if (currentTop > this.previousTop) {
          // if scrolling down...
          this.$.navbar.removeClass('is-visible');
          if (currentTop > headerHeight && !this.$.navbar.hasClass('is-fixed')) {
           this.$.navbar.addClass('is-fixed');
         }
      }
      this.previousTop = currentTop;
    });
  }
});
