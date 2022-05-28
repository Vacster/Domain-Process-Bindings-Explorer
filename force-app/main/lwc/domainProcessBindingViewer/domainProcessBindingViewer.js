/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, wire } from 'lwc'
import { refreshApex } from '@salesforce/apex'
import getDomainProcessBindings from '@salesforce/apex/DomainBindingExplorerController.getDomainProcessBindings'

export default class DomainProcessBindingViewer extends LightningElement {
    @api selectedSObjectDeveloperName = 'Account'

    @api triggerOperation = 'Before_Insert'

    @api isAsync = false

    _isLoading = false

    @api async refreshBindings() {
        this._isLoading = true
        await refreshApex(this.domainProcessBindings)
        this._isLoading = false
    }

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
