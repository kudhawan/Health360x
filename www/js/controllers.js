/*
    @Author - Krunal panchal

    Summary - This angular module consists of all controllers used for communication between angular module and view

    Module name - Controllers

    Module description - list of controllers with events functions and scopes

*/

angular.module('app.controllers', [])


// Home controller used with home view (with dependency injections)
.controller('homeCtrl', ['$scope', '$stateParams', '$state', '$http', '$cordovaSQLite', '$cordovaSocialSharing', function($scope, $stateParams, $state, $http, $cordovaSQLite, $cordovaSocialSharing) {
  //initialization of scope
  $scope.home = {};
  //fetching local storage username and assigning it to scope
  $scope.home.loggedinUserName = localStorage.getItem("userFirstName").toString();
  //fetching local storage last login time and assigning it to scope
  $scope.home.loggedinUserLastLogin = localStorage.getItem("userLastLoggedinTime").toString();
  //blank scopes
  $scope.home.loggedinUserBMI = "";
  $scope.home.loggedinUserBP = "";
  $scope.home.loggedinUserBG = "";
  $scope.home.loggedinUserBMI_EON = "";
  $scope.home.loggedinUserBP_EON = "";
  $scope.home.loggedinUserBG_EON = "";

  $scope.eventsScreen = function() {
    $state.go("healthCare360X.events")
  }

  // database initaliaztion
  var db;
  db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);


  // query for selecting deafult parameters of blood glucose from database
  var query = "SELECT BGValue, EON FROM BloodGlucose WHERE IsDefault = 1";
  // db execution method and getting the results
  $cordovaSQLite.execute(db, query).then(function(res) {

    if (res.rows.length > 0) {
      $scope.home.loggedinUserBG = res.rows.item(0).BGValue;
      $scope.home.loggedinUserBG_EON = res.rows.item(0).EON;

    } else {
      $scope.home.loggedinUserBG = "0.0";
      $scope.home.loggedinUserBG_EON = "";

    }

  }, function(err) {
    console.log(err);
    // alert(err);
  });
  // query for selecting deafult parameters of blood pressure from database
  var query = "SELECT SYSValue,DIAValue, EON FROM BloodPressure WHERE IsDefault = 1";
  // db execution method and getting the results
  $cordovaSQLite.execute(db, query).then(function(res) {
    //console.log(res);
    if (res.rows.length > 0) {
      $scope.home.loggedinUserBP = res.rows.item(0).SYSValue + "/" + res.rows.item(0).DIAValue;
      $scope.home.loggedinUserBP_EON = res.rows.item(0).EON;

    } else {
      $scope.home.loggedinUserBP = "0/0";
      $scope.home.loggedinUserBP_EON = "";

    }

  }, function(err) {
    console.log(err);
    // alert(err);
  });
  // query for selecting deafult parameters of bmi from database
  var query = "SELECT Weight,Height,BMI, EON FROM BMI WHERE IsDefault = 1";
  // db execution method and getting the results
  $cordovaSQLite.execute(db, query).then(function(res) {

    if (res.rows.length > 0) {
      $scope.home.loggedinUserBMI = parseFloat(res.rows.item(0).BMI).toFixed(1);
      $scope.home.loggedinUserBMI_EON = res.rows.item(0).EON;

    } else {
      $scope.home.loggedinUserBMI = "0";
      $scope.home.loggedinUserBMI_EON = "";

    }

  }, function(err) {
    console.log(err);
    // alert(err);
  });

  $scope.shareApp = function() {
    $state.go("healthCare360X.messages")
      //    $cordovaSocialSharing
      //      .share("Checkout our health app", "Health 360X", "", "https://play.google.com") // Share via native share sheet
      //      .then(function(result) {
      //        // Success!
      //      }, function(err) {
      //        // An error occured. Show a message to the user
      //      });
  }

}])

//Login controller used with login view (with dependency injections)
.controller('loginCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$cordovaSQLite', '$timeout', function($scope, $stateParams, $state, $http, $ionicLoading, $cordovaSQLite, $timeout) {
  //scope initialization
  $scope.login = {};
  $scope.login.email = "";
  $scope.login.password = "";

  //Login button click function
  $scope.loginClick = function() {
    //$state.go("healthCare360X.home");
    $ionicLoading.show();
    console.log($scope.login.password);

    if ($scope.login.email == null || $scope.login.email.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter valid email id", 'error');
      return;
    }
    if ($scope.login.password == null || $scope.login.password.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter valid password", 'error');
      return;
    }
    // http request for login with method and URL with parameters
    var req = {
        method: 'GET',
        url: "http://www.health360x.com/dataaccess.asmx/nonHVLogin?email=" + $scope.login.email + "&password=" + $scope.login.password + "",

      }
      //request called using angular $http
    $http(req).then(onSuccess, onError);

    // on success method of http request
    function onSuccess(res) {

      if (res != null && res != "") {
        var x2js = new X2JS();
        console.log(x2js.xml_str2json(res.data));
        var response = x2js.xml_str2json(res.data)
        if (response != null && response != "") {
          if (response.LoginUser.id != null && response.LoginUser.id != "") {
            $scope.login.email = "";
            $scope.login.password = "";
            localStorage.setItem("userEmail", response.LoginUser.email);
            localStorage.setItem("userFirstName", response.LoginUser.fname);
            localStorage.setItem("userLastName", response.LoginUser.lname);
            localStorage.setItem("userGender", response.LoginUser.gender);
            localStorage.setItem("userZipCode", response.LoginUser.zipcode);
            localStorage.setItem("userId", response.LoginUser.id);
            if (localStorage.getItem("userLastLoggedinTime") == null || localStorage.getItem("userLastLoggedinTime") == "") {
              localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
            }
            var db;
            db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
            //        if (window.cordova && window.sqlitePlugin) {
            //
            //            var db = $cordovaSQLite.openDB({name:"H360X.db",location:"default"});
            //
            //        } else {
            //            db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5); // browser
            //            console.log("browser");
            //        }
            console.log("DB CREATION")

            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS BloodGlucose(BGId INTEGER PRIMARY KEY AUTOINCREMENT, BGValue NUMERIC, EON TEXT, IsDefault NUMERIC)');
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS BloodPressure(BPId INTEGER PRIMARY KEY AUTOINCREMENT, SYSValue NUMERIC, DIAValue NUMERIC, EON TEXT, IsDefault NUMERIC)');
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS BMI(BMId INTEGER PRIMARY KEY AUTOINCREMENT, Weight NUMERIC,HEIGHT NUMERIC,BMI NUMERIC, EON TEXT, IsDefault NUMERIC)');
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Nutrition(NutritionId INTEGER PRIMARY KEY AUTOINCREMENT, Calory NUMERIC, MDescription TEXT, MType TEXT, EON TEXT, IsDefault NUMERIC)');
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Fitness(FitnessId INTEGER PRIMARY KEY AUTOINCREMENT, Age INTEGER,Weight INTEGER, Gender Text, ActivityType TEXT, Intensity INTEGER,Calory NUMERIC, Distance NUMERIC, Time TEXT, Goal INTEGER, IsDefault NUMERIC,EON TEXT)');
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Events(EventsId INTEGER PRIMARY KEY AUTOINCREMENT, Type NUMERIC, Name TEXT, FromDate TEXT, ToDate TEXT, Time TEXT, Days TEXT NULL, Notes TEXT, Title TEXT, Doctor TEXT)');
            $timeout(function() {
              $ionicLoading.hide();
              $state.go("healthCare360X.home");
            }, 5000)


          } else {
            showToast("Invalid login, please try again", 'error');
            $ionicLoading.hide();
            $scope.login.email = "";
            $scope.login.password = "";
          }
        }
      }
    }
    //on failure method of http request
    function onError(err) {
      $ionicLoading.hide();
      console.log(err);
      showToast("Error while logging in", 'error');
    }
  }

}])

//Signup controller used with signup view (with dependency injections)
.controller('signupCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q', function($scope, $stateParams, $state, $http, $ionicLoading, $q) {

  //default initialization of scope
  $scope.signup = {};
  $scope.signup.firstName = "";
  $scope.signup.lastName = "";
  $scope.signup.emailId = "";
  $scope.signup.password = "";
  $scope.signup.gender = [{
    id: 1,
    gender: "Male"
  }, {
    id: 2,
    gender: "female"
  }];
  $scope.signup.selectedGender = 0;
  $scope.signup.month = "Jan";
  $scope.signup.day = "1";
  $scope.signup.year = "";
  $scope.signup.pincode = "";
  $scope.signup.country = "";
  $scope.signup.userRoles = "";
  $scope.signup.selectedUserRole = "";
  $scope.signup.doctor = "";
  $scope.signup.selectedDoctor = "";
  $scope.signup.securityQuestion = "";
  $scope.signup.selectedSecurityQuestion = "";
  $scope.signup.securityAnswer = "";
  $scope.signup.securityCode = "";
  $scope.signup.selectedSecurityQuestion1 = "";
  $scope.signup.securityAnswer1 = "";
  $scope.signup.securityCode = "";
  $scope.signup.randomSecurityCode = "";

  // on signup page load functions
  $scope.initFunctions = function() {
    $ionicLoading.show();
    var userRoleDeffered = loadUserRoles().then(function(res) {
      if (res != null && res.toString().toLowerCase() == "done") {
        var doctorListDeferred = loadDoctorList().then(function(res) {
          if (res != null && res.toString().toLowerCase() == "done") {
            var questionDeferred = loadSecurityQuestion().then(function(res) {
              if (res != null && res.toString().toLowerCase() == "done") {
                $ionicLoading.hide();
                makeid();
              }
            }, function(err) {
              console.log(err);
              $ionicLoading.hide();
            });
          }
        }, function(err) {
          console.log(err);
          $ionicLoading.hide();
        });
      }
    }, function(err) {
      console.log(err);
      $ionicLoading.hide();
    });

  }

  //on signup button click function
  $scope.signupClick = function() {

    $ionicLoading.show();

    // field validations - firstname
    if ($scope.signup.firstName == null || $scope.signup.firstName.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter first name", "error");
      return;
    }
    // field validations - last name
    if ($scope.signup.lastName == null || $scope.signup.lastName.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter last name", "error");
      return;
    }
    // field validations - email
    if ($scope.signup.emailId == null || $scope.signup.emailId.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter email id", "error");
      return;
    }
    // field validations - password
    if ($scope.signup.password == null || $scope.signup.password.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter password", "error");
      return;
    }
    // field validations - gender
    if ($scope.signup.selectedGender == null || $scope.signup.selectedGender.toString().trim() == "0" || $scope.signup.selectedGender.id == 0 || $scope.signup.selectedGender.id == "") {
      $ionicLoading.hide();
      showToast("Please select gender", "error");
      return;
    }
    // field validations - date of birth
    if ($scope.signup.month == null || $scope.signup.month.toString() == "" || $scope.signup.day == null || $scope.signup.day.toString() == "" || $scope.signup.year == null || $scope.signup.year.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter date of birth", "error");
      return;
    }
    // field validations - postal code
    if ($scope.signup.pincode == null || $scope.signup.pincode.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter postal code", "error");
      return;
    }
    // field validations - country
    if ($scope.signup.country == null || $scope.signup.country.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter country", "error");
      return;
    }
    // field validations - user role
    if ($scope.signup.selectedUserRole == null || $scope.signup.selectedUserRole.toString().trim() == "" || $scope.signup.selectedUserRole.id == 0 || $scope.signup.selectedUserRole.id == "") {
      $ionicLoading.hide();
      showToast("Please select user role", "error");
      return;
    }
    // field validations - doctor
    if ($scope.signup.selectedDoctor == null || $scope.signup.selectedDoctor.toString().trim() == "" || $scope.signup.selectedDoctor.id == 0 || $scope.signup.selectedDoctor.id == "") {
      $ionicLoading.hide();
      showToast("Please select doctor", "error");
      return;
    }
    // field validations - security question
    if ($scope.signup.selectedSecurityQuestion == null || $scope.signup.selectedSecurityQuestion.toString().trim() == "" ||
      $scope.signup.selectedSecurityQuestion.id == 0 || $scope.signup.selectedSecurityQuestion.id == "") {
      $ionicLoading.hide();
      showToast("Please select first security question ", "error");
      return;
    }
    // field validations - security question answer
    if ($scope.signup.securityAnswer == null || $scope.signup.securityAnswer.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter first security question answer", "error");
      return;
    }
    // field validations - security question
    if ($scope.signup.selectedSecurityQuestion1 == null || $scope.signup.selectedSecurityQuestion1.toString().trim() == "" || $scope.signup.selectedSecurityQuestion1.id == 0 || $scope.signup.selectedSecurityQuestion1.id == "") {
      $ionicLoading.hide();
      showToast("Please select second security question ", "error");
      return;
    }
    // field validations - security question answer
    if ($scope.signup.securityAnswer1 == null || $scope.signup.securityAnswer1.toString().trim() == "" || $scope.signup.securityAnswer1.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter second security question answer", "error");
      return;
    }
    // field validations - security code
    if ($scope.signup.securityCode == null || $scope.signup.securityCode.toString() == "") {
      $ionicLoading.hide();
      showToast("Please enter security code", "error");
      return;
    } else if ($scope.signup.securityCode.toString().toLowerCase() != $scope.signup.randomSecurityCode.toString().toLowerCase()) {
      $ionicLoading.hide();
      showToast("Please enter valid security code", "error");
      return;
    }
    var dateOfBirth = $scope.signup.day + "/" + $scope.signup.month + "/" + $scope.signup.year;

    // Defining URL for signup service
    var signupURL = "http://www.health360x.com/dataaccess.asmx/nonHVRegistration?fname=" + $scope.signup.firstName + "&lname=" + $scope.signup.lastName + "&email=" + $scope.signup.emailId + "&password=" + $scope.signup.password + "&roletype=" + $scope.signup.selectedUserRole.roletype + "&gender=" + $scope.signup.selectedGender.gender + "&birthyear=" + moment(dateOfBirth).format("MM/DD/YYYY") + "&postalcode=" + $scope.signup.pincode + "&country=" + $scope.signup.country + "&question1=" + $scope.signup.selectedSecurityQuestion.question + "&answer1=" + $scope.signup.securityAnswer + "&question2=" + $scope.signup.selectedSecurityQuestion1.question + "&answer2=" + $scope.signup.securityAnswer1 + "&createddate=" + new Date() + "&docid=" + $scope.signup.selectedDoctor.id + "";
    console.log(signupURL);

    //Deferred and promise from HTTP request objects
    var httpRequestDeffered = httpRequest("GET", signupURL, "", "").then(function(res) {
      console.log(res);
      $ionicLoading.hide();
      var x2js = new X2JS();
      var result = x2js.xml_str2json(res.data);
      console.log(result);
      if (result != null && result.User.id != null && result.User.id != "") {
        showToast("Signup done successfully, please login", "SUCCESS");
        $scope.signup.firstName = "";
        $scope.signup.lastName = "";
        $scope.signup.emailId = "";
        $scope.signup.password = "";
        $scope.signup.selectedGender = 0;
        $scope.signup.dob = "";
        $scope.signup.pincode = "";
        $scope.signup.country = "";
        $scope.signup.selectedUserRole = "";
        $scope.signup.selectedDoctor = "";
        $scope.signup.selectedSecurityQuestion = "";
        $scope.signup.securityAnswer = "";
        $scope.signup.securityCode = "";
        $scope.signup.selectedSecurityQuestion1 = "";
        $scope.signup.securityAnswer1 = "";
        $scope.signup.securityCode = "";
        $scope.signup.randomSecurityCode = "";
        makeid();
      } else {
        showToast("Error while doing signup", "ERROR");
      }
    }, function(err) {
      console.log(err);
      $ionicLoading.hide();
    })
  }

  // on signin button click function
  $scope.loginClick = function() {
    $state.go("login");
  }

  // on security question first dropdown change event, this will bind the second dropdown based on the selection of first questions
  $scope.securityQuestionChange = function(item) {
    console.log(item);
    if (item != null && item.id != null) {
      var securityQuestion2Data = [];
      for (var i = 0; i < $scope.signup.securityQuestion.length; i++) {
        if ($scope.signup.securityQuestion[i].id != item.id) {
          securityQuestion2Data.push({
            id: $scope.signup.securityQuestion[i].id,
            question: $scope.signup.securityQuestion[i].question
          })
        }
      }
      $scope.signup.securityQuestion1 = securityQuestion2Data;
    } else {
      $scope.signup.securityQuestion1 = [];
    }
  }

  //load function of user roles from webservice, returns success if the result is obtained or returns error if any error persists
  function loadUserRoles() {
    var deferred = $q.defer();
    var x2js = new X2JS();
    var httpRequestDeferred = httpRequest('GET', 'http://www.health360x.com/dataaccess.asmx/RoleType', "", "").then(function(res) {
      console.log(x2js.xml_str2json(res.data));
      //parsing XML to JSON using predefined JS and storing the result in variable
      var roleData = x2js.xml_str2json(res.data);
      if (roleData != null && roleData.ArrayOfRole != null && roleData.ArrayOfRole.Role != null && roleData.ArrayOfRole.Role.length != 0) {
        $scope.signup.userRoles = roleData.ArrayOfRole.Role;
        deferred.resolve("done");
        //$scope.signup.selectedUserRole = $scope.signup.userRoles[0];
      }
    }, function(err) {
      console.log(err);
      deferred.reject(err);
    })
    return deferred.promise;
  }

  //load function of doctors from webservice,returns success if the result is obtained or returns error if any error persists
  function loadDoctorList() {
    var deferred = $q.defer();
    var x2js = new X2JS();
    var httpRequestDeferred = httpRequest('GET', 'http://www.health360x.com/dataaccess.asmx/DoctorList', "", "").then(function(res) {
      console.log(x2js.xml_str2json(res.data));
      //parsing XML to JSON using predefined JS and storing the result in variable
      var docData = x2js.xml_str2json(res.data);
      if (docData != null && docData.ArrayOfUser != null && docData.ArrayOfUser.User != null && docData.ArrayOfUser.User.length != 0) {
        $scope.signup.doctor = docData.ArrayOfUser.User;
        deferred.resolve("done");

      }
    }, function(err) {
      console.log(err);
      deferred.reject(err);
    })
    return deferred.promise;
  }

  //load function of security questions from webservice,returns success if the result is obtained or returns error if any error persists
  function loadSecurityQuestion() {
    var deferred = $q.defer();
    var x2js = new X2JS();
    var httpRequestDeferred = httpRequest('GET', 'http://www.health360x.com/dataaccess.asmx/SecurityQuestion ', "", "").then(function(res) {
      console.log(x2js.xml_str2json(res.data));
      //parsing XML to JSON using predefined JS and storing the result in variable
      var queData = x2js.xml_str2json(res.data);
      if (queData != null && queData.ArrayOfSecurity_Question != null && queData.ArrayOfSecurity_Question.Security_Question != null && queData.ArrayOfSecurity_Question.Security_Question.length != 0) {
        $scope.signup.securityQuestion = queData.ArrayOfSecurity_Question.Security_Question;
        //$scope.signup.securityQuestion1 = queData.ArrayOfSecurity_Question.Security_Question;
        deferred.resolve("done");

      }
    }, function(err) {
      console.log(err);
      deferred.reject(err);
    })
    return deferred.promise;
  }
  /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
  function httpRequest(method, url, params, headers) {
    var deferred = $q.defer();
    var req = {
      method: method,
      url: url,
      data: params,
      headers: headers
    }
    $http(req).then(function(res) {
      if (res != null && res != "") {
        deferred.resolve(res);
      }
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  }
  // Function for generating random security code
  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    $scope.signup.randomSecurityCode = text;
  }
}])

