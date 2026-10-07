import { createElement } from 'lwc'
import getEntityDefinitions from '@salesforce/apex/DomainBindingExplorerController.getEntityDefinitions'
import getSObjectNamesWithDomainProcessBindings from '@salesforce/apex/DomainBindingExplorerController.getSObjectNamesWithDomainProcessBindings'
import EntityDefinitionSelector from 'c/entityDefinitionSelector'

const mockGetEntityDefinitions = require('./data/getEntityDefinitions.json')
const mockGetEntityDefinitionsSorted = require('./data/getEntityDefinitionsSorted.json')

jest.mock(
    '@salesforce/apex/DomainBindingExplorerController.getEntityDefinitions',
    () => {
        const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest')
        return {
            default: createApexTestWireAdapter(jest.fn()),
        }
    },
    { virtual: true }
)

jest.mock(
    '@salesforce/apex/DomainBindingExplorerController.getSObjectNamesWithDomainProcessBindings',
    () => {
        const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest')
        return {
            default: createApexTestWireAdapter(jest.fn()),
        }
    },
    { virtual: true }
)

describe('c-entity-definition-selector', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild)
        }
        jest.clearAllMocks()
    })

    async function flushPromises() {
        return Promise.resolve()
    }

    function createSelector() {
        const element = createElement('c-entity-definition-selector', {
            is: EntityDefinitionSelector,
        })
        document.body.appendChild(element)
        return element
    }

    function combobox(element) {
        return element.shadowRoot.querySelector('lightning-combobox')
    }

    describe('wired data', () => {
        it('renders all bound objects and selects the first one', async () => {
            const element = createSelector()
            let selected
            element.addEventListener('object_changed', (event) => (selected = event.detail))

            getEntityDefinitions.emit(mockGetEntityDefinitions)
            getSObjectNamesWithDomainProcessBindings.emit(
                mockGetEntityDefinitionsSorted.map(
                    (entityDefinition) => entityDefinition.QualifiedApiName
                )
            )
            await flushPromises()

            expect(combobox(element).value).toBe(mockGetEntityDefinitionsSorted[0].QualifiedApiName)
            expect(combobox(element).spinnerActive).toBe(false)
            expect(combobox(element).variant).toBe('label-hidden')
            expect(selected).toBe(mockGetEntityDefinitionsSorted[0].QualifiedApiName)
            expect(combobox(element).options).toStrictEqual(
                mockGetEntityDefinitionsSorted.map((entityDefinition) => ({
                    value: entityDefinition.QualifiedApiName,
                    label: entityDefinition.Label,
                }))
            )
        })

        it('only offers objects referenced by Domain Process Bindings', async () => {
            const element = createSelector()

            getEntityDefinitions.emit(mockGetEntityDefinitions)
            getSObjectNamesWithDomainProcessBindings.emit(['Contact'])
            await flushPromises()

            expect(combobox(element).options).toStrictEqual([
                { value: 'Contact', label: 'Contact' },
            ])
            expect(combobox(element).value).toBe('Contact')
        })

        it('offers no objects and reports an error when binding names fail to load', async () => {
            const element = createSelector()

            getEntityDefinitions.emit(mockGetEntityDefinitions)
            getSObjectNamesWithDomainProcessBindings.error({
                body: { message: 'Unable to load bindings' },
                status: 500,
                statusText: 'Server Error',
            })
            await flushPromises()

            expect(combobox(element).options).toStrictEqual([])
            expect(element.shadowRoot.querySelector('[role="alert"]').textContent).toContain(
                'Unable to load objects with Domain Process Bindings.'
            )
        })
    })

    describe('handleObjectChange', () => {
        it('sends object_changed with the chosen object and updates the value', async () => {
            const element = createSelector()
            const handler = jest.fn()

            getEntityDefinitions.emit(mockGetEntityDefinitions)
            getSObjectNamesWithDomainProcessBindings.emit(['Account', 'Contact'])
            await flushPromises()
            element.addEventListener('object_changed', handler)

            combobox(element).dispatchEvent(
                new CustomEvent('change', { detail: { value: 'Contact' } })
            )
            await flushPromises()

            expect(handler).toHaveBeenCalledTimes(1)
            expect(handler.mock.calls[0][0].detail).toBe('Contact')
            expect(combobox(element).value).toBe('Contact')
        })
    })

    it('renders a loading combobox by default', () => {
        const element = createSelector()

        expect(combobox(element).value).toBe('')
        expect(combobox(element).options).toStrictEqual([])
        expect(combobox(element).spinnerActive).toBe(true)
        expect(combobox(element).placeholder).toBe('Select Object')
        expect(element.shadowRoot.querySelector('lightning-button-icon')).toBeNull()
    })
})
