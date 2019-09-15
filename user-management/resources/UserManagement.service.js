angular.module('app').factory('UserManagementService', ['$http', function($http) {
    var svc = {};

    /**
    * Load the list of users from the reqres API.
    * @return a promise for an array of user JSON objects.
    */
    svc.getUsersList = function() {
        return $http.get('https://reqres.in/api/users')
            .then(function(response) {
                // TODO error handling
                console.log(response);
                var usersList = response.data.data;
                return usersList;
            })
    }

    /**
    * PUT the updated user to the reqres API.
    * @return a promise that returns the HTTP response when the PUT is done.
    */
    svc.updateUser = function(user) {
        var url = "https://reqres.in/api/users/" + user.id;
        return $http.put(url, user)
            .then(function(response) {
                // TODO error handling
                console.log(response);
                return response;
            })
    }

    /**
    * DELETE the user with the ID in the input param.
    * @return a promise that returns the HTTP response when the DELETE is done.
    */
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

    /**
    * POST the new user specified in the input param.
    * @return a promise that returns the HTTP response when the POST is done.
    */
    svc.createUser = function(user) {
        var url = "https://reqres.in/api/users";
        return $http.post(url, user)
            .then(function(response) {
                // TODO error handling
                console.log("create:");
                console.log(response);
                return response;
            })
    }

    return svc;
}]);
