angular.module('app').component('esInsuranceIin', {
    templateUrl: 'components/es-insurance-with-iin/es-insurance-with-iin.html',
    controller: ['backend', '$q', InsuranceIinController],
    controllerAs: 'vm',
    bindings: {
        service: '=service',
        locked: '=locked',
        hasOtherServices: '='
    }
});

function InsuranceIinController(backend, $q) {

    var vm = this;

    vm.switchService = switchService;
    vm.switchServiceItem = switchServiceItem;
    vm.getInsuranceFullPrice = getInsuranceFullPrice;
    vm.updateAvailable = updateAvailable;
    vm.saveIinHandlers = [];

    vm.orderInfo = backend.getOrderInfo();

    updateAvailable();

    function updateAvailable() {

        vm.availableByPassengers = vm.orderInfo.passengers.map(function (passenger, passengerNum) {
            return (
                vm.service.itemsByPassengers[passengerNum].length &&
                passenger.nationalityCode === 'KZ' &&
                passenger.documentNumberDiscount &&
                (checkAdult(passenger) || hasAdultKzWithIin())
            );
        });

        vm.insuranceAvailable = hasAdultKz();
    }

    function hasAdultKzWithIin() {
        return vm.orderInfo.passengers.some(function (passenger) {
            return (
                checkAdult(passenger) &&
                passenger.documentNumberDiscount &&
                passenger.nationalityCode === 'KZ'
            );
        });
    }

    function hasAdultKz() {
        return vm.orderInfo.passengers.some(function (passenger) {
            return (
                checkAdult(passenger) &&
                passenger.nationalityCode === 'KZ'
            );
        });
    }

    function hasInternationalFlights() {
        return vm.orderInfo.plainFlights.some(function (flight) {
            var destinationCity = backend.getCityByCode(flight.destinationcity);
            var originCity = backend.getCityByCode(flight.origincity);
            return (
                !destinationCity ||
                !originCity ||
                destinationCity.countryEn !== 'KZ' ||
                originCity.countryEn !== 'KZ'
            );
        });
    }

    function checkAdult(passenger) {
        var age = moment(backend.sessionParams.todayDate, 'DD.MM.YYYY').diff(
            moment(passenger.dateOfBirth, 'DD.MM.YYYY'),
            'years'
        );
        return age >= 18;
    }

    function switchService() {
        if (!vm.locked) {
            vm.service.active = !vm.service.active;
            if (vm.service.active) {
                if (vm.service.items.length === 1) {
                    backend.modifyExtraService(getInsuranceSubmitParams(vm.service.items[0]));
                }
            } else {
                backend.removeExtraService({
                    code: vm.service.onlineMode ? 'insuranceOnline' : 'insurance'
                });
            }
        }
    }

    function switchServiceItem(itemNum, passengerNum) {
        var params = getInsuranceSubmitParams(
            vm.service.itemsByPassengers[passengerNum][itemNum],
            vm.orderInfo.passengers[passengerNum].id
        );
        if (!vm.locked) {
            if (vm.service.itemsByPassengers[passengerNum][itemNum].selected) {
                backend.removeExtraService(params).then(function () {
                    vm.iinFormTouched[passengerNum] = false;
                });
            } else {
                if (vm.orderInfo.passengers[passengerNum].documentNumberDiscount) {
                    backend.modifyExtraService(params);
                } else {
                    if (checkAdult(vm.orderInfo.passengers[passengerNum]) || hasAdultKzWithIin()) {
                        vm.saveIinHandlers[passengerNum]().then(function () {
                            switchServiceItem(itemNum, passengerNum);
                        });
                    } else {
                        $q.race(vm.saveIinHandlers.filter(function (handler, num) {
                            return num !== passengerNum;
                        }).map(function (handler) {
                            return handler();
                        })).then(function () {
                            switchServiceItem(itemNum, passengerNum);
                        });
                    }

                }
            }
        }
    }

    function getInsuranceFullPrice(item) {
        return {
            value: item.price || Big(item.insurance_premium || 0).plus(item.luggage_premium || 0).toFixed(2),
            currency: item.currency
        };
    }

    function getInsuranceSubmitParams(item, passenger_id) {
        var params = {
            code: 'insurance',
            ins: item.ins,
            tins: item.tins,
            passenger_id: passenger_id
        };
        if (vm.service.onlineMode) {
            params.code = 'insuranceOnline';
            params.productCode = item.productCode;
        }
        return params;
    }

}
