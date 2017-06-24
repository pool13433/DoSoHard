app.factory('CameraFactory', CameraFactory);
app.factory('Utility', Utility);
app.factory('GeolocationFactory', GeolocationFactory);
app.factory('$safeApply', ['$rootScope', safeApply]);

function GeolocationFactory() {
    var Geolocation = {}

    Geolocation.init = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(loc){
                Geolocation.coords = loc.coords;
            });
        }
    }

    return Geolocation;
}

function CameraFactory() {
    var Camera = {};

    var video = {};

    Camera.init = function () {
        var _video = getDimensionDeviceScreen();
        console.log('_video ::==', _video);
        var constraints = { audio: false, video: _video }
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            video = document.getElementById('videoCapture');
            // Older browsers may not have srcObject
            if ("srcObject" in video) {
                video.srcObject = stream;
            } else {
                // Avoid using this in new browsers, as it is going away.
                video.src = window.URL.createObjectURL(stream);
            }
            Camera.stream = stream;
            video.onloadedmetadata = function (e) {
                video.play();
            };
        }).catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
    }

    Camera.reset = function () {

        console.log('Camera.stream ::==', Camera.stream);
        video = document.querySelector('video');
        // Older browsers may not have srcObject
        if ("srcObject" in video) {
            video.srcObject = Camera.stream;
        } else {
            // Avoid using this in new browsers, as it is going away.
            video.src = window.URL.createObjectURL(Camera.stream);
        }
        video.onloadedmetadata = function (e) {
            video.play();
        };
    }


    Camera.capture = function () {
        var $canvas = $('#canvasCapture').get(0);
        var $image = $('#imageCapture');
        var localMediaStream = null;

        if (Camera.stream != undefined) {
            $canvas.getContext('2d').drawImage(video, 0, 0);
            // "image/webp" works in Chrome.
            // Other browsers will fall back to image/png.
            var dataToURL = $canvas.toDataURL('image/webp');
            //console.log('dataToURL ::==', dataToURL);
            $image.attr('src', dataToURL);
        }
    }

    Camera.dataURItoBlob = function (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    }

    function getDimensionDeviceScreen() {
        return {
            width: (window.innerWidth > 0) ? window.innerWidth : screen.width,
            height: ((window.innerHeight > 0) ? window.innerHeight : screen.height) / 2
        }
    }

    return Camera;
};

function Utility() {
    return {
        guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }
};
function safeApply($rootScope) {
    $rootScope.$safeApply = function () {
        var $scope, fn, arg, force = false,
            args = arguments;

        if (args.length === 1) {
            arg = args[0];
            if (typeof arg === 'function') {
                fn = arg;
            } else {
                $scope = arg;
            }
        } else if (args.length > 0) {
            $scope = args[0];
            fn = args[1];
            if (args.length === 3) {
                force = !!args[2];
            }
        }

        $scope = $scope || this || $rootScope;
        // Weird v8 bug where sometimes this === window
        // Doesn't happen if you set breakpoints either
        // used a try / catch with a debugger statement
        // before I could inspect an exception instance
        if ($scope === window) { $scope = $rootScope; }

        fn = fn || function () { };

        if (force || !($scope.$$phase ||
            ($scope.$root && $scope.$root.$$phase))) {
            $scope.$apply ? $scope.$apply(fn) : $scope.apply(fn);
        } else {
            fn();
        }
    };

    return $rootScope.$safeApply;
};