/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement } from 'lwc'

export const POSSIBLE_ACTIONS = [
    { label: 'Created', value: 'create' },
    { label: 'Updated', value: 'update' },
    { label: 'Deleted', value: 'delete' },
]

export default class DomainProcessBindingsFilter extends LightningElement {
    _selectedAction = POSSIBLE_ACTIONS[0]

    handleObjectChanged(event) {
        this.dispatchEvent(
            new CustomEvent('objectchanged', {
                detail: event.detail,
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

    get selectedActionLabel() {
        return this._selectedAction?.label
    }
}
