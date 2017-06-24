function FeedController($scope, FirebaseService) {
    var vm = this;
    var refProfile = firebase.database().ref().child('/profile');

    refProfile.orderByKey().on("value", function (snapshot) {

        vm.profileList = [];
        snapshot.forEach(function (data) {
            console.log('data ::==', data.key);
            var _data = snapshot.child(data.key).val();
            _data.id = data.key
            vm.profileList.push(_data);
        });
    }, function (error) {
        console.log("Error: " + error.code);
    });
    //Title
    vm.name = 'Feed';


}