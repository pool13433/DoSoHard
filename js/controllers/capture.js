
function CaptureController(CameraFactory, FirebaseService, Utility, GeolocationFactory, $scope, $rootScope) {
    var vm = this;
    var firebaseStoragePath = "gallery/";
    var $modalCapture = $('#model-capture-form');
    vm.profileList = [];

    // Firebase
    var refProfile = firebase.database().ref().child('/profile');
    refProfile.orderByKey().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            var _id = data.key;
            console.log('data ::==', _id);
            var _data = snapshot.child(_id).val();
            console.log('_data ::==', _data);

            // Galllery List
            var refGallery = firebase.database().ref().child('/gallery');
            refGallery.orderByChild("user_id").equalTo(_id).on("value", function (subSnapshot) {
                _data.gallerys = [];
                subSnapshot.forEach(function (data) {
                    var _dataSub = subSnapshot.child(data.key).val();
                    //console.log('_dataSub ::==', _dataSub);
                    _data.gallerys.push(_dataSub);
                });
                vm.profileList.push(_data);
                //console.log("vm.profileList :: ", vm.profileList);
            }, function (error) {
                console.log("Error: " + error.code);
            });

        });
    }, function (error) {
        console.log("Error: " + error.code);
    });


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
        var currentDTM = firebase.database.ServerValue.TIMESTAMP;
        var refGallery = firebase.database().ref().child('/gallery');
        var blobName = Utility.guid() + '.png';
        var form = {
            caption: vm.caption,
            date_time: currentDTM,
            image_name: blobName,
            latitude: coords.latitude,
            location_name: vm.location_name,
            longitude: coords.longitude,
            gallery_rate: {
                x: {
                    user_id: $rootScope.firebaseUser
                }
            },
            gallary_rate_count: 0,
            user_id:  $rootScope.firebaseUser
        }
        refGallery.push(form, function () {
            pushMediaToStorage(blobName);
            $('#model-capture-form').modal('close');
            setTimeout(function () {
                CameraFactory.init();
                vm.caption = '';
                vm.location_name = '';
                vm.camera.capture = false;
            }, 1000);
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

    vm.loginFB = function () {
        var provider = new firebase.auth.FacebookAuthProvider();
        //provider.addScope('user_birthday');
        provider.addScope('public_profile');
        provider.setCustomParameters({
            'display': 'popup'
        });
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            console.log('user ::==', user);
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log('error ::==', error);
        });
    }


    function pushMediaToStorage(blobName) {
        var dataURL = canvas.toDataURL('image/png'); //'image/webp'
        //console.log('dataURL ::==', dataURL);
        //document.querySelector('img').src = dataURL;
        var storageRef = firebase.storage().ref(firebaseStoragePath + blobName);
        var uploadTask = storageRef.put(CameraFactory.dataURItoBlob(dataURL));
        uploadTask.on('state_changed', function progress(snapshot) {
            console.log(snapshot.totalBytesTransferred); // progress of upload
        });
    }



    $scope.$watch(['camera', 'profileList'], function (newData, oldData) {
        console.log('newData ::==', newData);
        console.log('oldData ::==', oldData);
    });

}