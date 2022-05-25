/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement } from 'lwc'

/**
 * Displays information regarding an org's Domain Process Bindings. Allows filtering by specific SObject and Trigger Operation
 * 
 * @alias DomainBindingsExplorer
 * @hideconstructor
 * 
 * @example
 * <c-domain-process-bindings-explorer></c-domain-process-bindings-explorer>
 */
export default class DomainBindingsExplorer extends LightningElement {
    _selectedSObjectDeveloperName = 'Account'
    _triggerOperation = 'create'

    handleObjectChanged(event) {
        this._selectedSObjectDeveloperName = event.detail
    }

    handleTriggerOperationChanged(event) {
        this._triggerOperation = event.detail
    }

    get selectedSObjectDeveloperName() {
        return this._selectedSObjectDeveloperName
    }

    get beforeTriggerOperation() {
        let triggerOperation = 'Before_'
        if (this._triggerOperation === 'create') {
            triggerOperation += 'Insert'
        } else if (this._triggerOperation === 'update') {
            triggerOperation += 'Update'
        } else if (this._triggerOperation === 'delete') {
            triggerOperation += 'Delete'
        }

        return triggerOperation
    }

    get afterTriggerOperation() {
        let triggerOperation = 'After_'
        if (this._triggerOperation === 'create') {
            triggerOperation += 'Insert'
        } else if (this._triggerOperation === 'update') {
            triggerOperation += 'Update'
        } else if (this._triggerOperation === 'delete') {
            triggerOperation += 'Delete'
        }

        return triggerOperation
    }
}
