var mocks = angular.module('mocks', []);
mocks.service('UserManagementService', function ($q) {
    var usersList = [
        {"id": 7, "first_name": "Michael", "last_name": "Lawson", "email" : "michael.lawson@reqres.in"},
        {"id": 8, "first_name": "Lindsay", "last_name": "Ferguson", "email" : "lindsay.ferguson@reqres.in"},
        {"id": 9, "first_name": "Tobias", "last_name": "Funke", "email" : "tobias.funke@reqres.in"},
        {"id": 10, "first_name": "Byron", "last_name": "Fields", "email" : "byron.fields@reqres.in"},
    ];
    var nextId = 11;

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

    this.deleteUser = function(user) {
        var deferred = $q.defer();
        deferred.resolve("done");
        return deferred.promise;
    };

    this.createUser = function(user) {
        var deferred = $q.defer();
        user.id = nextId++;
        user.createdAt = Date.now();
        deferred.resolve(user);
        return deferred.promise;
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

            // test user not found condition
            var newUser = {id: 1000, name: "test"};
            index = $scope.getIndexOfUser(newUser);
            expect(index).toBe(-1);
        });
    });

    describe('$scope.deleteUserFromList', function() {
        var $scope, controller, svc;

        beforeEach(function() {
            $scope = $rootScope.$new();
            svc = UserManagementService;
            controller = $controller('UserManagementController', { $scope: $scope, UserManagementService: svc });
        });

        it('test delete user from list', function(done) {
            // get the list of users from the service
            $scope.loadUsersList();
            $rootScope.$digest();

            // delete the first user
            expect($scope.usersList.length).toBe(4);
            expect($scope.usersList[0].nameOrig).toBe("Michael Lawson");
            $scope.deleteUserFromList($scope.usersList[0]);
            $rootScope.$digest();
            expect($scope.usersList.length).toBe(3);
            expect($scope.usersList[0].nameOrig).toBe("Lindsay Ferguson");

            // delete the last user
            $scope.deleteUserFromList($scope.usersList[2]);
            $rootScope.$digest();
            expect($scope.usersList.length).toBe(2);
            expect($scope.usersList[0].nameOrig).toBe("Lindsay Ferguson");
            expect($scope.usersList[1].nameOrig).toBe("Tobias Funke");

            // test user not found condition
            var newUser = {id: 1000, name: "test"};
            $scope.deleteUserFromList(newUser);
            $rootScope.$digest();
            expect($scope.usersList.length).toBe(2);

            // wait for the promise to be fulfilled before exiting
            done();
        });
    });

    describe('$scope.addUserToList', function() {
        var $scope, controller, svc;

        beforeEach(function() {
            $scope = $rootScope.$new();
            svc = UserManagementService;
            controller = $controller('UserManagementController', { $scope: $scope, UserManagementService: svc });
        });

        it('test add user to list', function(done) {
            // get the list of users from the service
            $scope.loadUsersList();
            $rootScope.$digest();

            // create a new user
            expect($scope.usersList.length).toBe(4);
            $scope.createUser.name = "George Edwards";
            $scope.createUser.email = "george.edwards@reqres.in";
            $scope.addUserToList();
            $rootScope.$digest();
            expect($scope.usersList.length).toBe(5);
            expect($scope.usersList[4].nameOrig).toBe("George Edwards");
            expect($scope.usersList[4].email).toBe("george.edwards@reqres.in");
            expect($scope.usersList[4].id).toBe(11);
            expect($scope.usersList[4].createdAt).not.toBeUndefined();
            expect($scope.createUser.name).toBe("");
            expect($scope.createUser.email).toBe("");

            // wait for the promise to be fulfilled before exiting
            done();
        });
    });
});