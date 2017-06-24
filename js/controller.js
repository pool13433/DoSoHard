app.controller('IndexController', IndexController)
app.controller('FeedController', FeedController)
app.controller('CaptureController', CaptureController)
app.controller('ProfileController', ProfileController)
app.controller('GeolocationController', GeolocationController)

/** @ngInject */
function IndexController($scope) {
    var vm = this;


    vm.name = 'Index';


}

function FeedController($scope) {
    var vm = this;


    vm.name = 'Feed';

}

function CaptureController(CameraFactory, $scope) {
    var vm = this;
    vm.camera = { isCameraWorking: false, time: 0, capture: false };
    //vm.isCameraWorking = false;
    vm.name = 'Capture';
    vm.cameraInit = function () {
        CameraFactory.init();
        vm.camera.isCameraWorking = true;
    }
    vm.cameraCapture = function () {
        vm.camera.capture = true;
        setTimeout(function () {
            CameraFactory.capture();
            setTimeout(function () {
                $('#model-capture-form').modal({
                    dismissible: true, // Modal can be dismissed by clicking outside of the modal
                    opacity: .5, // Opacity of modal background
                    inDuration: 300, // Transition in duration
                    outDuration: 200, // Transition out duration
                    startingTop: '4%', // Starting top style attribute
                    endingTop: '10%', // Ending top style attribute
                    ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                        //alert("Ready");
                        //console.log(modal, trigger);
                        vm.camera.capture = false;
                    },
                    complete: function () {
                        vm.camera.capture = false;
                        console.log(' modal complete ::==');
                    } // Callback for Modal close
                }).modal('open');

            }, 1000);
        }, 1000 * (vm.camera.time));
    };
    vm.cameraTime = function () {
        var time = prompt("ตั้งเวลาถ่าย (วินาที)", vm.camera.time);
        vm.camera.time = parseInt(time);
        console.log('vm.camera.time ::==', vm.camera);
    };
    vm.cameraSwitchMode = function () {
        alert('Mode');
    };
    vm.cameraSetting = function () {
        alert('Setting');
    };
    $scope.$watch(function () {
        return vm.camera;
    }, function (newData, oldData) {
        console.log('newData ::==', newData);
        console.log('oldData ::==', oldData);
    });

}

function ProfileController() {
    var vm = this;


    vm.name = 'Profile';

}

function GeolocationController() {
    var vm = this;


    vm.name = 'Geolocation';

}



