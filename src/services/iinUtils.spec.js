
describe('Services: iinUtils.spec', () => {

    beforeEach(module('app'));

    it('app should contain iinUtils', () => {
        inject((iinUtils) => {
            expect(iinUtils).toBeDefined();
        });
    });

    it('iinUtils should provide getCenturyByYear()', () => {
        inject((iinUtils) => {
            expect(iinUtils.getCenturyByYear).toBeDefined();
            expect(iinUtils.getCenturyByYear(1)).toBe(1);
            expect(iinUtils.getCenturyByYear(1801)).toBe(19);
            expect(iinUtils.getCenturyByYear(1900)).toBe(19);
            expect(iinUtils.getCenturyByYear(1901)).toBe(20);
            expect(iinUtils.getCenturyByYear(2000)).toBe(20);
            expect(iinUtils.getCenturyByYear(2001)).toBe(21);
            expect(iinUtils.getCenturyByYear(2100)).toBe(21);
            expect(iinUtils.getCenturyByYear(2101)).toBe(22);
            expect(iinUtils.getCenturyByYear(2200)).toBe(22);
        });
    });

    it('iinUtils should provide getIinCenturyGenderCode()', () => {
        inject((iinUtils) => {
            expect(iinUtils.getIinCenturyGenderCode).toBeDefined();
        });
    });

    it('iinUtils should provide getIinStart()', () => {
        inject((iinUtils) => {
            expect(iinUtils.getIinStart).toBeDefined();
            expect(iinUtils.getIinStart('07.09.1880', 'male')).toBe('8009071');
            expect(iinUtils.getIinStart('07.09.1880', 'female')).toBe('8009072');
            expect(iinUtils.getIinStart('07.09.1980', 'male')).toBe('8009073');
            expect(iinUtils.getIinStart('07.09.1980', 'female')).toBe('8009074');
            expect(iinUtils.getIinStart('07.09.2080', 'male')).toBe('8009075');
            expect(iinUtils.getIinStart('07.09.2080', 'female')).toBe('8009076');
            expect(iinUtils.getIinStart('07.09.2180', 'male')).toBe('800907');
            expect(iinUtils.getIinStart('07.09.2180', 'female')).toBe('800907');
        });
    });

    it('iinUtils should provide getIinCheckSumm()', () => {
        inject((iinUtils) => {
            expect(iinUtils.getIinCheckSumm).toBeDefined();
            expect(iinUtils.getIinCheckSumm()).toBe(-1);
            expect(iinUtils.getIinCheckSumm('')).toBe(-1);
            expect(iinUtils.getIinCheckSumm('456')).toBe(-1);
            expect(iinUtils.getIinCheckSumm('80090738668')).toBe(-1);
            expect(iinUtils.getIinCheckSumm('80090731111')).toBe(2);
            expect(iinUtils.getIinCheckSumm('80090739988')).toBe(0);
            expect(iinUtils.getIinCheckSumm('80997739988')).toBe(6);
            expect(iinUtils.getIinCheckSumm('82111930119')).toBe(8);
            expect(iinUtils.getIinCheckSumm('02121250119')).toBe(9);
        });
    });

    it('iinUtils should provide isValidIin()', () => {
        inject((iinUtils) => {
            expect(iinUtils.isValidIin).toBeDefined();
            expect(iinUtils.isValidIin()).toBe(false);
            expect(iinUtils.isValidIin('')).toBe(false);
            expect(iinUtils.isValidIin('456')).toBe(false);
            expect(iinUtils.isValidIin('800907311112')).toBe(true);
            expect(iinUtils.isValidIin('800907311113')).toBe(false);
            expect(iinUtils.isValidIin('800907399880')).toBe(true);
            expect(iinUtils.isValidIin('800907399881')).toBe(false);
            expect(iinUtils.isValidIin('800907386680')).toBe(false);
            expect(iinUtils.isValidIin('809977399886')).toBe(false);
            expect(iinUtils.isValidIin('021212501199')).toBe(true);
        });
    });

    it('iinUtils should provide isValidIinForPax()', () => {
        inject((iinUtils) => {
            expect(iinUtils.isValidIinForPax).toBeDefined();
            expect(iinUtils.isValidIinForPax('821119301118', 'male', '19.11.1982')).toBe(true);
            expect(iinUtils.isValidIinForPax('82111930111', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('82111930111 ', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821119301119', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('921119301118', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('891119301118', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('829119301118', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821919301118', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821199301118', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821118301118', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821119901118', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821119391118', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821119309118', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821119301918', 'male', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821119301198', 'male', '19.11.1982')).toBe(true);
            expect(iinUtils.isValidIinForPax('021212501199', 'male', '12.12.2002')).toBe(true);
            expect(iinUtils.isValidIinForPax('821119301118', 'female', '19.11.1982')).toBe(false);
            expect(iinUtils.isValidIinForPax('821119301118', 'male', '')).toBe(false);
        });
    });

});

