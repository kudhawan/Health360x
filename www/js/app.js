// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db;

angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'ngCordova', 'pickadate'])

.config(function($ionicConfigProvider, $sceDelegateProvider) {

  $sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

})

.run(function($ionicPlatform, $cordovaSQLite, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)


    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
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




  });
})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
  return {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

      function stopDrag() {
        $ionicSideMenuDelegate.canDragContent(false);
      }

      function allowDrag() {
        $ionicSideMenuDelegate.canDragContent(true);
      }

      $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
      $element.on('touchstart', stopDrag);
      $element.on('touchend', allowDrag);
      $element.on('mousedown', stopDrag);
      $element.on('mouseup', allowDrag);

    }]
  };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val) {
        href = val;
      });

      element.bind('click', function(event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});
