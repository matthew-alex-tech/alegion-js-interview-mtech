angular.module('app').controller('UserManagementController',
        ['$scope', 'UserManagementService', '$uibModal',
        function ($scope, UserManagementService, $uibModal) {

    $scope.usersList = []; // the current list of users
    $scope.inEditMode = false; // true if the UI is currently editing a user name or email
    $scope.userInEdit = {}; // the user being edited

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
    * Event when the accept edit check button for the specified user is clicked.
    */
    $scope.acceptEditClick = function(user) {
        // turn off edit mode
        $scope.inEditMode = false;
        $scope.userInEdit = {};
        // call service
        UserManagementService.updateUser(user).then(function(response){
            // update the base name and email to the edited values
            user.nameOrig = user.nameEdit;
            user.email = user.emailEdit;
        });
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

    /**
    * Event when the delete button for the specified user is clicked.
    */
    $scope.deleteUserClick = function(user, usersList) {
        // open confirmation dialog
        var modalInstance = $uibModal.open({
            templateUrl: 'deleteModal.html',
            controller: function ($scope, $uibModalInstance) {
                $scope.username = user.nameOrig;

                $scope.ok = function () {
                    $uibModalInstance.close();
                    console.log(user);
                    // call service
                    UserManagementService.deleteUser(user).then(function(response){
                        // only on success
                        $scope.deleteUserFromList(user, usersList);
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.deleteUserFromList = function(userToDelete, usersList) {
                    var indexToDelete = -1;
                    for (var i=0; i < usersList.length; i++) {
                        var user = usersList[i];
                        if (user.id === userToDelete.id) {
                            indexToDelete = i;
                        }
                    }
                    if (indexToDelete >= 0) {
                        usersList.splice(indexToDelete, 1);
                    }
                }
            }
        });
        modalInstance.result.then(function(){}, function(res){});
    }

    /**
    * Event when the create new user button is clicked.
    */
    $scope.addUserClick = function(usersList) {
        // open dialog
        var modalInstance = $uibModal.open({
            templateUrl: 'createUserModal.html',
            controller: function ($scope, $uibModalInstance) {
                $scope.inputName = "";
                $scope.inputEmail = "";

                $scope.ok = function () {
                    $uibModalInstance.close();
                    // call service
                    var user = {
                        nameOrig: $scope.inputName,
                        nameEdit: $scope.inputName,
                        email: $scope.inputEmail,
                        emailEdit: $scope.inputEmail
                    }
                    UserManagementService.createUser(user).then(function(response){
                        // only on success
                        user.id = response.data.id;
                        usersList.push(user);
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
        });
        modalInstance.result.then(function(){}, function(res){});
    }

}]);
