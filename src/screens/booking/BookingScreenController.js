angular.module('app').controller(
    'BookingScreenController',
    ['$scope', 'fancyboxTools', 'backend', 'utils', 'redirect', 'iinUtils', '$q',
    function ($scope, fancyboxTools, backend, utils, redirect, iinUtils, $q) {
            const vm = this;

            vm.loading = true;
            vm.orderServicesLoading = true;

            vm.submitPayment = submitPayment;
            vm.paymentFormChangeHandler = paymentFormChangeHandler;
            vm.swithcSubmitButtonHoverState = swithcSubmitButtonHoverState;

            $scope.$on('plasticCardForPaymentChangeEvent', function (event, data) {
                vm.card = data;
            });

            backend.ready.then(function() {
                angular.element('title').text(backend.getAliasWithPrefix('web.pageTitle.', 'extraServices'));

                backend.clearOrderInfoListeners();
                backend.clearUpdateOrderServicesListeners();

                backend.addOrderInfoListener(function(orderInfo) {
                    if (orderInfo &&
                        orderInfo.header &&
                        orderInfo.header.regnum &&
                        orderInfo.passengers &&
                        orderInfo.passengers[0] &&
                        orderInfo.passengers[0].lastName) {
                        vm.loading = true;

                        redirect.goToConfirmOrder();

                        return;
                    }

                    vm.orderInfo = orderInfo;
                });

                backend.addUpdateOrderServicesListener(function(resp) {
                    vm.orderInfo = resp[1];
                    vm.priceVariant = resp[2];
                    vm.isFreePricevariant = utils.isFreePricevariant(resp[2]);

                    vm.es = utils.reformatAvailableExtraServices(resp[0], vm.orderInfo, vm.es);
                    vm.esList = utils.getAvailableExtraServicesList(resp[0], vm.es);
                    vm.loading = false;
                    vm.orderServicesLoading = false;

                    if (backend.getParam('ffp.enable') && (vm.orderInfo.hasBonusCard || vm.orderInfo.ffpSumm)) {
                        backend.ffpBonus().then(function(resp) {
                            vm.ffpBonus = resp.total || 0;
                        });
                    }

                }, function(resp) {
                    vm.loading = false;
                    vm.orderServicesLoading = false;
                    vm.errorMessage = resp.error;
                });

                backend.updateOrderServices(true).then(function() {
                    backend.switchDefaultSelectedServices(vm.esList, vm.es, vm.orderInfo);
                });

                backend.addExtraServiceListener(function(state) {
                    vm.modifyServicesLoading = !state;
                    vm.orderServicesLoading = true;
                });

                backend.addExtraServiceErrorListener(function(resp, req) {
                    if (!req || req.code !== 'seat') {
                        vm.modifyServicesError = resp.error;
                    }

                    vm.modifyServicesLoading = false;
                    vm.orderServicesLoading = true;
                });

            });

            function submitPayment() {
                var paymentFormVariant;

                if (vm.agree && !vm.modifyServicesLoading && !vm.orderServicesLoading) {
                    if (vm.selectedPaymentForm && vm.selectedPaymentType) {
                        paymentFormVariant = _.findWhere(vm.priceVariant, { code: vm.selectedPaymentForm });
                        if (paymentFormVariant.conflicts_with_aeroexpress ||
                            paymentFormVariant.conflicts_with_insurance) {
                            fancyboxTools.openHandler('popupCancelConflictServices', false, {
                                paymentForm: vm.selectedPaymentForm,
                                aeroexpress: paymentFormVariant.conflicts_with_aeroexpress,
                                insurance: paymentFormVariant.conflicts_with_insurance,
                                submitCallback: submitPaymentHandler
                            });
                        } else {
                            $q.all(iinUtils.getSaveIinHanders().filter(function (handler, passengerNum) {
                                return (
                                    vm.orderInfo &&
                                    vm.orderInfo.groupedEditableExtraServices &&
                                    vm.orderInfo.groupedEditableExtraServices.insurance &&
                                    !!vm.orderInfo.groupedEditableExtraServices.insurance[passengerNum]
                                );
                            }).map(function (cb) {
                                return cb();
                            })).then(function () {
                                submitPaymentHandler();
                            });

                        }

                    } else {
                        vm.showNeedSelectPaymentFormMesage = true;
                    }
                }
            }

            function submitPaymentHandler(removeInsuranceAeroexpress) {
                vm.doBookingAndRegisterOrderLoading = true;

                if (vm.bookingError) {
                    delete vm.bookingError;
                }

                backend.doBookingAndRegisterOrder(vm.selectedPaymentForm, vm.selectedPaymentType,
                    removeInsuranceAeroexpress, vm.card).then(function(resp) {
                    if (resp.pnr && resp.lastName) {
                        redirect.goToConfirmOrder();
                    } else if (resp.eraseAeroexpressBecauseOfCurrency || resp.eraseInsuranceBecauseOfCurrency) {
                        fancyboxTools.openHandler('popupChangeCurrencyError', false, {
                            eraseAeroexpressBecauseOfCurrency: resp.eraseAeroexpressBecauseOfCurrency,
                            eraseInsuranceBecauseOfCurrency: resp.eraseInsuranceBecauseOfCurrency,
                            mode: 'booking',
                            submitCallback: submitPaymentHandler
                        });
                    }

                    vm.doBookingAndRegisterOrderLoading = false;
                }, function(resp) {
                    vm.doBookingAndRegisterOrderLoading = false;
                    vm.bookingError = resp.error;
                });
            }

            function paymentFormChangeHandler(priceVariantItemCode) {
                vm.showNeedSelectPaymentFormMesage = false;
                backend.changePaymentForm(priceVariantItemCode);
            }

            function swithcSubmitButtonHoverState() {
                vm.submitButtonHover = !vm.submitButtonHover;
            }

        }
    ]
);


