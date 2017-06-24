var app = angular.module('dosohardApp', ['ngRoute'])
app.constant('');
app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true).hashPrefix('*');
    $routeProvider.when("/", {
            templateUrl: "./views/index.html",
            controller: 'IndexController'
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
        }).otherwise({ redirectTo: "/" });
});

app.run(function (CameraFactory) {
    
    $(document).ready(function () {
        var $tab = $('ul.tabs').tabs({
            onShow: function (tab) {
                //console.log('tab ::==', tab);
                var id = $(tab).attr('id');
                if (id == 'Capture') {
                    //CameraFactory.init();
                }
            }
        });
    });    
})