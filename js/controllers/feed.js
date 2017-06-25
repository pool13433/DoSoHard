function FeedController($scope, FirebaseService) {
    var vm = this;
    vm.profileList = [];
    vm.name = 'Feed';

    //------------------------------------------------------------------
    // Firebase
    var refProfile = firebase.database().ref().child('/profile');
    refProfile.orderByKey().on("value", function (snapshot) {

        $scope.$safeApply(function () {
            snapshot.forEach(function (data) {
                var _id = data.key;
                //console.log('data ::==', _id);
                var _data = snapshot.child(_id).val();
                //console.log('_data ::==', _data.name);

                // Galllery List
                var refGallery = firebase.database().ref().child('/gallery');
                refGallery.orderByChild("user_id").equalTo(_id).on("value", function (subSnapshot) {
                    $scope.$safeApply(function () {
                        _data.gallerys = [];
                       // _data.tatal_rate= [];
                        var totolRate = 0 ;
                        subSnapshot.forEach(function (data) {
                            var _dataSub = subSnapshot.child(data.key).val();
                            


                            //console.log(JSON.stringify(_dataSub));
                            //console.log('_dataSub ::==', _dataSub);                            
                            var gallerys_rate = _dataSub.gallery_rate;

                            var sumGallery = _(gallerys_rate).groupBy('user_id').map(function (value, key) {
                                //console.log('key ::==',key);
                                //console.log('value ::==',value);
                                return {
                                    name: key,
                                    count: _.countBy(value, 'user_id')[key]
                                }
                            }).value();
                            console.log('_data ::==', _data.name);
                            console.log('sumGallery ::==', sumGallery);

                            console.log('---------------------');
                            var total = _.sumBy(sumGallery,function(total){
                                return total.count;
                            });
                            console.log('total ::==', total);
                            totolRate += total;
                            _data.gallerys.push(_dataSub);


                        });
                        _data.total_rate = totolRate; 
                        vm.profileList.push(_data);
                        console.log("vm.profileList :: " ,vm.profileList);
                    });
                }, function (error) {
                    console.log("Error: " + error.code);
                });

            });

        });
   
    }, function (error) {
        console.log("Error: " + error.code);
    });

}