var app = angular.module('dosohardApp', ['ngRoute'])
app.constant('');
app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true).hashPrefix('*');
    $routeProvider.when("/", {
        templateUrl: "./views/index.html",
        controller: 'IndexController'
    }).when("/login", {
        templateUrl: "./views/login.html",
        controller: 'LoginController'
    }).when("/feed", {
        templateUrl: "./views/feed.html",
        controller: 'FeedController'
    }).when("/capture", {
        templateUrl: "./views/capture.html",
        controller: 'CaptureController'
    }).when("/profile", {
        templateUrl: "./views/profile.html",
        controller: 'ProfileController'
    }).when("/setting", {
        templateUrl: "./views/setting.html",
        controller: 'ProfileController'
    }).when("/geo", {
        templateUrl: "./views/geolocation.html",
        controller: 'GeolocationController'
    }).otherwise({ redirectTo: "/feed" });
});

/*app.run(function ($rootScope, AUTH_EVENTS, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
                // user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
}); */
app.run(['$safeApply', function () {
    
}]);

