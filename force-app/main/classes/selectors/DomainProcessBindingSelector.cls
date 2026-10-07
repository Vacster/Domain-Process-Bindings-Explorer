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
            DomainProcessBinding__mdt.QualifiedApiName,
            DomainProcessBinding__mdt.DeveloperName,
            DomainProcessBinding__mdt.ExecuteAsynchronous__c,
            DomainProcessBinding__mdt.Id,
            DomainProcessBinding__mdt.IsActive__c,
            DomainProcessBinding__mdt.LogicalInverse__c,
            DomainProcessBinding__mdt.MasterLabel,
            DomainProcessBinding__mdt.OrderOfExecution__c,
            DomainProcessBinding__mdt.PreventRecursive__c,
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

    public override String getOrderBy() {
        return 'OrderOfExecution__c ASC';
    }

    public List<String> selectSObjectNamesWithBindings() {
        List<DomainProcessBinding__mdt> domainProcessBindings = [
            SELECT RelatedDomainBindingSObject__r.QualifiedApiName, RelatedDomainBindingSObjectAlternate__c
            FROM DomainProcessBinding__mdt
        ];
        Set<String> sObjectNames = new Set<String>();

        for (DomainProcessBinding__mdt domainProcessBinding : domainProcessBindings) {
            if (domainProcessBinding.RelatedDomainBindingSObject__r != null) {
                sObjectNames.add(domainProcessBinding.RelatedDomainBindingSObject__r.QualifiedApiName);
            }
            if (String.isNotBlank(domainProcessBinding.RelatedDomainBindingSObjectAlternate__c)) {
                sObjectNames.add(domainProcessBinding.RelatedDomainBindingSObjectAlternate__c);
            }
        }

        return new List<String>(sObjectNames);
    }

    public List<DomainProcessBinding__mdt> selectByRelatedDomainBindingSObjectTriggerOperation(
        final String sObjectDeveloperName,
        final String triggerOperation
    ) {
        List<DomainProcessBinding__mdt> domainProcessBindings = (List<DomainProcessBinding__mdt>) Database.query(
            newQueryFactory()
                .setCondition(
                    'RelatedDomainBindingSObject__r.QualifiedApiName = :sObjectDeveloperName AND TriggerOperation__c = :triggerOperation'
                )
                .toSOQL()
        );
        final List<DomainProcessBinding__mdt> alternateRelatedObjectDomainProcessBindings = (List<DomainProcessBinding__mdt>) Database.query(
            newQueryFactory()
                .setCondition(
                    'RelatedDomainBindingSObjectAlternate__c = :sObjectDeveloperName AND TriggerOperation__c = :triggerOperation'
                )
                .toSOQL()
        );
        domainProcessBindings.addAll(alternateRelatedObjectDomainProcessBindings);

        return domainProcessBindings;
    }
}