//Controller communicating between forgot password view and model
.controller('forgotCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q) {
    //default scope initilization
    $scope.forgot = {};
    $scope.forgot.email = "";
    //forgot password button click event
    $scope.forgotPasswordClick = function() {
        // XML to JSON parser initilization
        var x2js = new X2JS();
        //validation for email
        if ($scope.forgot.email == null || $scope.forgot.email == "") {
          showToast("Please enter your email id", "ERROR");

          return;
        }
        $ionicLoading.show();
        //generating PIN (random)
        var pin = generatePin();
        console.log(pin);
        //URL initilization
        var url = "http://www.health360x.com/dataaccess.asmx/GeneratePin?email=" + $scope.forgot.email + "&pin=" + pin;
        //Deferred object for HTTP request
        var httpRequestDeferred = httpRequest("GET", url, "", "").then(function(res) {
          var result = x2js.xml_str2json(res.data);
          if (result != null && result.Result != null && result.Result.responce == 1) {
            console.log("pin generated successfully");
            $ionicLoading.hide();
            $scope.forgot.email = "";
            //moving to next screen - verify pin with random PIN generated as argument
            $state.go("verifyPin", {
              pin: pin
            });
          } else {
            showToast(result.Result.message, "error");
            $ionicLoading.hide();
            return;
          }
        }, function(err) {
          $ionicLoading.hide();
        })

      }
      /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    function generatePin() {
      var min = 10000;
      var max = 99999;
      var num = Math.floor(Math.random() * (max - min + 1)) + min;
      return num;
    }
  }
])

//Controller communicating between verify pin  view and model
.controller('verifyPinCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q) {
    //default scope initilization
    $scope.verify = {};
    $scope.verify.email = "";
    $scope.verify.pin = "";
    $scope.verify.actualPin = $stateParams.pin;
    console.log($scope.verify.actualPin);
    //submit pin button click evnt
    $scope.submitPinClick = function() {
      //XML to JSON parser initilization
      var x2js = new X2JS();

      // validation for email
      if ($scope.verify.email == null || $scope.verify.email == "") {
        showToast("Please enter your email id", "ERROR");
        return;
      }
      //validation for pin
      if ($scope.verify.pin == null || $scope.verify.pin == "") {
        showToast("Please enter your pin", "ERROR");
        return;
      }
      //checking the random pin generated and the actual pin entered
      if ($scope.verify.pin != $scope.verify.actualPin) {
        // if pin mismatch - show error
        showToast("Email id and Pin does not match", "ERROR");
        return;
      } else if ($scope.verify.pin == $scope.verify.actualPin) {
        //if pin matches then move to next screen - changepassword
        $scope.verify.email = "";
        $scope.verify.pin = "";
        $state.go("changePassword");
        return;
      }



    }

  }
])

//Controller communicating between change password  view and model
.controller('changePasswordCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q', '$ionicPopup',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q, $ionicPopup) {

    //default scope initilization
    $scope.changePassword = {};
    $scope.changePassword.email = "";
    $scope.changePassword.password = "";

    //change password button click event
    $scope.changePasswordClick = function() {
        //XML to JSON parser initilization
        var x2js = new X2JS();
        //validating email
        if ($scope.changePassword.email == null || $scope.changePassword.email == "") {
          showToast("Please enter your email id", "ERROR");
          return;
        }
        //validating password
        if ($scope.changePassword.password == null || $scope.changePassword.password == "") {
          showToast("Please enter your password", "ERROR");
          return;
        }
        $ionicLoading.show();
        //URL for change password service
        var url = "http://www.health360x.com/dataaccess.asmx/ChangePassword?email=" + $scope.changePassword.email + "&password=" + $scope.changePassword.password + "";
        //HTTP request deferred object
        var httpRequestDeferred = httpRequest("GET", url, "", "").then(function(res) {
          $ionicLoading.hide();
          //parsing the result form XML to JSON
          var result = x2js.xml_str2json(res.data);
          //checking whether result is not null
          if (result != null && result.Result != null && result.Result.responce == 1) {
            $scope.changePassword.email = "";
            $scope.changePassword.password = "";
            //success message for password change
            var alertPopup = $ionicPopup.alert({
              title: 'Health360X',
              template: 'Password changed succesfully !!'
            });
            // if confirmed the alert then move to login screen
            alertPopup.then(function(res) {
              $state.go("login");
            });
          }
        }, function(err) {
          console.log(err);
          $ionicLoading.hide();
        })


      }
      /*
        HTTP angular method to call the webservice
        Accepts parameters
            method - method name GET / POST
            url - URL of the service
            params - parameters to be passed to the service
            headers - default headers to the service
    */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

  }
])

//Controller communicating between blood glucose view and model
.controller('bloodGlucoseCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q', function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {

  //logout function
  

  //default scope
  $scope.BGobj = [];
  $scope.bGlu = "0";
  $scope.bgMarginTop = "-15%"
    //database initialization
  var db;
  db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);

  $scope.logout = function() {
    $scope.bGlu="0"
    localStorage.clear();
    localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
    $state.go("login");
  }
  //query for selecting default value from bg table
  var query = "SELECT BGValue, EON FROM BloodGlucose WHERE IsDefault = 1";
  //execution of query
  $cordovaSQLite.execute(db, query).then(function(res) {
    //checking result length
    if (res.rows.length > 0) {
      //assigning result to scope
      $scope.BGobj.BGiLevel = res.rows.item(0).BGValue;
      //var eon = formatDateToDisplay(new Date(res.rows.item(0).EON));
      var eon = res.rows.item(0).EON;
      $scope.bgMarginTop = "-25%"

      console.log(eon);
      $scope.BGDate = eon;
      $scope.BGobj.BGEOND = eon.toString().split("|")[0];

      $scope.BGobj.BGEONT = eon.toString().split("|")[1];

      var $bs = res.rows.item(0).BGValue;
      //rotation angle defined based on the value entered
      $scope.angle = getRotationAngle($bs) + $bs;
      if ($bs <= 40)
        $scope.BGVColor = "BGV_Red", gAng = -88;
      else if ($bs > 40 && $bs <= 54)
        $scope.BGVColor = "BGV_Yellow", gAng = -83;
      else if ($bs > 54 && $bs <= 109)
        $scope.BGVColor = "BGV_Green";
      else if ($bs > 109 && $bs <= 159)
        $scope.BGVColor = "BGV_Yellow";
      else if ($bs > 159)
        $scope.BGVColor = "BGV_Red";
    } else {
      $scope.BGobj.BGiLevel = "0.0";
      $scope.angle = -87;
      $scope.BGVColor = "BGV_Red";
    }

  }, function(err) {
    alert(err);
  });

  //calculating Blood sugar level
  $scope.calculateBS = function($bs) {

      if ($bs > 250 || $bs <= 0) {
        showToast("Invalid value.", 'error');
        return false;
      }

      if ($bs == null || $bs.toString().length == 0) {
        $scope.bGlu = "";
        showToast("Enter Blood Sugar.", 'warning');
        return false;
      };
      //defining rotation based on the blood sugar level
      if ($bs <= 40)
        $scope.BGVColor = "BGV_Red", gAng = -88;
      else if ($bs > 40 && $bs <= 54)
        $scope.BGVColor = "BGV_Yellow", gAng = -83;
      else if ($bs > 54 && $bs <= 109)
        $scope.BGVColor = "BGV_Green";
      else if ($bs > 109 && $bs <= 159)
        $scope.BGVColor = "BGV_Yellow";
      else if ($bs > 159)
        $scope.BGVColor = "BGV_Red";

      $scope.angle = getRotationAngle($bs) + $bs;

      $scope.BGobj.BGiLevel = parseFloat($bs).toFixed(1);
      var eon = formatDateToDisplay(new Date());
      $scope.BGDate = moment(new Date()).format("MMM DD YYYY | hh : mm a")
      $scope.BGobj.BGEOND = eon.toString().split("|")[0];
      $scope.BGobj.BGEONT = eon.toString().split("|")[1];

      //insert query for values entered into blood glucose table
      var query = "INSERT INTO BloodGlucose(BGValue, EON, IsDefault) VALUES (?,?,?)";
      //execution of insert query
      $cordovaSQLite.execute(db, query, [parseFloat($bs).toFixed(1), moment(new Date()).format("MMM DD YYYY | hh : mm a"), 1]).then(function(res) {
        //update query for the current value to be the default value
        query = "UPDATE BloodGlucose SET IsDefault = 0 WHERE BGId <> ? ";
        // execution of update query
        var data = {
          userID: localStorage.getItem("userId"),
          bloodGlucose: $bs.toString(),
          dateCollected:  moment(new Date()).format("MM/DD/YYYY"),
          mealFlag:'',
          hvRecordID:'',
          comments:''

        }
       
        $cordovaSQLite.execute(db, query, [res.insertId]).then(function(kres) {
          $ionicLoading.show();
          var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://www.health360x.com/dataaccess.asmx/saveHV_BloodGlucoseFull",
            "method": "POST",
            "headers": {
              "content-type": "application/x-www-form-urlencoded",
            },
            "data": data
          }
          
          $.ajax(settings).done(function (response) {
            var x2js = new X2JS();
            var res = x2js.xml_str2json(response);
            console.log(res);
            $ionicLoading.hide();
          });
        }, function(kerr) {
          alert(kerr);
        });

        //alert("INSERT ID -> " + res.insertId);
      }, function(err) {
        alert(err);
      });
    }
    // function to convert json to query string
    function jsonToQueryString(json) {
      return '?' + 
          Object.keys(json).map(function(key) {
              return encodeURIComponent(key) + '=' +
                  encodeURIComponent(json[key]);
          }).join('&');
    }
    /*
      HTTP angular method to call the webservice
      Accepts parameters
          method - method name GET / POST
          url - URL of the service
          params - parameters to be passed to the service
          headers - default headers to the service
     */
  function httpRequest(method, url, params, headers) {
    var deferred = $q.defer();
    var req = {
      method: method,
      url: url,
      data: params,
      headers: headers
    }
    $http(req).then(function(res) {
      if (res != null && res != "") {
        deferred.resolve(res);
      }
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  }

  $scope.initFunction = function(){
    
  }

}])

//Controller communicating between blood pressure view and model
.controller('bloodPressureCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {

    //logout function
    $scope.logout = function() {
        localStorage.clear();
        localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
        $state.go("login");
      }
      //default scope
    $scope.BPobj = [];
    $scope.BPobj.BPSYSLevel = "0.0";
    $scope.BPobj.BPDIALevel = "0.0";

    $scope.SYSangle = -87;
    $scope.DIAangle = -87;

    $scope.BPSColor = "BGV_Red";
    $scope.BPDColor = "BGV_Red";
    $scope.systolicDialMarginTop = "-23%"

    //database initilization
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);

    //select query for default blood pressure
    var query = "SELECT SYSValue, DIAValue, EON FROM BloodPressure WHERE IsDefault = 1";
    //select query execution
    $cordovaSQLite.execute(db, query).then(function(res) {
      //checking result rows length
      if (res.rows.length > 0) {
        //assigning result to scope
        $scope.BPobj.BPSYSLevel = res.rows.item(0).SYSValue;
        $scope.BPobj.BPDIALevel = res.rows.item(0).DIAValue;
        var $syst = res.rows.item(0).SYSValue;
        var $dias = res.rows.item(0).DIAValue;
        $scope.systolicDialMarginTop = "-35%"

        //var eon = formatDateToDisplay(new Date(res.rows.item(0).EON));
        var eon = res.rows.item(0).EON;
        $scope.BPobj.BPEOND = eon.toString().split("|")[0];
        $scope.BPobj.BPEONT = eon.toString().split("|")[1];
        $scope.BPDate = eon;

        $scope.SYSangle = getRotationAngle($syst) + $syst;
        console.log($scope.SYSangle);
        $scope.DIAangle = getRotationAngle($dias) + $dias;

        $scope.setUnitColor($syst, $dias);

      } else {
        $scope.BPobj.BPSYSLevel = "0.0";
        $scope.BPobj.BPDIALevel = "0.0";

        // $scope.SYSangle = -87;
        // $scope.DIAangle = -87;

        $scope.BPSColor = "BGV_Red";
        $scope.BPDColor = "BGV_Red";
      }

    }, function(err) {
      alert(err);
    });
    //setting color based on the blood pressure values
    $scope.setUnitColor = function($syst, $dias) {
        if ($syst <= 70)
          $scope.BPSColor = "BGV_Red";
        else if ($syst > 70 && $syst <= 90)
          $scope.BPSColor = "BGV_Yellow";
        else if ($syst > 90 && $syst <= 120)
          $scope.BPSColor = "BGV_Green";
        else if ($syst > 120 && $syst <= 160)
          $scope.BPSColor = "BGV_Yellow";
        else if ($syst > 160)
          $scope.BPSColor = "BGV_Red";

        if ($dias >= 50 && $dias <= 55)
          $scope.BPDColor = "BGV_Yellow";
        else if ($dias > 55 && $syst <= 80)
          $scope.BPDColor = "BGV_Green";
        else if ($dias > 80 && $syst <= 90)
          $scope.BPDColor = "BGV_Yellow";
        else if ($dias > 90)
          $scope.BPDColor = "BGV_Red";
      }
      //$scope.Syst = "";
      //$scope.Dias = "";
      //$scope.isystolic = "";
      //$scope.idiastolic = "";

    //$('#gaugeSys .gauge-arrow').cmGauge();
    //$('#gaugeDia .gauge-arrow').cmGauge();

    //calculating blood pressure level
    $scope.calculateBP = function($syst, $dias) {
        //validating bp values
        if ($syst == null || $dias == null || $syst.toString().length == 0 || $dias.toString().length == 0) {
          $scope.Syst = "";
          $scope.Dias = "";
          showToast("Systolic & Diastolic values are mandatory.", 'warning');
          return false;
        };

        if ($syst < 60 || $syst > 180) {
          showToast("Invalid systolic value.", 'error');
          return false;
        }

        if ($dias < 50 || $dias > 110) {
          showToast("Invalid diastolic value.", 'error');
          return false;
        }
        //defining angle of rotation of meter
        $scope.SYSangle = getRotationAngle($syst) + $syst;
        $scope.DIAangle = getRotationAngle($dias) + $dias;
        //setting the color with values
        $scope.setUnitColor($syst, $dias);

        $scope.BPobj.BPSYSLevel = $syst;
        $scope.BPobj.BPDIALevel = $dias;
        //formatting the date
        var eon = formatDateToDisplay(new Date());
        $scope.BPobj.BPEOND = eon.toString().split("|")[0];
        $scope.BPobj.BPEONT = eon.toString().split("|")[1];
        $scope.BPDate = moment(new Date()).format("MMM DD YYYY | hh:mm a");
        //inserting values into bp table
        var query = "INSERT INTO BloodPressure(SYSValue, DIAValue, EON, IsDefault) VALUES (?,?,?,?)";
        //execution of insert query
        $cordovaSQLite.execute(db, query, [$syst, $dias, moment(new Date()).format("MMM DD YYYY | hh : mm a"), 1]).then(function(res) {
          //update of recently added value to default
          query = "UPDATE BloodPressure SET IsDefault = 0 WHERE BPId <> ? ";
          //exeuction of update query
          $cordovaSQLite.execute(db, query, [res.insertId]).then(function(kres) {
            $ionicLoading.show();
            //URL for webserive (BP) with parameters
            //var url = 'http://www.health360x.com/dataaccess.asmx/saveHV_BloodPressureFull?userID=' + localStorage.getItem("userId") + '&systolic=' + $syst.toString() + '&dateMeasured=' + moment(new Date()).format("MM/DD/YYYY") + '&diastolic=' + $dias.toString() + '&notes=""&hvRecordID=""';
            var data = {
              userID: localStorage.getItem("userId"),
              dateMeasured:  moment(new Date()).format("MM/DD/YYYY"),
              systolic:$syst.toString(),
              diastolic:$dias.toString(),
              hvRecordID:'',
              notes:''
    
            }
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": "http://www.health360x.com/dataaccess.asmx/saveHV_BloodPressureFull",
              "method": "POST",
              "headers": {
                "content-type": "application/x-www-form-urlencoded",
              },
              "data": data
            }
            
            $.ajax(settings).done(function (response) {
              var x2js = new X2JS();
              var res = x2js.xml_str2json(response);
              console.log(res);
              $ionicLoading.hide();
            });

          
          }, function(kerr) {
            alert(kerr);
          });

        }, function(err) {
          alert(err);
        });


      }
      /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }


  }
])

