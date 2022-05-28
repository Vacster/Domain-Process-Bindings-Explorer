import { createElement } from 'lwc'
import DomainProcessBindingListItem from 'c/domainProcessBindingListItem'
import { ICON_NAME_BY_BINDING_TYPE } from 'c/domainProcessBindingListItem'

const mockActionBinding = require('./data/actionBinding.json')
const mockCriteriaBinding = require('./data/criteriaBinding.json')
const mockAsyncActionBinding = require('./data/asyncActionBinding.json')
const mockInactiveActionBinding = require('./data/inactiveActionBinding.json')

describe('c-domain-process-binding-list-item', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild)
        }
    })

    async function flushPromises() {
        return Promise.resolve()
    }

    describe('record is set', () => {
        const EXPECTED_BADGE_CLASSES = ['slds-grow-none', 'slds-col_bump-left', 'slds-badge']

        it('displays expected action icon on Action Binding', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockActionBinding
            document.body.appendChild(element)

            const lightningIconEl = element.shadowRoot.querySelector('lightning-icon[data-id="binding-type-icon"]')
            expect(lightningIconEl.iconName).toBe(
                ICON_NAME_BY_BINDING_TYPE[mockActionBinding.Type__c]
            )
        })
        it('displays expected criteria icon on Criteria Binding', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockCriteriaBinding
            document.body.appendChild(element)

            const lightningIconEl = element.shadowRoot.querySelector('lightning-icon[data-id="binding-type-icon"]')
            expect(lightningIconEl.iconName).toBe(
                ICON_NAME_BY_BINDING_TYPE[mockCriteriaBinding.Type__c]
            )
        })
        it('displays order of execution', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockActionBinding
            document.body.appendChild(element)

            const lightningFormattedNumberEl = element.shadowRoot.querySelector(
                'lightning-formatted-number'
            )
            expect(lightningFormattedNumberEl.value).toBe(mockActionBinding.OrderOfExecution__c)
        })
        it('does not display async icon on non-async record', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockActionBinding
            document.body.appendChild(element)

            const lightningIconEl = element.shadowRoot.querySelector('lightning-icon[data-id="async-icon"]')
            expect(lightningIconEl).toBeNull()
        })
        it('displays async icon on async record', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockAsyncActionBinding
            document.body.appendChild(element)

            const lightningIconEl = element.shadowRoot.querySelector('lightning-icon[data-id="async-icon"]')
            expect(lightningIconEl).not.toBeNull()
        })
        it('displays expected classes in badge on active record', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockActionBinding
            document.body.appendChild(element)

            const activeBadgeLabelSpanEl = element.shadowRoot.querySelector(
                'span[data-id="badge-label"]'
            )
            expect(activeBadgeLabelSpanEl.classList).toContain('slds-badge_lightest')
            for (let currentClass of EXPECTED_BADGE_CLASSES) {
                expect(activeBadgeLabelSpanEl.classList).toContain(currentClass)
            }
        })
        it('displays expected label in badge on active record', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockActionBinding
            document.body.appendChild(element)

            const activeBadgeLabelSpanEl = element.shadowRoot.querySelector(
                'span[data-id="badge-label"]'
            )
            expect(activeBadgeLabelSpanEl.textContent).toBe('Active')
        })
        it('displays expected classes in badge on inactive record', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockInactiveActionBinding
            document.body.appendChild(element)

            const activeBadgeLabelSpanEl = element.shadowRoot.querySelector(
                'span[data-id="badge-label"]'
            )
            expect(activeBadgeLabelSpanEl.classList).not.toContain('slds-badge_lightest')
            for (let currentClass of EXPECTED_BADGE_CLASSES) {
                expect(activeBadgeLabelSpanEl.classList).toContain(currentClass)
            }
        })
        it('displays expected label in badge on inactive record', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockInactiveActionBinding
            document.body.appendChild(element)

            const activeBadgeLabelSpanEl = element.shadowRoot.querySelector(
                'span[data-id="badge-label"]'
            )
            expect(activeBadgeLabelSpanEl.textContent).toBe('Inactive')
        })
        it('opens a link when record name clicked', async () => {
            const element = createElement('c-domain-process-binding-list-item', {
                is: DomainProcessBindingListItem,
            })
            element.record = mockInactiveActionBinding
            document.body.appendChild(element)

            let spy = jest.spyOn(window, 'open')
            spy.mockImplementation(() => {})

            const aEl = element.shadowRoot.querySelector('a')
            aEl.click()

            await flushPromises()

            expect(spy).toHaveBeenCalled()
            //TODO: Can we verify that window.open was called with the binding Id?

            spy.mockRestore()
        })
    })

    it('displays nothing if record does not exist', () => {
        const element = createElement('c-domain-process-binding-list-item', {
            is: DomainProcessBindingListItem,
        })
        document.body.appendChild(element)

        expect(element.shadowRoot.firstChild).toBeNull()
    })
})
