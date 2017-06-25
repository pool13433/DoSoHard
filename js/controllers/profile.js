function ProfileController(FirebaseStore, $scope, FirebaseService) {

    var googleProvider = $rootScope.firebaseUser; 
    var googleId = googleProvider.providerData[0].uid;

    var vm = this;
    vm.name = 'Profile';
    vm.textToSplit = "~#~#";
    vm.profile_profileKey = googleId;
    vm.imageValue = [];
    //level 1 is index of localtion
    //level 2 is image name ~#~# rating
    vm.imageObj = [[]];
    //Data is Location --> Index
    vm.imageMapLocation = [];
    //Data is Index --> Location
    vm.imageMapLocationConvert = [];
    //Big picture of each location
    vm.bigPictureObj = [];
    //Imgaes data after modifire
    vm.imageToPage = [];
    vm.contLocation = 0;
    vm.resultMapingLocation;
    var childValue;
    var rateCount;
    var pictureObj = {};
    var pictureURL;
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

                pictureURL = "images/loading.gif";
                pictureObj.name = childValue.image_name;
                pictureObj.rateCount = rateCount;
                pictureObj.pictureURL = pictureURL;
                vm.imageObj[vm.resultMapingLocation][vm.imageObj[vm.resultMapingLocation].length] =  Object.assign({},pictureObj);
                
                //Find picture is max rate
                if(vm.bigPictureObj[vm.resultMapingLocation] == null){
                    vm.bigPictureObj[vm.resultMapingLocation] = Object.assign({},pictureObj);
                }else{
                    if(vm.bigPictureObj[vm.resultMapingLocation].rateCount < rateCount){
                        vm.bigPictureObj[vm.resultMapingLocation] = Object.assign({},pictureObj);
                    }
                }
            });
            //Modifire data for send to Front
            vm.imageToPage = vm.imageMapLocationConvert.map(function (value, index) {
                return {
                    data: value,
                    value: vm.imageObj[index],
                    bigPicture: vm.bigPictureObj[index]
                }
            });

            console.log("vm.bigPictureObj : ", vm.bigPictureObj);
            console.log("vm.imageToPage : ", vm.imageToPage);
            console.log("vm.imageMapLocation : ", vm.imageMapLocation);
            console.log("vm.imageMapLocationConvert : ", vm.imageMapLocationConvert);
            console.log("vm.imageObj array : ", vm.imageObj);
            setImageURL(vm.imageObj, 0, 0);
            function setImageURL(pictureObjArray, indexX, indexY){
                console.log("pictureObjArray : ", pictureObjArray);
                var firebaseStoragePath = "gallery/";
                var storageRef = firebase.storage().ref(firebaseStoragePath);
                storageRef.child(pictureObjArray[indexX][indexY].name).getDownloadURL().then(function(url) {
                    pictureObjArray[indexX][indexY].pictureURL = url;
                    console.log("try indexX : ", indexX);
                    console.log("try indexY : ", indexY);
                    console.log("pictureObjArray[indexX][indexY] : ", pictureObjArray[indexX][indexY]);
                    document.getElementById(pictureObjArray[indexX][indexY].name).src = url;
                    if(indexX < pictureObjArray.length){
                        if(indexY >= pictureObjArray[indexX].length - 1){
                            indexX++;
                            indexY = 0;
                        }else{
                            indexY++;
                        }
                        setImageURL(pictureObjArray, indexX, indexY);
                    }
                }).catch(function(error) {
                    console.log("catch indexX : ", indexX);
                    console.log("catch indexY : ", indexY);
                    // Handle any errors
                    document.getElementById(pictureObjArray[indexX][indexY].name).src = "images/default-img.png";
                    if(indexX < pictureObjArray.length){
                        if(indexY >= pictureObjArray[indexX].length - 1){
                            indexX++;
                            indexY = 0;
                        }else{
                            indexY++;
                        }
                        setImageURL(pictureObjArray, indexX, indexY);
                    }
                });
            }
            console.log("vm.imageObj array new val : ", vm.imageObj);
        });
    });
}