var _ = require('lodash');

var data = [
    { "caption": "NICK", "date_time": 1498365545925, "gallary_rate_count": 0, "gallery_rate": { "x": { "user_id": "xxxxxxxxx" } }, "image_name": "744ee8bb-aed5-9d6b-4b29-5c45b8585bd6.png", "latitude": 13.8632195, "location_name": "NICK", "longitude": 100.58836459999999, "user_id": "-Km1o604__n-j5yOkTce" },
    { "caption": "Pool", "date_time": 1498365545925, "gallary_rate_count": 0, "gallery_rate": { "x": { "user_id": "xxxxxxxxx" } }, "image_name": "744ee8bb-aed5-9d6b-4b29-5c45b8585bd6.png", "latitude": 13.8632195, "location_name": "NICK", "longitude": 100.58836459999999, "user_id": "-Km1o604__n-j5yOkTce" },
    { "caption": "NICK", "date_time": 1498365545925, "gallary_rate_count": 0, "gallery_rate": { "x": { "user_id": "xxxxxxxxx" } }, "image_name": "744ee8bb-aed5-9d6b-4b29-5c45b8585bd6.png", "latitude": 13.8632195, "location_name": "NICK", "longitude": 100.58836459999999, "user_id": "-Km1o604__n-j5yOkTce" },
    { "caption": "NICK", "date_time": 1498365545925, "gallary_rate_count": 0, "gallery_rate": { "x": { "user_id": "xxxxxxxxx" } }, "image_name": "744ee8bb-aed5-9d6b-4b29-5c45b8585bd6.png", "latitude": 13.8632195, "location_name": "NICK", "longitude": 100.58836459999999, "user_id": "-Km1o604__n-j5yOkTce" },
    { "caption": "NICK", "date_time": 1498365545925, "gallary_rate_count": 0, "gallery_rate": { "x": { "user_id": "xxxxxxxxx" } }, "image_name": "744ee8bb-aed5-9d6b-4b29-5c45b8585bd6.png", "latitude": 13.8632195, "location_name": "NICK", "longitude": 100.58836459999999, "user_id": "-Km1o604__n-j5yOkTce" }
]


var result = _(data).groupBy('caption').map(function (value, key) {
    //console.log('key ::==',key);
    //console.log('value ::==',value);
    return {
        name: key,
        count: _.countBy(value, 'caption')[key]
    }
}).value();

console.log('result ::==', result);