app.controller('IndexController', IndexController)
app.controller('FeedController', FeedController)
app.controller('CaptureController', CaptureController)
app.controller('ProfileController', ProfileController)
app.controller('GeolocationController', GeolocationController)

/** @ngInject */
function IndexController($scope,$rootScope) {
    var vm = this;


    vm.name = 'Index';


}

function FeedController($scope) {
    var vm = this;


    vm.name = 'Feed';

}

function CaptureController(){
    var vm = this;


    vm.name = 'Capture';

}

function ProfileController(){
    var vm = this;


    vm.name = 'Profile';

}

function GeolocationController(){
    var vm = this;


    vm.name = 'Geolocation';

}



