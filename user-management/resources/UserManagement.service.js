angular.module('app').factory('UserManagementService', ['$http', function($http) {
    var svc = {};

    svc.usersList = [];
    svc.getUsersList = function() {
        return $http.get('https://reqres.in/api/users')
            .then(function(response) {
                svc.usersList = response.data.data;
                return svc.usersList;
            })
    }

    return svc;
}]);
