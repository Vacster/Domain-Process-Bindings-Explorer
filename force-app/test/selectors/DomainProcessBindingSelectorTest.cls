/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
@IsTest
private class DomainProcessBindingSelectorTest {
    /**
     * Following the example from this blog post:
     * https://developer.salesforce.com/blogs/engineering/2015/05/testing-custom-metadata-types
     */
    private static final String TEST_CRITERIA_RECORD_DEVELOPER_NAME = 'DPBE_SelectorCriteriaTestRecord';
    private static final String TEST_ACTION_RECORD_DEVELOPER_NAME = 'DPBE_SelectorActionTestRecord';

    @IsTest
    private static void newInstanceShouldReturnExpectedInterface() {
        // exercise
        Test.startTest();
        IApplicationSObjectSelector returnedInterface = DomainProcessBindingSelector.newInstance();
        Test.stopTest();

        // validate
        System.assertNotEquals(null, returnedInterface, 'Returned interface should not be null');
        System.assert(
            returnedInterface instanceof IDomainProcessBindingSelector,
            'Returned interface should be an instance of IDomainProcessBindingSelector'
        );
    }

    @IsTest
    private static void getSObjectTypeShouldReturnExpectedSObjectType() {
        // exercise
        Test.startTest();
        SObjectType returnedSObjectType = new DomainProcessBindingSelector().getSObjectType();
        Test.stopTest();

        // validate
        System.assert(
            returnedSObjectType == DomainProcessBinding__mdt.SObjectType,
            'Returned SObject Type should be an instance of DomainProcessBinding__mdt SObjectType'
        );
    }

    @IsTest
    private static void getSObjectFieldListShouldReturnExpectedFields() {
        // prepare
        final List<Schema.SObjectField> expectedSObjectFields = new List<Schema.SObjectField>{
            DomainProcessBinding__mdt.QualifiedApiName,
            DomainProcessBinding__mdt.DeveloperName,
            DomainProcessBinding__mdt.ExecuteAsynchronous__c,
            DomainProcessBinding__mdt.Id,
            DomainProcessBinding__mdt.IsActive__c,
            DomainProcessBinding__mdt.MasterLabel,
            DomainProcessBinding__mdt.OrderOfExecution__c,
            DomainProcessBinding__mdt.Type__c
        };

        // exercise
        Test.startTest();
        final List<Schema.SObjectField> returnedSObjectFields = new DomainProcessBindingSelector().getSObjectFieldList();
        Test.stopTest();

        // validate
        // Running this way to make 100% sure expectedSObjectFields matches 1-1 with returnedSObjectFields
        // this way we're sure no extra fields are either in the Selector or in the Test
        for (Schema.SObjectField currentSObjectField : expectedSObjectFields) {
            System.assert(
                returnedSObjectFields.contains(currentSObjectField),
                'Returned SObject Fields should contain all expected SObject Fields; no more and no less'
            );
        }
        for (Schema.SObjectField currentSObjectField : returnedSObjectFields) {
            System.assert(
                expectedSObjectFields.contains(currentSObjectField),
                'Returned SObject Fields should contain all expected SObject Fields; no more and no less'
            );
        }
    }

    @IsTest
    private static void getAdditionalSObjectFieldListShouldReturnExpectedFields() {
        // prepare

        // We currently don't expect any fields in the Additonal SObject Field List
        final List<Schema.SObjectField> expectedSObjectFields = new List<Schema.SObjectField>();

        // exercise
        Test.startTest();
        final List<Schema.SObjectField> returnedSObjectFields = new DomainProcessBindingSelector()
            .getAdditionalSObjectFieldList();
        Test.stopTest();

        // validate
        for (Schema.SObjectField currentSObjectField : expectedSObjectFields) {
            System.assert(
                returnedSObjectFields.contains(currentSObjectField),
                'Returned Additional SObject Fields should contain all expected SObject Fields'
            );
        }
    }

    @IsTest
    private static void selectByRelatedDomainBindingSObjectTriggerOperationShouldReturnExpectedRecords() {
        // prepare
        Map<Id, DomainProcessBinding__mdt> existingDomainProcessBindings = new Map<Id, DomainProcessBinding__mdt>(
            [
                SELECT Id, Type__c, IsActive__c, ExecuteAsynchronous__c, OrderOfExecution__c
                FROM DomainProcessBinding__mdt
                WHERE DeveloperName IN (:TEST_CRITERIA_RECORD_DEVELOPER_NAME, :TEST_ACTION_RECORD_DEVELOPER_NAME)
            ]
        );

        // exercise
        Test.startTest();
        List<DomainProcessBinding__mdt> returnedDomainProcessBindings = new DomainProcessBindingSelector()
            .selectByRelatedDomainBindingSObjectTriggerOperation(
                DomainProcessBinding__mdt.SObjectType.getDescribe().getName(),
                'Before_Insert'
            );
        Test.stopTest();

        // validate
        System.assertEquals(
            existingDomainProcessBindings.keySet().size(),
            returnedDomainProcessBindings.size(),
            'Returned Domain Process Bindings should have returned the same amount as expected Existing Domain Process Bindings.'
        );
        for (DomainProcessBinding__mdt currentDomainProcessBinding : returnedDomainProcessBindings) {
            System.assert(
                existingDomainProcessBindings.containsKey(currentDomainProcessBinding.Id),
                'Returned Domain Process Binding must be found in expected Existing Domain Process Bindings'
            );
        }
    }

    @IsTest
    private static void getOrderByShouldReturnAscendingOrderOfExecution() {
        // prepare
        final String expectedOrderByValue = 'OrderOfExecution__c ASC';

        // exercise
        Test.startTest();
        final String returnedOrderByValue = new DomainProcessBindingSelector().getOrderBy();
        Test.stopTest();

        // validate
        System.assertEquals(
            expectedOrderByValue,
            returnedOrderByValue,
            'Expected Ascending order by OrderOfExecution__c field'
        );
    }
}
