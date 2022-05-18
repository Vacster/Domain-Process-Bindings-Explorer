/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import getDomainProcessBindings from '@salesforce/apex/DomainBindingExplorerController.getDomainProcessBindings';
import { api, LightningElement, wire } from 'lwc';

export default class DomainProcessBindingViewer extends LightningElement {

    @api selectedSObjectDeveloperName = 'Account'

    @api triggerOperation = 'Before_Insert'

    @api isAsync = false

    @wire(getDomainProcessBindings, {sObjectDeveloperName: '$selectedSObjectDeveloperName', triggerOperation: '$triggerOperation', isAsync: '$isAsync'})
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

    get domainProcessBindingsList() {
        return this.domainProcessBindings.data ?? []
    }

    get domainProcessBindingsListLength() {
        return this.domainProcessBindings.data?.length
    }
}