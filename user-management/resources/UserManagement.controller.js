angular.module('app').controller('UserManagementController', ['$scope', 'UserManagementService', '$uibModal',
        function ($scope, UserManagementService, $uibModal) {

    /////////////////////////////////////////////////////////////////////////
    // load the initial list of users first
    /////////////////////////////////////////////////////////////////////////
    $scope.usersList = [];
    $scope.loadUsersList = function() {
        return UserManagementService.getUsersList().then(function(response){
//            console.log(response);
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
        // call service
        UserManagementService.updateUser(user).then(function(response){
            // only on success
            user.nameOrig = user.nameEdit;
            user.email = user.emailEdit;
        });
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

    $scope.deleteUser = function(user, usersList) {
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

    /////////////////////////////////////////////////////////////////////////
    // functions for adding a new user
    /////////////////////////////////////////////////////////////////////////
    $scope.addUser = function() {
        // TODO open dialog
        console.log("TODO open dialog");
        console.log("TODO add service");

        // on success
//        $scope.loadUsersList();
    }

}]);
