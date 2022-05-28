/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, wire } from 'lwc'
import { refreshApex } from '@salesforce/apex'
import getDomainProcessBindings from '@salesforce/apex/DomainBindingExplorerController.getDomainProcessBindings'

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

    _isLoading = false

    /**
     * Refreshes the Domain Process Binding records
     * @function refreshBindings
     * @instance
     * @memberof DomainProcessBindingViewer
     */
    @api async refreshBindings() {
        this._isLoading = true
        await refreshApex(this.domainProcessBindings)
        this._isLoading = false
    }

    @wire(getDomainProcessBindings, {
        sObjectDeveloperName: '$selectedSObjectDeveloperName',
        triggerOperation: '$triggerOperation',
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
            title = 'Record After Save'
        }
        return title
    }

    //TODO: Figures out why this line method does not show up as covered during jest tests
    get domainProcessBindingsList() {
        let domainProcessBindings = this.domainProcessBindings?.data
        if (domainProcessBindings !== undefined) {
            return domainProcessBindings
        }
        return []
    }

    get domainProcessBindingsListLength() {
        return this.domainProcessBindings?.data?.length ?? 0
    }

    get isLoading() {
        return !this.domainProcessBindings.data || this._isLoading
    }
}

/**
 * A String representation of the possible Trigger Operation for a Domain Process Binding
 * @typedef {'Before_Insert'|'After_Insert'|'Before_Update'|'After_Update'|'Before_Delete'|'After_Delete'} DomainProcessBindingViewer~TriggerOperationType
 */
