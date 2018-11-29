angular.module('app').factory('iinUtils', [
    function () {

        var saveIinHandlers = [];

        return {
            getIinStart: getIinStart,
            getIinCenturyGenderCode: getIinCenturyGenderCode,
            getCenturyByYear: getCenturyByYear,
            getIinCheckSumm: getIinCheckSumm,
            isValidIin: isValidIin,
            isValidIinForPax: isValidIinForPax,
            addSaveIinHander: addSaveIinHander,
            getSaveIinHanders: getSaveIinHanders
        };

        function getIinStart(dateOfBirth, gender) {
            var dateOfBirthMoment = moment(dateOfBirth, 'DD.MM.YYYY');
            return dateOfBirthMoment.format('YYMMDD') + getIinCenturyGenderCode(dateOfBirthMoment, gender);
        }
    
        function getIinCenturyGenderCode(dateOfBirthMoment, gender) {
            var century = getCenturyByYear(dateOfBirthMoment.year());
            if (gender === 'male') {
                if (century === 19) return '1';
                else if (century === 20) return '3';
                else if (century === 21) return '5';
            } else if (gender === 'female') {
                if (century === 19) return '2';
                else if (century === 20) return '4';
                else if (century === 21) return '6';
            }
            return '';
        }
    
        function getCenturyByYear(year) {
            var yearBefore = year - 1;
            return Math.floor(yearBefore/100) + 1;
        }

        function getIinCheckSumm(iinStr) {
            var a, b, summ;
            if (iinStr && iinStr.length === 11) {
                a = iinStr.split('');
                b = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
                summ = scal(a, b) % 11;
                if (summ === 10) {
                    b = [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2 ];
                    summ = scal(a, b) % 11;
                }
                if (summ >= 0 && summ <= 9) {
                    return summ;
                }
            }
            return -1;
        }

        function isValidIin(iinStr) {
            if (iinStr && iinStr.length === 12) {
                if (
                    moment(iinStr.substr(0, 6), 'YYMMDD').isValid() &&
                    getIinCheckSumm(iinStr.substr(0, 11)) == iinStr[11]
                ) {
                    return true;
                }
            }
            return false;
        }

        function isValidIinForPax(iinStr, gender, dateOfBirth) {
            return (iinStr.substr(0, 7) === getIinStart(dateOfBirth, gender) && isValidIin(iinStr))
        }

        function scal(A, B) {
            var result = 0;
            if (A && B && A.length === B.length) {
                for (var i=0; i<A.length; i++) {
                    result += A[i] * B[i];
                }
                return result;
            }
        }

        function addSaveIinHander(cb, num) {
            saveIinHandlers[num] = cb;
        }

        function getSaveIinHanders() {
            return saveIinHandlers;
        }

    }
]);