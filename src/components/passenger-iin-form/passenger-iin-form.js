angular.module('app').component('passengerIinForm', {
    templateUrl: 'components/passenger-iin-form/passenger-iin-form.html',
    controller: ['backend', 'iinUtils', '$q', '$element', PassengerIinFormController],
    controllerAs: 'vm',
    bindings: {
        passenger: '=passenger',
        num: '=num',
        onModify: '&',
        submitTouched: '=touched',
        saveIin: '=?'
    }
});

function PassengerIinFormController(backend, iinUtils, $q, $element) {

    var vm = this;

    vm.saveIin = saveIin;
    vm.editableValue = getIinDefaultValue(vm.passenger);

    vm.$onInit = function () {
        iinUtils.addSaveIinHander(vm.saveIin, vm.num);
    };
    
    function saveIin() {

        vm.submitTouched = true;

       return $q(function (resolve, reject) {

            if (!vm.loading && vm.iinForm.$valid) {

                if (vm.editableValue != vm.passenger.documentNumberDiscount) {

                    vm.loading = true;

                    backend.modifyPassenger({
                        additionalDocumentType: 'ИИН',
                        additionalDocumentNumber: vm.editableValue,
                        index: vm.num
                    }).then(function () {
                        vm.loading = false;
                        vm.passenger.documentNumberDiscount = vm.editableValue;
                        vm.onModify();
                        resolve();
                    }, function () {
                        vm.loading = false;
                        reject();
                    });

                } else {
                    resolve();
                }

            } else {
                if (vm.iinForm.$invalid) {
                    jQuery('form.iinForm__js.ng-invalid', $element).triggerHandler('submit');
                }
                reject();
            }

        });
    }

    function getIinDefaultValue(passenger) {
        return passenger.documentNumberDiscount ? passenger.documentNumberDiscount : iinUtils.getIinStart(passenger.dateOfBirth, passenger.gender);
    }        

}