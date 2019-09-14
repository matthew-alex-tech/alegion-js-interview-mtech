angular.module('app').controller('UserManagementController', ['$scope', 'UserManagementService', function($scope, UserManagementService) {

    UserManagementService.getUsersList().then(function(response){
        console.log(response);
        $scope.usersList = response;
    });

}]);
