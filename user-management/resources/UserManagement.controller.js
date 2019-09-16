angular.module('app').controller('UserManagementController',
        ['$scope', 'UserManagementService', '$uibModal',
        function ($scope, UserManagementService, $uibModal) {

    $scope.usersList = []; // the current list of users
    $scope.inEditMode = false; // true if the UI is currently editing a user name or email
    $scope.userInEdit = {}; // the user being edited
    $scope.userInDelete = {}; // the user being deleted
    $scope.modalInstance = {};
    $scope.createUser = {
        name: "",
        email: ""
    };

    /**
    * Load the initial list of users from the service.
    * @return a promise for the list of users.
    */
    $scope.loadUsersList = function() {
        // return a promise so the unit test knows when the data is available
        return UserManagementService.getUsersList().then(function(response){
            // add fields to the JSON for a combined name, edited name, and edited email
            // the edited fields allow a variable to store edits, so the original fields aren't
            // overriden. edits can be canceled.
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

    // call the function to load the initial list of users from the service
    $scope.loadUsersList();

    /**
    * Event when the edit button for the specified user is clicked.
    * Sets edit mode to true, so that other edit and delete buttons can't be pressed.
    * Sets the userInEdit so that the name and email fields for the user become editable input fields.
    */
    $scope.editUserClick = function(user) {
        $scope.inEditMode = true;
        $scope.userInEdit = user;
    }

    /**
    * @return true if the accept edit check button should be disabled (if the name and email have not been changed),
    * return false if the check button should be enabled (changes have been made).
    */
    $scope.disableAcceptEdit = function(user) {
        return user.nameEdit===user.nameOrig && user.emailEdit===user.email;
    }

    /**
    * @return the index of userToFind in usersList, or -1 if the userToFind is not in the usersList.
    */
    $scope.getIndexOfUser = function(userToFind) {
        var indexToReturn = -1;
        for (var i=0; i < $scope.usersList.length; i++) {
            var user = $scope.usersList[i];
            if (user.id === userToFind.id) {
                indexToReturn = i;
                break;
            }
        }
        return indexToReturn;
    }

    /**
    * Event when the accept edit check button for the specified user is clicked.
    */
    $scope.acceptEditClick = function(user) {
        // turn off edit mode
        $scope.inEditMode = false;
        $scope.userInEdit = {};
        // make a copy of the user before the user, in case the update fails
        var userCopy = JSON.parse(JSON.stringify(user));
        // update the base name and email to the edited values
        user.nameOrig = user.nameEdit;
        user.email = user.emailEdit;
        // call service
        var index = $scope.getIndexOfUser(user, $scope.usersList);
        return UserManagementService.updateUser(user).then(
            function successCallback(response){
                // replace the user with the updated user
                $scope.usersList[index] = response;
                return response;
            }, function errorCallback(response){
                // revert the user
                $scope.usersList[index] = userCopy;
                return response;
            }
        );
    }

    /**
    * Event when the cancel edit close button for the specified user is clicked.
    */
    $scope.cancelEditClick = function(user) {
        // turn off edit mode
        $scope.inEditMode = false;
        $scope.userInEdit = {};
        // revert edit values to original
        user.nameEdit = user.nameOrig;
        user.emailEdit = user.email;
    }

    $scope.clearDeleteDialogVariables = function() {
        $scope.userInDelete = {};
    }

    /**
    * Event when the delete button for the specified user is clicked.
    */
    $scope.deleteUserClick = function(user) {
        $scope.userInDelete = user;

        // open confirmation dialog
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'deleteModal.html',
            scope: $scope
        });

        // prevent error message in log; callbacks are handled in controller
        $scope.modalInstance.result.then(function(){}, function(res){
            $scope.clearDeleteDialogVariables();
        });
    }

    /**
    * Event when OK button clicked in the delete user confirmation dialog
    */
    $scope.deleteOkClicked = function() {
        $scope.modalInstance.close();
        $scope.deleteUserFromList($scope.userInDelete);
    }

    /**
    * Event when Cancel button clicked in the delete user confirmation dialog
    */
    $scope.deleteCancelClicked = function() {
        $scope.clearDeleteDialogVariables();
        $scope.modalInstance.dismiss('cancel');
    }

    /**
    * Call the service to delete the user; if successful then remove from the UI list
    */
    $scope.deleteUserFromList = function(user) {
        // call service
        UserManagementService.deleteUser(user).then(
            function successCallback(response){
                $scope.clearDeleteDialogVariables();
                // only on success
                var indexToDelete = $scope.getIndexOfUser(user, $scope.usersList);
                if (indexToDelete >= 0) {
                    $scope.usersList.splice(indexToDelete, 1);
                }
            },
             function errorCallback(response){
                $scope.clearDeleteDialogVariables();
             }
        );
    }

    $scope.clearCreateDialogVariables = function() {
        $scope.createUser.name = "";
        $scope.createUser.email = "";
    }

    /**
    * Event when the create new user button is clicked.
    */
    $scope.addUserClick = function(usersList) {
        // open dialog
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'createUserModal.html',
            scope: $scope
        });

        // prevent error message in log; callbacks are handled in controller
        $scope.modalInstance.result.then(function(){}, function(res){
            $scope.clearCreateDialogVariables();
        });
    }

    /**
    * Event when OK button clicked in the create new user dialog
    */
    $scope.createOkClicked = function() {
        $scope.modalInstance.close();
        $scope.addUserToList();
    }

    /**
    * Event when Cancel button clicked in the create new user dialog
    */
    $scope.createCancelClicked = function() {
        $scope.clearCreateDialogVariables();
        $scope.modalInstance.dismiss('cancel');
    }

    /**
    * Call the service to create the user; if successful then add to the UI list
    */
    $scope.addUserToList = function() {
        var user = {
            nameOrig: $scope.createUser.name,
            nameEdit: $scope.createUser.name,
            email: $scope.createUser.email,
            emailEdit: $scope.createUser.email
        };

        // call service
        UserManagementService.createUser(user).then(
            function successCallback(response){
                // only on success
                $scope.usersList.push(response);
                $scope.clearCreateDialogVariables();
            },
             function errorCallback(response){
                $scope.clearCreateDialogVariables();
             }
        );
    }

}]);
