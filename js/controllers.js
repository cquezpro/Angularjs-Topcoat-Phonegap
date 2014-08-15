'use strict';

angular.module('myApp.controllers', [])
    .controller('MainCtrl', ['$scope', '$rootScope',  '$window', '$location', function ($scope, $rootScope, $window, $location) {
	
        $scope.slide = '';
        $rootScope.back = function() {
          //$scope.slide = 'slide-right';
		  //$rootScope.temp = $rootScope.title;
		  //$rootScope.title = $rootScope.previousTitle;
		  //$rootScope.previousTitle = $rootScope.temp;		  
		  //$window.history.back();
        }
		
        $rootScope.go = function(path){
          $scope.slide = 'slide-left';
          $location.url(path);
        }
		
		
		$rootScope.baseUrl = 'https://www.forerunner.cc/test/services/';
		$rootScope.baseImageUrl = 'https://www.forerunner.cc/assets/images/forerunner/';
		$rootScope.loginAPI = 'login.php';
		$rootScope.getDataAPI = 'getData.php';
		
		/* Begin : Global Variables */
			$rootScope.userToken = '';
			
			$rootScope.bBack = false;
			$rootScope.bBackShow = false;
			$rootScope.title = '';
			$rootScope.previousTitle = '';
			$rootScope.zonelist = [];
			$rootScope.homegrouplist = [];
			$rootScope.familygroup = [];
			$rootScope.family = [];
			$rootScope.member = {};
			
			//Google map
	
			$rootScope.address = "";
			$rootScope.Latitude = 47;
			$rootScope.Longitude = -122;
			
			$rootScope.markClick = false;// the zoom level
			$rootScope.zoom = 13;//the zoom level
			$rootScope.fit = true;
			
			
			$rootScope.userLoggedIn = false;
			
			$rootScope.isUserLoggedIn = function(){
				return $rootScope.userLoggedIn;
				//return ($rootScope.userToken == '') ? false : true;
			}

        	$rootScope.showAlert = function(msg) {
                	navigator.notification.confirm(
            		   msg, // message
            		   $rootScope.OnConfirm,            // callback to invoke with index of button pressed
            		   "慕主先鋒教會",           // title
            		   'OK'         // buttonLabels
            		);        		
			}
        	$rootScope.OnConfirm = function() {
                	return ;
			}
        
			$rootScope.logout = function(){
				//alert("logout");
				$rootScope.gotoHomePage();
				return;
				if (!$rootScope.isUserLoggedIn()) return;
				
				$http({ method: 'POST', url: $rootScope.baseUrl + "/logout", params: {'token': $rootScope.userToken} }).
				success(function (data, status, headers, config){
					
					if (data.code == undefined) {
						$rootScope.showAlert("Logout error");
						return;
					}
					
					$rootScope.setUserToken('');
					
					$rootScope.gotoLoginPage();								
				});
			}
			
			$rootScope.setUserToken = function($token){
				$rootScope.userToken = $token;
				
				/*if ($token != NULL)
					$rootScope.userLoggedIn = true;
				else
					$rootScope.userLoggedIn = false;
				*/
			}
			
			/* Begin : Location Management */
			
			$rootScope.pathList = {
				rootPath : "/login",
				zonesPath : "/zones",
				groupsPath : "/homegroups",
				familyGroupPath : "/familygroup",
				familyPath : "/family",
				memberProfilePath : "/member"
			};			
			
			$rootScope.prevPath = "/";
			$rootScope.currentPath = "/";
			
			$rootScope.$on('$locationChangeSuccess', function(angularEvent, newUrl, oldUrl){
			
				$rootScope.prevPath = $rootScope.currentPath;
				$rootScope.currentPath = $location.path();
				
				if ($rootScope.currentPath == $rootScope.pathList.rootPath)
					$rootScope.currentPageTitle = "Login";
					
				if ($rootScope.currentPath == $rootScope.pathList.zonesPath)
					$rootScope.currentPageTitle = "Zones";
					
				else if ($rootScope.currentPath == $rootScope.pathList.groupsPath)
					$rootScope.currentPageTitle = "HomeGroups";
					
				else if ($rootScope.currentPath == $rootScope.pathList.familyGroupPath)
					$rootScope.currentPageTitle = "FamilyGroup";
					
				else if ($rootScope.currentPath == $rootScope.pathList.familyPath)
					$rootScope.currentPageTitle = "Family";
					
				else if ($rootScope.currentPath == $rootScope.pathList.memberProfilePath)
					$rootScope.currentPageTitle = "MemberProfie";
			});
			
			$rootScope.gotoHomePage = function(){
				$rootScope.gotoPage($rootScope.pathList.rootPath);
			}
			
			$rootScope.gotoZonesPage = function(){
				$rootScope.gotoPage($rootScope.pathList.zonesPath);
				
			}
			
			$rootScope.gotoHomeGroupsPage = function(){
				$rootScope.gotoPage($rootScope.pathList.groupsPath);
			}
			
			$rootScope.gotoFamilyGroupPage = function(){
				$rootScope.gotoPage($rootScope.pathList.familyGroupPath);
			}
			
			$rootScope.gotoFamilyPage = function(){
				$rootScope.gotoPage($rootScope.pathList.familyPath);
			}
			
			$rootScope.gotoMemberPage = function(){
				$rootScope.gotoPage($rootScope.pathList.memberProfilePath);
			}
			
			$rootScope.gotoPage = function(path){
				$scope.slide = 'slide-left';
				$location.path(path);
			}
			
			$rootScope.gotoBack = function($path){
				$location.path($rootScope.prevPath);
			}
		
    }])
	.controller('LoginCtrl', ['$scope', '$rootScope', '$window', '$http', function($scope, $rootScope, $window, $http) {
		$scope.login = function () {
			if ($scope.username == '' || $scope.username == undefined) {
    			$rootScope.showAlert("Please enter login username.");
        		
    			return;
    		}
    		
    		if ($scope.password == '' || $scope.password == undefined){
    			$rootScope.showAlert("Please enter login password.");
                
    			return;
    		}
			
			$http({ method: 'GET', url: $rootScope.baseUrl + $rootScope.loginAPI, params: {'u': $scope.username, 'p' : $scope.password} }).
    			success(function (data, status, headers, config){
    				
    				if (data[0].token == "NULL" || data[0].token == undefined) {
    					$rootScope.showAlert("Login error");
    					return;
    				}
    				
    				$rootScope.setUserToken(data[0].token);
    				//$rootScope.gotoZonesPage();  

					//After get token, should call to get the member role.
					$http({ method: 'GET', url: $rootScope.baseUrl + $rootScope.getDataAPI, params: {'token': data[0].token} }).
						success(function (data, status, headers, config){
							//alert(data);
							switch(data.role) {
								case 'pastor':
									$rootScope.zonelist = data.data;
									$rootScope.gotoZonesPage();
									break;
								case 'zoneleader':
									$rootScope.bBackShow = 	false;
									$rootScope.title = data.title;
									$rootScope.homegrouplist = data.data;
									$rootScope.gotoHomeGroupsPage();
									break;
								case 'arealeader':
									$rootScope.bBackShow = 	false;
									$rootScope.title = data.title;
									$rootScope.familygroup = data.data;
									$rootScope.gotoFamilyGroupPage();
									break;
								case 'familyleader':
									$rootScope.bBackShow = 	false;
									$rootScope.title = data.title;
									$rootScope.family = data.data;
									$rootScope.gotoFamilyPage();
									break;
								case 'member':
									$rootScope.title = data.title;
									$rootScope.member = data.data[0];
									$rootScope.gotoMemberPage();
									break;
								default:
									break;
							}
						}).error(function(data, status, headers, config){
							$rootScope.showAlert("Login error");    			
						});
					//    				
    			}).error(function(data, status, headers, config){
    				$rootScope.showAlert("Login error");    			
    		});
		}
	}])
	.controller('ZonesCtrl', ['$scope', '$rootScope', '$window', '$http', function ($scope, $rootScope, $windows, $http) {
		$scope.id = 0;
		$scope.title  = "Zones";
		$scope.previousTitle  = "";
		
        $scope.showHomeGroups = function(idx) {
			$scope.id = $scope.zonelist[idx].id;
			$rootScope.previousTitle = $scope.title;
			
			$http({ method: 'GET', url: $rootScope.baseUrl + $rootScope.getDataAPI, params: {'token':$rootScope.userToken, 'zoneid': $scope.id} }).
				success(function (data, status, headers, config){
					$rootScope.bBackShow = 	true;
					$rootScope.bBack = false;
					$rootScope.title = data[0].title;
					console.log($rootScope.title);
					console.log($rootScope.previousTitle);
					$rootScope.homegrouplist = data[0].data;
					$rootScope.gotoHomeGroupsPage();
				}).error(function(data, status, headers, config){
					$rootScope.showAlert("get error");     			
				});
		}
		 
		 /*$scope.back = function() {
          $scope.slide = 'slide-right';
		  $rootScope.title = $rootScope.previousTitle;
		  $rootScope.bBack = true;	
		  $window.history.back();
        }*/
    }])
	.controller('GroupsCtrl', ['$scope', '$rootScope', '$window', '$http', function ($scope, $rootScope, $window, $http) {
		if( $rootScope.bBack == false) {
			$scope.title  = $rootScope.title;
			$scope.previousTitle = "Zones";
			console.log($scope.title);
			console.log($scope.previousTitle);
			window.localStorage.setItem("title1", $scope.title);
			window.localStorage.setItem("prevtitle1", $scope.previousTitle);
		}else{
			$scope.title  = window.localStorage.getItem("title1");
			$scope.previousTitle = window.localStorage.getItem("prevtitle1");
		}		
		
        $scope.showFamilyGroup = function(idx) {
			$scope.id = $scope.homegrouplist[idx].id;
			$rootScope.previousTitle = $scope.title;			
			
			$http({ method: 'GET', url: $rootScope.baseUrl + $rootScope.getDataAPI, params: {'token':$rootScope.userToken, 'areaid': $scope.id} }).
				success(function (data, status, headers, config){
					$rootScope.bBackShow = 	true;
					$rootScope.bBack = false;
					$rootScope.title = data[0].title;
					
					$rootScope.familygroup = data[0].data;
					$rootScope.gotoFamilyGroupPage();
				}).error(function(data, status, headers, config){
					$rootScope.showAlert("get error");    			
				});
		};
		
		$scope.back = function() {
          $scope.slide = 'slide-right';
		  $rootScope.title = $rootScope.previousTitle;
		  /*$rootScope.previousTitle = $scope.previousTitle;		*/
		  $rootScope.bBack = true;			  
		  $window.history.back();
        };
		
		
    }])
	.controller('FamilyGroupCtrl', ['$scope', '$rootScope', '$window', '$http', function ($scope, $rootScope, $window,$http) {
		if( $rootScope.bBack == false) {
			$scope.title = $rootScope.title;
			$scope.previousTitle = $rootScope.previousTitle;
			window.localStorage.setItem("title2", $scope.title);
			window.localStorage.setItem("prevtitle2", $scope.previousTitle);
			console.log($scope.title);
			console.log($scope.previousTitle);
		}else{
			$scope.title  = window.localStorage.getItem("title2");
			$scope.previousTitle = window.localStorage.getItem("prevtitle2");
		}	
		
        $scope.showFamily = function(idx) {
			$scope.id = $scope.familygroup[idx].id;
			$rootScope.previousTitle = $scope.title;
			
			$http({ method: 'GET', url: $rootScope.baseUrl + $rootScope.getDataAPI, params: {'token':$rootScope.userToken, 'familyid': $scope.id} }).
				success(function (data, status, headers, config){
					$rootScope.bBack = false;
					$rootScope.bBackShow = 	true;
					$rootScope.title = data.title;
 	
					$rootScope.family = data.data;
					$rootScope.gotoFamilyPage();
				}).error(function(data, status, headers, config){
					$rootScope.showAlert("get error");     			
				});
		};  

		$scope.back = function() {
          $scope.slide = 'slide-right';
		  $rootScope.title = $rootScope.previousTitle;
		 /* $rootScope.previousTitle = $scope.previousTitle;		  */
		  $rootScope.bBack = true;	
		  $window.history.back();
        };
    }])
	.controller('FamilyCtrl', ['$scope', '$rootScope', '$window', '$http', function ($scope, $rootScope, $window, $http) {
		if( $rootScope.bBack == false) {
			$scope.title = $rootScope.title;
			$scope.previousTitle = $rootScope.previousTitle;
			window.localStorage.setItem("title3", $scope.title);
			window.localStorage.setItem("prevtitle3", $scope.previousTitle);
			console.log($scope.title);
			console.log($scope.previousTitle);
		}else{
			$scope.title  = window.localStorage.getItem("title3");
			$scope.previousTitle = window.localStorage.getItem("prevtitle3");
		}
		
        $scope.showMember = function(member) {
			$rootScope.bBack = false;
			$rootScope.previousTitle = $scope.title;
			$rootScope.title = member.cname;
			
			$rootScope.bBackShow = 	true;
			$rootScope.member = member;
			$rootScope.gotoMemberPage();
		};
		
		$scope.back = function() {
          $scope.slide = 'slide-right';
		  $rootScope.title = $rootScope.previousTitle;
		  /*$rootScope.previousTitle = $scope.previousTitle;*/
		  $rootScope.bBack = true;		  
		  $window.history.back();
        };
    }])
    .controller('MemberCtrl', ['$scope', '$rootScope', '$window', '$http', function ($scope, $rootScope, $window, $http) {
		$rootScope.address = $rootScope.member.street + ' ' + $rootScope.member.zip + ' ' + $rootScope.member.state + ' ' + $rootScope.member.city;
		$rootScope.geoUrl = 'http://maps.google.com/maps/api/geocode/json?address=' + $rootScope.address + '&sensor=false';
		
		
		$http({ method: 'GET', url: $rootScope.geoUrl, params :{} }).
				success(function (data, status, headers, config){
					$rootScope.Latitude = data.results[0].geometry.location.lat;
					$rootScope.Longitude = data.results[0].geometry.location.lng;
		
					$rootScope.mapOptions = {
						zoom: 10,
						center: new google.maps.LatLng($rootScope.Latitude, $rootScope.Longitude),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					}		
					
					$rootScope.map = new google.maps.Map(document.getElementById('map'), $rootScope.mapOptions);
					
					var marker = new google.maps.Marker({
						map: $rootScope.map,
						position: new google.maps.LatLng($rootScope.Latitude, $rootScope.Longitude)
					});
				}).error(function(data, status, headers, config){
					$rootScope.showAlert("get location error");    			
		});
		
		$scope.sendMail = function() {
			window.plugin.email.open({
				to:      [$rootScope.member.email],
				cc:      [],
				bcc:     [],
				subject: 'Greetings',
				body:    ''
			});
		}			
		$scope.back = function() {
          $scope.slide = 'slide-right';
			 $rootScope.title = $rootScope.previousTitle;
		/*	$rootScope.previousTitle = $scope.previousTitle;*/
  		  $rootScope.bBack = true;
		  $window.history.back();
        };
		//$("#emergency .service-num a").attr("href", "tel:"+str);		
    }])

	
	