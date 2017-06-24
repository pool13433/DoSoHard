function ProfileController($scope) {
    var vm = this;
    vm.name = 'Profile';
    vm.textToSplit = "~#~#";
    vm.profile_profileKey = "-Km1o604__n-j5yOkTce";
    vm.imageValue = [];
    //level 1 is index of localtion
    //level 2 is image name ~#~# rating
    vm.imageObj = [[]];
    //Data is Location --> Index
    vm.imageMapLocation = [];
    //Data is Index --> Location
    vm.imageMapLocationConvert = [];
    //Imgaes data after modifire
    vm.imageToPage = [];
    vm.contLocation = 0;
    vm.resultMapingLocation;
    var childValue;
    var rateCount;
    var ref = firebase.database().ref("/gallery");
    ref.orderByChild("user_id").equalTo(vm.profile_profileKey).on("value", function (snapshot) {
        $scope.$safeApply(function () {
            snapshot.forEach(function (data) {
                childValue = snapshot.child(data.key).val();

                //Check if new Locaton of array and 1D
                if (vm.imageMapLocation[childValue.location_name] == null) {
                    vm.imageMapLocationConvert[vm.imageMapLocationConvert.length] = childValue.location_name;
                    vm.imageMapLocation[childValue.location_name] = vm.contLocation++;
                }
                vm.resultMapingLocation = vm.imageMapLocation[childValue.location_name];
                vm.imageValue[vm.imageValue.length] = childValue;
                //Check if new Locaton of array and generate array 2D
                if (vm.imageObj[vm.resultMapingLocation] == undefined) {
                    vm.imageObj[vm.resultMapingLocation] = [];
                }
                //Get rate count
                if (childValue.gallary_rate_count == undefined) {
                    rateCount = 0;
                } else {
                    rateCount = childValue.gallary_rate_count;
                }
                vm.imageObj[vm.resultMapingLocation][vm.imageObj[vm.resultMapingLocation].length] = childValue.image_name + vm.textToSplit + rateCount;
            });
            //Modifire data for send to Front
            vm.imageToPage = vm.imageMapLocationConvert.map(function (value, index) {
                return {
                    data: value,
                    value: vm.imageObj[index]
                }
            });

            console.log("vm.imageToPage : ", vm.imageToPage);
            console.log("vm.imageMapLocation : ", vm.imageMapLocation);
            console.log("vm.imageMapLocationConvert : ", vm.imageMapLocationConvert);
            console.log("vm.imageObj array : ", vm.imageObj);
        });
    });

}