/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, wire } from 'lwc'
import getEntityDefinitions from '@salesforce/apex/DomainBindingExplorerController.getEntityDefinitions'
import getSObjectNamesWithDomainProcessBindings from '@salesforce/apex/DomainBindingExplorerController.getSObjectNamesWithDomainProcessBindings'

/**
 * Popover selector for Apex Triggerable EntityDefinitions referenced by a Domain Process Binding
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
    _loading = true
    _sObjectNamesWithBindings = []
    _bindingNamesLoading = true
    _bindingNamesError = false

    @wire(getEntityDefinitions)
    entityDefinitionsWire(value) {
        if (value.data) {
            this._entityDefinitions = [...value.data].sort((a, b) => {
                return a.Label.localeCompare(b.Label)
            })
            this._loading = false
            this.updateSelectedObject()
        }
    }

    @wire(getSObjectNamesWithDomainProcessBindings)
    sObjectNamesWithBindingsWire(value) {
        if (value.data) {
            this._sObjectNamesWithBindings = value.data
            this._bindingNamesLoading = false
            this._bindingNamesError = false
            this.updateSelectedObject()
        } else if (value.error) {
            this._bindingNamesLoading = false
            this._bindingNamesError = true
            this.updateSelectedObject()
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
        return this._entityDefinitions
            .filter((entityDefinition) =>
                this._sObjectNamesWithBindings.includes(entityDefinition.QualifiedApiName)
            )
            .map((entityDefinition) => {
                return { value: entityDefinition.QualifiedApiName, label: entityDefinition.Label }
            })
    }

    updateSelectedObject() {
        if (this._loading || this._bindingNamesLoading) {
            return
        }
        if (!this.options.some((option) => option.value === this.selectedSObjectDeveloperName)) {
            const selectedValue = this.options[0]?.value ?? ''
            if (selectedValue !== this.selectedSObjectDeveloperName) {
                this.selectedSObjectDeveloperName = selectedValue
            }
        }
    }

    get calculatedPopoverClasses() {
        let defaultClasses = 'slds-popover slds-nubbin_left slds-m-left_medium '
        if (!this._displayPopover) {
            defaultClasses += 'slds-popover_hide'
        }
        return defaultClasses
    }

    get selectedSObjectLabel() {
        return this.isLoading ? 'Loading...' : this._selectedSObjectLabel
    }

    get selectedSObjectDeveloperName() {
        return this._selectedSObjectDeveloperName
    }

    get isLoading() {
        return this._loading || this._bindingNamesLoading
    }

    get hasBindingNamesError() {
        return this._bindingNamesError
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
