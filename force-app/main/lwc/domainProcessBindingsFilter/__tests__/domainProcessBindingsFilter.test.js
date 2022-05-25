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
        it('updates values in UI', async () => {
            const element = createElement('c-domain-process-bindings-filter', {
                is: DomainProcessBindingsFilter,
            })
            document.body.appendChild(element)

            const selectActionLabelBEl = element.shadowRoot.querySelector(
                'b[data-id="selected-action-label"]'
            )
            // double checking it's on default value at first
            expect(selectActionLabelBEl.textContent).toBe(POSSIBLE_ACTIONS[0].label)

            const lightningButtonMenuEl = element.shadowRoot.querySelector('lightning-button-menu')
            lightningButtonMenuEl.dispatchEvent(
                new CustomEvent('select', { detail: { value: POSSIBLE_ACTIONS[1].value } })
            )

            await flushPromises()

            expect(selectActionLabelBEl.textContent).toBe(POSSIBLE_ACTIONS[1].label)
        })
    })

    it('has default values', () => {
        const element = createElement('c-domain-process-bindings-filter', {
            is: DomainProcessBindingsFilter,
        })
        document.body.appendChild(element)

        const lightningMenuItemEls = element.shadowRoot.querySelectorAll('lightning-menu-item')
        expect(lightningMenuItemEls.length).toBe(POSSIBLE_ACTIONS.length)
        for (let [index, lightningMenuItemEl] of lightningMenuItemEls.entries()) {
            expect(lightningMenuItemEl.value).toBe(POSSIBLE_ACTIONS[index].value)
            expect(lightningMenuItemEl.label).toBe(POSSIBLE_ACTIONS[index].label)
        }

        const selectActionLabelBEl = element.shadowRoot.querySelector(
            'b[data-id="selected-action-label"]'
        )
        expect(selectActionLabelBEl.textContent).toBe(POSSIBLE_ACTIONS[0].label)
    })
})
