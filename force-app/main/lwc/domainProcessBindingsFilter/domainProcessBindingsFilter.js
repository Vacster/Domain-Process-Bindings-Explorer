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

/**
 * Allows filtering of Domain Process Bindings by SObject or by Action
 *
 * @alias DomainProcessBindingsFilter
 * @hideconstructor
 *
 * @fires DomainProcessBindingsFilter#action_changed
 * @fires DomainProcessBindingsFilter#object_changed
 * @fires DomainProcessBindingsFilter#refresh
 *
 * @example
 * <c-domain-process-bindings-filter
 *      onobject_changed={handleObjectChanged}
 *      onaction_changed={handleActionChanged}
 *      onrefresh={handleRefresh}
 * ></c-domain-process-bindings-filter>
 */
export default class DomainProcessBindingsFilter extends LightningElement {
    _selectedAction = POSSIBLE_ACTIONS[0]

    handleObjectChanged(event) {
        this.dispatchEvent(
            new CustomEvent('object_changed', {
                detail: event.detail,
            })
        )
    }

    handleMenuSelect(event) {
        this._selectedAction = POSSIBLE_ACTIONS.find(
            (action) => action.value === event.detail.value
        )
        this.dispatchEvent(
            new CustomEvent('action_changed', {
                detail: this._selectedAction.value,
            })
        )
    }

    handleRefresh() {
        this.dispatchEvent(new CustomEvent('refresh'))
    }

    get possibleActions() {
        return POSSIBLE_ACTIONS
    }

    get selectedActionLabel() {
        return this._selectedAction?.label
    }
}

/**
 * Action selected has changed
 *
 * @memberof DomainProcessBindingsFilter
 * @event DomainProcessBindingsFilter#action_changed
 * @type {CustomEvent}
 * @property {DomainProcessBindingsFilter~ActionType} detail - the selected Action
 */

/**
 * SObject selected has changed
 *
 * @memberof DomainProcessBindingsFilter
 * @event DomainProcessBindingsFilter#object_changed
 * @type {CustomEvent}
 * @property {String} detail - the selected SObject's DeveloperName
 */

/**
 * Refresh button has been clicked
 *
 * @memberof DomainProcessBindingsFilter
 * @event DomainProcessBindingsFilter#refresh
 * @type {CustomEvent}
 */

/**
 * Describes the possible action types
 * @typedef {('create'|'update'|'delete')} DomainProcessBindingsFilter~ActionType
 */
