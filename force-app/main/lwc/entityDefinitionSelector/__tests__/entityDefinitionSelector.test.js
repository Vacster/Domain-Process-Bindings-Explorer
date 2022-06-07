import { createElement } from 'lwc'
import getEntityDefinitions from '@salesforce/apex/DomainBindingExplorerController.getEntityDefinitions'
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

    describe('getEntityDefinitions @wire data', () => {
        it('renders lightning combobox with expected default value and options', async () => {
            const element = createElement('c-entity-definition-selector', {
                is: EntityDefinitionSelector,
            })
            document.body.appendChild(element)

            getEntityDefinitions.emit(mockGetEntityDefinitions)

            await flushPromises()

            const lightningCombobox = element.shadowRoot.querySelector('lightning-combobox')
            expect(lightningCombobox.value).toBe(mockGetEntityDefinitionsSorted[0].DeveloperName)

            const expectedOptions = mockGetEntityDefinitionsSorted.map((entityDefinition) => {
                return { value: entityDefinition.DeveloperName, label: entityDefinition.Label }
            })
            expect(lightningCombobox.options).toStrictEqual(expectedOptions)

            expect(lightningCombobox.variant).toBe('label-hidden')
        })
    })

    describe('handleObjectChange', () => {
        // mock values exist in getEntityDefinitions.json
        const MOCK_SOBJECT_DEVELOPER_NAME = 'OrderItemChangeEvent'
        const MOCK_SOBJECT_LABEL = 'Order Product Change Event'
        it('sends out objectChanged event with expected detail', async () => {
            const element = createElement('c-entity-definition-selector', {
                is: EntityDefinitionSelector,
            })
            const handler = jest.fn()
            element.addEventListener('object_changed', handler)
            document.body.appendChild(element)

            const lightningComboboxEl = element.shadowRoot.querySelector('lightning-combobox')
            lightningComboboxEl.dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: MOCK_SOBJECT_DEVELOPER_NAME },
                })
            )
            await flushPromises()

            expect(handler.mock.calls.length).toBe(1)
            expect(handler.mock.calls[0][0].detail).toBe(MOCK_SOBJECT_DEVELOPER_NAME)
        })
        it('updates value in LightningCombobox', async () => {
            const element = createElement('c-entity-definition-selector', {
                is: EntityDefinitionSelector,
            })
            document.body.appendChild(element)
            const lightningComboboxEl = element.shadowRoot.querySelector('lightning-combobox')
            lightningComboboxEl.dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: MOCK_SOBJECT_DEVELOPER_NAME },
                })
            )

            await flushPromises()

            expect(lightningComboboxEl.value).toBe(MOCK_SOBJECT_DEVELOPER_NAME)
        })
        it('hides the popover', async () => {
            const element = createElement('c-entity-definition-selector', {
                is: EntityDefinitionSelector,
            })
            document.body.appendChild(element)

            const lightningButtonIconEl = element.shadowRoot.querySelector('lightning-button-icon')
            lightningButtonIconEl.click()

            await flushPromises()

            const sectionEl = element.shadowRoot.querySelector('section')
            expect(sectionEl.classList).not.toContain('slds-popover_hide')

            const lightningComboboxEl = element.shadowRoot.querySelector('lightning-combobox')
            lightningComboboxEl.dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: MOCK_SOBJECT_DEVELOPER_NAME },
                })
            )

            await flushPromises()

            expect(sectionEl.classList).toContain('slds-popover_hide')
        })
        it('displays expected label', async () => {
            const element = createElement('c-entity-definition-selector', {
                is: EntityDefinitionSelector,
            })
            document.body.appendChild(element)

            getEntityDefinitions.emit(mockGetEntityDefinitions)

            const lightningComboboxEl = element.shadowRoot.querySelector('lightning-combobox')
            lightningComboboxEl.dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: MOCK_SOBJECT_DEVELOPER_NAME },
                })
            )

            await flushPromises()

            const objectLabelEl = element.shadowRoot.querySelector('b[data-id="selected-object-label"]')
            expect(objectLabelEl.textContent).toBe(MOCK_SOBJECT_LABEL)
        })
    })

    describe('displayToolbar method', () => {
        const EXPECTED_CLASSES = ['slds-popover', 'slds-nubbin_left', 'slds-m-left_medium']
        it('displays the popover', async () => {
            const element = createElement('c-entity-definition-selector', {
                is: EntityDefinitionSelector,
            })
            document.body.appendChild(element)

            const sectionEl = element.shadowRoot.querySelector('section')
            expect(sectionEl.classList).toContain('slds-popover_hide') // starts hidden
            for (let currentClass of EXPECTED_CLASSES) {
                expect(sectionEl.classList).toContain(currentClass)
            }

            const lightningButtonIconEl = element.shadowRoot.querySelector('lightning-button-icon')
            lightningButtonIconEl.click()

            await flushPromises()

            expect(sectionEl.classList).not.toContain('slds-popover_hide')
            for (let currentClass of EXPECTED_CLASSES) {
                expect(sectionEl.classList).toContain(currentClass)
            }
        })
        it('hides the popover', async () => {
            const element = createElement('c-entity-definition-selector', {
                is: EntityDefinitionSelector,
            })
            document.body.appendChild(element)

            const sectionEl = element.shadowRoot.querySelector('section')
            const lightningButtonIconEl = element.shadowRoot.querySelector('lightning-button-icon')
            lightningButtonIconEl.click()

            await flushPromises()

            expect(sectionEl.classList).not.toContain('slds-popover_hide') // from a point where it's showing
            for (let currentClass of EXPECTED_CLASSES) {
                expect(sectionEl.classList).toContain(currentClass)
            }

            lightningButtonIconEl.click()
            await flushPromises()

            expect(sectionEl.classList).toContain('slds-popover_hide')
            for (let currentClass of EXPECTED_CLASSES) {
                expect(sectionEl.classList).toContain(currentClass)
            }
        })
    })

    it('gets default values', async () => {
        const element = createElement('c-entity-definition-selector', {
            is: EntityDefinitionSelector,
        })
        document.body.appendChild(element)

        const combobox = element.shadowRoot.querySelector('lightning-combobox')
        expect(combobox).not.toBeNull()
        expect(combobox.value).toBe('')
        expect(combobox.options).toStrictEqual([])

        const sectionEl = element.shadowRoot.querySelector('section')
        expect(sectionEl).not.toBeNull()
        expect(sectionEl.classList).toContain('slds-popover_hide')
    })
})
