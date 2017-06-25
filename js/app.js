var app = angular.module('dosohardApp', ['ngRoute'])
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

app.run(['$rootScope', '$location', 'FirebaseService', '$safeApply', function ($rootScope, $location, FirebaseService) {
    $rootScope.$on('$viewContentLoaded', function () {
        console.log('viewContentLoaded ::==');
        var user = firebase.auth().currentUser;
        if (user == null) {
            $location.path('/login');
        }
    });
}]);

app.controller('MenuController', function (FirebaseService, AuthenticationService, $window) {
    var vm = this;
    vm.logout = function () {
        firebase.auth().signOut().then(function () {
            console.log("sing-out suc");
            setTimeout(function () {
                AuthenticationService.ClearCredentials();
                $window.location.href = '/';
                console.log(" location.path ::");
            }, 2000);
        }).catch(function (error) {
            console.log("sing-out fail", error);
        });
    }
})

