import { createElement } from 'lwc'
import getDomainProcessBindings from '@salesforce/apex/DomainBindingExplorerController.getDomainProcessBindings'
import DomainProcessBindingViewer from 'c/domainProcessBindingViewer'

const mockGetDomainProcessBindings = require('./data/getDomainProcessBindings.json')
const mockGetDomainProcessBindingsAsync = require('./data/getDomainProcessBindingsAsync.json')

jest.mock(
    '@salesforce/apex/DomainBindingExplorerController.getDomainProcessBindings',
    () => {
        const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest')
        return {
            default: createApexTestWireAdapter(jest.fn()),
        }
    },
    { virtual: true }
)

describe('c-domain-process-binding-viewer', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild)
        }
    })

    async function flushPromises() {
        return Promise.resolve()
    }


    describe('synchronous process bindings retrieved', () => {
        it('displays expected values on After', async () => {
            const element = createElement('c-domain-process-binding-viewer', {
                is: DomainProcessBindingViewer,
            })
            element.triggerOperation = 'After_Update'
            document.body.appendChild(element)
    
            getDomainProcessBindings.emit(mockGetDomainProcessBindings)
    
            await flushPromises()

            const h4El = element.shadowRoot.querySelector('h4')
            expect(h4El.textContent).toBe('Record After Save')

            const domainProcessBindingListItemEls = element.shadowRoot.querySelectorAll('c-domain-process-binding-list-item')
            expect(domainProcessBindingListItemEls.length).toBe(mockGetDomainProcessBindings.length)
            for (let [index, domainProcessBindingListItemEl] of domainProcessBindingListItemEls.entries()) {
                expect(domainProcessBindingListItemEl.record.Id).toBe(mockGetDomainProcessBindings[index].Id)
            }

            const listLengthSpanEl = element.shadowRoot.querySelector('span[data-id="list-length"]')
            expect(listLengthSpanEl.textContent).toBe(`${mockGetDomainProcessBindings.length} Item(s)`)

            const noItemsPEl = element.shadowRoot.querySelector('p[data-id="no-items-text"]')
            expect(noItemsPEl).toBeNull()
        })
        it('displays expected values on Before', async () => {
            const element = createElement('c-domain-process-binding-viewer', {
                is: DomainProcessBindingViewer,
            })
            element.triggerOperation = 'Before_Insert'
            document.body.appendChild(element)
    
            getDomainProcessBindings.emit(mockGetDomainProcessBindings)
    
            await flushPromises()

            const h4El = element.shadowRoot.querySelector('h4')
            expect(h4El.textContent).toBe('Record Before Save')

            const domainProcessBindingListItemEls = element.shadowRoot.querySelectorAll('c-domain-process-binding-list-item')
            expect(domainProcessBindingListItemEls.length).toBe(mockGetDomainProcessBindings.length)
            for (let [index, domainProcessBindingListItemEl] of domainProcessBindingListItemEls.entries()) {
                expect(domainProcessBindingListItemEl.record.Id).toBe(mockGetDomainProcessBindings[index].Id)
            }

            const listLengthSpanEl = element.shadowRoot.querySelector('span[data-id="list-length"]')
            expect(listLengthSpanEl.textContent).toBe(`${mockGetDomainProcessBindings.length} Item(s)`)

            const noItemsPEl = element.shadowRoot.querySelector('p[data-id="no-items-text"]')
            expect(noItemsPEl).toBeNull()
        })
    })

    describe('asynchronoius process bindings retrieved', () => {
        it('displays expected values on After Async', async () => {
            const element = createElement('c-domain-process-binding-viewer', {
                is: DomainProcessBindingViewer,
            })
            element.triggerOperation = 'After_Update'
            element.isAsync = true
            document.body.appendChild(element)
    
            getDomainProcessBindings.emit(mockGetDomainProcessBindingsAsync)
    
            await flushPromises()

            const h4El = element.shadowRoot.querySelector('h4')
            expect(h4El.textContent).toBe('Run Asynchronously')

            const domainProcessBindingListItemEls = element.shadowRoot.querySelectorAll('c-domain-process-binding-list-item')
            expect(domainProcessBindingListItemEls.length).toBe(mockGetDomainProcessBindingsAsync.length)
            for (let [index, domainProcessBindingListItemEl] of domainProcessBindingListItemEls.entries()) {
                expect(domainProcessBindingListItemEl.record.Id).toBe(mockGetDomainProcessBindingsAsync[index].Id)
            }

            const listLengthSpanEl = element.shadowRoot.querySelector('span[data-id="list-length"]')
            expect(listLengthSpanEl.textContent).toBe(`${mockGetDomainProcessBindingsAsync.length} Item(s)`)

            const noItemsPEl = element.shadowRoot.querySelector('p[data-id="no-items-text"]')
            expect(noItemsPEl).toBeNull()
        })
        it('throws error on impossible Before Async', async () => {
            const element = createElement('c-domain-process-binding-viewer', {
                is: DomainProcessBindingViewer,
            })
            element.triggerOperation = 'Before_Insert'
            element.isAsync = true

            let caughtError = null
            try {
                document.body.appendChild(element)
            } catch (error) {
                caughtError = error
            }

            expect(caughtError).not.toBeNull()
            expect(caughtError.message).toBe('Impossible State Found: Before + Async')
        })
    })

    it('uses default values', async () => {
        const element = createElement('c-domain-process-binding-viewer', {
            is: DomainProcessBindingViewer,
        })
        document.body.appendChild(element)

        getDomainProcessBindings.emit([])

        await flushPromises()

        const h4El = element.shadowRoot.querySelector('h4')
        expect(h4El.textContent).toBe('Record Before Save')

        const domainProcessBindingListItemEls = element.shadowRoot.querySelectorAll('c-domain-process-binding-list-item')
        expect(domainProcessBindingListItemEls.length).toBe(0)

        const listLengthSpanEl = element.shadowRoot.querySelector('span[data-id="list-length"]')
        expect(listLengthSpanEl.textContent).toBe('0 Item(s)')

        const noItemsPEl = element.shadowRoot.querySelector('p[data-id="no-items-text"]')
        expect(noItemsPEl).not.toBeNull()
        expect(noItemsPEl.textContent).toBe('No items to display')
    })
})
