import { createElement } from 'lwc'
import DomainBindingsExplorer from 'c/domainBindingsExplorer'

describe('c-domain-bindings-explorer', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild)
        }
    })

    async function flushPromises() {
        return Promise.resolve()
    }

    describe('trigger operation changes', () => {
        it('updates viewers on changed to update', async () => {
            const element = createElement('c-domain-bindings-explorer', {
                is: DomainBindingsExplorer,
            })
            document.body.appendChild(element)

            const domainProcessBindingsFilterEl = element.shadowRoot.querySelector(
                'c-domain-process-bindings-filter'
            )
            domainProcessBindingsFilterEl.dispatchEvent(
                new CustomEvent('action_changed', {
                    detail: 'update',
                })
            )

            await flushPromises()

            const domainProcessBindingsViewerEls = element.shadowRoot.querySelectorAll(
                'c-domain-process-binding-viewer'
            )
            expect(domainProcessBindingsViewerEls.length).toBe(2)

            expect(domainProcessBindingsViewerEls[0].triggerOperation).toBe('Before_Update')
            expect(domainProcessBindingsViewerEls[0].selectedSObjectDeveloperName).toBe('')

            expect(domainProcessBindingsViewerEls[1].triggerOperation).toBe('After_Update')
            expect(domainProcessBindingsViewerEls[1].selectedSObjectDeveloperName).toBe('')
        })

        it('updates viewers on changed to delete', async () => {
            const element = createElement('c-domain-bindings-explorer', {
                is: DomainBindingsExplorer,
            })
            document.body.appendChild(element)

            const domainProcessBindingsFilterEl = element.shadowRoot.querySelector(
                'c-domain-process-bindings-filter'
            )
            domainProcessBindingsFilterEl.dispatchEvent(
                new CustomEvent('action_changed', {
                    detail: 'delete',
                })
            )

            await flushPromises()

            const domainProcessBindingsViewerEls = element.shadowRoot.querySelectorAll(
                'c-domain-process-binding-viewer'
            )

            expect(domainProcessBindingsViewerEls.length).toBe(2)

            expect(domainProcessBindingsViewerEls[0].triggerOperation).toBe('Before_Delete')
            expect(domainProcessBindingsViewerEls[0].selectedSObjectDeveloperName).toBe('')

            expect(domainProcessBindingsViewerEls[1].triggerOperation).toBe('After_Delete')
            expect(domainProcessBindingsViewerEls[1].selectedSObjectDeveloperName).toBe('')
        })
    })

    describe('sobject changes', () => {
        it('updates viewers', async () => {
            const SOBJECT_DEVELOPER_NAME = 'Potato__c'

            const element = createElement('c-domain-bindings-explorer', {
                is: DomainBindingsExplorer,
            })
            document.body.appendChild(element)

            const domainProcessBindingsFilterEl = element.shadowRoot.querySelector(
                'c-domain-process-bindings-filter'
            )
            domainProcessBindingsFilterEl.dispatchEvent(
                new CustomEvent('object_changed', {
                    detail: SOBJECT_DEVELOPER_NAME,
                })
            )

            await flushPromises()

            const domainProcessBindingsViewerEls = element.shadowRoot.querySelectorAll(
                'c-domain-process-binding-viewer'
            )
            expect(domainProcessBindingsViewerEls.length).toBe(2)

            expect(domainProcessBindingsViewerEls[0].triggerOperation).toBe('Before_Insert')
            expect(domainProcessBindingsViewerEls[0].selectedSObjectDeveloperName).toBe(
                SOBJECT_DEVELOPER_NAME
            )

            expect(domainProcessBindingsViewerEls[1].triggerOperation).toBe('After_Insert')
            expect(domainProcessBindingsViewerEls[1].selectedSObjectDeveloperName).toBe(
                SOBJECT_DEVELOPER_NAME
            )
        })
    })

    describe('refresh called', () => {
        it('refreshes viewers', async () => {
            const element = createElement('c-domain-bindings-explorer', {
                is: DomainBindingsExplorer,
            })
            document.body.appendChild(element)

            const domainProcessBindingsViewerEls = element.shadowRoot.querySelectorAll(
                'c-domain-process-binding-viewer'
            )

            const spyArray = domainProcessBindingsViewerEls
                .values()
                .map((el) => jest.spyOn(el, 'refreshBindings'))

            const domainProcessBindingsFilterEl = element.shadowRoot.querySelector(
                'c-domain-process-bindings-filter'
            )
            domainProcessBindingsFilterEl.dispatchEvent(new CustomEvent('refresh'))

            await flushPromises()

            spyArray.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1))
        })
    })

    it('displays default values', () => {
        const element = createElement('c-domain-bindings-explorer', {
            is: DomainBindingsExplorer,
        })
        document.body.appendChild(element)

        const domainProcessBindingsFilterEl = element.shadowRoot.querySelector(
            'c-domain-process-bindings-filter'
        )
        expect(domainProcessBindingsFilterEl).not.toBeNull()

        const domainProcessBindingsViewerEls = element.shadowRoot.querySelectorAll(
            'c-domain-process-binding-viewer'
        )
        expect(domainProcessBindingsViewerEls.length).toBe(2)

        expect(domainProcessBindingsViewerEls[0].triggerOperation).toBe('Before_Insert') // we display the before first
        expect(domainProcessBindingsViewerEls[0].selectedSObjectDeveloperName).toBe('')

        expect(domainProcessBindingsViewerEls[1].triggerOperation).toBe('After_Insert') // then after
        expect(domainProcessBindingsViewerEls[1].selectedSObjectDeveloperName).toBe('')
    })
})
