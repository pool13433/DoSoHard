app.factory('CameraFactory', function () {
    var camera = {};

    var video = {};

    camera.init = function () {
        var _video = getDimensionDeviceScreen();
        console.log('_video ::==', _video);
        var constraints = { audio: false, video: getDimensionDeviceScreen() }
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            video = document.querySelector('video');
            // Older browsers may not have srcObject
            if ("srcObject" in video) {
                video.srcObject = stream;
            } else {
                // Avoid using this in new browsers, as it is going away.
                video.src = window.URL.createObjectURL(stream);
            }
            camera.stream = stream;
            video.onloadedmetadata = function (e) {
                video.play();
            };
        }).catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
    }
    camera.capture = function () {
        var $canvas = $('#canvasCapture').get(0);
        var $image = $('#imageCapture');
        var localMediaStream = null;

        if (camera.stream != undefined) {
            $canvas.getContext('2d').drawImage(video, 0, 0);
            // "image/webp" works in Chrome.
            // Other browsers will fall back to image/png.
            var dataToURL = $canvas.toDataURL('image/webp');
            //console.log('dataToURL ::==', dataToURL);
            $image.attr('src', dataToURL);
        }
    }

    function getDimensionDeviceScreen() {
        return {
            width: (window.innerWidth > 0) ? window.innerWidth : screen.width,
            height: ((window.innerHeight > 0) ? window.innerHeight : screen.height) / 2
        }
    }

    return camera;
})