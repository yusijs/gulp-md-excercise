angular.module("app", ['ngMaterial', 'ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state(
    "home",
    {
      url: "/",
      templateUrl: "/app/home/home.view.html"
    }
  )
  $urlRouterProvider.otherwise("/");
})