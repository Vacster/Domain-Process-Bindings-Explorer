/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
@IsTest
private class EntityDefinitionsSelectorTest {
    @IsTest
    private static void newInstanceShouldReturnExpectedInterface() {
        // exercise
        Test.startTest();
        IApplicationSObjectSelector returnedInterface = EntityDefinitionsSelector.newInstance();
        Test.stopTest();

        // validate
        System.assertNotEquals(null, returnedInterface, 'Returned interface should not be null');
        System.assert(
            returnedInterface instanceof IEntityDefinitionsSelector,
            'Returned interface should be an instance of IEntityDefinitionsSelector'
        );
    }

    @IsTest
    private static void getSObjectTypeShouldReturnExpectedSObjectType() {
        // exercise
        Test.startTest();
        SObjectType returnedSObjectType = new EntityDefinitionsSelector().getSObjectType();
        Test.stopTest();

        // validate
        System.assert(
            returnedSObjectType == EntityDefinition.SObjectType,
            'Returned SObject Type should be an instance of EntityDefinition SObjectType'
        );
    }

    @IsTest
    private static void getSObjectFieldListShouldReturnExpectedFields() {
        // prepare
        final List<Schema.SObjectField> expectedSObjectFields = new List<Schema.SObjectField>{
            EntityDefinition.Id,
            EntityDefinition.DeveloperName,
            EntityDefinition.Label
        };

        // exercise
        Test.startTest();
        final List<Schema.SObjectField> returnedSObjectFields = new EntityDefinitionsSelector().getSObjectFieldList();
        Test.stopTest();

        // validate
        for (Schema.SObjectField currentSObjectField : expectedSObjectFields) {
            System.assert(
                returnedSObjectFields.contains(currentSObjectField),
                'Returned SObject Fields should contain all expected SObject Fields'
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
        final List<Schema.SObjectField> returnedSObjectFields = new EntityDefinitionsSelector()
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
    private static void selectByApexTriggerableShouldReturnExpectedRecords() {
        // prepare
        List<EntityDefinition> expectedEntityDefinitions = [
            SELECT Id, DeveloperName, Label
            FROM EntityDefinition
            WHERE IsApexTriggerable = TRUE
        ];

        // exercise
        Test.startTest();
        List<EntityDefinition> returnedEntityDefinitions = new EntityDefinitionsSelector().selectByApexTriggerable(true);
        Test.stopTest();

        // validate
        System.assertEquals(
            expectedEntityDefinitions.size(),
            returnedEntityDefinitions.size(),
            'Returned Entity Definitions should have returned the same amount as expected Existing Entity Definitions.'
        );
    }
}
