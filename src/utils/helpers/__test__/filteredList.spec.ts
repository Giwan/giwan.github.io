import {test} from 'supertape';
import filteredList from '../filteredList';

describe('filtered list ', () => {
    test('should return the parent object if the label was found', (t) => {
        const toolTemplate = {
            category: '',
            title: '',
            url: '',
            description: '',
            price: 0,
            labels: [''],
        };

        let tools = [{
            ...toolTemplate,
        }];

        t.equal(filteredList(tools), tools);
        t.deepEqual(filteredList(tools, 'design'), []);

        tools = [{
            ...toolTemplate,
            category: 'design',
        }];
        t.equal(filteredList(tools, 'design'), tools);

        tools.push({
            ...toolTemplate,
            category: 'writing',
        });
        expect(filteredList(tools, 'writing')).toMatchObject([{
            category: 'writing',
        }]);
        expect(filteredList(tools, 'design')).toMatchObject([{
            category: 'design',
        }]);
        t.end();
    });
});
