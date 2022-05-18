/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
public with sharing class DomainBindingExplorerController {
    @AuraEnabled(Cacheable=true)
    public static List<EntityDefinition> getEntityDefinitions() {
        //TODO: Transfer this into an EntityDefinitionsSelector to allow mocking in tests
        try {
            return [
                SELECT Id, DeveloperName, Label
                FROM EntityDefinition
                WHERE IsApexTriggerable = TRUE
                WITH SECURITY_ENFORCED
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(Cacheable=true)
    public static List<DomainProcessBinding__mdt> getDomainProcessBindings(
        final String sObjectDeveloperName,
        final String triggerOperation,
        final Boolean isAsync
    ) {
        //TODO: Transfer this into a DomainProcessBindingsSelector to allow mocking in tests
        List<DomainProcessBinding__mdt> domainProcessBindings = [
            SELECT Id, MasterLabel, DeveloperName, IsActive__c, OrderOfExecution__c, Type__c, ExecuteAsynchronous__c
            FROM DomainProcessBinding__mdt
            WHERE
                RelatedDomainBindingSObject__c = :sObjectDeveloperName
                AND TriggerOperation__c = :triggerOperation
                AND ExecuteAsynchronous__c = :isAsync
            WITH SECURITY_ENFORCED
            ORDER BY OrderOfExecution__c ASC
        ];

        final List<DomainProcessBinding__mdt> alternateRelatedObjectDomainProcessBindings = [
            SELECT Id, MasterLabel, DeveloperName, IsActive__c, OrderOfExecution__c, Type__c, ExecuteAsynchronous__c
            FROM DomainProcessBinding__mdt
            WHERE
                RelatedDomainBindingSObjectAlternate__c = :sObjectDeveloperName
                AND TriggerOperation__c = :triggerOperation
                AND ExecuteAsynchronous__c = :isAsync
            WITH SECURITY_ENFORCED
            ORDER BY OrderOfExecution__c ASC
        ];

        domainProcessBindings.addAll(alternateRelatedObjectDomainProcessBindings);

        return domainProcessBindings;
    }
}
