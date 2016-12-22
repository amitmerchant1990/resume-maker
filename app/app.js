(function(angular, undefined) {
    "use strict";
    var resumeApp = angular.module('resumeApp', ['ngMaterial', "ngSanitize", "ui.router"]);

    //Angular Service to provide Toast across all controller
    resumeApp.service('toastService', function ($mdToast) {
      var last = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };

      var toastPosition = angular.extend({},last);

      this.getToastPosition = function() {
        sanitizePosition();

        return Object.keys(toastPosition)
          .filter(function(pos) { return toastPosition[pos]; })
          .join(' ');
      };

      this.showSimpleToast = function() {
        var pinTo = this.getToastPosition();

        $mdToast.show(
          $mdToast.simple()
            .textContent('Saved.')
            .position(pinTo )
            .hideDelay(3000)
        );
      };

      function sanitizePosition() {
        var current = toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }
    });

    /*
    Angular Service to provide common utility functions
    across all controller
    */
    resumeApp.service('utilService', function(){
      this.guid = function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
    });

    resumeApp.config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/tab/dash');
        $stateProvider
        .state('view1', {
            url: "/home",
            templateUrl: "partials/home.html"
        })
        .state('view2', {
            url: "/summary",
            templateUrl: "partials/summary.html"
        })
        .state('view3', {
            url: "/basicinfo",
            templateUrl: "partials/basicinfo.html"
        })
        .state('view4', {
            url: "/experiences",
            templateUrl: "partials/experiences.html"
        })
        .state('view5', {
            url: "/projects",
            templateUrl: "partials/projects.html"
        })
        .state('view6', {
            url: "/education",
            templateUrl: "partials/education.html"
        })
        .state('view7', {
            url: "/skills",
            templateUrl: "partials/skills.html"
        })
        .state('view8', {
            url: "/download",
            templateUrl: "partials/download.html"
        })
        ;
    })

    resumeApp.controller('tabCtrl', function($scope, toastService, utilService, $location, $log) {
        $scope.selectedIndex = 0;

        $scope.$watch('selectedIndex', function(current, old) {
            switch (current) {
                case 0:
                    $location.url("/home");
                    break;
                case 1:
                    $location.url("/summary");
                    break;
                case 2:
                    $location.url("/basicinfo");
                    break;
                case 3:
                    $location.url("/experiences");
                    break;
                case 4:
                    $location.url("/projects");
                    break;
                case 5:
                    $location.url("/education");
                    break;
                case 6:
                    $location.url("/skills");
                    break;
                case 7:
                    $location.url("/download");
                    break;
            }
        });

        // For maintaing tab state while routing
        $scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
          let currentState = toState.name;

          if(currentState=='view1'){
            $scope.selectedIndex = 0;
          }else if(currentState=='view2'){
            $scope.selectedIndex = 1;
          }else if(currentState=='view3'){
            $scope.selectedIndex = 2;
          }else if(currentState=='view4'){
            $scope.selectedIndex = 3;
          }else if(currentState=='view5'){
            $scope.selectedIndex = 4;
          }else if(currentState=='view6'){
            $scope.selectedIndex = 5;
          }else if(currentState=='view7'){
            $scope.selectedIndex = 6;
          }else if(currentState=='view8'){
            $scope.selectedIndex = 7;
          }
        });

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
          if(this.fullname==undefined || this.email==undefined)
            return false;
          var fullname = this.fullname;
          var email = this.email;
          var phonenumber = this.phonenumber;
          var website = this.website;

          var basicInfoObject = { 'fullname': fullname, 'email': email, 'phonenumber': phonenumber, 'website': website };

          // Put the object into storage
          localStorage.setItem('basicInfoObject', JSON.stringify(basicInfoObject));

          $scope.fullname = fullname;
          $scope.email = email;
          $scope.phonenumber = phonenumber;
          $scope.website = website;

          toastService.showSimpleToast();
        }

        $scope.saveSummery = function(){
          var biography = this.biography;

          var biographyObject = {'biography': biography};

          localStorage.setItem('biographyObject', JSON.stringify(biographyObject));
          toastService.showSimpleToast();
        }
    })

    resumeApp.controller('experienceCtrl', function($scope, toastService, utilService, $location, $log) {
      var experienceList = this;
      experienceList.experiences = [];

      if(JSON.parse(localStorage.getItem('addExperienceObject'))){
        var resolveAddExperienceObject = JSON.parse(localStorage.getItem('addExperienceObject'));
        for(var i = 0; i < resolveAddExperienceObject.length; i++) {
            var obj = resolveAddExperienceObject[i];

            experienceList.experiences.push({id: obj.id, companyname: obj.companyname, time_period: obj.time_period, role_company: obj.role_company, desc: obj.desc});
            //console.log(obj.id);
        }
      }

      experienceList.addExperience = function(){
        if(experienceList.companyname==undefined
          || experienceList.time_period==undefined
          ||experienceList.role_company==undefined
          ||experienceList.desc==undefined)
          return false;

        var expId = utilService.guid();
        if(experienceList.id!=undefined && experienceList.id!=''){
          let addExperienceObject = JSON.parse(localStorage.getItem('addExperienceObject'));
          for (i=0;i<addExperienceObject.length;i++){
            if (addExperienceObject[i].id == experienceList.id) {
              addExperienceObject[i].companyname = experienceList.companyname;
              addExperienceObject[i].time_period = experienceList.time_period;
              addExperienceObject[i].role_company = experienceList.role_company;
              addExperienceObject[i].desc = experienceList.desc;
            }
          }
          localStorage.setItem('addExperienceObject', JSON.stringify(addExperienceObject));

          // Update the selected Experience
          angular.forEach(experienceList.experiences, function (p) {
            if (p.id == experienceList.id) {
              p.companyname = experienceList.companyname;
              p.time_period = experienceList.time_period;
              p.role_company = experienceList.role_company;
              p.desc = experienceList.desc;
            }
          });
        }else{
          experienceList.experiences.push({id:expId, companyname: experienceList.companyname, time_period: experienceList.time_period, role_company: experienceList.role_company, desc: experienceList.desc});

          var addExperienceObject = JSON.parse(localStorage.getItem('addExperienceObject')) || [];
          var addExperienceNewItem = {'id': expId, 'companyname': experienceList.companyname, 'time_period': experienceList.time_period, 'role_company': experienceList.role_company, 'desc': experienceList.desc};

          addExperienceObject.push(addExperienceNewItem);
          localStorage.setItem('addExperienceObject', JSON.stringify(addExperienceObject));
        }
        experienceList.companyname = '';
        experienceList.time_period = '';
        experienceList.role_company = '';
        experienceList.desc = '';
        experienceList.id = '';

        toastService.showSimpleToast();
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
        experienceList.desc = experience.desc;
        experienceList.id = experience.id;
      }
    })

    resumeApp.controller('projectsCtrl', function($scope, toastService, utilService, $location, $log) {
      var projectsList = this;
      projectsList.projects = [];

      if(JSON.parse(localStorage.getItem('addProjectObject'))){
        var resolveAddProjectObject = JSON.parse(localStorage.getItem('addProjectObject'));
        for(var i = 0; i < resolveAddProjectObject.length; i++) {
            var obj = resolveAddProjectObject[i];

            projectsList.projects.push({id: obj.id, title: obj.title, website: obj.website, desc: obj.desc});
            //console.log(obj.id);
        }
      }

      projectsList.addProject = function(){
        if(projectsList.title==undefined
          || projectsList.website==undefined
          ||projectsList.desc==undefined)
          return false;

        var projectId = utilService.guid();
        if(projectsList.id!=undefined && projectsList.id!=''){
          let addProjectObject = JSON.parse(localStorage.getItem('addProjectObject'));
          for (i=0;i<addProjectObject.length;i++){
            if (addProjectObject[i].id == projectsList.id) {
              addProjectObject[i].title = projectsList.title;
              addProjectObject[i].website = projectsList.website;
              addProjectObject[i].desc = projectsList.desc;
            }
          }
          localStorage.setItem('addProjectObject', JSON.stringify(addProjectObject));

          // Update the selected Project
          angular.forEach(projectsList.projects, function (p) {
            if (p.id == projectsList.id) {
              p.title = projectsList.title;
              p.website = projectsList.website;
              p.desc = projectsList.desc;
            }
          });
        }else{
          projectsList.projects.push({id:projectId, title: projectsList.title, website: projectsList.website, desc: projectsList.desc});

          var addProjectObject = JSON.parse(localStorage.getItem('addProjectObject')) || [];
          var addProjectNewItem = {'id': projectId, 'title': projectsList.title, 'website': projectsList.website, 'desc': projectsList.desc};

          addProjectObject.push(addProjectNewItem);
          localStorage.setItem('addProjectObject', JSON.stringify(addProjectObject));
        }
        projectsList.title = '';
        projectsList.website = '';
        projectsList.desc = '';
        projectsList.id = '';

        toastService.showSimpleToast();
      }

      projectsList.removeProject = function(project) {
        var _index = projectsList.projects.indexOf(project);
        let id = project.id;
        console.log(project);
        projectsList.projects.splice(_index, 1);

        let addProjectObject = JSON.parse(localStorage.getItem('addProjectObject'));
        for (i=0;i<addProjectObject.length;i++)
                    if (addProjectObject[i].id == id) addProjectObject.splice(i,1);
        localStorage.setItem('addProjectObject', JSON.stringify(addProjectObject));
      }

      projectsList.bindSelectedProject = function(project) {
        projectsList.title = project.title;
        projectsList.website = project.website;
        projectsList.desc = project.desc;
        projectsList.id = project.id;
      }
    })

    resumeApp.controller('educationCtrl', function($scope, toastService, utilService, $location, $log) {
      var educationList = this;
      educationList.educations = [];

      if(JSON.parse(localStorage.getItem('addEducationObject'))){
        var resolveAddEducationObject = JSON.parse(localStorage.getItem('addEducationObject'));
        for(var i = 0; i < resolveAddEducationObject.length; i++) {
            var obj = resolveAddEducationObject[i];

            educationList.educations.push({id: obj.id, school_name: obj.school_name, degree: obj.degree, duration: obj.duration});
            //console.log(obj.id);
        }
      }

      educationList.addEducation = function(){
        if(educationList.school_name==undefined
          || educationList.degree==undefined
          ||educationList.duration==undefined)
          return false;

        var eduId = utilService.guid();
        if(educationList.id!=undefined && educationList.id!=''){
          let addEducationObject = JSON.parse(localStorage.getItem('addEducationObject'));
          for (i=0;i<addEducationObject.length;i++){
            if (addEducationObject[i].id == educationList.id) {
              addEducationObject[i].school_name = educationList.school_name;
              addEducationObject[i].degree = educationList.degree;
              addEducationObject[i].duration = educationList.duration;
            }
          }
          localStorage.setItem('addEducationObject', JSON.stringify(addEducationObject));

          // Update the selected Project
          angular.forEach(educationList.educations, function (p) {
            if (p.id == educationList.id) {
              p.school_name = educationList.school_name;
              p.degree = educationList.degree;
              p.duration = educationList.duration;
            }
          });
        }else{
          educationList.educations.push({id:eduId, school_name: educationList.school_name, degree: educationList.degree, duration: educationList.duration});

          var addEducationObject = JSON.parse(localStorage.getItem('addEducationObject')) || [];
          var addEducationNewItem = {'id': eduId, 'school_name': educationList.school_name, 'degree': educationList.degree, 'duration': educationList.duration};

          addEducationObject.push(addEducationNewItem);
          localStorage.setItem('addEducationObject', JSON.stringify(addEducationObject));
        }
        educationList.school_name = '';
        educationList.degree = '';
        educationList.duration = '';
        educationList.id = '';

        toastService.showSimpleToast();
      }

      educationList.removeEducation = function(education) {
        var _index = educationList.educations.indexOf(education);
        let id = education.id;
        //console.log(education);
        educationList.educations.splice(_index, 1);

        let addEducationObject = JSON.parse(localStorage.getItem('addEducationObject'));
        for (i=0;i<addEducationObject.length;i++)
                    if (addEducationObject[i].id == id) addEducationObject.splice(i,1);
        localStorage.setItem('addEducationObject', JSON.stringify(addEducationObject));
      }

      educationList.bindSelectedEducation = function(education) {
        educationList.school_name = education.school_name;
        educationList.degree = education.degree;
        educationList.duration = education.duration;
        educationList.id = education.id;
      }


    })

    resumeApp.controller('skillsCtrl', function($scope, toastService, utilService, $location, $log) {
      var skillsList = this;
      skillsList.skills = [];

      if(JSON.parse(localStorage.getItem('addSkillsObject'))){
        var resolveAddSkillsObject = JSON.parse(localStorage.getItem('addSkillsObject'));
        for(var i = 0; i < resolveAddSkillsObject.length; i++) {
            var obj = resolveAddSkillsObject[i];

            skillsList.skills.push({id: obj.id, name: obj.name});
            //console.log(obj.id);
        }
      }

      skillsList.addSkill = function(){
        console.log(skillsList.name);
        if(skillsList.name==undefined)
          return false;

        var skillId = utilService.guid();
        console.log(skillsList.id);
        if(skillsList.id!=undefined && skillsList.id!=''){
          let addSkillsObject = JSON.parse(localStorage.getItem('addSkillsObject'));
          for (i=0;i<addSkillsObject.length;i++){
            if (addSkillsObject[i].id == skillsList.id) {
              addSkillsObject[i].name = skillsList.name;
            }
          }
          localStorage.setItem('addSkillsObject', JSON.stringify(addSkillsObject));

          // Update the selected Project
          angular.forEach(skillsList.skills, function (p) {
            if (p.id == skillsList.id) {
              p.name = skillsList.name;
            }
          });
        }else{
          console.log('here');
          skillsList.skills.push({id:skillId, name: skillsList.name});

          var addSkillsObject = JSON.parse(localStorage.getItem('addSkillsObject')) || [];
          var addSkillNewItem = {'id': skillId, 'name': skillsList.name};

          addSkillsObject.push(addSkillNewItem);
          localStorage.setItem('addSkillsObject', JSON.stringify(addSkillsObject));
        }
        skillsList.name = '';
        skillsList.id = '';

        toastService.showSimpleToast();
      }

      skillsList.removeSkill = function(skill) {
        var _index = skillsList.skills.indexOf(skill);
        let id = skill.id;
        //console.log(education);
        skillsList.skills.splice(_index, 1);

        let addSkillsObject = JSON.parse(localStorage.getItem('addSkillsObject'));
        for (i=0;i<addSkillsObject.length;i++)
                    if (addSkillsObject[i].id == id) addSkillsObject.splice(i,1);
        localStorage.setItem('addSkillsObject', JSON.stringify(addSkillsObject));
      }

      skillsList.bindSelectedSkill = function(skill) {
        skillsList.name = skill.name;
        skillsList.id = skill.id;
      }

    })

    resumeApp.controller('downloadCtrl', function($scope, $location, $log, $mdToast) {
      var downloadList = this;
      downloadList.elem = [];
      downloadList.skill = [];

      $scope.resumeSelection = 'Resume1';

      if(localStorage.getItem('basicInfoObject')!==null){
        let retrievedObject = localStorage.getItem('basicInfoObject');
        let basicInfoObject =  JSON.parse(retrievedObject);

        downloadList.fullname = basicInfoObject.fullname;
        downloadList.email = basicInfoObject.email;
        downloadList.phonenumber = basicInfoObject.phonenumber;
        downloadList.website = basicInfoObject.website;
      }

      if(localStorage.getItem('biographyObject')!==null){
        let retrievedObject = localStorage.getItem('biographyObject');
        let biographyObject =  JSON.parse(retrievedObject);
        downloadList.summary = biographyObject.biography;
      }

      if(localStorage.getItem('addExperienceObject')!==null){
        let retrievedObject = localStorage.getItem('addExperienceObject');
        downloadList.elem = JSON.parse(retrievedObject);
      }

      if(localStorage.getItem('addProjectObject')!==null){
        let retrievedObject = localStorage.getItem('addProjectObject');
        downloadList.projects = JSON.parse(retrievedObject);
      }

      if(localStorage.getItem('addSkillsObject')!==null){
        let retrievedObject = localStorage.getItem('addSkillsObject');
        downloadList.skill = JSON.parse(retrievedObject);
      }

      if(localStorage.getItem('addEducationObject')!==null){
        let retrievedObject = localStorage.getItem('addEducationObject');
        downloadList.education = JSON.parse(retrievedObject);
      }
    });

})(angular);
