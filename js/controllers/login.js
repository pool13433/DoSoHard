function LoginController(FirebaseService, AuthenticationService, $location, $scope, $rootScope) {
    var vm = this;
    console.log("TEST");

    vm.google = function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        var user = firebase.auth().currentUser;

        console.log('user ::==', user);

        if (user != null) {
            $scope.$safeApply(function () {
                AuthenticationService.SetCredentials(user);
                $location.path('/feed');
                console.log(" location.path ::");
            });
            user.providerData.forEach(function (profile) {
                console.log("Sign-in provider: " + profile.providerId);
                console.log("  Provider-specific UID: " + profile.uid);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                console.log("  Photo URL: " + profile.photoURL);
            });
        } else {

            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;

                user.sendEmailVerification().then(function() {
                console.log("sendEmailVerification suc");
              }, function(error) {
                console.log("sendEmailVerification fail",error);
              });

                console.log("User", user);
                console.log("Username", user.displayName);
                $scope.$safeApply(function () {
                    AuthenticationService.SetCredentials(user);
                    $location.path('/feed');
                    console.log(" location.path ::");
                });
                // ...
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log("Error", error);
                // ...
            });
        }
    }
}