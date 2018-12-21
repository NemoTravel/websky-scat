/*
*
* TODO: find the way to use this module without adding directive to component, if u can, remove search, search-order and add-services component
*
 */

var app = angular.module('app');

app.directive('replaceWith', function () {
    return {
        scope: false,
        controllerAs: 'replaceWith',
        bindToController: true,
        scopeAs: 'vm',
        controller: 'isRouteController',
    }
});

app.controller('isRouteController', ['$scope', 'backend', '$location', '$rootScope', isRouteController]);

function isRouteController($scope, backend, $location, $rootScope) {
    var vm = $scope.vm;


    $scope.$watch(angular.bind(this, function () {

        return vm.fareGroupDescription;

    }), function (newfareGroupDescription) {

        var parentScope = $scope.$parent.vm;

        _.forEach(parentScope.searchParams.segments, function (segment) {
            if (segment.destination.codeEn === 'IST' ||
                segment.origin.codeEn === 'IST') {
                replaceFareGroup();

                return;
            }
        });
    });

    function replaceFareGroup() {
        var counter = 0;

        if (!vm.fareGroupDescription) {
            return;
        }


        vm.fareGroupDescription = vm.fareGroupDescription.replace(/20 кг/g, '30 кг');

    }
}


