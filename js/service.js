app.service('FirebaseService', function () {
    var FirebaseService = {};
    FirebaseService = function () {
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyBzbDBZl1Ii0D79Y-Oghqh20GF4tMmwm80",
            authDomain: "dosohard.firebaseapp.com",
            databaseURL: "https://dosohard.firebaseio.com",
            projectId: "dosohard",
            storageBucket: "dosohard.appspot.com",
            messagingSenderId: "1015045318443"
        };
        firebase.initializeApp(config);
        console.log('Firebase Init Complete !!');
    }

    return FirebaseService();
}); 