//Controller communicating between default view and model
.controller('healthCare360XCtrl', ['$scope', '$stateParams', '$state', '$http',
  function($scope, $stateParams, $state, $http) {
    //logout function
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }
  }
])

//Controller communicating between weight view and model
.controller('weightCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout function
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }

    //default scope
    $scope.bW = "";
    $scope.bH = "";
    $scope.BWobj = [];
    //database initilization
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);

    //query for selecting default weight
    var query = "SELECT Weight, EON FROM BMI WHERE IsDefault = 1";
    //execution of select query
    $cordovaSQLite.execute(db, query).then(function(res) {
      //checking result rows length
      if (res.rows.length > 0) {
        var $weight = res.rows.item(0).Weight;
        //formatting date value from result
        var eon = res.rows.item(0).EON;
        $scope.weightDate = eon;
        //assinging result to scope
        $scope.BWobj.BPEOND = eon.toString().split("|")[0];
        $scope.BWobj.BPEONT = eon.toString().split("|")[1];
        //defining angle for rotation based on result
        $scope.angle = getRotationAngleForBW($weight);
        $scope.BWobj.BWLevel = $weight;
      } else {
        $scope.BWobj.BWLevel = "0.0";
        $scope.angle = -124;
        $scope.BGVColor = "BGV_Red";
      }
      //defining color
      $scope.BGVColor = "BGV_Green";

    }, function(err) {
      alert(err);
    });

    //calculating weight (BMI)
    $scope.calculateBW = function($weight, $height) {
        //validating weight value
        if ($weight == null || $weight.toString().length == 0) {
          showToast("Weight is mandatory.", 'warning');
          return false;
        };
        //validating height value
        if ($height == null || $height.toString().length == 0) {
          showToast("Height is mandatory.", 'warning');
          return false;
        };
        if ($weight < 1 || $weight > 400) {
          showToast("Invalid weight.", 'error');
          return false;
        }
        //calculating BMI
        var BMI = (parseFloat($weight) / parseFloat($height) / parseFloat($height)) * 703;
        console.log(BMI);
        //validating weight range

        //defining backgorund color
        $scope.BGVColor = "BGV_Green";
        //setting angle of meter rotation based on weight entered
        $scope.angle = getRotationAngleForBW($weight);

        $scope.BWobj.BWLevel = $weight;
        //formatting date
        var eon = formatDateToDisplay(new Date());
        $scope.weightDate = moment(new Date()).format("MMM DD YYYY | hh:mm a");
        //assigning date to scope
        $scope.BWobj.BPEOND = eon.toString().split("|")[0];
        $scope.BWobj.BPEONT = eon.toString().split("|")[1];
        //insert query for values entered
        var query = "INSERT INTO BMI(Weight,Height,BMI, EON, IsDefault) VALUES (?,?,?,?,?)";
        //execution of insert query
        $cordovaSQLite.execute(db, query, [$weight, $height, parseFloat(BMI).toFixed(1), moment(new Date()).format("MMM DD YYYY | hh : mm a"), 1]).then(function(res) {
          //update query for setting default to the recently entered values
          query = "UPDATE BMI SET IsDefault = 0 WHERE BMId <> ? ";
          //exeuction of update query
          $cordovaSQLite.execute(db, query, [res.insertId]).then(function(kres) {
            $ionicLoading.show();
            var data = {
              userID: localStorage.getItem("userId"),
              dateMeasured:  moment(new Date()).format("MM/DD/YYYY"),
              weightLbs:$weight.toString(),
              heightInches:$height.toString(),
              hvRecordID:'',
            }
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": "http://www.health360x.com/dataaccess.asmx/saveHV_HeightWeight",
              "method": "POST",
              "headers": {
                "content-type": "application/x-www-form-urlencoded",
              },
              "data": data
            }
            
            $.ajax(settings).done(function (response) {
              var x2js = new X2JS();
              var res = x2js.xml_str2json(response);
              console.log(res);
              $ionicLoading.hide();
            });
          }, function(kerr) {
            alert(kerr);
          });

        }, function(err) {
          alert(err);
        });

      }
      /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }
  }
])

//Controller communicating between fitness view and model
.controller('fitnessCtrl', ['$scope', '$stateParams', '$cordovaGeolocation', '$state', '$http', '$ionicLoading', '$q', '$cordovaSQLite',
  function($scope, $stateParams, $cordovaGeolocation, $state, $http, $ionicLoading, $q, $cordovaSQLite) {
    //logout function
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);

    //default scope
    $scope.fitness = {};
    $scope.fitness.age = "";
    $scope.fitness.weight = "";
    $scope.fitness.activity = ['Aerobics', 'Calisthenics', 'Cross-Fit', 'Cycling', 'Dancing', 'Hiking', 'Jogging', 'Running', 'Stretching', 'Strength Training', 'Tai Chi', 'Walking', 'Yoga', 'Zumba'];
    $scope.fitness.gender = ['Male', 'Female'];
    $scope.fitness.intensity = [{
      id: 1,
      label: '1 - Low',
      value: 1
    }, {
      id: 2,
      label: '2',
      value: 2
    }, {
      id: 3,
      label: '3',
      value: 3
    }, {
      id: 4,
      label: '4',
      value: 4
    }, {
      id: 5,
      label: '5 - Medium',
      value: 5
    }, {
      id: 6,
      label: '6',
      value: 6
    }, {
      id: 7,
      label: '7',
      value: 7
    }, {
      id: 8,
      label: '8',
      value: 8
    }, {
      id: 9,
      label: '9',
      value: 9
    }, {
      id: 10,
      label: '10 - High',
      value: 10
    }, ];
    $scope.fitness.selectedGender = "Male";
    $scope.fitness.selectedActivity = "Aerobics";
    $scope.fitness.selectedIntensity = $scope.fitness.intensity[0];
    $scope.fitness.goal = "";
    $scope.fitness.hours = "";
    $scope.fitness.minutes = "";
    $scope.fitness.seconds = "";
    //on start button click
    $scope.gotoFitnessMeasurement = function() {
      console.log($scope.fitness.goal)
        //validation for age
      if ($scope.fitness.age == null || $scope.fitness.age == "" || $scope.fitness.age == 0) {
        showToast("Please enter proper age", 'error');
        return false;
      }
      //validation for weight
      if ($scope.fitness.weight == null || $scope.fitness.weight.toString().trim() == "" || $scope.fitness.weight == 0) {
        showToast("Please enter proper weight", 'error');
        return false;
      }
      //validation for activity
      if ($scope.fitness.selectedActivity == null || $scope.fitness.selectedActivity == "" || $scope.fitness.selectedActivity == 0) {
        showToast("Please select proper activity", 'error');
        return false;
      }
      //validation for gender
      if ($scope.fitness.selectedGender == null || $scope.fitness.selectedGender == "" || $scope.fitness.selectedGender == 0) {
        showToast("Please select proper gender", 'error');
        return false;
      }
      //validation for intensity
      if ($scope.fitness.selectedIntensity == null || $scope.fitness.selectedIntensity == "" || $scope.fitness.selectedIntensity == 0) {
        showToast("Please select proper intensity", 'error');
        return false;
      }
      //validation for goal
      if ($scope.fitness.goal == null || $scope.fitness.goal == "" || $scope.fitness.goal == 0) {
        showToast("Please enter proper distance", 'error');
        return false;
      }
      //validation for hours
      if ($scope.fitness.hours == null || $scope.fitness.hours == "" ||
        $scope.fitness.minutes == null || $scope.fitness.minutes == "" ||
        $scope.fitness.seconds == null || $scope.fitness.seconds == ""
      ) {
        showToast("Please enter proper time", 'error');
        return false;
      }
      var time = $scope.fitness.hours + " " + $scope.fitness.minutes + " " + $scope.fitness.seconds;
      var query = "INSERT INTO Fitness(Age,Weight,Gender,ActivityType,Intensity,Goal,Time,EON,IsDefault) VALUES (?,?,?,?,?,?,?,?,?)";
      //execution of insert query
      $cordovaSQLite.execute(db, query, [parseInt($scope.fitness.age), parseInt($scope.fitness.weight), $scope.fitness.selectedGender, $scope.fitness.selectedActivity, parseInt($scope.fitness.selectedIntensity.value), $scope.fitness.goal, time, moment(new Date()).format("MMM DD YYYY | hh : mm a"), 1]).then(function(res) {
        //update query for setting default to the recently entered values
        query = "UPDATE Fitness SET IsDefault = 0 WHERE FitnessId <> ? ";
        //exeuction of update query
        $cordovaSQLite.execute(db, query, [res.insertId]).then(function(kres) {
          $ionicLoading.hide();
          //URL for webservice (BMI) with its parameters
          //          var url = 'http://www.health360x.com/dataaccess.asmx/saveHV_HeightWeight?userID=' + localStorage.getItem("userId") + '&weightLbs=' + $weight.toString() + '&dateMeasured=' + moment(new Date()).format("MM/DD/YYYY") + '&heightInches=' + $height + '&hvRecordID=""';
          //          console.log(url);
          //          //HTTP request with webservice
          //          var httpRequestDeferred = httpRequest("GET", url, "", "").then(function(res) {
          //            console.log(res);
          //            $ionicLoading.hide();
          //          }, function(err) {
          //            console.log(err);
          //            $ionicLoading.hide();
          //          })
        }, function(kerr) {
          console.log(kerr);
          $ionicLoading.hide();
        });

      }, function(err) {
        console.log(err);
        $ionicLoading.hide();
      });

      //moving to timer screen
      $state.go("healthCare360X.fitnessMeasurement", {
        goal: $scope.fitness.goal,
        age: $scope.fitness.age,
        weight: $scope.fitness.weight,
        intensity: $scope.fitness.selectedIntensity.value,
        gender: $scope.fitness.selectedGender,
        isNewStart: true,
        exercise:$scope.fitness.selectedActivity
      })
    }

    //moving to timer screen
    $scope.onResumeClick = function() {
      $state.go("healthCare360X.fitnessMeasurement", {
        goal: $scope.fitness.goal,
        age: $scope.fitness.age,
        weight: $scope.fitness.weight,
        intensity: $scope.fitness.selectedIntensity.value,
        gender: $scope.fitness.selectedGender,
        isNewStart: false
      })
    }
    $scope.onIntensityChange = function(obj) {
      console.log("change");
      console.log(obj);
    }

  }
])

