angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }

    )
    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }

    )
    .state('forgot', {
        url: '/forgot',
        templateUrl: 'templates/forgotPassword.html',
        controller: 'forgotCtrl'
      }

    )
    .state('verifyPin', {
        url: '/verifyPin',
        templateUrl: 'templates/verifyPin.html',
        controller: 'verifyPinCtrl',
        params: {
          pin: null
        }
      }

    )
    .state('changePassword', {
        url: '/changePassword',
        templateUrl: 'templates/changePassword.html',
        controller: 'changePasswordCtrl',

      }

    )

  .state('healthCare360X.home', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('healthCare360X.bloodGlucose', {
      url: '/page2',
      views: {
        'side-menu21': {
          templateUrl: 'templates/bloodGlucose.html',
          controller: 'bloodGlucoseCtrl'
        }
      }
    })
    .state('healthCare360X.bgHistory', {
      url: '/bgHistory',
      views: {
        'side-menu21': {
          templateUrl: 'templates/BGHistory.html',
          controller: 'bgHistoryCtrl'
        }
      }
    })

  .state('healthCare360X.bgGraph', {
    url: '/bgGraph',
    views: {
      'side-menu21': {
        templateUrl: 'templates/bgGraph.html',
        controller: 'bgGraphCtrl'
      }
    }
  })

  .state('healthCare360X.bloodPressure', {
      url: '/page3',
      views: {
        'side-menu21': {
          templateUrl: 'templates/bloodPressure.html',
          controller: 'bloodPressureCtrl'
        }
      }
    })
    .state('healthCare360X.bpHistory', {
      url: '/bpHistory',
      views: {
        'side-menu21': {
          templateUrl: 'templates/bpHistory.html',
          controller: 'bpHistoryCtrl'
        }
      }
    })

  .state('healthCare360X.bpGraph', {
    url: '/bpGraph',
    views: {
      'side-menu21': {
        templateUrl: 'templates/bpGraph.html',
        controller: 'bpGraphCtrl'
      }
    }
  })

  .state('healthCare360X', {
    url: '/side-menu21',
    templateUrl: 'templates/healthCare360X.html',
    controller: 'healthCare360XCtrl'
  })

  .state('healthCare360X.weight', {
      url: '/page4',
      views: {
        'side-menu21': {
          templateUrl: 'templates/weight.html',
          controller: 'weightCtrl'
        }
      }
    })
    .state('healthCare360X.bmiHistory', {
      url: '/bmiHistory',
      views: {
        'side-menu21': {
          templateUrl: 'templates/bmiHistory.html',
          controller: 'bmiHistoryCtrl'
        }
      }
    })

  .state('healthCare360X.bmiGraph', {
    url: '/bmiGraph',
    views: {
      'side-menu21': {
        templateUrl: 'templates/bmiGraph.html',
        controller: 'bmiGraphCtrl'
      }
    }
  })

  .state('healthCare360X.fitness', {
    url: '/page5',
    views: {
      'side-menu21': {
        templateUrl: 'templates/fitness.html',
        controller: 'fitnessCtrl'
      }
    }
  })

  .state('healthCare360X.fitnessHistory', {
    url: '/fitnessHistory',
    views: {
      'side-menu21': {
        templateUrl: 'templates/fitnessHistory.html',
        controller: 'fitnessHistoryCtrl'
      }
    }
  })

  .state('healthCare360X.fitnessGraph', {
    url: '/fitnessGraph',
    views: {
      'side-menu21': {
        templateUrl: 'templates/fitnessGraph.html',
        controller: 'fitnessGraphCtrl'
      }
    }
  })

  .state('healthCare360X.fitnessMeasurement', {
    url: '/fitnessMeasurement',
    views: {
      'side-menu21': {
        templateUrl: 'templates/fitnessMeasurement.html',
        controller: 'fitnessMeasurementCtrl'
      }
    },
    params: {
      goal: null,
      gender: null,
      intensity: null,
      weight: null,
      age: null,
      isNewStart: null,
      exercise:null

    }
  })

  .state('healthCare360X.nutrition', {
      url: '/page6',
      views: {
        'side-menu21': {
          templateUrl: 'templates/nutrition.html',
          controller: 'nutritionCtrl'
        }
      }
    })
    .state('healthCare360X.nutritionHistory', {
      url: '/nutritionHistory',
      views: {
        'side-menu21': {
          templateUrl: 'templates/nutritionHistory.html',
          controller: 'nutritionHistoryCtrl'
        }
      }
    })
    .state('healthCare360X.nutritionGraph', {
      url: '/nutritionGraph',
      views: {
        'side-menu21': {
          templateUrl: 'templates/nutritionGraph.html',
          controller: 'nutritionGraphCtrl'
        }
      }
    })

  .state('healthCare360X.events', {
    url: '/page7',
    views: {
      'side-menu21': {
        templateUrl: 'templates/events.html',
        controller: 'eventsCtrl'
      }
    }
  })

  .state('healthCare360X.addEvent', {
    url: '/addNewEvent',
    views: {
      'side-menu21': {
        templateUrl: 'templates/addEvent.html',
        controller: 'addEventCtrl'
      }
    }
  })

  .state('healthCare360X.eventList', {
    url: '/eventList',
    views: {
      'side-menu21': {
        templateUrl: 'templates/eventsList.html',
        controller: 'eventListCtrl'
      }
    }
  })

  .state('healthCare360X.messageDetail', {
    url: '/messageDetail',
    views: {
      'side-menu21': {
        templateUrl: 'templates/messageDetail.html',
        controller: 'messageDetailCtrl'
      }
    },
    params: {
      chatDetail: null
    }
  })

  .state('healthCare360X.compose', {
    url: '/compose',
    views: {
      'side-menu21': {
        templateUrl: 'templates/composeMessage.html',
        controller: 'composeMessageCtrl'
      }
    }
  })

  .state('healthCare360X.messages', {
    url: '/messages',
    views: {
      'side-menu21': {
        templateUrl: 'templates/messages.html',
        controller: 'messagesCtrl'
      }
    }
  })

  .state('healthCare360X.newEvent', {
    url: '/page8',
    views: {
      'side-menu21': {
        templateUrl: 'templates/newEvent.html',
        controller: 'newEventCtrl'
      }
    }
  })

  .state('healthCare360X.devices', {
    url: '/page9',
    views: {
      'side-menu21': {
        templateUrl: 'templates/devices.html',
        controller: 'devicesCtrl'
      }
    }
  })

  .state('healthCare360X.doctorsList', {
    url: '/page10',
    views: {
      'side-menu21': {
        templateUrl: 'templates/doctorsList.html',
        controller: 'doctorsListCtrl'
      }
    }
  })

  .state('healthCare360X.deviceList', {
    url: '/page11',
    views: {
      'side-menu21': {
        templateUrl: 'templates/deviceList.html',
        controller: 'deviceListCtrl'
      }
    }
  })

  .state('healthCare360X.coachList', {
    url: '/page12',
    views: {
      'side-menu21': {
        templateUrl: 'templates/coachList.html',
        controller: 'coachListCtrl'
      }
    }
  })

  .state('healthCare360X.settings', {
    url: '/page13',
    views: {
      'side-menu21': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('bloodGlucose.help', {
    url: '/page31',
    views: {
      'tab1': {
        templateUrl: 'templates/help.html',
        controller: 'helpCtrl'
      }
    }
  })

  .state('bloodGlucose.contact', {
    url: '/page32',
    views: {
      'tab2': {
        templateUrl: 'templates/contact.html',
        controller: 'contactCtrl'
      }
    }
  })

  .state('bloodGlucose.ihome', {
    url: '/page33',
    views: {
      'tab3': {
        templateUrl: 'templates/ihome.html',
        controller: 'ihomeCtrl'
      }
    }
  })

  .state('healthCare360X.sync', {
    url: '/sync',
    views: {
      'side-menu21': {
        templateUrl: 'templates/sync.html',
        controller: 'syncCtrl'
      }
    }
  })


  if (localStorage.getItem("userFirstName") == null || localStorage.getItem("userFirstName") == "")
    $urlRouterProvider.otherwise('/login')
  else
    $urlRouterProvider.otherwise("/side-menu21/page1")
    //$urlRouterProvider.otherwise('/side-menu21/page2')

});
