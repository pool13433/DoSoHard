function FeedController($scope, FirebaseService, $rootScope) {
    var vm = this;
    vm.profileList = [];
    vm.title = 'Feed';

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
                            _data.idGal = data.key;

                        });
                        _data.total_rate = totolRate; 
                        _data.idUser = _id;
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
    
    var googleProvider = $rootScope.firebaseUser;
    var googleId = googleProvider.providerData[0].uid;
      
    /*vm.like =  function (userId,idImg) {
        var refGallery = firebase.database().ref().child('/gallery/'+idImg+'/gallery_rate/');
        console.log("---------userId--------",userId);
        console.log("--------idImg---------",idImg);

       
        refGallery.push({user_id:googleId});

        var count ;
        var caption;
        var date_time;
        var latitude;
        var location_name;
        var longitude;
        var user_id;
        var _idGal;
        var gallery_rate;
        var refGal = firebase.database().ref().child('/gallery');
       refGal.orderByKey().equalTo(idImg).on("value", function (snapshot) {
          snapshot.forEach(function (data) {
                 _idGal = data.key;
                var _data = snapshot.child(_idGal).val();
                count = _data.gallary_rate_count + 1 ;
                  caption  = _data.caption;
                    date_time  = _data.date_time;
                    latitude  = _data.latitude;
                    location_name  = _data.location_name;
                    longitude  = _data.longitude;
                    user_id  = _data.user_id;
                    gallery_rate  = _data.gallery_rate;
                console.log(">>>>>>>>>>>>>>>>>>>>>",count);
            });

       });*/

   /*   console.log(">>>>>>>><<<<<<pppppp",idImg);
      var refUpdateCount = firebase.database().ref().child('/gallery/');
        var updates = {};
       updates['/' + idImg] = {
        caption:caption,
        date_time:date_time,
        gallary_rate_count:count,
        gallery_rate: gallery_rate,
        latitude:latitude,
        location_name:location_name,
        longitude:longitude,
        user_id:user_id

            };
      refUpdateCount.update(updates);*/

      
        
     



    }

  
}