//Controller communicating between fitness measurement view and model
.controller('fitnessMeasurementCtrl', ['$scope', '$http', '$stateParams', "$state", '$interval', '$window', '$ionicLoading', '$q',

  function($scope, $http, $stateParams, $state, $interval, $window, $ionicLoading, $apply, $q) {
    //logout function
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }
    $ionicLoading.show();
    //default scope
    $scope.fitnessMeasurement = {};
    $scope.fitnessMeasurement.age = $stateParams.age;
    $scope.fitnessMeasurement.gender = $stateParams.gender;
    console.log($scope.fitnessMeasurement.gender)
    $scope.fitnessMeasurement.goal = $stateParams.goal;
    $scope.fitnessMeasurement.weight = $stateParams.weight;
    $scope.fitnessMeasurement.intensity = $stateParams.intensity;
    $scope.fitnessMeasurement.isNewStart = $stateParams.isNewStart;
    $scope.fitnessMeasurement.hours = "00";
    $scope.fitnessMeasurement.minutes = "00";
    $scope.fitnessMeasurement.seconds = "00";
    $scope.fitnessMeasurement.timerMessage = "Start";
    $scope.fitnessMeasurement.globalSeconds = 0;
    $scope.fitnessMeasurement.currentLocationLatitude = "";
    $scope.fitnessMeasurement.currentLocationLongitude = "";
    $scope.fitnessMeasurement.calories = 0;
    $scope.fitnessMeasurement.distanceTravelled = 0;
    $scope.fitnessMeasurement.exercise = $stateParams.exercise;
    console.log($scope.fitnessMeasurement.isNewStart);
    //for existing start event
    if ($scope.fitnessMeasurement.isNewStart == false) {
      $scope.fitnessMeasurement.hours = parseInt(localStorage.getItem("fitnessTime").toString().split(":")[0]);
      $scope.fitnessMeasurement.minutes = parseInt(localStorage.getItem("fitnessTime").toString().split(":")[1]);
      $scope.fitnessMeasurement.seconds = parseInt(localStorage.getItem("fitnessTime").toString().split(":")[2]);
      $scope.fitnessMeasurement.globalSeconds = parseInt(localStorage.getItem("totalSeconds"));
      $scope.fitnessMeasurement.calories = parseInt(localStorage.getItem("caloriesBurned"));
      $scope.fitnessMeasurement.distanceTravelled = parseInt(localStorage.getItem("distanceTravelled"));

    } else if ($scope.fitnessMeasurement.isNewStart == true) { //for new event
      localStorage.setItem("fitnessTime", "");
      localStorage.setItem("totalSeconds", "");
      localStorage.setItem("caloriesBurned", "");
      localStorage.setItem("distanceTravelled", "");
    }
    //dynamic timer styling based on start and stop event
    $scope.fitnessMeasurement.timerStyle = {
      "width": "150px",
      "height": "150px",
      "border-radius": "100%",
      "background-color": "#54cc5f",
      "text-align": "center",
      "line-height": "100px",
      "font-size": "16px",
      "margin": "0 auto",
      "color": "#FFF",
      "box-shadow": "0 3px 3px rgba(0,0,0,.5)"
    }
    console.log($stateParams.age)
    var options = {
        enableHighAccuracy: true,
        maximumAge: 3600000
      }
      // HTTP request parameters
      //    var req = {
      //      method: 'POST',
      //      url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCFyz-ryLQsKck7lAm_Vx98jkZvNzXszcY",
      //
      //    }
      //
      //    $http(req).then(onSuccess, onError);

    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    //success method of fetching position
    function onSuccess(position) {
      console.log(position);
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        mapTypeControl: false,
        compass: true,
        indoorPicker: true
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      var myMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      });
      addYourLocationButton(map, myMarker);
      $scope.map = map;
      $scope.fitnessMeasurement.currentLocationLatitude = position.coords.latitude;
      $scope.fitnessMeasurement.currentLocationLongitude = position.coords.longitude;
      //      console.log('Latitude: ' + position.data.location.lat + '\n' +
      //        'Longitude: ' + position.data.location.lng
      //      );
      $ionicLoading.hide();
    };

    function onError(error) {
      alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
      $ionicLoading.hide();
    }

    //adding marker to the current location
    function addYourLocationButton(map, marker) {
      var controlDiv = document.createElement('div');

      var firstChild = document.createElement('button');
      firstChild.style.backgroundColor = '#fff';
      firstChild.style.border = 'none';
      firstChild.style.outline = 'none';
      firstChild.style.width = '28px';
      firstChild.style.height = '28px';
      firstChild.style.borderRadius = '2px';
      firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
      firstChild.style.cursor = 'pointer';
      firstChild.style.marginRight = '10px';
      firstChild.style.padding = '0';
      firstChild.title = 'Your Location';
      controlDiv.appendChild(firstChild);

      var secondChild = document.createElement('div');
      secondChild.style.margin = '5px';
      secondChild.style.width = '18px';
      secondChild.style.height = '18px';
      secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
      secondChild.style.backgroundSize = '180px 18px';
      secondChild.style.backgroundPosition = '0 0';
      secondChild.style.backgroundRepeat = 'no-repeat';
      firstChild.appendChild(secondChild);

      google.maps.event.addListener(map, 'center_changed', function() {
        secondChild.style['background-position'] = '0 0';
      });

      firstChild.addEventListener('click', function() {
        var imgX = '0',
          animationInterval = setInterval(function() {
            imgX = imgX === '-18' ? '0' : '-18';
            secondChild.style['background-position'] = imgX + 'px 0';
          }, 500);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position);
            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(latlng);
            clearInterval(animationInterval);
            secondChild.style['background-position'] = '-144px 0';
          });
        } else {
          clearInterval(animationInterval);
          secondChild.style['background-position'] = '0 0';
        }
      });

      controlDiv.index = 1;
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    }
    var timerInterval = "";

    //timer start event
    $scope.startTimer = function() {
      if ($scope.fitnessMeasurement.timerMessage.toString().toLowerCase() == "start") {
        $scope.fitnessMeasurement.timerStyle = {
          "width": "150px",
          "height": "150px",
          "border-radius": "100%",
          "background-color": "#cc5458",
          "text-align": "center",
          "line-height": "100px",
          "font-size": "16px",
          "margin": "0 auto",
          "color": "#FFF",
          "box-shadow": "0 3px 3px rgba(0,0,0,.5)"
        }

        $interval.cancel(timerInterval);
        //                    $scope.fitnessMeasurement.seconds = "00";
        //                    $scope.fitnessMeasurement.minutes = "00";
        //                    $scope.fitnessMeasurement.hours = "00";
        $scope.fitnessMeasurement.timerMessage = "Stop";
        timerInterval = $interval(function() {
          $scope.fitnessMeasurement.seconds = parseInt($scope.fitnessMeasurement.seconds) + 1;
          $scope.fitnessMeasurement.globalSeconds = parseInt($scope.fitnessMeasurement.globalSeconds) + 1;
          if ($scope.fitnessMeasurement.seconds.toString().length == 1) {
            $scope.fitnessMeasurement.seconds = "0" + $scope.fitnessMeasurement.seconds;
          }
          if ($scope.fitnessMeasurement.minutes.toString().length == 1) {
            $scope.fitnessMeasurement.minutes = "0" + $scope.fitnessMeasurement.minutes;
          }
          if ($scope.fitnessMeasurement.hours.toString().length == 1) {
            $scope.fitnessMeasurement.hours = "0" + $scope.fitnessMeasurement.hours;
          }
          if (parseInt($scope.fitnessMeasurement.seconds) == 59) {
            $scope.fitnessMeasurement.minutes = parseInt($scope.fitnessMeasurement.minutes) + 1;
            $scope.fitnessMeasurement.seconds = 0;
          }
          if (parseInt($scope.fitnessMeasurement.minutes) == 59) {
            $scope.fitnessMeasurement.minutes = 0;
            $scope.fitnessMeasurement.hours = parseInt($scope.fitnessMeasurement.hours) + 1;
          }

        }, 1000);


      } else if ($scope.fitnessMeasurement.timerMessage.toString().toLowerCase() == "stop") {
        $scope.fitnessMeasurement.timerStyle = {
          "width": "150px",
          "height": "150px",
          "border-radius": "100%",
          "background-color": "#54cc5f",
          "text-align": "center",
          "line-height": "100px",
          "font-size": "16px",
          "margin": "0 auto",
          "color": "#FFF",
          "box-shadow": "0 3px 3px rgba(0,0,0,.5)"
        }
        $interval.cancel(timerInterval);
        $scope.fitnessMeasurement.timerMessage = "Start";
        localStorage.setItem("fitnessTime", $scope.fitnessMeasurement.hours.toString() + ":" + $scope.fitnessMeasurement.minutes.toString() + ":" + $scope.fitnessMeasurement.seconds.toString())
        localStorage.setItem("totalSeconds", $scope.fitnessMeasurement.globalSeconds.toString());
        //                    $scope.fitnessMeasurement.seconds = "00";
        //                    $scope.fitnessMeasurement.minutes = "00";
        //                    $scope.fitnessMeasurement.hours = "00";
        //                    $scope.fitnessMeasurement.globalSeconds = 0;
        var currentLatitude, currentLongitude = 0;
        var distanceOptions = {
          enableHighAccuracy: true,
          maximumAge: 3600000
        }

        var distanceTravelLocationWatch = navigator.geolocation.getCurrentPosition(onDistanceSuccess, onDistanceError, options);

        //$http(req).then(onDistanceSuccess, onDistanceError);

        //distance success method
        function onDistanceSuccess(position) {
          console.log(position);
          currentLatitude = position.coords.latitude;
          currentLongitude = position.coords.longitude;

          $scope.fitnessMeasurement.calories = generateResults();
          $scope.fitnessMeasurement.distanceTravelled = getDistanceTravelled($scope.fitnessMeasurement.currentLocationLatitude, $scope.fitnessMeasurement.currentLocationLongitude, currentLatitude, currentLongitude, "M");

          console.log($scope.fitnessMeasurement.calories);
          console.log($scope.fitnessMeasurement.distanceTravelled);

          localStorage.setItem("caloriesBurned", $scope.fitnessMeasurement.calories);
          localStorage.setItem("distanceTravelled", $scope.fitnessMeasurement.distanceTravelled);

          var data = {
            userID: localStorage.getItem("userId"),
            dateStr:  moment(new Date()).format("MM/DD/YYYY"),
            exercise:$scope.fitnessMeasurement.exercise.toString(),
            amount:$scope.fitnessMeasurement.intensity.toString(),
            units:'',
            calories:$scope.fitnessMeasurement.calories,
            seconds:$scope.fitnessMeasurement.seconds,
            percentageOfGoal:$scope.fitnessMeasurement.distanceTravelled.toString(),
            goal:$scope.fitnessMeasurement.goal.toString(),
            timegoal:$scope.fitnessMeasurement.globalSeconds.toString(),
            

          }
          var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://www.health360x.com/dataaccess.asmx/saveExercise",
            "method": "POST",
            "headers": {
              "content-type": "application/x-www-form-urlencoded",
            },
            "data": data
          }
          
          $.ajax(settings).done(function (response) {
            var x2js = new X2JS();
            var res = x2js.xml_str2json(response);
            console.log(res);
            $ionicLoading.hide();
            $state.go("healthCare360X.fitness");
          });
          
          // $scope.$apply();
        }

        function onDistanceError(error) {
          console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
          $ionicLoading.hide();
        }


      }
    }

    //getting distance travelled
    function getDistanceTravelled(lat1, lon1, lat2, lon2, unit) {
      //default distance is in miles
      console.log(lat1 + ":" + lon1 + ":" + lat2 + ":" + lon2 + ":" + unit);
      var radlat1 = Math.PI * lat1 / 180
      var radlat2 = Math.PI * lat2 / 180
      var theta = lon1 - lon2
      var radtheta = Math.PI * theta / 180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180 / Math.PI
      dist = dist * 60 * 1.1515
      if (unit == "K") { // K is for kilometers
        dist = dist * 1.609344
      }
      if (unit == "N") { // N is for nautical miles
        dist = dist * 0.8684
      }
      return dist
    }

    //calculation result
    function generateResults() {
      var intensityValue, calories, minutes = 0;
      if ($scope.fitnessMeasurement.intensity < 3) {
        intensityValue = 75;
      }
      if ($scope.fitnessMeasurement.intensity < 5) {
        intensityValue = 90;
      }
      if ($scope.fitnessMeasurement.intensity < 7) {
        intensityValue = 110;
      }
      if ($scope.fitnessMeasurement.intensity < 9) {
        intensityValue = 130;
      }
      if ($scope.fitnessMeasurement.intensity < 11) {
        intensityValue = 150;
      }
      minutes = parseInt($scope.fitnessMeasurement.globalSeconds) / 60;

      if ($scope.fitnessMeasurement.gender.toString().toLowerCase() == "male")
        calories = ((-55.0969 + (0.6309 * intensityValue) + (0.1988 * $scope.fitnessMeasurement.weight) + (0.2017 * $scope.fitnessMeasurement.age)) / 4.184) * minutes;
      else
        calories = ((-20.4022 + (0.4472 * intensityValue) + (0.1263 * $scope.fitnessMeasurement.weight) + (0.074 * $scope.fitnessMeasurement.age)) / 4.184) * minutes;

      return parseInt($window.Math.round(calories, 0));

    }

  }
])

//Controller communicating between nutrition view and model
.controller('nutritionCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',

  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout method
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }

    //default scope
    $scope.NUTobj = [];
    //database initilization
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
    //select query for nutrition default value
    var query = "SELECT Calory, EON FROM Nutrition WHERE IsDefault = 1";
    //execute select query
    $cordovaSQLite.execute(db, query).then(function(res) {

      if (res.rows.length > 0) {
        var $calory = res.rows.item(0).Calory;

        var eon = res.rows.item(0).EON;
        $scope.NUTobj.NTEOND = eon.toString().split("|")[0];
        $scope.NUTobj.NTEONT = eon.toString().split("|")[1];
        $scope.nutritionDate = eon;
        //assinging value to scope
        $scope.NUTobj.NUTiLevel = $calory;
        //angle of rotation for meter
        $scope.angle = getRotationAngleForNUT($calory);
        //color value on calory value
        if ($calory > 0 && $calory <= 700)
          $scope.BGVColor = "BGV_Green";
        else if ($calory > 700 && $calory <= 900)
          $scope.BGVColor = "BGV_Yellow";
        else if ($calory > 900)
          $scope.BGVColor = "BGV_Red";

      } else {
        $scope.NUTobj.NUTiLevel = "0.0";
        $scope.angle = -86;
        $scope.BGVColor = "BGV_Red";
      }

    }, function(err) {
      alert(err);
    });

    //calculate of query function
    $scope.calculateCalory = function($ncalory, $mdesc, $mtype) {
      //validating calory
      if ($ncalory == null || $ncalory.toString().length == 0 || $ncalory <= 0) {
        showToast("Please enter a valid calorie.", 'warning');
        return false;
      };
      //validation meal description
      if ($mdesc == null || $mdesc.toString().length == 0) {
        showToast("Please enter meal description.", 'warning');
        return false;
      };
      //validation meal type
      if ($mtype == null || $mtype.toString().length == 0) {
        showToast("Please select meal type.", 'warning');
        return false;
      };

      //assigning values to scope
      $scope.NUTobj.NUTiLevel = $ncalory;
      //defining angle of rotation
      $scope.angle = getRotationAngleForNUT($ncalory);
      //formatting date
      var eon = formatDateToDisplay(new Date());
      $scope.nutritionDate = moment(new Date()).format("MMM DD YYYY | hh:mm a");
      $scope.NUTobj.NTEOND = eon.toString().split("|")[0];
      $scope.NUTobj.NTEONT = eon.toString().split("|")[1];

      if ($ncalory > 0 && $ncalory <= 700)
        $scope.BGVColor = "BGV_Green";
      else if ($ncalory > 700 && $ncalory <= 900)
        $scope.BGVColor = "BGV_Yellow";
      else if ($ncalory > 900)
        $scope.BGVColor = "BGV_Red";
      //insert query for added values
      var query = "INSERT INTO Nutrition(Calory, MDescription, MType, EON, IsDefault) VALUES (?,?,?,?,?)";
      //insert query execution
      $cordovaSQLite.execute(db, query, [$ncalory, $mdesc, $mtype, moment(new Date()).format("MMM DD YYYY | hh : mm a"), 1]).then(function(res) {
        //update query for recently added values
        query = "UPDATE Nutrition SET IsDefault = 0 WHERE NutritionId <> ? ";
        //execution for update query
        $cordovaSQLite.execute(db, query, [res.insertId]).then(function(kres) {
          $ionicLoading.show();
          var data = {
            userID: localStorage.getItem("userId"),
            logDate: moment(new Date()).format("MM/DD/YYYY"),
            meal:$mtype.toString(),
            desc:$mdesc.toString(),
            calories:$ncalory.toString()
          }
          var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://www.health360x.com/dataaccess.asmx/saveCalorieLog",
            "method": "POST",
            "headers": {
              "content-type": "application/x-www-form-urlencoded",
            },
            "data": data
          }
          
          $.ajax(settings).done(function (response) {
            var x2js = new X2JS();
            var res = x2js.xml_str2json(response);
            console.log(res);
            $ionicLoading.hide();
          });
        }, function(kerr) {
          alert(kerr);
        });

      }, function(err) {
        alert(err);
      });

      

    };
    /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }


  }
])

//Controller communicating between nutrition graph view and model
.controller('nutritionGraphCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout function
    $scope.logout = function() {
        localStorage.clear();
        localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
        $state.go("login");
      }
      //default scope
    $scope.BGItems = [];

    var dSet = [];
    var lbls = [];
    //db initilization
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
    //select query for default values
    var query = "SELECT Calory, EON FROM Nutrition ORDER BY NutritionId DESC";
    //execution of select query
    $cordovaSQLite.execute(db, query).then(function(resk) {

      if (resk.rows.length > 0) {

        var kl = resk.rows.length;

        for (i = 0; i < kl; i++) {

          var BGItem = {};

          var eon = resk.rows.item(i).EON;

          BGItem = {
            "X": eon.split("|")[0],
            "Y": parseFloat(resk.rows.item(i).Calory)
          }

          $scope.BGItems.push(BGItem);

          dSet.push(resk.rows.item(i).Calory);
          lbls.push(eon.split("|")[0]);
        }
        //setting graph values
        var graphdata1 = {
          ChartType: "Area",
          linecolor: "#11c1f3",
          title: "Nutrition",
          values: $scope.BGItems
        };
        //passing values of graph to view
        $("#Bargraph").SimpleChart({
          ChartType: "Line",
          toolwidth: "50",
          toolheight: "25",
          axiscolor: "#E6E6E6",
          textcolor: "#6E6E6E",
          showlegends: false,
          data: [graphdata1],
          legendsize: "140",
          legendposition: 'bottom',
          xaxislabel: 'Date',
          title: 'Nutrition Graph',
          yaxislabel: 'Nutrition'
        });

      }

    }, function(err) {
      alert(err);
    });

  }
])

//Controller communicating between nutrition history view and model
.controller('nutritionHistoryCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout function
    $scope.logout = function() {
        localStorage.clear();
        localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
        $state.go("login");
      }
      //default scope
    $scope.BGItems = [];
    //db initilization
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
    //select query for nutrition default value
    var query = "SELECT Calory,MType, EON FROM Nutrition ORDER BY NutritionId DESC";
    //execution for query
    $cordovaSQLite.execute(db, query).then(function(resk) {
      //result length
      if (resk.rows.length > 0) {

        var kl = resk.rows.length;

        for (i = 0; i < kl; i++) {

          var BGItem = {};

          console.log(resk.rows.item(i).Calory);
          //formatting date
          var eon = resk.rows.item(i).EON;

          //assinging values to JSON array
          BGItem = {
            "BGValue": resk.rows.item(i).Calory,
            "MealType": resk.rows.item(i).MType,
            "EON": eon
          }

          //adding values to model
          $scope.BGItems.push(BGItem);
        }
      }

    }, function(err) {
      console.log(err);
      alert(err);
    });

  }
])

