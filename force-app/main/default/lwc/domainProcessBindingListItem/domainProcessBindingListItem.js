/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, LightningElement } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

const ICON_NAME_BY_BINDING_TYPE = {
    'Action': 'standard:invocable_action',
    'Criteria': 'standard:activations',
}

export default class DomainProcessBindingListItem extends NavigationMixin(LightningElement) {

    @api record

    async navigateToRecord(event) {
        event.preventDefault()

        //Done this way to open in a new tab
        const url = await this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.record.Id,
                objectApiName: 'DomainProcessBinding__mdt',
                actionName: 'view'
            }
        });
        window.open(url, "_blank");
    }

    get activeBadgeCalculatedClass() {
        let classes = 'slds-grow-none slds-col_bump-left slds-badge '
        if (this.record.IsActive__c) {
            classes += 'slds-badge_lightest'
        }
        return classes
    }

    get activeBadgeLabel() {
        if (this.record.IsActive__c) {
            return 'Active'
        } else {
            return 'Inactive'
        }
    }

    get iconName() {
        return ICON_NAME_BY_BINDING_TYPE[this.record.Type__c]
    }

}