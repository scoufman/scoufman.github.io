app.directive('myfade', function($animate) {
  return {
    scope: {
      'myfade': '=',
      'aftershow': '&',
      'afterhide': '&'
    },
    link: function(scope, element) {
      scope.$watch('myfade', function(show, oldShow) {
        if (show) {
          $animate.removeClass(element, 'ng-hide').then(scope.aftershow);
        }
        if (!show) {
          $animate.addClass(element, 'ng-hide').then(scope.afterhide);
        }
      });
    }
  }
})