//Controller communicating between events view and model
.controller('eventsCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q', '$cordovaSQLite',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q, $cordovaSQLite) {

    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
    //$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
    //$scope.minDate = moment(new Date()).format("YYYY-MM-DD");
    //    $scope.maxDate = '2017-10-06';
    $scope.medicationDate = [];
    $scope.doctorAppointmentDate = [];
    //$scope.doctorAppointmentDate = '2017-10-27';
    $scope.otherDate = [];
    //$scope.disableDate = ['2017-09-30', '2017-10-15']
    $scope.disabledDatesFn = function(formattedDate) {
      console.log(formattedDate);
      return ['2017-10-10', '2017-10-15', '2017-10-19'].indexOf(formattedDate) > -1;
    }

    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");


    }
    $scope.addNewEvent = function() {
      $state.go("healthCare360X.addEvent");
    }
    $scope.showEventList = function() {
      $state.go("healthCare360X.eventList");
    }
    $scope.initFunction = function() {
      $ionicLoading.show();
      getMedicationEvents().then(function(res) {
        console.log(res);
        if (res != undefined && res != null && res.length != 0) {
          $scope.medicationDate = res;
          getDocAppointmentDate().then(function(res) {
            if (res !== undefined && res !== null && res.length !== 0) {
              console.log(res);
              $scope.doctorAppointmentDate = res;
              getOtherDates().then(function(res) {
                console.log(res);
                if (res !== undefined && res !== null && res.length !== 0) {
                  $scope.otherDate = res;
                  $ionicLoading.hide();
                }
              }, function(err) {
                console.log(err);
                $ionicLoading.hide();
              })
            }
          }, function(err) {
            console.log(err);
            $ionicLoading.hide();
          })
        }
        $ionicLoading.hide();
      }, function(err) {
        console.log(err);
        $ionicLoading.hide();
      })
    }

    function getMedicationEvents() {
      var defer = $q.defer();
      var finalArray = [];
      try {
        var db;
        db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
        var query = "SELECT FromDate, ToDate from Events where Type='Medication'";
        console.log(query);
        //execution of select query
        $cordovaSQLite.execute(db, query).then(function(res) {
          console.log(res)
          var medicationDatesArray = [];
          if (res !== undefined && res !== null && res.rows.length !== 0) {
            for (var i = 0; i < res.rows.length; i++) {
              var tempDate = [];
              tempDate = getDates(res.rows.item(i).FromDate, res.rows.item(i).ToDate);
              medicationDatesArray.push(tempDate);
            }
            for (var j = 0; j < medicationDatesArray.length; j++) {
              for (var k = 0; k < medicationDatesArray[j].length; k++) {
                finalArray.push(medicationDatesArray[j][k]);
              }
            }
          }
          defer.resolve(finalArray);
        });

      } catch (ex) {
        console.log(ex);
        defer.reject("error");
      }
      return defer.promise;
    }
    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf())
      date.setDate(date.getDate() + days);
      return date;
    }

    function getDates(startDate, stopDate) {
      var startDate = new Date(startDate);
      var stopDate = new Date(stopDate);
      var betweenDates = []
      while (startDate <= stopDate) {

        console.log(startDate);
        betweenDates.push(moment(new Date(startDate)).format("YYYY-MM-DD"));
        startDate.setDate(startDate.getDate() + 1);
      }
      return betweenDates;
    }

    function getDocAppointmentDate() {
      var defer = $q.defer();
      try {
        var db;
        db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
        var query = "SELECT FromDate from Events where Type='Doctor Appointment'";
        console.log(query);
        //execution of select query
        $cordovaSQLite.execute(db, query).then(function(res) {
          console.log(res)
          var docAppointmentDate = [];
          if (res !== undefined && res !== null && res.rows.length !== 0) {
            for (var i = 0; i < res.rows.length; i++) {
              docAppointmentDate.push(moment(new Date(res.rows.item(i).FromDate)).format("YYYY-MM-DD"));
            }
          }
          defer.resolve(docAppointmentDate);

        });
      } catch (ex) {
        console.log(ex);
        defer.reject("error");
      }
      return defer.promise;
    }

    function getOtherDates() {
      var defer = $q.defer();
      try {
        var db;
        db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
        var query = "SELECT FromDate from Events where Type='Other'";
        console.log(query);
        //execution of select query
        $cordovaSQLite.execute(db, query).then(function(res) {
          console.log(res)
          var docAppointmentDate = [];
          if (res !== undefined && res !== null && res.rows.length !== 0) {
            for (var i = 0; i < res.rows.length; i++) {
              docAppointmentDate.push(moment(new Date(res.rows.item(i).FromDate)).format("YYYY-MM-DD"));
            }
          }
          defer.resolve(docAppointmentDate);

        });
      } catch (ex) {
        console.log(ex);
        defer.reject("error");
      }
      return defer.promise;
    }

  }
])

//Controller communicating between events view and model
.controller('messageDetailCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q', '$ionicPopup', '$timeout',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q, $ionicPopup, $timeout) {
    console.log($stateParams.chatDetail);
    $scope.messageDetail = {};
    $scope.messageDetail.to = $stateParams.chatDetail.UserName;
    $scope.messageDetail.subject = $stateParams.chatDetail.SubjectTxt;
    $scope.messageDetail.message = $stateParams.chatDetail.MessageTxt;
    /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }
    $scope.forwardMessage = function() {
      console.log("asdf");

      $timeout(function() {
        var myPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="messageDetail.email" style="padding:10px;">',
          title: 'Forward To',
          subTitle: 'Email Id',
          scope: $scope,

          buttons: [{
            text: 'Cancel'
          }, {
            text: '<b>Submit</b>',
            type: 'button-positive',
            onTap: function(e) {
              if ($scope.messageDetail.email != null && $scope.messageDetail.email != "") {
                $ionicLoading.show();
                var httpDef = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/getID_ForComposeEmail?email=" + $scope.messageDetail.email, "", "").then(function(res) {
                  console.log(res);
                  var x2js = new X2JS();
                  var userId = x2js.xml_str2json(res.data);
                  console.log(userId);
                  if (userId != null) {
                    var httpReqDef = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/saveHV_ComposeMessage?FromID=" + localStorage.getItem("userId") + "&ToID=" + userId.string.__text + "&Subject=" + $scope.messageDetail.subject + "&Message=" + $scope.messageDetail.message, "", "").then(function(res) {
                      console.log(res);
                      if (res != null) {
                        //                        $scope.messageDetail.email = "";
                        //                        $scope.messageDetail.subject = "";
                        //                        $scope.messageDetail.message = "";
                        showToast("Message sent successfully", "success");
                      }
                      $ionicLoading.hide();
                    }, function(err) {
                      console.log(err);
                      $ionicLoading.hide();
                    })
                  } else {
                    $ionicLoading.hide();
                  }
                }, function(err) {
                  console.log(err);
                  $ionicLoading.hide();
                })
              }

            }
          }]
        });

        myPopup.then(function(res) {
          console.log('Tapped!', res);
        });
      }, 100);
    }


  }
])

//Controller communicating between compose message view and model
.controller('composeMessageCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q, dateFilter) {

    $scope.composeMessage = {};
    $scope.composeMessage.to = "";
    $scope.composeMessage.subject = "";
    $scope.composeMessage.message = "";
    /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }
    $scope.submitMessage = function() {
      if ($scope.composeMessage.to == null || $scope.composeMessage.to == "") {
        showToast("Please enter email id", "error");
        return;
      }
      if ($scope.composeMessage.subject == null || $scope.composeMessage.subject == "") {
        showToast("Please enter subject", "error");
        return;
      }
      if ($scope.composeMessage.message == null || $scope.composeMessage.message == "") {
        showToast("Please enter message", "error");
        return;
      }
      $ionicLoading.show();
      var httpDef = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/getID_ForComposeEmail?email=" + $scope.composeMessage.to, "", "").then(function(res) {
        var x2js = new X2JS();
        var userId = x2js.xml_str2json(res.data);
        console.log(userId);
        if (userId != null) {
          var httpReqDef = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/saveHV_ComposeMessage?FromID=" + localStorage.getItem("userId") + "&ToID=" + userId.string.__text + "&Subject=" + $scope.composeMessage.subject + "&Message=" + $scope.composeMessage.message, "", "").then(function(res) {
            console.log(res);
            if (res != null) {
              $scope.composeMessage.to = "";
              $scope.composeMessage.subject = "";
              $scope.composeMessage.message = "";
              showToast("Message sent successfully", "success");
            }
            $ionicLoading.hide();
          }, function(err) {
            console.log(err);
            $ionicLoading.hide();
          })
        } else {
          $ionicLoading.hide();
        }
      }, function(err) {
        console.log(err);
        $ionicLoading.hide();
      })

    }




  }
])

//Controller communicating between messages view and model
.controller('messagesCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q, dateFilter) {

    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");


    }
    $scope.messages = {}
    $scope.messages.inbox = [];
    $scope.messages.sent = [];
    $scope.messages.inboxColor = "#00aad5";
    $scope.messages.sentColor = "#ccc";
    $scope.messages.selectedTab = 1;
    $scope.composeMessage = function() {
      $state.go("healthCare360X.compose");
    }
    $scope.messageDetail = function(item) {
        $state.go("healthCare360X.messageDetail", {
          chatDetail: item
        });
      }
      /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }
    $scope.initFunction = function() {
      $ionicLoading.show();
      var httpRequestDef = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/getHV_InboxMessage?userID=" + localStorage.getItem("userId"), "", "").then(function(res) {
        console.log(res);
        var x2js = new X2JS();
        var inboxResult = x2js.xml_str2json(res.data);
        console.log(inboxResult);
        if (inboxResult != null && inboxResult.ArrayOfMessageInboxService.MessageInboxService.length != 0) {
          for (var i = 0; i < inboxResult.ArrayOfMessageInboxService.MessageInboxService.length; i++) {
            $scope.messages.inbox.push({
              ChatLogID: inboxResult.ArrayOfMessageInboxService.MessageInboxService[i].ChatLogID,
              Date: moment(inboxResult.ArrayOfMessageInboxService.MessageInboxService[i].Date).format("MMM DD YYYY | hh:mm a"),
              FromID: inboxResult.ArrayOfMessageInboxService.MessageInboxService[i].FromID,
              MessageTxt: inboxResult.ArrayOfMessageInboxService.MessageInboxService[i].MessageTxt,
              SubjectTxt: inboxResult.ArrayOfMessageInboxService.MessageInboxService[i].SubjectTxt,
              Unread_notify: inboxResult.ArrayOfMessageInboxService.MessageInboxService[i].Unread_notify,
              UserName: inboxResult.ArrayOfMessageInboxService.MessageInboxService[i].UserName,
            })
          }
          //$scope.messages.inbox = inboxResult.ArrayOfMessageInboxService.MessageInboxService
        } else {
          $ionicLoading.hide();
        }


        var httpRequestDefSent = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/getHV_SentMessage?userID=" + localStorage.getItem("userId"), "", "").then(function(res) {
          var x2js = new X2JS();
          var sentResult = x2js.xml_str2json(res.data);
          console.log(sentResult);
          if (sentResult != null && sentResult.ArrayOfMessageSentService.MessageSentService.length != 0) {
            //$scope.messages.sent = sentResult.ArrayOfMessageSentService.MessageSentService

            for (var i = 0; i < sentResult.ArrayOfMessageSentService.MessageSentService.length; i++) {
              $scope.messages.sent.push({
                ChatLogID: sentResult.ArrayOfMessageSentService.MessageSentService[i].ChatLogID,
                Date: moment(sentResult.ArrayOfMessageSentService.MessageSentService[i].Date).format("MMM DD YYYY | hh:mm a"),
                ToID: sentResult.ArrayOfMessageSentService.MessageSentService[i].ToID,
                MessageTxt: sentResult.ArrayOfMessageSentService.MessageSentService[i].MessageTxt,
                SubjectTxt: sentResult.ArrayOfMessageSentService.MessageSentService[i].SubjectTxt,
                Unread_notify: sentResult.ArrayOfMessageSentService.MessageSentService[i].Unread_notify,
                UserName: sentResult.ArrayOfMessageSentService.MessageSentService[i].UserName,
              })
            }
            console.log($scope.messages.sent);
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }

          $ionicLoading.hide();

        }, function(err) {
          console.log(err)
          $ionicLoading.hide();
        })

      }, function(err) {
        console.log(err)
        $ionicLoading.hide();
      })
    }
    $scope.tabClick = function(id) {
      console.log(id);
      if (id == 1) {
        $scope.messages.inboxColor = "#00aad5";
        $scope.messages.sentColor = "#ccc";
        $scope.messages.selectedTab = 1;
      } else if (id == 2) {
        $scope.messages.inboxColor = "#ccc";
        $scope.messages.sentColor = "#00aad5";
        $scope.messages.selectedTab = 2;
      }
    }


  }
])

//Controller communicating between events view and model
.controller('eventListCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q', '$cordovaSQLite',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q, $cordovaSQLite) {
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
    $scope.eventList = {}
    $scope.eventList.events = []
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");


    }
    $scope.initFunction = function() {
      $ionicLoading.show();
      var query = "Select Type,FromDate,Time from Events";
      console.log(query);
      $cordovaSQLite.execute(db, query).then(function(res) {
        console.log(res);
        if (res != null && res.rows.length != 0) {
          for (var i = 0; i < res.rows.length; i++) {
            $scope.eventList.events.push({
              name: res.rows.item(i).Type,
              date: moment(res.rows.item(i).FromDate).format("MMM DD YYYY").toString() + " | " +
                res.rows.item(i).Time
            })
          }
          $ionicLoading.hide();
          console.log($scope.eventList.events);
        }
        $ionicLoading.hide();
      }, function(error) {
        console.log(error);
        $ionicLoading.hide();
      })
    }

  }
])

