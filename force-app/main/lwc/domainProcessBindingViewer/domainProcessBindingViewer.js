/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track, wire } from 'lwc'
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

    @track _loadingElements = {
        bindings: true,
        triggerOperation: true,
        selectedSObjectDeveloperName: true
    }

    /**
     * Determines the DeveloperName of the Related Domain SObject Binding
     * @param {String} value
     * @default 'Account'
     */ 
    set selectedSObjectDeveloperName(value) {
        this._loadingElements.selectedSObjectDeveloperName = true
        this._selectedSObjectDeveloperName = value
    }
    
    @api
    get selectedSObjectDeveloperName() {
        return this._selectedSObjectDeveloperName
    }

    _selectedSObjectDeveloperName = 'Account'

    /**
     * Determines when a binding occurs
     * @param {TriggerOperationType} value
     * @default 'Before_Insert'
     */
    set triggerOperation(value) {
        this._loadingElements.triggerOperation = true
        this._triggerOperation = value
    }

    @api 
    get triggerOperation() {
        return this._triggerOperation
    }
    
    _triggerOperation = 'Before_Insert'

    /**
     * Refreshes the Domain Process Binding records
     * @function refreshBindings
     * @instance
     * @memberof DomainProcessBindingViewer
     */
    @api async refreshBindings() {
        this._loadingElements.bindings = true
        // We want a minimum of 300ms to show that a loading was attempted, only used for UX
        await Promise.all([
            refreshApex(this._domainProcessBindingsWire),
            new Promise(resolve => {
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                setTimeout(resolve, 300)
            })
        ])
        this._loadingElements.bindings = false
    }

    _domainProcessBindingsWire = {data: undefined, error: undefined}

    @wire(getDomainProcessBindings, {
        sObjectDeveloperName: '$selectedSObjectDeveloperName',
        triggerOperation: '$triggerOperation',
    })
    domainProcessBindings(value) {
        this._domainProcessBindingsWire = value
        this._loadingElements.bindings = false
        this._loadingElements.selectedSObjectDeveloperName = false
        this._loadingElements.triggerOperation = false
    }

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

    //TODO: Figure out why this method does not show up as covered during jest tests
    get domainProcessBindingsList() {
        let domainProcessBindings = this._domainProcessBindingsWire?.data
        if (domainProcessBindings !== undefined) {
            return domainProcessBindings
        }
        return []
    }

    get domainProcessBindingsListLength() {
        return this._domainProcessBindingsWire?.data?.length ?? 0
    }

    get isLoading() {
        return Object.values(this._loadingElements).some((element) => element)
    }
}

/**
 * A String representation of the possible Trigger Operation for a Domain Process Binding
 * @typedef {'Before_Insert'|'After_Insert'|'Before_Update'|'After_Update'|'Before_Delete'|'After_Delete'} TriggerOperationType
 */
