function GeolocationController($scope, $http, FirebaseService) {
    var vm = this;
    vm.name = 'Geolocation';
    var map = {};
    var json_string = '';
    var locationList = [];

    // check geolocation support
    if (navigator.geolocation) {
        // get latitude & longitude
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log('position :::==', position);
            var mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                mapTypeId: 'roadmap'
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            // refresh view for blank map render
            google.maps.event.trigger(map, function () {
                map.setZoom(map.getZoom() - 1);
                map.setZoom(map.getZoom() + 1);
            });

            // Firebase

            var refProfile = firebase.database().ref().child('/profile');
            refProfile.orderByKey().on("value", function (snapshot) {
                snapshot.forEach(function (data) {
                    var _id = data.key;
                    var _data = snapshot.child(_id).val();

                    locationList.push(_data);

                    // Create markers.
                    locationList.forEach(function (loc) {
                        // get location name from latitude & longitude 
                        if (loc.latitude != undefined && loc.longitude != undefined) {
                            $http.get('https://maps.google.com/maps/api/geocode/json?latlng=' + loc.latitude + ',' + loc.longitude + '&sensor=false&key=AIzaSyDbtrVJQg_OGwu-W2oaqJdD9pylKTMr_kM').then(function (response) {
                                json_string = response.data.results[0].formatted_address;

                                var contentString = '<div id="content">' +
                                    '<div id="siteNotice">' +
                                    '</div>' +
                                    '<div id="bodyContent" style="max-width:300px"/>' +
                                    '<p><img src=' + loc.profile_image +
                                    ' width="80px" height="80px" style="float:left;max-width80px;max-height:80px;padding:10px;"><b>' + loc.first_name + ' ' + loc.last_name + '</b>, กำลังอยู่ที่ </br> ละติจูดที่ ' + loc.latitude +
                                    ' </br> ลองกิจูดที่ ' + loc.longitude + ' </br></br> <b>' + loc.location_name + '</b> </br></br>' + json_string + '</p>' +
                                    '</div>' +
                                    '</div>';


                                var infowindow = new google.maps.InfoWindow({
                                    content: contentString
                                });

                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(loc.latitude, loc.longitude),
                                    map: map
                                });

                                marker.addListener('click', function () {
                                    infowindow.open(map, marker);
                                });
                            });
                        }
                    });
                });

                var refProfile = firebase.database().ref().child('/active_profile');
                refProfile.orderByKey().on("value", function (snapshot) {
                    snapshot.forEach(function (data) {
                        var _id = data.key;
                        var _data = snapshot.child(_id).val();

                        locationList.push(_data);

                        // Create markers.
                        locationList.forEach(function (loc) {
                            // get location name from latitude & longitude 
                            if (loc.latitude != undefined && loc.longitude != undefined) {
                                $http.get('https://maps.google.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false&key=AIzaSyDbtrVJQg_OGwu-W2oaqJdD9pylKTMr_kM').then(function (response) {
                                    json_string = response.data.results[0].formatted_address;

                                    var contentString = '<div id="content">' +
                                        '<div id="siteNotice">' +
                                        '</div>' +
                                        '<div id="bodyContent" style="max-width:300px"/>' +
                                        '<p><img src=' + loc.profile_image +
                                        ' width="80px" height="80px" style="float:left;max-width80px;max-height:80px;padding:10px;"><b>' + loc.first_name + ' ' + loc.last_name + '</b>, กำลังอยู่ที่ </br> ละติจูดที่ ' + position.coords.latitude +
                                        ' </br> ลองกิจูดที่ ' + position.coords.longitude + ' </br></br> <b>' + loc.location_name + '</b> </br></br>' + json_string + '</p>' +
                                        '</div>' +
                                        '</div>';


                                    var infowindow = new google.maps.InfoWindow({
                                        content: contentString
                                    });

                                    var marker = new google.maps.Marker({
                                        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                                        map: map
                                    });

                                    marker.addListener('click', function () {
                                        infowindow.open(map, marker);
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

}