//Controller communicating between add new event view and model
.controller('addEventCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q', '$cordovaDatePicker', '$ionicPopup', '$cordovaSQLite',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q, $cordovaDatePicker, $ionicPopup, $cordovaSQLite) {
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }
    $scope.addEvent = {};
    $scope.addEvent.eventType = "Medication";
    $scope.addEvent.name = "";
    $scope.addEvent.from = {};
    $scope.addEvent.from.month = "1";
    $scope.addEvent.from.day = "1";
    $scope.addEvent.from.year = "2017";
    $scope.addEvent.to = {}
    $scope.addEvent.to.month = "1";
    $scope.addEvent.to.day = "1";
    $scope.addEvent.to.year = "2017";
    $scope.addEvent.time = {};
    $scope.addEvent.time.hour = "01";
    $scope.addEvent.time.minutes = "00";
    $scope.addEvent.time.timetype = "AM";
    $scope.addEvent.notes = "";
    $scope.addEvent.daysChecked = {};
    $scope.addEvent.selectedDays = [];
    $scope.addEvent.selectedDaysText = "";
    $scope.addEvent.doctorsList = [];
    $scope.addEvent.selectedDoctor = "";
    $scope.addEvent.appointmentTitle = "";
    $scope.addEvent.days = [{
      name: "Monday",
      id: "1"
    }, {
      name: "Tuesday",
      id: "2"
    }, {
      name: "Wednesday",
      id: "3"
    }, {
      name: "Thursday",
      id: "4"
    }, {
      name: "Friday",
      id: "5"
    }, {
      name: "Saturday",
      id: "6"
    }, {
      name: "Sunday",
      id: "7"
    }]
    $scope.initFunction = function() {
      $ionicLoading.show();
      httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/GetDocCoachOfPatient?patientid=" + localStorage.getItem("userId") + "&isdocList=true", "", "").then(function(res) {
        console.log(res);
        var x2js = new X2JS();
        var docList = x2js.xml_str2json(res.data);
        console.log(docList);
        var docArray = [];
        if (docList.ArrayOfUser.User.length == undefined) {
          docArray.push(docList.ArrayOfUser.User)
        } else {
          docArray = docList.ArrayOfUser.User;
        }
        $scope.addEvent.doctorsList = docArray;
        $scope.addEvent.selectedDoctor = "100000";
        $ionicLoading.hide();
      }, function(error) {
        console.log(error);
        $ionicLoading.hide();
      })
    }
    angular.forEach($scope.addEvent.days, function(val, index) {
      $scope.addEvent.daysChecked[val.id] = "true";
      $scope.addEvent.days[index].checked = true;
    })

    $scope.daysChange = function(key, status, val) {
      console.log(status)
        //if checkbox is checked
      if (status == true) {
        //add values to scope
        $scope.addEvent.selectedDays.push(val.id);


      } else if (status == false) { // if checkbox is not checked
        //remove item from scope
        var index = $scope.addEvent.selectedDays.indexOf(val.id);
        console.log(index)
        if (index != null && index != "") {
          $scope.addEvent.selectedDays.splice(index, 1);

        } else if ($scope.addEvent.selectedDays.length <= 1) {
          $scope.addEvent.selectedDays = [];
        }

      }
      console.log($scope.addEvent.selectedDays);
    }
    $scope.showDaysPopup = function() {
      var myPopup = $ionicPopup.show({
        template: '<div ng-repeat="(key,val) in addEvent.days">' +
          '<ion-checkbox ng-model="addEvent.daysChecked[val.id]" ng-click="daysChange(key,addEvent.daysChecked[val.id],val)"' +
          'ng-true-value = "true" ' +
          'ng-false-value = "false" >{{val.name}} </ion-checkbox>' +
          '</div>',
        title: 'Select Days',
        subTitle: 'Days',
        scope: $scope,

        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            $scope.addEvent.selectedDaysText = "";
            for (var i = 0; i < $scope.addEvent.selectedDays.length; i++) {
              for (var j = 0; j < $scope.addEvent.days.length; j++) {
                if ($scope.addEvent.selectedDays[i] == $scope.addEvent.days[j].id) {
                  $scope.addEvent.selectedDaysText = $scope.addEvent.selectedDaysText + $scope.addEvent.days[j].name + ","

                }
              }

            }
            $scope.addEvent.selectedDaysText = $scope.addEvent.selectedDaysText.substr(0, $scope.addEvent.selectedDaysText.length - 1);
            console.log($scope.addEvent.selectedDaysText)

          }
        }]
      });

      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
    }
    $scope.submitEvent = function() {

        if ($scope.addEvent.eventType == null || $scope.addEvent.eventType == "") {
          showToast("Please select type", 'error');
          return;
        }
        if ($scope.addEvent.eventType == "Medication" && ($scope.addEvent.name == null || $scope.addEvent.name == "")) {
          showToast("Please enter name", 'error');
          return;
        }
        if ($scope.addEvent.eventType == "Doctor Appointment" && ($scope.addEvent.selectedDoctor == null || $scope.addEvent.selectedDoctor == "")) {
          showToast("Please select doctor", 'error');
          return;
        }
        if ($scope.addEvent.eventType == "Other" && ($scope.addEvent.appointmentTitle == null || $scope.addEvent.appointmentTitle == "")) {
          showToast("Please enter appointment title", 'error');
          return;
        }
        if ($scope.addEvent.from.month == null || $scope.addEvent.from.month == "") {
          showToast("Please select from date", 'error');
          return;
        }
        if ($scope.addEvent.from.day == null || $scope.addEvent.from.day == "") {
          showToast("Please select from date", 'error');
          return;
        }
        if ($scope.addEvent.from.year == null || $scope.addEvent.from.year == "") {
          showToast("Please select from date", 'error');
          return;
        }
        if ($scope.addEvent.eventType == "Medication" && ($scope.addEvent.to.month == null || $scope.addEvent.to.month == "")) {
          showToast("Please select to date", 'error');
          return;
        }
        if ($scope.addEvent.eventType == "Medication" && ($scope.addEvent.to.day == null || $scope.addEvent.to.day == "")) {
          showToast("Please select to date", 'error');
          return;
        }
        if ($scope.addEvent.eventType == "Medication" && ($scope.addEvent.to.year == null || $scope.addEvent.to.year == "")) {
          showToast("Please select to date", 'error');
          return;
        }
        if ($scope.addEvent.time.hour == null || $scope.addEvent.time.hour == "") {
          showToast("Please select time", 'error');
          return;
        }
        if ($scope.addEvent.time.hour == null || $scope.addEvent.time.hour == "") {
          showToast("Please select time", 'error');
          return;
        }
        if ($scope.addEvent.time.timetype == null || $scope.addEvent.time.timetype == "") {
          showToast("Please select time", 'error');
          return;
        }
        if ($scope.addEvent.eventType == "1") {
          if ($scope.addEvent.selectedDaysText == null || $scope.addEvent.selectedDaysText == "") {
            showToast("Please select days", 'error');
            return;
          }
        }
        if ($scope.addEvent.notes == null || $scope.addEvent.notes == "") {
          showToast("Please enter notes", 'error');
          return;
        }
        $ionicLoading.show();
        var fromDate = $scope.addEvent.from.month + "/" + $scope.addEvent.from.day + "/" + $scope.addEvent.from.year;
        var toDate = $scope.addEvent.to.month + "/" + $scope.addEvent.to.day + "/" + $scope.addEvent.to.year;
        var time = $scope.addEvent.time.hour + ":" + $scope.addEvent.time.minutes + " " + $scope.addEvent.time.timetype;
        var query = "INSERT INTO Events(Type, Name, FromDate, ToDate, Time, Days, Notes, Title, Doctor) VALUES (?,?,?,?,?,?,?,?,?)";
        //execution of insert query
        $cordovaSQLite.execute(db, query, [$scope.addEvent.eventType, $scope.addEvent.name, fromDate, toDate, time, $scope.addEvent.selectedDaysText, $scope.addEvent.notes, $scope.addEvent.appointmentTitle, $scope.addEvent.selectedDoctor]).then(function(res) {
          console.log(res);
          $ionicLoading.hide();
          showToast("Event added successfully", "success");
          $scope.addEvent.name = "";
          $scope.addEvent.from.year = "";
          $scope.addEvent.to.year = "";
          $scope.addEvent.notes = "";
          $scope.addEvent.selectedDaysText = "";
          $scope.addEvent.selectedDays = []
          $scope.addEvent.selectedDoctor = "100000";
          $scope.addEvent.appointmentTitle = "";
          $state.go("healthCare360X.events");
          //          var url = "http://www.health360x.com/dataaccess.asmx/saveScheduler?type='" + $scope.addEvent.eventType + "'&date=" + moment(new Date()).format("MM/DD/YYYY") + "&dateFrom=" + moment(fromDate).format("MM/DD/YYYY") + "&dateTo=" + moment(toDate).format("MM/DD/YYYY") + "&mediname='" + $scope.addEvent.name + "'&time='" + time + "'&day='" + $scope.addEvent.selectedDaysText + "'&id=" + $scope.addEvent.selectedDoctor + "&notes='" + $scope.addEvent.notes + "'&patientid=" + localStorage.getItem("userId");
          //          console.log(url);
          //          httpRequest("GET", url, "", "").then(function(res) {
          //            var x2js = new X2JS();
          //            var sentResult = x2js.xml_str2json(res.data);
          //
          //
          //          })
        }, function(error) {
          console.log(error);
          showToast("Error while adding event", "error");
          $ionicLoading.hide();
        });

      }
      /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

  }
])


//Controller communicating between device view and model
.controller('devicesCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q) {

    //default scope
    $scope.deviceList = {};
    $scope.deviceList.currentDevices = [];
    //logout function
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }

    /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }
    // on load function
    $scope.initFunction = function() {
      $scope.deviceList.currentDevices = [];
      $ionicLoading.show();
      //XML to JSON parser initilization
      var x2js = new X2JS();
      var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/GetUserDeviceList?userid=" + localStorage.getItem("userId"), "", "").then(function(res) {

        var userDeviceList = x2js.xml_str2json(res.data);
        console.log(userDeviceList);
        //adding coaches to array
        if (userDeviceList.ArrayOfUserDevices.UserDevices != null &&
          userDeviceList.ArrayOfUserDevices.UserDevices != undefined && userDeviceList.ArrayOfUserDevices.UserDevices.length != undefined) {
          $scope.deviceList.currentDevices = userDeviceList.ArrayOfUserDevices.UserDevices;

        } else if (userDeviceList.ArrayOfUserDevices.UserDevices != null &&
          userDeviceList.ArrayOfUserDevices.UserDevices != undefined) {
          $scope.deviceList.currentDevices.push(userDeviceList.ArrayOfUserDevices.UserDevices);
        }
        console.log($scope.deviceList.currentDevices)
        $ionicLoading.hide();
        //$scope.loadDoctorsList();

      }, function(err) {
        console.log(err);
        $ionicLoading.hide();
      })
    }
    $scope.addDevice = function() {

      $state.go("healthCare360X.deviceList")
    }
    $scope.removeDevice = function(item) {
      console.log(item);
      $ionicLoading.show();
      //HTTP request for removing doctors and coaches
      var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/RemoveDeviceFromList?userid=" + localStorage.getItem("userId") + "&deviceid=" + item.id, "", "").then(function(res) {
        $ionicLoading.hide();
        $scope.initFunction();
      }, function(err) {
        console.log(err);
        $ionicLoading.hide();
      })
    }
  }
])

//Controller communicating between doctors list view and model
.controller('doctorsListCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q) {
    //default scope
    $scope.doctorsList = {};
    $scope.doctorsList.doctors = [];
    $scope.doctorsList.isChecked = false;
    $scope.doctorsList.selectedDoctors = [];
    $scope.doctorsList.selectedDoctorsId = "";

    /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }
    //load function
    $scope.initFunction = function() {
        $ionicLoading.show();
        //XML to JSON parser initilization
        var x2js = new X2JS();
        var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/DoctorList", "", "").then(function(res) {

          var doctorsResult = x2js.xml_str2json(res.data);
          console.log(doctorsResult);
          if (doctorsResult != null && doctorsResult.ArrayOfUser != null) {
            if (doctorsResult.ArrayOfUser.User.length != undefined) {
              $scope.doctorsList.doctors.push(doctorsResult.ArrayOfUser.User);
            } else {

              $scope.doctorsList.doctors = doctorsResult.ArrayOfUser.User;
            }

            console.log($scope.doctorsList.doctors);
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
          $ionicLoading.hide();
        }, function(err) {
          console.log(err);
          $ionicLoading.hide();
        })
      }
      //checkbox change of adding doctors
    $scope.doctorsCheckChange = function(key, val, isChecked) {
        //if checkbox is checked
        if (isChecked == true) {
          //add values to scope
          $scope.doctorsList.selectedDoctors.push(val.id);

        } else if (isChecked == false) { // if checkbox is not checked
          //remove item from scope
          var index = $scope.doctorsList.selectedDoctors.indexOf(val.id);
          console.log(index)
          if (index != null && index != "") {
            $scope.doctorsList.selectedDoctors.splice(index, 1);

          } else if ($scope.doctorsList.selectedDoctors.length <= 1) {
            $scope.doctorsList.selectedDoctors = [];
          }

        }
        console.log($scope.doctorsList.selectedDoctors);

      }
      //submit adding doctors click
    $scope.addDoctors = function() {
      //for all checkboxes checked
      for (var i = 0; i < $scope.doctorsList.selectedDoctors.length; i++) {
        //fetching id for doctors
        $scope.doctorsList.selectedDoctorsId += $scope.doctorsList.selectedDoctors[i].toString() + ",";
      }
      $scope.doctorsList.selectedDoctorsId = $scope.doctorsList.selectedDoctorsId.substr(0, $scope.doctorsList.selectedDoctorsId.length - 1);
      //XML to JSON parser
      var x2js = new X2JS();
      //HTTP request deferred with Webservice and GET method will all parameters
      var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/AddDocCoachByPatient?patientid=" + localStorage.getItem("userId") + "&doccoachid=" + $scope.doctorsList.selectedDoctorsId + "&isdoc=true", "", "").then(function(res) {
        //parsing XML to JSON
        var addResult = x2js.xml_str2json(res.data);
        console.log(addResult);
        //if result is not null and success
        if (addResult != null && addResult != "" && addResult.int.__text.toString() == "1") {
          //success method and uncheck all doctors checkbox
          showToast("Doctors added successfully", "SUCCESS");
          $scope.doctorsList.isChecked = false;
        }
      }, function(err) {
        console.log(err);
      })
    }
  }
])

//Controller communicating between device list view and model
.controller('deviceListCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q) {
    //default scope
    $scope.deviceList = {};
    $scope.deviceList.devices = [];
    $scope.deviceList.isChecked = false;
    $scope.deviceList.selectedDevice = [];
    $scope.deviceList.selectedDeviceId = "";

    /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }
    //load function
    $scope.initFunction = function() {
        $ionicLoading.show();
        //XML to JSON parser initilization
        var x2js = new X2JS();
        var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/GetDeviceList", "", "").then(function(res) {

          var devicesResult = x2js.xml_str2json(res.data);
          console.log(devicesResult.ArrayOfDevice.Device);
          if (devicesResult.ArrayOfDevice.Device != null) {
            //              $scope.deviceList.devices = devicesResult.ArrayOfDevice.Device
            if (devicesResult.ArrayOfDevice.Device.length != undefined) {
              $scope.deviceList.devices.push(devicesResult.ArrayOfDevice.Device);
            } else {

              $scope.deviceList.devices = devicesResult.ArrayOfDevice.Device;
            }

            console.log($scope.deviceList.devices);
          }
          $ionicLoading.hide();
        }, function(err) {
          console.log(err);
          $ionicLoading.hide();
        })
      }
      //checkbox change of adding doctors
    $scope.deviceCheckChange = function(key, val, isChecked) {
        //if checkbox is checked
        if (isChecked == true) {
          //add values to scope
          $scope.deviceList.selectedDevice.push(val.id);

        } else if (isChecked == false) { // if checkbox is not checked
          //remove item from scope
          var index = $scope.deviceList.selectedDevice.indexOf(val.id);
          console.log(index)
          if (index != null && index != "") {
            $scope.deviceList.selectedDevice.splice(index, 1);

          } else if ($scope.deviceList.selectedDevice.length <= 1) {
            $scope.deviceList.selectedDevice = [];
          }

        }
        console.log($scope.deviceList.selectedDevice);

      }
      //submit adding doctors click
    $scope.addDevice = function() {
      //for all checkboxes checked
      for (var i = 0; i < $scope.deviceList.selectedDevice.length; i++) {
        //fetching id for doctors
        $scope.deviceList.selectedDeviceId += $scope.deviceList.selectedDevice[i].toString() + ",";
      }
      $scope.deviceList.selectedDeviceId = $scope.deviceList.selectedDeviceId.substr(0, $scope.deviceList.selectedDeviceId.length - 1);
      //XML to JSON parser
      var x2js = new X2JS();
      //HTTP request deferred with Webservice and GET method will all parameters
      var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/AddDeviceToUserList?userid=" + localStorage.getItem("userId") + "&deviceid=" + $scope.deviceList.selectedDeviceId + "&isdoc=true", "", "").then(function(res) {
        //parsing XML to JSON
        var addResult = x2js.xml_str2json(res.data);
        console.log(addResult);
        //if result is not null and success
        if (addResult != null && addResult != "" && addResult.int.__text.toString() == "1") {
          //success method and uncheck all doctors checkbox
          showToast("Devices added successfully", "SUCCESS");
          $scope.deviceList.isChecked = false;
        }
      }, function(err) {
        console.log(err);
      })
    }
  }
])

//Controller communicating between coach list view and model
.controller('coachListCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q) {
    //default scope
    $scope.coachList = {};
    $scope.coachList.coach = [];
    $scope.coachList.isChecked = false;
    $scope.coachList.selectedCoach = [];
    $scope.coachList.selectedCoachId = "";

    /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }
    //load function
    $scope.initFunction = function() {
        $ionicLoading.show();
        //XML to JSON parser
        var x2js = new X2JS();
        //fetching coach list
        var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/CoachList", "", "").then(function(res) {

          var coachResult = x2js.xml_str2json(res.data);
          console.log(coachResult);
          if (coachResult != null && coachResult.ArrayOfUser != null) {
            if (coachResult.ArrayOfUser.User.length != undefined) {
              $scope.coachList.coach.push(coachResult.ArrayOfUser.User);
            } else {

              $scope.coachList.coach = coachResult.ArrayOfUser.User;
            }

            console.log($scope.coachList.coach);
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
          $ionicLoading.hide();
        }, function(err) {
          console.log(err);
          $ionicLoading.hide();
        })
      }
      //coach checkbox change event
    $scope.coachCheckChange = function(key, val, isChecked) {
        //if checkbox is checked
        if (isChecked == true) {
          //add id to scope
          $scope.coachList.selectedCoach.push(val.id);
        } else if (isChecked == false) { //else if it is not checked
          //remove id from scope
          var index = $scope.coachList.selectedCoach.indexOf(val.id);
          console.log(index)
          if (index != null && index != "") {
            $scope.coachList.selectedCoach.splice(index, 1);

          } else if ($scope.coachList.selectedCoach.length <= 1) {
            $scope.coachList.selectedCoach = [];
          }

        }
        console.log($scope.coachList.selectedCoach);

      }
      //add coach button click event
    $scope.addCoach = function() {
      //for all checkbox checked
      for (var i = 0; i < $scope.coachList.selectedCoach.length; i++) {
        $scope.coachList.selectedCoachId += $scope.coachList.selectedCoach[i].toString() + ",";
      }
      $scope.coachList.selectedCoachId = $scope.coachList.selectedCoachId.substr(0, $scope.coachList.selectedCoachId.length - 1);
      console.log($scope.coachList.selectedCoachId);
      //XML to JSON parser
      var x2js = new X2JS();
      //HTTP request with webservice & parameters for adding coach for patient
      var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/AddDocCoachByPatient?patientid=" + localStorage.getItem("userId") + "&doccoachid=" + $scope.coachList.selectedCoachId + "&isdoc=false", "", "").then(function(res) {
        //parsing result to JSON
        var addResult = x2js.xml_str2json(res.data);
        console.log(addResult);
        //if result is not null
        if (addResult != null && addResult != "" && addResult.int.__text.toString() == "1") {
          //success message
          showToast("Coach added successfully", "SUCCESS");
          //uncheck all checkbox
          $scope.coachList.isChecked = false;
        }
      }, function(err) {
        console.log(err);
      })
    }
  }
])

