angular.module('app').controller('UserManagementController', ['$scope', 'UserManagementService', function ($scope, UserManagementService) {

    $scope.usersList = [];
    $scope.loadUsersList = function() {
        return UserManagementService.getUsersList().then(function(response){
            console.log(response);
            $scope.usersList = response;
            return response;
        });
    }
    $scope.loadUsersList();


}]);
