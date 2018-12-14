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
        controller: 'isRouteController'
    }
});

app.controller('isRouteController', ['$scope', 'backend', '$location', '$rootScope', isRouteController]);

function isRouteController($scope, backend, $location, $rootScope) {
    var vm = $scope.$parent.vm;
    vm.originalBrands = false;
    vm.needToRestoreBrandsInfo = false;


    backend.ready.then(function () {
        try {
            var redefineRules = JSON.parse(backend.getAlias('web.brandConfig.redefine'));
        } catch (e) {
            console.error('redefine rules parse error', e);
        }
        vm.redefineRules = redefineRules;

        $scope.$watch(angular.bind(this, function () {
            return vm.searchResult
        }), function (newSearchResult) {

            if ($location.path() === '/search-order') {
                return;
            }

            onNewSearchResult(newSearchResult);
        }, true);

    });

    function onNewSearchResult(newSearchResult) {
        if (!newSearchResult.brandsList && newSearchResult.fareGroups) {
            // fareGroups replace mode
            replaceFareGroups(newSearchResult)
        }
    }


    function replaceFareGroups(newSearchResult) {
        _.forEach(newSearchResult.flights, function (flight) {
            _.forEach(flight.flights, function (flightInfo) {
                if (flightInfo.destinationcity === 'IST' || flightInfo.origincity === 'IST') {
                    var waitUntilCompareTableOpen = setInterval(function () {
                        var neededScope = findScopeWithProp($scope, 'fareGroupDescriptionHTML');
                        if (neededScope) {
                            clearInterval(waitUntilCompareTableOpen);
                            neededScope.vm.fareGroupDescriptionHTML = neededScope.vm.fareGroupDescription.replace(/5/gi, '35');
                            neededScope.$apply();
                        }
                    }, 200);
                }
            });
        });
    }

    function findScopeWithProp(scope, prop) {
        var scopes = {}; // exclude the current scope
        var root = scope || angular.element(document).injector().get('$rootScope');
        var pendingChildHeads = [root.$$childHead];
        var currentScope;

        while (pendingChildHeads.length) {
            currentScope = pendingChildHeads.shift();

            while (currentScope) {
                if (currentScope.hasOwnProperty('vm')) {
                    if (currentScope.vm[prop]) {
                        return currentScope;
                    }
                }
                scopes["scope" + pendingChildHeads.length] = currentScope.$id;
                pendingChildHeads.push(currentScope.$$childHead);
                currentScope = currentScope.$$nextSibling;
            }
        }

        return null;

    }
}