import {test} from 'supertape';
import {isCategorySelected} from '../helpers/isCategorySelected';

describe('isCategorySelected', () => {
    test('should indicate if the category is selected', () => {
        expect(isCategorySelected('1', '2')).toBeFalsy();
        expect(isCategorySelected('write', 'write')).toBeTruthy();
    });
});
