var mocks = angular.module('mocks', []);
mocks.service('UserManagementService', function ($q) {
    var usersList = [
        {"id": 7, "first_name": "Michael", "last_name": "Lawson", "email" : "michael.lawson@reqres.in"},
        {"id": 8, "first_name": "Lindsay", "last_name": "Ferguson", "email" : "lindsay.ferguson@reqres.in"},
    ];

    this.getUsersList = function () {
        // return a promise, since the real service returns a http promise
        var deferred = $q.defer();
        deferred.promise.data = usersList;
        deferred.resolve(usersList);
        return deferred.promise;
    };

    this.updateUser = function(user) {
        if (user.id === 7) { // return success
            user.updatedAt = Date.now();
            var deferred = $q.defer();
            deferred.promise.data = user;
            deferred.resolve(user);
            return deferred.promise;
        }
        else { // return error
            var deferred = $q.defer();
            deferred.reject("rejecting just because!");
            return deferred.promise;
        }
    };
});

describe('UserManagementController', function() {
    beforeEach(module('app'));
    beforeEach(module('mocks'));

    var $controller, $rootScope, UserManagementService;

    beforeEach(inject(function(_$controller_, _$rootScope_, _UserManagementService_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        UserManagementService = _UserManagementService_;
    }));

    describe('$scope.loadUsersList', function() {
        it('test loading the list of users from the service', function(done) {
            var $scope = $rootScope.$new();
            var svc = UserManagementService;
            var controller = $controller('UserManagementController', { $scope: $scope, UserManagementService: svc });
            $scope.loadUsersList().then(function (result) {
                expect($scope.usersList).toBe(result);
                expect($scope.usersList.length).toBeGreaterThan(1);
                expect($scope.usersList[0].first_name).toBe("Michael");
                expect($scope.usersList[0].nameOrig).toBe("Michael Lawson");
                expect($scope.usersList[0].nameEdit).toBe("Michael Lawson");
                expect($scope.usersList[0].emailEdit).toBe("michael.lawson@reqres.in");
                expect($scope.usersList[1].nameOrig).toBe("Lindsay Ferguson");
            });

            // wait for the promise to be fulfilled before exiting
            $rootScope.$digest();
            done();
        });
    });

    describe('$scope.acceptEditClick', function() {
        var $scope, controller, svc;

        beforeEach(function() {
            $scope = $rootScope.$new();
            svc = UserManagementService;
            controller = $controller('UserManagementController', { $scope: $scope, UserManagementService: svc });
        });

        it('test accepting an edit on a user object', function(done) {
            // get the list of users from the service
            $scope.loadUsersList();
            $rootScope.$digest();

            // make an edit on the first user
            expect($scope.usersList.length).toBeGreaterThan(1);
            expect($scope.usersList[0].nameOrig).toBe("Michael Lawson");
            expect($scope.usersList[0].updatedAt).toBeUndefined();
            $scope.usersList[0].nameEdit = "edited name";
            $scope.usersList[0].emailEdit = "editedEmail@reqres.in";
            $scope.acceptEditClick($scope.usersList[0]).then(function (result) {
                expect($scope.usersList[0]).toBe(result);
                expect($scope.usersList[0].nameOrig).toBe("edited name");
                expect($scope.usersList[0].nameEdit).toBe("edited name");
                expect($scope.usersList[0].email).toBe("editedEmail@reqres.in");
                expect($scope.usersList[0].emailEdit).toBe("editedEmail@reqres.in");
                expect($scope.usersList[0].updatedAt).not.toBeUndefined();
            });

            // wait for the promise to be fulfilled before exiting
            $rootScope.$digest();
            done();
        });

        it('test error on accepting an edit on a user object', function(done) {
            // get the list of users from the service
            $scope.loadUsersList();
            $rootScope.$digest();

            // make an edit on the second user, expect an error an it not to take effect
            expect($scope.usersList.length).toBeGreaterThan(1);
            expect($scope.usersList[1].nameOrig).toBe("Lindsay Ferguson");
            expect($scope.usersList[1].updatedAt).toBeUndefined();
            $scope.usersList[1].nameEdit = "edited name";
            $scope.usersList[1].emailEdit = "editedEmail@reqres.in";
            $scope.acceptEditClick($scope.usersList[1]).then(function (result) {
                expect($scope.usersList[1].updatedAt).toBeUndefined();
                expect($scope.usersList[1].nameOrig).toBe("Lindsay Ferguson");
                expect($scope.usersList[1].email).toBe("lindsay.ferguson@reqres.in");
            });

            // wait for the promise to be fulfilled before exiting
            $rootScope.$digest();
            done();
        });
    });

    describe('$scope.getIndexOfUser', function() {
        var $scope, controller, svc;

        beforeEach(function() {
            $scope = $rootScope.$new();
            svc = UserManagementService;
            controller = $controller('UserManagementController', { $scope: $scope, UserManagementService: svc });
        });

        it('test get index of user function', function() {
            // get the list of users from the service
            $scope.loadUsersList();
            $rootScope.$digest();

            // make an edit on the first user
            expect($scope.usersList.length).toBeGreaterThan(1);
            expect($scope.usersList[0].nameOrig).toBe("Michael Lawson");
            var index = $scope.getIndexOfUser($scope.usersList[0]);
            expect(index).toBe(0);
        });
    });
});