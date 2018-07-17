angular.module('app').directive('iincheck', ['iinUtils', 'backend', function (iinUtils, backend) {
    return {
        require: 'ngModel',
        scope: {
            pax: '=iincheck'
        },
        link: function (scope, elm, attrs, ctrl) {
            if (!ctrl || !scope.pax) {
                return;
            }

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.unshift(validate);

            function validate(value) {
                var isValid = !value || iinUtils.isValidIinForPax(value, scope.pax.gender, scope.pax.dateOfBirth);
                ctrl.$setValidity('iincheck', isValid);
                if (isValid) {
                    delete ctrl.$error.customMessage;
                } else {
                    ctrl.$error.customMessage = backend.getAliasDynamic('web.extraServices.insurance.invalidIinMessage');
                }
                
                return value;
            }
        }
    };
}]);


