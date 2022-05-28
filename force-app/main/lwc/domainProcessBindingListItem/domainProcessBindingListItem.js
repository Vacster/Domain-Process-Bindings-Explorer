/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, LightningElement } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

export const ICON_NAME_BY_BINDING_TYPE = {
    Action: 'standard:invocable_action',
    Criteria: 'standard:filter_criteria_rule',
}

/**
 * Displays information regarding a single Domain Process Binding record
 * 
 * @alias DomainProcessBindingListItem
 * @hideconstructor
 * 
 * @example
 * <c-domain-process-binding-list-item record={domainProcessBinding}></c-domain-process-binding-list-item>
 */
export default class DomainProcessBindingListItem extends NavigationMixin(LightningElement) {
    /**
     * A Domain process Binding record
     * @type {DomainProcessBinding}
     */
    @api record

    async navigateToRecord(event) {
        event.preventDefault()

        //Done this way to open in a new tab
        const url = await this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.record.Id,
                objectApiName: 'DomainProcessBinding__mdt',
                actionName: 'view',
            },
        })
        window.open(url, '_blank')
    }

    get activeBadgeCalculatedClass() {
        let classes = 'slds-grow-none slds-col_bump-left slds-badge '
        if (this.record?.IsActive__c) {
            classes += 'slds-badge_lightest'
        }
        return classes
    }

    get activeBadgeLabel() {
        if (this.record?.IsActive__c) {
            return 'Active'
        }
        return 'Inactive'
    }

    get recordLabel() {
        return this.record?.MasterLabel
    }

    get orderOfExecution() {
        return this.record?.OrderOfExecution__c
    }

    get isAsync() {
        return this.record?.ExecuteAsynchronous__c
    }
    
    get iconName() {
        return ICON_NAME_BY_BINDING_TYPE[this.record?.Type__c]
    }
}
