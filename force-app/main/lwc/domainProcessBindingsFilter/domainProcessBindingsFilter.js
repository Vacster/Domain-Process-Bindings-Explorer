/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import getEntityDefinitions from '@salesforce/apex/DomainBindingExplorerController.getEntityDefinitions'
import { LightningElement, wire } from 'lwc'

const POSSIBLE_ACTIONS = [
    { label: 'Created', value: 'create' },
    { label: 'Updated', value: 'update' },
    { label: 'Deleted', value: 'delete' },
]

export default class DomainProcessBindingsFilter extends LightningElement {
    _selectedSObjectDeveloperName = ''
    _selectedAction = POSSIBLE_ACTIONS[0]

    @wire(getEntityDefinitions)
    entityDefinitionsWire(value) {
        if (value.data) {
            if (!this._selectedSObjectDeveloperName) {
                this._selectedSObjectDeveloperName = value.data[0].DeveloperName
            }
        }
    }

    handleObjectChanged(event) {
        this._selectedSObjectDeveloperName = event.detail
        this.dispatchEvent(
            new CustomEvent('objectchanged', {
                detail: this._selectedSObjectDeveloperName,
            })
        )
    }

    handleMenuSelect(event) {
        this._selectedAction = POSSIBLE_ACTIONS.find(
            (action) => action.value === event.detail.value
        )
        this.dispatchEvent(
            new CustomEvent('actionchanged', {
                detail: this._selectedAction.value,
            })
        )
    }

    get possibleActions() {
        return POSSIBLE_ACTIONS
    }

    get selectedSObjectDeveloperName() {
        return this._selectedSObjectDeveloperName
    }

    get selectedActionLabel() {
        return this._selectedAction?.label
    }
}
