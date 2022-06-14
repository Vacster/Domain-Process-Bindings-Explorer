/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, wire } from 'lwc'
import getEntityDefinitions from '@salesforce/apex/DomainBindingExplorerController.getEntityDefinitions'

/**
 * Simple popover selector that allows a user to choose any EntityDefinition record that is Apex Triggerable
 *
 * @alias EntityDefinitionSelector
 * @hideconstructor
 *
 * @fires EntityDefinitionSelector#object_changed
 *
 * @example
 * <c-entity-definition-selector onobject_changed={handleObjectChanged}></c-entity-definition-selector>
 */
export default class EntityDefinitionSelector extends LightningElement {
    _entityDefinitions = []
    _selectedSObjectDeveloperName = ''
    _selectedSObjectLabel = ''
    _displayPopover = false

    @wire(getEntityDefinitions)
    entityDefinitionsWire(value) {
        if (value.data) {
            this._entityDefinitions = [...value.data].sort((a, b) => {
                return a.Label.localeCompare(b.Label)
            })
            if (!this.selectedSObjectDeveloperName) {
                this.selectedSObjectDeveloperName = this._entityDefinitions[0].QualifiedApiName
            }
        }
    }

    handleObjectChange(event) {
        this.selectedSObjectDeveloperName = event.detail.value
        this._displayPopover = false
    }

    displayToolbar() {
        this._displayPopover = !this._displayPopover
    }

    get options() {
        return this._entityDefinitions.map((entityDefinition) => {
            return { value: entityDefinition.QualifiedApiName, label: entityDefinition.Label }
        })
    }

    get calculatedPopoverClasses() {
        let defaultClasses = 'slds-popover slds-nubbin_left slds-m-left_medium '
        if (!this._displayPopover) {
            defaultClasses += 'slds-popover_hide'
        }
        return defaultClasses
    }

    get selectedSObjectLabel() {
        return this._selectedSObjectLabel
    }

    get selectedSObjectDeveloperName() {
        return this._selectedSObjectDeveloperName
    }

    set selectedSObjectDeveloperName(value) {
        this._selectedSObjectDeveloperName = value
        this._selectedSObjectLabel = this.options.find((element) => element.value === value)?.label

        this.dispatchEvent(
            new CustomEvent('object_changed', {
                detail: value,
            })
        )
    }
}

/**
 * SObject selected has changed
 *
 * @memberof EntityDefinitionSelector
 * @event EntityDefinitionSelector#object_changed
 * @type {CustomEvent}
 * @property {String} detail - the selected SObject's DeveloperName
 */