//Controller communicating between settings view and model
.controller('settingsCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $state, $http, $ionicLoading, $q) {
    //default scope
    $scope.settings = {};
    $scope.settings.healthProfessionalsList = [];
    $scope.settings.userDoctorsList = [];
    $scope.settings.userCoachList = [];
    $scope.settings.doctorsList = [];
    $scope.settings.coachList = [];

    /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }
    //add doctor button click - then move to doctors list view
    $scope.addDoctor = function() {
      $state.go("healthCare360X.doctorsList");
    }

    //add coach button click - then move to coach list view
    $scope.addCoach = function() {
      $state.go("healthCare360X.coachList");
    }

    //load function
    $scope.initFunction = function() {
        $ionicLoading.show();
        // default blank array for doctor and coach list
        $scope.settings.userDoctorsList = [];
        $scope.settings.userCoachList = [];
        //XML to JSON
        var x2js = new X2JS();
        //fetch all coach list
        var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/GetDocCoachOfPatient ?patientid=" + localStorage.getItem("userId") + "&isdocList=false", "", "").then(function(res) {
          if (res != null) {
            //parsing JSON
            var coachResult = x2js.xml_str2json(res.data);
            console.log(coachResult);
            //if result is not null
            if (coachResult != null && coachResult.ArrayOfUser != null) {
              //adding coaches to array
              if (coachResult.ArrayOfUser.User != null && coachResult.ArrayOfUser.User != undefined && coachResult.ArrayOfUser.User.length != undefined) {
                $scope.settings.userCoachList = coachResult.ArrayOfUser.User;

              } else if (coachResult.ArrayOfUser.User != null && coachResult.ArrayOfUser.User != undefined) {
                $scope.settings.userCoachList.push(coachResult.ArrayOfUser.User);
              }
              console.log($scope.settings.userCoachList);
              $ionicLoading.hide();
              $scope.loadDoctorsList();
            }
          } else {
            $ionicLoading.hide();
            $scope.loadDoctorsList();
          }
        }, function(err) {
          console.log(err);
          $ionicLoading.hide();
        });

      }
      //load all doctors list
    $scope.loadDoctorsList = function() {
        $ionicLoading.show();
        //XML to JSON
        var x2js = new X2JS();
        //HTTP request for fetching all doctors
        var httpRequestDeferred_Doc = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/GetDocCoachOfPatient ?patientid=" + localStorage.getItem("userId") + "&isdocList=true", "", "").then(function(res) {
          if (res != null) {
            //parsing JSON
            var docResult = x2js.xml_str2json(res.data);
            console.log(docResult);
            //if result is not null
            if (docResult != null && docResult.ArrayOfUser != null) {
              //add doctors to model
              if (docResult.ArrayOfUser.User != null && docResult.ArrayOfUser.User != undefined && docResult.ArrayOfUser.User.length != undefined) {
                $scope.settings.userDoctorsList = docResult.ArrayOfUser.User;
              } else if (docResult.ArrayOfUser.User != null && docResult.ArrayOfUser.User != undefined) {
                $scope.settings.userDoctorsList.push(docResult.ArrayOfUser.User);
              }
              $ionicLoading.hide();

            }
          } else {
            $ionicLoading.hide();
          }
        }, function(err) {
          console.log(err);
          $ionicLoading.hide();
        });
      }
      //delete for doctors and coaches
    $scope.removeHealthProfessional = function(item, isdoc) {
      console.log(item);
      $ionicLoading.show();
      //HTTP request for removing doctors and coaches
      var httpRequestDeferred = httpRequest("GET", "http://www.health360x.com/dataaccess.asmx/RemoveDocCoachByPatient?patientid=" + localStorage.getItem("userId") + "&doccoachid=" + item.id + "&isdoc=" + isdoc + "", "", "").then(function(res) {
        $ionicLoading.hide();
        $scope.initFunction();
      }, function(err) {
        console.log(err);
        $ionicLoading.hide();
      })
    }
  }
])

//Controller communicating with Glucose history view and Glucose history model with default angular injections
.controller('bgHistoryCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout function
    $scope.logout = function() {
        localStorage.clear();
        localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
        $state.go("login");
      }
      //default scope
    $scope.BGItems = [];
    //db initilization
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
    //select query for BG default value
    var query = "SELECT BGValue, EON FROM BloodGlucose ORDER BY BGId DESC";
    //execution of select query
    $cordovaSQLite.execute(db, query).then(function(resk) {

      if (resk.rows.length > 0) {

        var kl = resk.rows.length;

        for (i = 0; i < kl; i++) {

          //default json array
          var BGItem = {};

          console.log(resk.rows.item(i).BGValue);
          //formatting date
          //var eon = formatDateToDisplay(new Date(resk.rows.item(i).EON));
          var eon = resk.rows.item(i).EON;
          //adding items to JSON array
          BGItem = {
              "BGValue": resk.rows.item(i).BGValue + " mg/dl",
              "EON": eon
            }
            //adding items to model
          $scope.BGItems.push(BGItem);
        }
      }

    }, function(err) {
      //alert(err);
    });

  }
])

//Controller communicating with BP history view and BP history model with default angular injections
.controller('bpHistoryCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout function
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }

    //BP scope initialization
    $scope.BPItems = [];
    //database initilization
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);

    //query for selecting default BP values
    var query = "SELECT SYSValue, DIAValue, EON FROM BloodPressure ORDER BY BPId DESC";
    //execution of query
    $cordovaSQLite.execute(db, query).then(function(resk) {

      if (resk.rows.length > 0) {

        var kl = resk.rows.length;
        //looping the result
        for (i = 0; i < kl; i++) {
          var BPValue = resk.rows.item(i).SYSValue.toString() + "/" + resk.rows.item(i).DIAValue.toString() + " mg/dl";

          // default JSON array
          var BPItem = {};
          //formatting the result
          //var eon = formatDateToDisplay(new Date(resk.rows.item(i).EON));
          var eon = resk.rows.item(i).EON;
          //adding values to JSON array
          BPItem = {
              "BPValue": BPValue,
              "EON": eon
            }
            //adding values to model
          $scope.BPItems.push(BPItem);
        }
      }

    }, function(err) {
      alert(err);
    });

  }
])

//Controller communicating with BMI history view and BMI history model with default angular injections
.controller('bmiHistoryCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout function
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }

    //BMI scope initialization
    $scope.BMItems = [];
    //database initilization
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
    //query for selecting default BMI value
    var query = "SELECT Weight,Height,BMI, EON FROM BMI ORDER BY BMId DESC";
    //execution of query
    $cordovaSQLite.execute(db, query).then(function(resk) {
      console.log(resk);

      if (resk.rows.length > 0) {

        var kl = resk.rows.length;
        //looping the result
        for (i = 0; i < kl; i++) {
          var BMValue = resk.rows.item(i).BMI.toFixed(1).toString();

          var BMItem = {};
          //formatting the result
          //var eon = formatDateToDisplay(new Date(resk.rows.item(i).EON));
          var eon = resk.rows.item(i).EON
            // creating JSON array for the values
          BMItem = {
            "BMValue": BMValue,
            "EON": eon
          }

          //adding values to model
          $scope.BMItems.push(BMItem);
        }
      }

    }, function(err) {
      alert(err);
    });

  }
])

//Controller communicating with Glucose Graph view and Glucose model with default angular injection
.controller('bgGraphCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout function
    $scope.logout = function() {
      localStorage.clear();
      localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
      $state.go("login");
    }

    //default scope
    $scope.BGItems = [];

    var dSet = [];
    var lbls = [];

    //initialization of database
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);

    //query for selecting glucose default value
    var query = "Select BGValue, EON from BloodGlucose where isdefault =1 union SELECT BGValue, EON FROM BloodGlucose where EON like '"+moment(new Date()).format("MMM")+"%'  limit 7";
    //execution of query
    $cordovaSQLite.execute(db, query).then(function(resk) {

      if (resk.rows.length > 0) {

        var kl = resk.rows.length;
        console.log(kl);
        for (i = 0; i < kl; i++) {

          var BGItem = {};
          //formatting the result
          //var eon = formatDateToDisplay(new Date(resk.rows.item(i).EON));
          var eon = resk.rows.item(i).EON;
          BGItem = {
            "X": (eon.split("|")[0]).split(" ")[1], // x axis value of graph
            "Y": parseFloat(resk.rows.item(i).BGValue) // y axis value of graph
          }
          console.log(BGItem);

          $scope.BGItems.push(BGItem);

          dSet.push(resk.rows.item(i).BGValue);
          lbls.push(eon.split("|")[0]);
        }
        // graph data
        var graphdata1 = {
          ChartType: "Area",
          linecolor: "#11c1f3",
          title: "Blood Glucose",
          values: $scope.BGItems
        };
        //initializing graph and sending it to view
        $("#Bargraph").SimpleChart({
          ChartType: "Line",
          toolwidth: "50",
          toolheight: "25",
          axiscolor: "#E6E6E6",
          textcolor: "#6E6E6E",
          showlegends: false,
          data: [graphdata1],
          legendsize: "140",
          legendposition: 'bottom',
          xaxislabel: 'Date',
          title: 'Blood Glucose Graph',
          yaxislabel: 'Blood Glucose'
        });

      }

    }, function(err) {
      alert(err);
    });

  }
])

//Controller communicating with BP Graph view and BP model with default angular injection
.controller('bpGraphCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout function
    $scope.logout = function() {
        localStorage.clear();
        localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
        $state.go("login");
      }
      //default initilization of scope
    $scope.BPItems = [];
    $scope.BPDIaItems = [];

    //initilization of database
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);

    //query for selecting Blood pressure default value
    var query = "Select SYSValue, DIAValue, EON From BloodPressure where isDefault=1 UNION SELECT SYSValue, DIAValue, EON FROM BloodPressure limit 5 ";
    //execution of query
    $cordovaSQLite.execute(db, query).then(function(resk) {

      if (resk.rows.length > 0) {

        var kl = resk.rows.length;

        for (i = 0; i < kl; i++) {

          var BGItem = {};
          var BPDiaItem = {};
          //formatting the result
          //var eon = formatDateToDisplay(new Date(resk.rows.item(i).EON));
          var eon = resk.rows.item(i).EON
          console.log(eon);
          BGItem = {
            "X": eon.split("|")[0].split(" ")[1], //x axis value
            "Y": parseFloat(resk.rows.item(i).SYSValue) // y axis value (systolic)
          }
          console.log(BGItem);
          BPDiaItem = {
            "X": eon.split("|")[0].split(" ")[1], //x axis value
            "Y": parseFloat(resk.rows.item(i).DIAValue) // y axis value (diastolic)
          }

          $scope.BPItems.push(BGItem);
          $scope.BPDIaItems.push(BPDiaItem);

        }
        //defining graph type and assigning values to graph
        var graphdata1 = {
          ChartType: "Area",
          linecolor: "#11c1f3",
          title: "Systolic",
          values: $scope.BPItems
        };
        //defining graph type and assigning values to graph
        var graphdata2 = {
          ChartType: "Area",
          linecolor: "#00CC66",
          title: "Diastolic",
          values: $scope.BPDIaItems
        };
        //passing the graph to view
        $("#Bargraph").SimpleChart({
          ChartType: "Line",
          toolwidth: "50",
          toolheight: "25",
          axiscolor: "#E6E6E6",
          textcolor: "#6E6E6E",
          showlegends: true,
          data: [graphdata1, graphdata2],
          legendsize: "100",
          legendposition: 'bottom',
          xaxislabel: 'Date',
          title: 'Blood Pressure Graph',
          yaxislabel: 'Blood Pressure'
        });

      }

    }, function(err) {
      alert(err);
    });

  }
])

//Controller communicating with BMI Graph view and BMI model with default angular injection
.controller('bmiGraphCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    // logout function
    $scope.logout = function() {
        localStorage.clear();
        localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
        $state.go("login");
      }
      //default initialization of scope
    $scope.BMItems = [];
    //initialization of database
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5); // browser

    // query for selecting BMI result (default)
    var query = "Select Weight,Height,BMI,EON from BMI where isdefault =1 UNION SELECT Weight,Height,BMI, EON FROM BMI limit 5";
    //execution of query
    $cordovaSQLite.execute(db, query).then(function(resk) {

      if (resk.rows.length > 0) {

        var kl = resk.rows.length;

        for (i = 0; i < kl; i++) {

          var BMItem = {};
          //formatting the result to be shown on graph
          //var eon = formatDateToDisplay(new Date(resk.rows.item(i).EON));
          var eon = resk.rows.item(i).EON;

          BMItem = {
            "X": eon.split("|")[0].split(" ")[1], // x axis value
            "Y": parseFloat(resk.rows.item(i).BMI) // y axis value
          }

          $scope.BMItems.push(BMItem);
        }
        //graph type and colors
        var graphdata1 = {
          ChartType: "Area",
          linecolor: "#11c1f3",
          title: "BMI",
          values: $scope.BMItems
        };
        //passing graph value to view
        $("#Bargraph").SimpleChart({
          ChartType: "Line",
          toolwidth: "50",
          toolheight: "25",
          axiscolor: "#E6E6E6",
          textcolor: "#6E6E6E",
          showlegends: false,
          data: [graphdata1],
          legendsize: "140",
          legendposition: 'bottom',
          xaxislabel: 'Date',
          title: 'BMI Graph',
          yaxislabel: 'BMI'
        });

      }

    }, function(err) {
      alert(err);
    });

  }
])

//Controller communicating with Fitness Graph view and Fitness model with default angular injection
.controller('fitnessGraphCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    // logout function
    $scope.logout = function() {
        localStorage.clear();
        localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
        $state.go("login");
      }
      //default initialization of scope
    $scope.BMItems = [];
    //initialization of database
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5); // browser

    // query for selecting BMI result (default)
    var query = "SELECT Intensity,ActivityType, EON FROM Fitness ORDER BY FitnessId DESC";
    //execution of query
    $cordovaSQLite.execute(db, query).then(function(resk) {

      if (resk.rows.length > 0) {

        var kl = resk.rows.length;

        for (i = 0; i < kl; i++) {

          var BMItem = {};
          //formatting the result to be shown on graph
          //var eon = formatDateToDisplay(new Date(resk.rows.item(i).EON));
          var eon = resk.rows.item(i).EON;
          var graphValue = (eon.split("|")[0]).split(" ")[0] + " " + (eon.split("|")[0]).split(" ")[1]

          BMItem = {
            "X": graphValue, // x axis value
            "Y": parseFloat(resk.rows.item(i).Intensity) // y axis value
          }

          $scope.BMItems.push(BMItem);
        }
        //graph type and colors
        var graphdata1 = {
          ChartType: "Area",
          linecolor: "#11c1f3",
          title: "Fitness",
          values: $scope.BMItems
        };
        //passing graph value to view
        $("#Bargraph").SimpleChart({
          ChartType: "Line",
          toolwidth: "50",
          toolheight: "25",
          axiscolor: "#E6E6E6",
          textcolor: "#6E6E6E",
          showlegends: false,
          data: [graphdata1],
          legendsize: "140",
          legendposition: 'bottom',
          xaxislabel: 'Date',
          title: 'Fitness Graph',
          yaxislabel: 'Intensity'
        });

      }

    }, function(err) {
      alert(err);
    });

  }
])

//Controller communicating between fitness history view and model
.controller('fitnessHistoryCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    //logout function
    $scope.logout = function() {
        localStorage.clear();
        localStorage.setItem("userLastLoggedinTime", moment(new Date).format("LLL"));
        $state.go("login");
      }
      //default scope
    $scope.fitnessItems = [];
    //db initilization
    var db;
    db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
    //select query for nutrition default value
    var query = "SELECT ActivityType, EON FROM Fitness ORDER BY FitnessId DESC";
    //execution for query
    $cordovaSQLite.execute(db, query).then(function(resk) {
      //result length
      if (resk.rows.length > 0) {

        var kl = resk.rows.length;

        for (i = 0; i < kl; i++) {

          var fitnessItem = {};

          console.log(resk.rows.item(i).Calory);
          //formatting date
          var eon = resk.rows.item(i).EON;

          //assinging values to JSON array
          fitnessItem = {
            "Activity": resk.rows.item(i).ActivityType,
            "EON": eon
          }

          //adding values to model
          $scope.fitnessItems.push(fitnessItem);
        }
      }

    }, function(err) {
      console.log(err);
      alert(err);
    });

  }
])

