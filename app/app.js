(function(angular, undefined) {
    "use strict";
    angular.module('dsntApp', ['ngMaterial', "ngSanitize", "ui.router"])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/tab/dash');
        $stateProvider
        .state('view1', {
            url: "/basicinfo",
            templateUrl: "partials/basicinfo.html"
        })
        .state('view2', {
            url: "/summary",
            templateUrl: "partials/summary.html"
        })
        .state('view3', {
            url: "/experiences",
            templateUrl: "partials/experiences.html"
        })
        .state('view4', {
            url: "/view4",
            templateUrl: "partials/view4.html"
        })
        .state('view5', {
            url: "/view5",
            templateUrl: "partials/view5.html"
        })
        .state('view6', {
            url: "/view6",
            templateUrl: "partials/view6.html"
        })
        .state('view7', {
            url: "/view7",
            templateUrl: "partials/view7.html"
        })
        ;
    })
    .controller('tabCtrl', function($scope, $location, $log, $mdToast) {
        $scope.selectedIndex = 0;

        $scope.$watch('selectedIndex', function(current, old) {
            switch (current) {
                case 0:
                    $location.url("/basicinfo");
                    break;
                case 1:
                    $location.url("/summary");
                    break;
                case 2:
                    $location.url("/experiences");
                    break;
                case 3:
                    $location.url("/view4");
                    break;
                case 4:
                    $location.url("/view5");
                    break;
                case 5:
                    $location.url("/view6");
                    break;
                case 6:
                    $location.url("/view7");
                    break;
            }
        });

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
          };

        $scope.toastPosition = angular.extend({},last);

        $scope.getToastPosition = function() {
          sanitizePosition();

          return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };

        function sanitizePosition() {
          var current = $scope.toastPosition;

          if ( current.bottom && last.top ) current.top = false;
          if ( current.top && last.bottom ) current.bottom = false;
          if ( current.right && last.left ) current.left = false;
          if ( current.left && last.right ) current.right = false;

          last = angular.extend({},current);
        }

        if(localStorage.getItem('basicInfoObject')!==null){
          var retrievedObject = localStorage.getItem('basicInfoObject');
          let basicInfoObject =  JSON.parse(retrievedObject);

          $scope.fullname = basicInfoObject.fullname;
          $scope.email = basicInfoObject.email;
          $scope.phonenumber = basicInfoObject.phonenumber;
          $scope.website = basicInfoObject.website;
        }

        if(localStorage.getItem('biographyObject')!==null){
          var retrievedObject = localStorage.getItem('biographyObject');
          let biographyObject =  JSON.parse(retrievedObject);

          $scope.biography = biographyObject.biography;
        }

        $scope.saveBasicInfo = function() {
          var fullname = this.fullname;
          var email = this.email;
          var phonenumber = this.phonenumber;
          var website = this.website;

          var basicInfoObject = { 'fullname': fullname, 'email': email, 'phonenumber': phonenumber, 'website': website };

          // Put the object into storage
          localStorage.setItem('basicInfoObject', JSON.stringify(basicInfoObject));
          this.showSimpleToast();
        }

        $scope.saveSummery = function(){
          var biography = this.biography;

          var biographyObject = {'biography': biography};

          localStorage.setItem('biographyObject', JSON.stringify(biographyObject));
          this.showSimpleToast();
        }

        $scope.showSimpleToast = function() {
          var pinTo = $scope.getToastPosition();

          $mdToast.show(
            $mdToast.simple()
              .textContent('Saved.')
              .position(pinTo )
              .hideDelay(3000)
          );
        };
    })
    .controller('experienceCtrl', function($scope, $location, $log, $mdToast) {
      var experienceList = this;
      experienceList.experiences = [];

      if(JSON.parse(localStorage.getItem('addExperienceObject'))){
        var resolveAddExperienceObject = JSON.parse(localStorage.getItem('addExperienceObject'));
        for(var i = 0; i < resolveAddExperienceObject.length; i++) {
            var obj = resolveAddExperienceObject[i];

            experienceList.experiences.push({companyname: obj.companyname, time_period: obj.time_period, role_company: obj.role_company});
            //console.log(obj.id);
        }
      }

      experienceList.addExperience = function(){
        experienceList.experiences.push({companyname: experienceList.companyname, time_period: experienceList.time_period, role_company: experienceList.role_company});

        var addExperienceObject = JSON.parse(localStorage.getItem('addExperienceObject')) || [];
        var addExperienceNewItem = { 'companyname': experienceList.companyname, 'time_period': experienceList.time_period, 'role_company': experienceList.role_company};

        addExperienceObject.push(addExperienceNewItem);
        localStorage.setItem('addExperienceObject', JSON.stringify(addExperienceObject));
      }

      experienceList.removeExperience = function(experience) {
        var _index = experienceList.experiences.indexOf(experience);
        experienceList.experiences.splice(_index, 1);
      }

      experienceList.bindSelectedData = function(experience) {
        experienceList.companyname = experience.companyname;
        experienceList.time_period = experience.time_period;
        experienceList.role_company = experience.role_company;
      }
    });

})(angular);
