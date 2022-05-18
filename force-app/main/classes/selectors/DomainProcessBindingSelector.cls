/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
public inherited sharing class DomainProcessBindingSelector extends ApplicationSObjectSelector implements IDomainProcessBindingSelector {
    public static IDomainProcessBindingSelector newInstance() {
        return (IDomainProcessBindingSelector) Application.Selector.newInstance(DomainProcessBinding__mdt.SObjectType);
    }

    public override List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField>{
            DomainProcessBinding__mdt.DeveloperName,
            DomainProcessBinding__mdt.ExecuteAsynchronous__c,
            DomainProcessBinding__mdt.Id,
            DomainProcessBinding__mdt.IsActive__c,
            DomainProcessBinding__mdt.MasterLabel,
            DomainProcessBinding__mdt.OrderOfExecution__c,
            DomainProcessBinding__mdt.Type__c
        };
    }

    @TestVisible
    private List<Schema.SObjectField> getAdditionalSObjectFieldList() {
        return new List<Schema.SObjectField>{};
    }

    public Schema.SObjectType getSObjectType() {
        return DomainProcessBinding__mdt.SObjectType;
    }

    public List<DomainProcessBinding__mdt> selectByRelatedDomainBindingSObjectTriggerOperationAndAsync(
        final String sObjectDeveloperName,
        final String triggerOperation,
        final Boolean isAsync
    ) {
        List<DomainProcessBinding__mdt> domainProcessBindings = (List<DomainProcessBinding__mdt>) Database.query(
            newQueryFactory()
                .setCondition(
                    'RelatedDomainBindingSObject__c = :sObjectDeveloperName AND TriggerOperation__c = :triggerOperation AND ExecuteAsynchronous__c = :isAsync'
                )
                .toSOQL()
        );
        final List<DomainProcessBinding__mdt> alternateRelatedObjectDomainProcessBindings = (List<DomainProcessBinding__mdt>) Database.query(
            newQueryFactory()
                .setCondition(
                    'RelatedDomainBindingSObjectAlternate__c = :sObjectDeveloperName AND TriggerOperation__c = :triggerOperation AND ExecuteAsynchronous__c = :isAsync'
                )
                .toSOQL()
        );
        domainProcessBindings.addAll(alternateRelatedObjectDomainProcessBindings);

        return domainProcessBindings;
    }
}
