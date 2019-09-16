var mocks = angular.module('mocks', []);
mocks.service('UserManagementService', function ($q) {
    this.getUsersList = function () {
        var usersList = [
            {"id": 7, "first_name": "Michael", "last_name": "Lawson", "email" : "michael.lawson@reqres.in"},
            {"id": 8, "first_name": "Lindsay", "last_name": "Ferguson", "email" : "lindsay.ferguson@reqres.i"},
        ];
        // return a promise, since the real service returns a http promise
        var deferred = $q.defer();
        deferred.promise.data = usersList;
        deferred.resolve(usersList);
        return deferred.promise;
    }
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
        it('loads the list of users from the service', function(done) {
            var $scope = $rootScope.$new();
            var svc = UserManagementService;
            var controller = $controller('UserManagementController', { $scope: $scope, UserManagementService: svc });
            $scope.loadUsersList().then(function (result) {
                expect(result.length).toBe(2);
                expect(result[0].first_name).toBe("Michael");
                expect(result[0].nameOrig).toBe("Michael Lawson");
                expect(result[0].nameEdit).toBe("Michael Lawson");
                expect(result[0].emailEdit).toBe("michael.lawson@reqres.in");
            });

            // wait for the promise to be fulfilled before exiting
            $rootScope.$digest();
            done();
        });
    });
});