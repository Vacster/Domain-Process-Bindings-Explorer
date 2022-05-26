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

    @api refreshBindings() {
        refreshApex(this.domainProcessBindings)
    }

    @wire(getDomainProcessBindings, {
        sObjectDeveloperName: '$selectedSObjectDeveloperName',
        triggerOperation: '$triggerOperation'
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
        return this.domainProcessBindings?.data ?? []
    }

    get domainProcessBindingsListLength() {
        return this.domainProcessBindings?.data?.length ?? 0
    }
}
