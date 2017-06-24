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

function FeedController($scope, FirebaseService) {
    var vm = this;
    var refProfile = firebase.database().ref().child('/profile');

    refProfile.orderByKey().on("value", function(snapshot) {
      
            vm.profileList = [];
            snapshot.forEach(function(data) {
                console.log('data ::==', data.key);
                var _data = snapshot.child(data.key).val();
                _data.id = data.key
                vm.profileList.push(_data);
            });
    }, function(error) {
        console.log("Error: " + error.code);
    });
    //Title
    vm.name = 'Feed';


}

function CaptureController(CameraFactory, FirebaseService, Utility,GeolocationFactory, $scope) {
    var vm = this;
    var firebaseStoragePath = "gallery/";
    var $modalCapture = $('#model-capture-form');

    // Firebase
    var refProfile = firebase.database().ref().child('/profile');
    /*refProfile.orderByKey().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            console.log('data ::==', data.key);
            var _data = snapshot.child(data.key).val();
            console.log('_data ::==', _data);
        });
    }, function (error) {
        console.log("Error: " + error.code);
    });*/

    vm.camera = { isCameraWorking: false, time: 0, capture: false };
    //vm.isCameraWorking = false;
    vm.name = 'Capture';
    vm.cameraInit = function () {
        CameraFactory.init();
        GeolocationFactory.init();
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

    var video = document.getElementById('videoCapture');
    var canvas = document.getElementById('canvasCapture');
    var ctx = canvas.getContext('2d');
    var localMediaStream = null;

    vm.pushPost = function (event) {
        var coords = GeolocationFactory.coords;
        var refGallery = firebase.database().ref().child('/gallery');
        var blobName = Utility.guid() + '.png';
        var form = {
            caption: vm.caption,
            date: "xxxxx",
            date_time: "2017-03-34 10:20:45",
            image_name: blobName,
            latitude: coords.latitude,
            location_name: "Union",
            longitude: coords.longitude,
            user_id: "xxxxxx"
        }
        refGallery.push(form,function(){
            pushMediaToStorage(blobName);
            $('#model-capture-form').modal('close');
            setTimeout(function () {
                CameraFactory.init();
                vm.camera.capture = false;
            },1000);                        
        });
        
        vm.form = {};
        event.preventDefault();

        /*if (localMediaStream) {
            ctx.drawImage(video, 0, 0);
            // "image/webp" works in Chrome.
            // Other browsers will fall back to image/png.            
            pushMediaToStorage(blobName);
        }*/
    }


    function pushMediaToStorage(blobName) {
        var dataURL = canvas.toDataURL('image/png'); //'image/webp'
        console.log('dataURL ::==', dataURL);
        //document.querySelector('img').src = dataURL;
        var storageRef = firebase.storage().ref(firebaseStoragePath + blobName);
        var uploadTask = storageRef.put(CameraFactory.dataURItoBlob(dataURL));
        uploadTask.on('state_changed', function progress(snapshot) {
            console.log(snapshot.totalBytesTransferred); // progress of upload
        });
    }



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



