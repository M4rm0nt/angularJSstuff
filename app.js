// app.js
angular.module('accessRequestApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'form1.html',
                controller: 'Form1Controller'
            })
            .when('/form2', {
                templateUrl: 'form2.html',
                controller: 'Form2Controller'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .controller('Form1Controller', ['$scope', '$location', 'AccessRequestService', function($scope, $location, AccessRequestService) {
        $scope.request = AccessRequestService.getRequest();
        $scope.securityLevels = AccessRequestService.getSecurityLevels();

        $scope.goToForm2 = function() {
            AccessRequestService.setRequest($scope.request);
            $location.path('/form2');
        };
    }])
    .controller('Form2Controller', ['$scope', '$location', 'AccessRequestService', function($scope, $location, AccessRequestService) {
        $scope.request = AccessRequestService.getRequest();

        $scope.goBackToForm1 = function() {
            $location.path('/');
        };

        $scope.submitRequest = function() {
            AccessRequestService.submitRequest($scope.request)
                .then(function(response) {
                    console.log('Access Request submitted successfully:', response);
                    // Hier können Sie weitere Aktionen nach erfolgreicher Übermittlung durchführen
                })
                .catch(function(error) {
                    console.error('Error submitting Access Request:', error);
                    // Hier können Sie Fehlerbehandlung durchführen
                });
        };
    }])
    .factory('AccessRequestService', ['$http', function($http) {
        var request = {
            employeeName: '',
            applicant: '',
            releaseDate: null,
            description: '',
            keyAccess: false,
            chipAccess: false,
            securityLevel: '',
            securityLevelRating: '',
            department: '',
            position: ''
        };

        var securityLevels = [
            { value: '0', label: 'Stufe 0' },
            { value: '1', label: 'Stufe 1' },
            { value: '2', label: 'Stufe 2' },
            { value: '3', label: 'Stufe 3' }
        ];

        return {
            getRequest: function() {
                return request;
            },
            setRequest: function(updatedRequest) {
                request = updatedRequest;
            },
            getSecurityLevels: function() {
                return securityLevels;
            },
            submitRequest: function(requestData) {
                return $http.post('/api/access-requests', requestData)
                    .then(function(response) {
                        return response.data;
                    });
            }
        };
    }]);