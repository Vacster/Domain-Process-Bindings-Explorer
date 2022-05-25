/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import getDomainProcessBindings from '@salesforce/apex/DomainBindingExplorerController.getDomainProcessBindings'
import { api, LightningElement, wire } from 'lwc'

/**
 * Displays a list of Domain Process Bindings that fit the criteria passed through this component's public properties
 *
 * @alias DomainProcessBindingViewer
 * @hideconstructor
 *
 * @example
 * <c-domain-process-binding-viewer
 *      selected-sobject-developer-name='Potato__c'
 *      trigger-operation="Before_Update"
 *      is-async="true"
 * ></c-domain-process-binding-viewer>
 */
export default class DomainProcessBindingViewer extends LightningElement {
    /**
     * Determines the DeveloperName of the Related Domain SObject Binding
     * @type {String}
     * @default 'Account'
     */
    @api selectedSObjectDeveloperName = 'Account'

    /**
     * Determines when a binding occurs
     * @type {DomainProcessBindingViewer~TriggerOperationType}
     * @default 'Before_Insert'
     */
    @api triggerOperation = 'Before_Insert'

    /**
     * Determines if the Domain Process Binding executes asynchronously or not
     * @type {boolean}
     * @default false
     */
    @api isAsync = false

    @wire(getDomainProcessBindings, {
        sObjectDeveloperName: '$selectedSObjectDeveloperName',
        triggerOperation: '$triggerOperation',
        isAsync: '$isAsync',
    })
    domainProcessBindings

    get calculatedTitle() {
        let title = ''
        if (this.triggerOperation.startsWith('Before')) {
            if (this.isAsync) {
                throw Error('Impossible State Found: Before + Async')
            }
            title = 'Record Before Save'
        } else if (this.triggerOperation.startsWith('After')) {
            if (this.isAsync) {
                title = 'Run Asynchronously'
            } else {
                title = 'Record After Save'
            }
        }
        return title
    }

    //TODO: Figures out why this line method does not show up as covered during jest tests
    get domainProcessBindingsList() {
        return this.domainProcessBindings?.data ?? []
    }

    get domainProcessBindingsListLength() {
        return this.domainProcessBindings?.data?.length ?? 0
    }
}

/**
 * A String representation of the possible Trigger Operation for a Domain Process Binding
 * @typedef {'Before_Insert'|'After_Insert'|'Before_Update'|'After_Update'|'Before_Delete'|'After_Delete'} DomainProcessBindingViewer~TriggerOperationType
 */
