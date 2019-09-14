angular.module('app').controller('UserManagementController', ['$scope', 'UserManagementService', function ($scope, UserManagementService) {

    /////////////////////////////////////////////////////////////////////////
    // load the list of users first
    /////////////////////////////////////////////////////////////////////////
    $scope.usersList = [];
    $scope.loadUsersList = function() {
        return UserManagementService.getUsersList().then(function(response){
            console.log(response);
            for (var i=0; i < response.length; i++) {
                var user = response[i];
                user.nameOrig = user.first_name + " " + user.last_name;
                user.nameEdit = user.first_name + " " + user.last_name;
                user.emailEdit = user.email;
            }
            $scope.usersList = response;
            return response;
        });
    }
    $scope.loadUsersList();

    /////////////////////////////////////////////////////////////////////////
    // functions for editing the user
    /////////////////////////////////////////////////////////////////////////
    $scope.inEditMode = false;
    $scope.userInEdit = {};

    $scope.editUser = function(user) {
        $scope.inEditMode = true;
        $scope.userInEdit = user;
    }

    $scope.disableAcceptEdit = function(user) {
        return user.nameEdit===user.nameOrig && user.emailEdit===user.email;
    }

    $scope.acceptEdit = function(user) {
        $scope.inEditMode = false;
        $scope.userInEdit = {};
        // TODO call service
        console.log("TODO call edit service");
        // only on success
        user.nameOrig = user.nameEdit;
        user.email = user.emailEdit;
    }

    $scope.cancelEdit = function(user) {
        $scope.inEditMode = false;
        $scope.userInEdit = {};
        // revert edit values to original
        user.nameEdit = user.nameOrig;
        user.emailEdit = user.email;
    }

    /////////////////////////////////////////////////////////////////////////
    // functions for deleting the user
    /////////////////////////////////////////////////////////////////////////
    $scope.deleteUser = function(user) {
        // TODO open confirmation dialog

        // TODO call service
        console.log("TODO call delete service");

        // on success
        $scope.loadUsersList();
    }

    /////////////////////////////////////////////////////////////////////////
    // functions for adding a new user
    /////////////////////////////////////////////////////////////////////////
    $scope.addUser = function() {
        // TODO open dialog
        console.log("TODO open dialog");
        console.log("TODO add service");

        // on success
        $scope.loadUsersList();
    }

}]);
