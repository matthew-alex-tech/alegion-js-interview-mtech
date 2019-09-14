angular.module('app').factory('UserManagementService', ['$http', function($http) {
    var svc = {};

    svc.usersList = [];
    svc.getUsersList = function() {
        return $http.get('https://reqres.in/api/users')
            .then(function(response) {
                // TODO error handling
                console.log(response);
                svc.usersList = response.data.data;
                return svc.usersList;
            })
    }

    svc.updateUser = function(user) {
        var url = "https://reqres.in/api/users/" + user.id;
        return $http.post(url, user)
            .then(function(response) {
                // TODO error handling
                console.log(response);
                return response;
            })
    }

    svc.deleteUser = function(user) {
        var url = "https://reqres.in/api/users/" + user.id;
        return $http.delete(url)
            .then(function(response) {
                // TODO error handling
                console.log("delete:");
                console.log(response);
                return response;
            })
    }

    return svc;
}]);
