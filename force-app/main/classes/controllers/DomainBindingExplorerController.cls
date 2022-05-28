/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
public with sharing class DomainBindingExplorerController {
    /**
     * @description Returns a list of all Entity Definitions where IsApexTriggerable is TRUE
     *
     * @return a list of all ApexTriggerable Entity Definitions
     *
     * @throws AuraHandledException from any Exception that can happen during the query
     */
    @AuraEnabled(Cacheable=true)
    public static List<EntityDefinition> getEntityDefinitions() {
        try {
            return EntityDefinitionsSelector.newInstance().selectByApexTriggerable(true);
        } catch (Exception e) {
            AuraHandledException convertedException = new AuraHandledException(e.getMessage());
            convertedException.setMessage(e.getMessage());
            throw convertedException;
        }
    }

    /**
     * @description returns all DomainProcessBinding__mdt records that meet the criterium passed in through parameters
     *
     * @param sObjectDeveloperName the SObject Developer name that matches the
     *                             RelatedDomainBindingSObject__c or RelatedDomainBindingSObjectAlternate__c
     *                             fields in the DomainProcessBinding__mdt records
     * @param triggerOperation the Trigger Operation that matches the TriggerOperation__c field in the
     *                         DomainProcessBinding__mdt records
     *
     * @return a list of all DomainProcessBinding__mdt records that meet the criterium
     *
     * @throws AuraHandledException from any Exception that can happen during the query
     *
     * @example
     * DomainBindingExplorerController.getDomainProcessBindings(
     *     'Account',
     *     'Before_Insert'
     * );
     */
    @AuraEnabled(Cacheable=true)
    public static List<DomainProcessBinding__mdt> getDomainProcessBindings(
        final String sObjectDeveloperName,
        final String triggerOperation
    ) {
        try {
            return DomainProcessBindingSelector.newInstance()
                .selectByRelatedDomainBindingSObjectTriggerOperation(
                    sObjectDeveloperName,
                    triggerOperation
                );
        } catch (Exception e) {
            AuraHandledException convertedException = new AuraHandledException(e.getMessage());
            convertedException.setMessage(e.getMessage());
            throw convertedException;
        }
    }
}
