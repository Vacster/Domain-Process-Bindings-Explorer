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
 * @alias EntityDefinitionSelector
 * @extends LightningElement
 * @hideconstructor
 *
 * @example
 * <c-entity-definition-selector onobjectchanged={handleObjectChanged}></c-entity-definition-selector>
 */
export default class EntityDefinitionSelector extends LightningElement {
    /**
     * An array of Apex-Triggerable EntityDefinitions
     * @type {Object[]}
     * @private
     */
    _entityDefinitions = []

    /**
     * The currently-selected EntityDefinition's DeveloperName
     * @type {string}
     * @private
     */
    _selectedSObjectDeveloperName = ''

    /**
     * Determines if the popover should be displayed
     * @type {boolean}
     * @private
     */
    _displayPopover = false

    /**
     * Retrieves all Apex-Triggerable EntityDefinition objects as a list
     *
     * @param {object} value - a { data, error } object which can contain a list of DomainProcessBinding in its data attribute
     * @memberof EntityDefinitionSelector
     */
    @wire(getEntityDefinitions)
    entityDefinitionsWire(value) {
        if (value.data) {
            this._entityDefinitions = [...value.data].sort((a, b) => {
                return a.Label.localeCompare(b.Label)
            })
            if (!this._selectedSObjectDeveloperName) {
                this._selectedSObjectDeveloperName = this._entityDefinitions[0].DeveloperName
            }
        }
    }

    /**
     * Handles a change in the Lightning-Combobox that picks the Object to use
     *
     * @param {Event} event - A LWC CustomEvent with a value property in its detail that contains the selected option
     * @memberof EntityDefinitionSelector
     * @fires EntityDefinitionSelector#objectchanged
     * @listens lightning-combobox#changed
     */
    handleObjectChange(event) {
        this._selectedSObjectDeveloperName = event.detail.value
        this._displayPopover = false

        /**
         * Object Changed event
         *
         * @event EntityDefinitionSelector#objectchanged
         * @property {string} detail - contains the selected EntityDefinition's DeveloperName
         */
        this.dispatchEvent(
            new CustomEvent('objectchanged', {
                detail: this._selectedSObjectDeveloperName,
            })
        )
    }

    /**
     * Toggles the display of the popover
     *
     * @memberof EntityDefinitionSelector
     * @listen lightning-button-icon#click
     */
    displayToolbar() {
        this._displayPopover = !this._displayPopover
    }

    /**
     * Provides a map of values and labels for the possible EntityDefinition options
     *
     * @private
     * @readonly
     * @memberof EntityDefinitionSelector
     * @returns {Option[]} - A list of Options for use in the Lightning-Combobox
     */
    get options() {
        /**
         * @typedef {Object} Option
         * @property value - The value for the Lightning Combobox Option
         * @property label - The label for the Lightning Combobox Option
         */
        return this._entityDefinitions.map((entityDefinition) => {
            return { value: entityDefinition.DeveloperName, label: entityDefinition.Label }
        })
    }

    /**
     * Dynamically determines the classes to use for the popover
     *
     * @private
     * @readonly
     * @memberof EntityDefinitionSelector
     * @returns {string} a string that contains all the list the popover must have
     */
    get calculatedPopoverClasses() {
        let defaultClasses = 'slds-popover slds-nubbin_left slds-m-left_medium '
        if (!this._displayPopover) {
            defaultClasses += 'slds-popover_hide'
        }
        return defaultClasses
    }

    /**
     * Retrieve the currently-selected EntityDefinition's DeveloperName
     *
     * @private
     * @readonly
     * @memberof EntityDefinitionSelector
     * @returns {string} the currently-selected EntityDefinition DeveloperName
     */
    get selectedSObjectDeveloperName() {
        return this._selectedSObjectDeveloperName
    }
}
