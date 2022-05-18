/**
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, 
 *   are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, 
 *      this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, 
 *      this list of conditions and the following disclaimer in the documentation 
 *      and/or other materials provided with the distribution.
 * - Neither the name of the John M. Daniel, nor the names of its contributors 
 *      may be used to endorse or promote products derived from this software without 
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES 
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL 
 *  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 *  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/

public with sharing class DomainBindingExplorerController {

    @AuraEnabled(Cacheable = true)
    public static List<EntityDefinition> getEntityDefinitions(){
        //TODO: Transfer this into an EntityDefinitionsSelector to allow mocking in tests
        try {
            return [SELECT Id, DeveloperName, Label FROM EntityDefinition WHERE IsApexTriggerable = TRUE WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(Cacheable = true)
    public static List<DomainProcessBinding__mdt> getDomainProcessBindings(final String sObjectDeveloperName, final String triggerOperation, final Boolean isAsync) {
        //TODO: Transfer this into a DomainProcessBindingsSelector to allow mocking in tests
        List<DomainProcessBinding__mdt> domainProcessBindings = [
            SELECT Id, MasterLabel, DeveloperName, IsActive__c, OrderOfExecution__c, Type__c, ExecuteAsynchronous__c
            FROM DomainProcessBinding__mdt
            WHERE RelatedDomainBindingSObject__c =: sObjectDeveloperName
            AND TriggerOperation__c =: triggerOperation
            AND ExecuteAsynchronous__c =: isAsync
            WITH SECURITY_ENFORCED
            ORDER BY OrderOfExecution__c ASC
        ];

        final List<DomainProcessBinding__mdt> alternateRelatedObjectDomainProcessBindings = [
            SELECT Id, MasterLabel, DeveloperName, IsActive__c, OrderOfExecution__c, Type__c, ExecuteAsynchronous__c
            FROM DomainProcessBinding__mdt
            WHERE RelatedDomainBindingSObjectAlternate__c =: sObjectDeveloperName
            AND TriggerOperation__c =: triggerOperation
            AND ExecuteAsynchronous__c =: isAsync
            WITH SECURITY_ENFORCED
            ORDER BY OrderOfExecution__c ASC
        ];

        domainProcessBindings.addAll(alternateRelatedObjectDomainProcessBindings);

        return domainProcessBindings;
    }
}
