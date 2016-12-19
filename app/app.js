(function(angular, undefined) {
    "use strict";
    angular.module('dsntApp', ['ngMaterial', "ngSanitize", "ui.router"])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/tab/dash');
        $stateProvider
        .state('view2', {
            url: "/summary",
            templateUrl: "partials/summary.html"
        })
        .state('view1', {
            url: "/basicinfo",
            templateUrl: "partials/basicinfo.html"
        })
        .state('view3', {
            url: "/experiences",
            templateUrl: "partials/experiences.html"
        })
        .state('view4', {
            url: "/projects",
            templateUrl: "partials/projects.html"
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
                    $location.url("/summary");
                    break;
                case 1:
                    $location.url("/basicinfo");
                    break;
                case 2:
                    $location.url("/experiences");
                    break;
                case 3:
                    $location.url("/projects");
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

            experienceList.experiences.push({id: obj.id, companyname: obj.companyname, time_period: obj.time_period, role_company: obj.role_company});
            //console.log(obj.id);
        }
      }

      experienceList.addExperience = function(){
        var expId = guid();
        if(experienceList.id!=undefined){
          let addExperienceObject = JSON.parse(localStorage.getItem('addExperienceObject'));
          for (i=0;i<addExperienceObject.length;i++){
            if (addExperienceObject[i].id == experienceList.id) {
              addExperienceObject[i].companyname = experienceList.companyname;
              addExperienceObject[i].time_period = experienceList.time_period;
              addExperienceObject[i].role_company = experienceList.role_company;
            }
          }
          localStorage.setItem('addExperienceObject', JSON.stringify(addExperienceObject));

          // Update the selected Experience
          angular.forEach(experienceList.experiences, function (p) {
            if (p.id == experienceList.id) {
              p.companyname = experienceList.companyname;
              p.time_period = experienceList.time_period;
              p.role_company = experienceList.role_company;
            }
          });
        }else{
          experienceList.experiences.push({id:expId, companyname: experienceList.companyname, time_period: experienceList.time_period, role_company: experienceList.role_company});

          var addExperienceObject = JSON.parse(localStorage.getItem('addExperienceObject')) || [];
          var addExperienceNewItem = {'id': expId, 'companyname': experienceList.companyname, 'time_period': experienceList.time_period, 'role_company': experienceList.role_company};

          addExperienceObject.push(addExperienceNewItem);
          localStorage.setItem('addExperienceObject', JSON.stringify(addExperienceObject));
        }
        experienceList.companyname = '';
        experienceList.time_period = '';
        experienceList.role_company = '';
        experienceList.id = '';
      }

      experienceList.removeExperience = function(experience) {
        var _index = experienceList.experiences.indexOf(experience);
        let id = experience.id;
        console.log(experience);
        experienceList.experiences.splice(_index, 1);

        let addExperienceObject = JSON.parse(localStorage.getItem('addExperienceObject'));
        for (i=0;i<addExperienceObject.length;i++)
                    if (addExperienceObject[i].id == id) addExperienceObject.splice(i,1);
        localStorage.setItem('addExperienceObject', JSON.stringify(addExperienceObject));
      }

      experienceList.bindSelectedData = function(experience) {
        experienceList.companyname = experience.companyname;
        experienceList.time_period = experience.time_period;
        experienceList.role_company = experience.role_company;
        experienceList.id = experience.id;
      }

      function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
    })
    .controller('projectsCtrl', function($scope, $location, $log, $mdToast) {
      var projectsList = this;
      projectsList.projects = [];
    });

})(angular);
