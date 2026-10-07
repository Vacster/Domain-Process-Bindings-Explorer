import { createElement } from 'lwc'
import DomainProcessBindingsFilter from 'c/domainProcessBindingsFilter'
import { POSSIBLE_ACTIONS } from 'c/domainProcessBindingsFilter'

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

describe('c-domain-process-bindings-filter', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild)
        }
    })

    async function flushPromises() {
        return Promise.resolve()
    }

    describe('sobject changes in child component', () => {
        const MOCK_SOBJECT_DEVELOPER_NAME = 'Potato__c'
        it('objectchanged event gets sent out', async () => {
            const element = createElement('c-domain-process-bindings-filter', {
                is: DomainProcessBindingsFilter,
            })
            const handler = jest.fn()
            element.addEventListener('object_changed', handler)
            document.body.appendChild(element)

            const entityDefinitionSelectorEl = element.shadowRoot.querySelector(
                'c-entity-definition-selector'
            )
            entityDefinitionSelectorEl.dispatchEvent(
                new CustomEvent('object_changed', {
                    detail: MOCK_SOBJECT_DEVELOPER_NAME,
                })
            )

            await flushPromises()

            expect(handler.mock.calls.length).toBe(1)
            expect(handler.mock.calls[0][0].detail).toBe(MOCK_SOBJECT_DEVELOPER_NAME)
        })
    })

    describe('possible action update', () => {
        it('updates the combobox value and sends out an action_changed event', async () => {
            const element = createElement('c-domain-process-bindings-filter', {
                is: DomainProcessBindingsFilter,
            })
            const handler = jest.fn()
            element.addEventListener('action_changed', handler)
            document.body.appendChild(element)

            const comboboxEl = element.shadowRoot.querySelector('lightning-combobox')
            // double checking it's on default value at first
            expect(comboboxEl.value).toBe(POSSIBLE_ACTIONS[0].value)

            comboboxEl.dispatchEvent(
                new CustomEvent('change', { detail: { value: POSSIBLE_ACTIONS[1].value } })
            )

            await flushPromises()

            expect(comboboxEl.value).toBe(POSSIBLE_ACTIONS[1].value)
            expect(handler).toHaveBeenCalledTimes(1)
            expect(handler.mock.calls[0][0].detail).toBe(POSSIBLE_ACTIONS[1].value)
        })
    })

    describe('refresh button clicked', () => {
        it('sends out a refresh event', async () => {
            const element = createElement('c-domain-process-bindings-filter', {
                is: DomainProcessBindingsFilter,
            })
            const handler = jest.fn()
            element.addEventListener('refresh', handler)
            document.body.appendChild(element)

            const refreshButtonEl = element.shadowRoot.querySelector('lightning-button-icon')
            expect(refreshButtonEl).not.toBeNull()

            refreshButtonEl.click()

            await flushPromises()

            expect(handler.mock.calls.length).toBe(1)
        })
    })

    it('has default values', () => {
        const element = createElement('c-domain-process-bindings-filter', {
            is: DomainProcessBindingsFilter,
        })
        document.body.appendChild(element)

        const comboboxEl = element.shadowRoot.querySelector('lightning-combobox')
        expect(comboboxEl.variant).toBe('label-hidden')
        expect(comboboxEl.value).toBe(POSSIBLE_ACTIONS[0].value)
        expect(comboboxEl.options).toStrictEqual(POSSIBLE_ACTIONS)
    })
})
