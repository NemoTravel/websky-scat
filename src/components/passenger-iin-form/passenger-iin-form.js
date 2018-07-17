angular.module('app').component('passengerIinForm', {
    templateUrl: 'components/passenger-iin-form/passenger-iin-form.html',
    controller: ['backend', 'iinUtils', '$q', PassengerIinFormController],
    controllerAs: 'vm',
    bindings: {
        passenger: '=passenger',
        num: '=num',
        onModify: '&',
        saveIin: '=?'
    }
});

function PassengerIinFormController(backend, iinUtils, $q) {

    var vm = this;

    vm.saveIin = saveIin;
    vm.editableValue = getIinDefaultValue(vm.passenger);    
    
    function saveIin() {

        vm.submitTouched = true;

       return $q(function (resolve, reject) {

            if (!vm.loading && vm.iinForm.$valid && vm.editableValue != vm.passenger.documentNumberDiscount) {

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
                if (vm.iinForm.$invalid) {
                    jQuery('form.iinForm__js.ng-invalid').triggerHandler('submit');
                }
                reject();
            }

        });
    }

    function getIinDefaultValue(passenger) {
        return passenger.documentNumberDiscount ? passenger.documentNumberDiscount : iinUtils.getIinStart(passenger.dateOfBirth, passenger.gender);
    }        

}