.controller('syncCtrl', ['$scope', '$stateParams', '$cordovaSQLite', '$state', '$http', '$ionicLoading', '$q',
  function($scope, $stateParams, $cordovaSQLite, $state, $http, $ionicLoading, $q) {
    $scope.sync = {};
    $scope.sync.enableResyncButton = false
      /*
    HTTP angular method to call the webservice
    Accepts parameters
        method - method name GET / POST
        url - URL of the service
        params - parameters to be passed to the service
        headers - default headers to the service
   */
    function httpRequest(method, url, params, headers) {
      var deferred = $q.defer();
      var req = {
        method: method,
        url: url,
        data: params,
        headers: headers
      }
      $http(req).then(function(res) {
        if (res != null && res != "") {
          deferred.resolve(res);
        }
      }, function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    $scope.initFunction = function() {
      $ionicLoading.show();
      syncBMI().then(function(res) {
        console.log("BMI Sync - " + res);
        if (res != null && res == "done") {
          syncBG().then(function(res) {
            console.log("BG Sync - " + res);
            if (res != null && res == "done") {
              syncBP().then(function(res) {
                console.log("BP Sync - " + res);
                if (res != null && res == "done") {
                  syncNutrition().then(function(res) {
                    console.log("Nutrition Sync - " + res);
                    if (res != null && res == "done") {
                      $ionicLoading.hide();
                      showToast("Data synched successfully", 'success');
                    }
                  }, function(err) {
                    console.log(err);
                    showToast("Data synched failed", 'error');
                    $scope.sync.enableResyncButton = true;
                  })
                }
              }, function(err) {
                console.log(err);
                showToast("Data synched failed", 'error');
                $scope.sync.enableResyncButton = true;
              })
            }
          }, function(err) {
            console.log(err);
            showToast("Data synched failed", 'error');
            $scope.sync.enableResyncButton = true;
          })
        }
      }, function(err) {
        console.log(err);
        showToast("Data synched failed", 'error');
        $scope.sync.enableResyncButton = true;
      })
    }

    function syncBMI() {
      var deferred = $q.defer();
      try {
        var db;
        db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
        //select query for nutrition default value
        var query = "SELECT * FROM BMI where IsDefault = 1";
        //execution for query
        $cordovaSQLite.execute(db, query).then(function(res) {
          if (res.rows.length > 0) {
            var recordDate = res.rows.item(0).EON.split("|")[0];
            var url = 'http://www.health360x.com/dataaccess.asmx/saveHV_HeightWeight?userID=' + localStorage.getItem("userId") + '&weightLbs=' + res.rows.item(0).Weight.toString() + '&dateMeasured=' + moment(recordDate).format("MM/DD/YYYY") + '&heightInches=' + res.rows.item(0).HEIGHT.toString() + '&hvRecordID=""';
            console.log(url);
            httpRequest("GET", url, "", "").then(function(res) {
              
              var deleteQuery="delete from BMI where isdefault!=1";
              $cordovaSQLite.execute(db,deleteQuery).then(function(res){
                var d = new Date();
                d = d.getDate()-7
                var data = {
                  userId:localStorage.getItem("userId"),
                  startDate:moment(new Date()).format("MM/"+d+"/YYYY"),
                  endDate :moment(new Date()).format("MM/DD/YYYY")
                }
                var url = "http://www.health360x.com/dataaccess.asmx/getHV_HeightWeightHistory?userId="+data.userId+"&startDate="+data.startDate+"&endDate="+data.endDate;
                httpRequest("GET",url,"","").then(function(res){
                  var x2js = new X2JS();
                  var response = x2js.xml_str2json(res.data);
                  console.log(response);
                  if(response!==undefined && response!==null && response!==""){
                    var insertQuery = "insert into BMI(Weight,HEIGHT,BMI,EON,IsDefault)";
                    for(var i=0;i<response.ArrayOfHV_HeightWeight.HV_HeightWeight.length;i++){
                      var bmi =(parseFloat(response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].weightLbs) / parseFloat(response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].heightInches) / parseFloat(response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].heightInches)) * 703;
                      //console.log(moment(new Date(response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].dateCollected)).format("MMM DD YYYY | hh : mm a"))
                      insertQuery+=" Select '"+response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].weightLbs+"','"+response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].heightInches+"','"+bmi+"','"+moment(new Date(response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].dateMeasured)).format("MMM DD YYYY | hh : mm a")+"','0' UNION ALL"
                    }
                    window.insertQuery = insertQuery;
                    insertQuery = insertQuery.substr(0,insertQuery.length-10);
                    console.log(insertQuery);
                    $cordovaSQLite.execute(db,insertQuery).then(function(res){
                      console.log(res);
                      if(res!==undefined && res!==null ){
                        deferred.resolve("done");
                      }
                      else{
                        deferred.reject("error")
                      }
                    })
                    
                  }
                })
              })
            }, function(err) {
              console.log(err);
              deferred.reject(err);
            })
          } else {
            var deleteQuery="delete from BMI";
            $cordovaSQLite.execute(db,deleteQuery).then(function(res){
              var d = new Date();
              d = d.getDate()-7
              var data = {
                userId:localStorage.getItem("userId"),
                startDate:moment(new Date()).format("MM/"+d+"/YYYY"),
                endDate :moment(new Date()).format("MM/DD/YYYY")
              }
              var url = "http://www.health360x.com/dataaccess.asmx/getHV_HeightWeightHistory?userId="+data.userId+"&startDate="+data.startDate+"&endDate="+data.endDate;
              httpRequest("GET",url,"","").then(function(res){
                var x2js = new X2JS();
                var response = x2js.xml_str2json(res.data);
                console.log(response);
                if(response!==undefined && response!==null && response!==""){
                  var insertQuery = "insert into BMI(Weight,HEIGHT,BMI,EON,IsDefault)";
                  for(var i=0;i<response.ArrayOfHV_HeightWeight.HV_HeightWeight.length;i++){
                    var bmi =(parseFloat(response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].weightLbs) / parseFloat(response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].heightInches) / parseFloat(response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].heightInches)) * 703;
                    //console.log(moment(new Date(response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].dateCollected)).format("MMM DD YYYY | hh : mm a"))
                    insertQuery+=" Select '"+response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].weightLbs+"','"+response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].heightInches+"','"+bmi+"','"+moment(new Date(response.ArrayOfHV_HeightWeight.HV_HeightWeight[i].dateMeasured)).format("MMM DD YYYY | hh : mm a")+"','0' UNION ALL"
                  }
                  window.insertQuery = insertQuery;
                  insertQuery = insertQuery.substr(0,insertQuery.length-10);
                  console.log(insertQuery);
                  $cordovaSQLite.execute(db,insertQuery).then(function(res){
                    console.log(res);
                    if(res!==undefined && res!==null ){
                      deferred.resolve("done");
                    }
                    else{
                      deferred.reject("error")
                    }
                  })
                  
                }
              })
            })
          }


        }, function(error) {
          console.log(error);
          deferred.reject(error);
        })
      } catch (ex) {
        console.log(ex);
        deferred.reject(ex);

      }
      return deferred.promise;


    }

    function syncBG() {
      var deferred = $q.defer();
      try {
        var db;
        db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
        //select query for nutrition default value
        var query = "SELECT * FROM BloodGlucose where IsDefault = 1";
        //execution for query
        $cordovaSQLite.execute(db, query).then(function(res) {
          if (res.rows.length > 0) {
            var recordDate = res.rows.item(0).EON.split("|")[0];
            var url = 'http://www.health360x.com/dataaccess.asmx/saveHV_BloodGlucoseFull?userID=' + localStorage.getItem("userId") + '&bloodGlucose=' + res.rows.item(0).BGValue.toString() + '&dateCollected=' + moment(recordDate).format("MM/DD/YYYY") + '&mealFlag=""&comments=""&hvRecordID=""';
            console.log(url);
            httpRequest("GET", url, "", "").then(function(res) {
              var deleteQuery="delete from BloodGlucose where isdefault!=1";
              $cordovaSQLite.execute(db,deleteQuery).then(function(res){
                var d = new Date();
                d = d.getDate()-7
                var data = {
                  userId:localStorage.getItem("userId"),
                  startDate:moment(new Date()).format("MM/"+d+"/YYYY"),
                  endDate :moment(new Date()).format("MM/DD/YYYY")
                }
                var url = "http://www.health360x.com/dataaccess.asmx/getHV_BloodGlucoseHistory?userId="+data.userId+"&startDate="+data.startDate+"&endDate="+data.endDate;
                httpRequest("GET",url,"","").then(function(res){
                  var x2js = new X2JS();
                  var response = x2js.xml_str2json(res.data);
                  console.log(response);
                  if(response!==undefined && response!==null && response!==""){
                    var insertQuery = "insert into BloodGlucose(BGValue,EON,IsDefault)";
                    for(var i=0;i<response.ArrayOfHV_BloodGlucose.HV_BloodGlucose.length;i++){
                      //console.log(moment(new Date(response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].dateCollected)).format("MMM DD YYYY | hh : mm a"))
                      insertQuery+=" Select '"+response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].bloodGlucose+"','"+moment(new Date(response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].dateCollected)).format("MMM DD YYYY | hh : mm a")+"','0' UNION ALL"
                    }
                    window.insertQuery = insertQuery;
                    insertQuery = insertQuery.substr(0,insertQuery.length-10);
                    console.log(insertQuery);
                    $cordovaSQLite.execute(db,insertQuery).then(function(res){
                      console.log(res);
                      if(res!==undefined && res!==null ){
                        deferred.resolve("done");
                      }
                      else{
                        deferred.reject("error")
                      }
                    })
                    
                  }
                })
              })
            }, function(err) {
              console.log(err);
              deferred.reject(err);
            })
          } else {
            var deleteQuery="delete from BloodGlucose";
            $cordovaSQLite.execute(db,deleteQuery).then(function(res){
              var d = new Date();
              d = d.getDate()-7
              var data = {
                userId:localStorage.getItem("userId"),
                startDate:moment(new Date()).format("MM/"+d+"/YYYY"),
                endDate :moment(new Date()).format("MM/DD/YYYY")
              }
              var url = "http://www.health360x.com/dataaccess.asmx/getHV_BloodGlucoseHistory?userId="+data.userId+"&startDate="+data.startDate+"&endDate="+data.endDate;
              httpRequest("GET",url,"","").then(function(res){
                var x2js = new X2JS();
                var response = x2js.xml_str2json(res.data);
                console.log(response);
                if(response!==undefined && response!==null && response!==""){
                  var insertQuery = "insert into BloodGlucose(BGValue,EON,IsDefault)";
                  for(var i=0;i<response.ArrayOfHV_BloodGlucose.HV_BloodGlucose.length;i++){
                    //console.log(moment(new Date(response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].dateCollected)).format("MMM DD YYYY | hh : mm a"))
                    insertQuery+=" Select '"+response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].bloodGlucose+"','"+moment(new Date(response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].dateCollected)).format("MMM DD YYYY | hh : mm a")+"','0' UNION ALL"
                  }
                  window.insertQuery = insertQuery;
                  insertQuery = insertQuery.substr(0,insertQuery.length-10);
                  console.log(insertQuery);
                  $cordovaSQLite.execute(db,insertQuery).then(function(res){
                    console.log(res);
                    if(res!==undefined && res!==null ){
                      deferred.resolve("done");
                    }
                    else{
                      deferred.reject("error")
                    }
                  })
                  
                }
              })
            })
          }


        }, function(error) {
          console.log(error);
          deferred.reject(error);
        })
      } catch (ex) {
        console.log(ex);
        deferred.reject(ex);

      }
      return deferred.promise;


    }

    function syncBP() {
      var deferred = $q.defer();
      try {
        var db;
        db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
        //select query for nutrition default value
        var query = "SELECT * FROM BloodPressure where IsDefault = 1";
        //execution for query
        $cordovaSQLite.execute(db, query).then(function(res) {
          if (res.rows.length > 0) {
            var recordDate = res.rows.item(0).EON.split("|")[0];
            var url = 'http://www.health360x.com/dataaccess.asmx/saveHV_BloodPressureFull?userID=' + localStorage.getItem("userId") + '&systolic=' + res.rows.item(0).SYSValue.toString() + '&dateMeasured=' + moment(recordDate).format("MM/DD/YYYY") + '&diastolic=' + res.rows.item(0).DIAValue.toString() + '&notes=""&hvRecordID=""';
            console.log(url);
            httpRequest("GET", url, "", "").then(function(res) {
              var deleteQuery="delete from BloodPressure where isdefault!=1";
              $cordovaSQLite.execute(db,deleteQuery).then(function(res){
                var d = new Date();
                d = d.getDate()-7
                var data = {
                  userId:localStorage.getItem("userId"),
                  startDate:moment(new Date()).format("MM/"+d+"/YYYY"),
                  endDate :moment(new Date()).format("MM/DD/YYYY")
                }
                var url = "http://www.health360x.com/dataaccess.asmx/getHV_BloodPressureHistory?userId="+data.userId+"&startDate="+data.startDate+"&endDate="+data.endDate;
                httpRequest("GET",url,"","").then(function(res){
                  var x2js = new X2JS();
                  var response = x2js.xml_str2json(res.data);
                  console.log(response);
                  if(response!==undefined && response!==null && response!==""){
                    var insertQuery = "insert into BloodPressure(SYSValue,DIAValue,EON,IsDefault)";
                    for(var i=0;i<response.ArrayOfHV_BloodPressure.HV_BloodPressure.length;i++){
                      //console.log(moment(new Date(response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].dateCollected)).format("MMM DD YYYY | hh : mm a"))
                      insertQuery+=" Select '"+response.ArrayOfHV_BloodPressure.HV_BloodPressure[i].systolic+"','"+response.ArrayOfHV_BloodPressure.HV_BloodPressure[i].diastolic+"','"+moment(new Date(response.ArrayOfHV_BloodPressure.HV_BloodPressure[i].dateMeasured)).format("MMM DD YYYY | hh : mm a")+"','0' UNION ALL"
                    }
                    window.insertQuery = insertQuery;
                    insertQuery = insertQuery.substr(0,insertQuery.length-10);
                    console.log(insertQuery);
                    $cordovaSQLite.execute(db,insertQuery).then(function(res){
                      console.log(res);
                      if(res!==undefined && res!==null ){
                        deferred.resolve("done");
                      }
                      else{
                        deferred.reject("error")
                      }
                    })
                    
                  }
                })
              })
            }, function(err) {
              console.log(err);
              deferred.reject(err);
            })
          } else {
            var deleteQuery="delete from BloodPressure";
            $cordovaSQLite.execute(db,deleteQuery).then(function(res){
              var d = new Date();
              d = d.getDate()-7
              var data = {
                userId:localStorage.getItem("userId"),
                startDate:moment(new Date()).format("MM/"+d+"/YYYY"),
                endDate :moment(new Date()).format("MM/DD/YYYY")
              }
              var url = "http://www.health360x.com/dataaccess.asmx/getHV_BloodPressureHistory?userId="+data.userId+"&startDate="+data.startDate+"&endDate="+data.endDate;
              httpRequest("GET",url,"","").then(function(res){
                var x2js = new X2JS();
                var response = x2js.xml_str2json(res.data);
                console.log(response);
                if(response!==undefined && response!==null && response!==""){
                  var insertQuery = "insert into BloodPressure(SYSValue,DIAValue,EON,IsDefault)";
                  for(var i=0;i<response.ArrayOfHV_BloodPressure.HV_BloodPressure.length;i++){
                    //console.log(moment(new Date(response.ArrayOfHV_BloodGlucose.HV_BloodGlucose[i].dateCollected)).format("MMM DD YYYY | hh : mm a"))
                    insertQuery+=" Select '"+response.ArrayOfHV_BloodPressure.HV_BloodPressure[i].systolic+"','"+response.ArrayOfHV_BloodPressure.HV_BloodPressure[i].diastolic+"','"+moment(new Date(response.ArrayOfHV_BloodPressure.HV_BloodPressure[i].dateMeasured)).format("MMM DD YYYY | hh : mm a")+"','0' UNION ALL"
                  }
                  window.insertQuery = insertQuery;
                  insertQuery = insertQuery.substr(0,insertQuery.length-10);
                  console.log(insertQuery);
                  $cordovaSQLite.execute(db,insertQuery).then(function(res){
                    console.log(res);
                    if(res!==undefined && res!==null ){
                      deferred.resolve("done");
                    }
                    else{
                      deferred.reject("error")
                    }
                  })
                  
                }
              })
            })
          }


        }, function(error) {
          console.log(error);
          deferred.reject(error);
        })
      } catch (ex) {
        console.log(ex);
        deferred.reject(ex);
        deferred.reject(ex);
      }
      return deferred.promise;


    }

    function syncNutrition() {
      var deferred = $q.defer();
      try {
        var db;
        db = window.openDatabase("H360X.db", '1', 'H360X', 1024 * 1024 * 5);
        //select query for nutrition default value
        var query = "SELECT * FROM Nutrition where IsDefault = 1";
        //execution for query
        $cordovaSQLite.execute(db, query).then(function(res) {
          if (res.rows.length > 0) {
            var recordDate = res.rows.item(0).EON.split("|")[0];
            var url = "http://www.health360x.com/dataaccess.asmx/saveCalorieLog?userID=" + localStorage.getItem("userId") + "&logDate=" + moment(recordDate).format("MM/DD/YYYY") + "&meal='" + res.rows.item(0).MType + "'&desc='" + res.rows.item(0).MDescription + "'&calories=" + res.rows.item(0).Calory + "";
            //        var url = "http://www.health360x.com/dataaccess.asmx/saveCalorieLog?userID=100493&logDate=08/28/2017&meal='Lunch'&desc='asdfasdf'&calories=342"
            console.log(url);
            httpRequest("GET", url, "", "").then(function(res) {
              deferred.resolve("done");
            }, function(err) {
              console.log(err);
              deferred.reject(err);
            })
          } else {
            deferred.resolve("done");
          }


        }, function(error) {
          console.log(error);
          deferred.reject(error);
        })
      } catch (ex) {
        console.log(ex);
        deferred.reject(ex);
        deferred.reject(ex);
      }
      return deferred.promise;


    }
  }
])
