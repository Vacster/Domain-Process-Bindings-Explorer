import { LightningElement } from 'lwc'

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
        let triggerOperation = 'Before_';
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
        let triggerOperation = 'After_';
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