/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
@IsTest
private class DomainBindingExplorerControllerTest {
    private static final fflib_ApexMocks MOCKS = new fflib_ApexMocks();

    @IsTest
    private static void getEntityDefinitionsShouldReturnEntityDefinitions() {
        // prepare
        final List<EntityDefinition> mockEntityDefinitions = new List<EntityDefinition>{
            new EntityDefinition(Id = fflib_IDGenerator.generate(EntityDefinition.SObjectType))
        };

        // mock
        IEntityDefinitionsSelector entityDefinitionsSelectorMock = (IEntityDefinitionsSelector) MOCKS.mock(
            IEntityDefinitionsSelector.class
        );
        MOCKS.startStubbing();
        MOCKS.when(entityDefinitionsSelectorMock.sObjectType()).thenReturn(EntityDefinition.SObjectType);
        MOCKS.when(entityDefinitionsSelectorMock.selectByApexTriggerable(true)).thenReturn(mockEntityDefinitions);
        MOCKS.stopStubbing();
        Application.Selector.setMock(entityDefinitionsSelectorMock);

        // exercise
        Test.startTest();
        final List<EntityDefinition> returnedEntityDefinitions = DomainBindingExplorerController.getEntityDefinitions();
        Test.stopTest();

        // validate
        System.assertEquals(
            mockEntityDefinitions.size(),
            returnedEntityDefinitions.size(),
            'Returned Entity Definitions size should match'
        );
    }

    @IsTest
    private static void getEntityDefinitionsShouldThrowAuraHandledExceptionOnError() {
        // prepare
        Exception exceptionToThrow = new System.QueryException('This is an error message');

        // mock
        IEntityDefinitionsSelector entityDefinitionsSelectorMock = (IEntityDefinitionsSelector) MOCKS.mock(
            IEntityDefinitionsSelector.class
        );
        MOCKS.startStubbing();
        MOCKS.when(entityDefinitionsSelectorMock.sObjectType()).thenReturn(EntityDefinition.SObjectType);
        MOCKS.when(entityDefinitionsSelectorMock.selectByApexTriggerable(true)).thenThrow(exceptionToThrow);
        MOCKS.stopStubbing();
        Application.Selector.setMock(entityDefinitionsSelectorMock);

        // exercise
        Test.startTest();
        Exception caughtException;
        try {
            final List<EntityDefinition> returnedEntityDefinitions = DomainBindingExplorerController.getEntityDefinitions();
        } catch (Exception e) {
            caughtException = e;
        }
        Test.stopTest();

        // validate
        System.assertNotEquals(null, caughtException, 'An exception should have been thrown and caught');
        System.assert(
            caughtException instanceof AuraHandledException,
            'Caught exception should be an instance of AuraHandledException'
        );
        System.assertEquals(
            exceptionToThrow.getMessage(),
            caughtException.getMessage(),
            'Caught Exception Message should match message from original exception'
        );
    }

    @IsTest
    private static void getDomainProcessBindingsShouldReturnDomainProcessBindings() {
        // prepare
        final String sObjectDeveloperName = 'PotatoDeveloperName';
        final String triggerOperation = 'Before_Insert';
        final List<DomainProcessBinding__mdt> mockDomainProcessBindings = new List<DomainProcessBinding__mdt> {
            new DomainProcessBinding__mdt(
                Id = fflib_IDGenerator.generate(DomainProcessBinding__mdt.SObjectType),
                RelatedDomainBindingSObjectAlternate__c = sObjectDeveloperName,
                TriggerOperation__c = triggerOperation
            )
        };

        // mock
        IDomainProcessBindingSelector domainProcessBindingsSelectorMock = (IDomainProcessBindingSelector) MOCKS.mock(
            IDomainProcessBindingSelector.class
        );
        MOCKS.startStubbing();
        MOCKS.when(domainProcessBindingsSelectorMock.sObjectType()).thenReturn(DomainProcessBinding__mdt.SObjectType);
        MOCKS.when(domainProcessBindingsSelectorMock.selectByRelatedDomainBindingSObjectTriggerOperation(
            sObjectDeveloperName, triggerOperation
        )).thenReturn(mockDomainProcessBindings);
        MOCKS.stopStubbing();
        Application.Selector.setMock(domainProcessBindingsSelectorMock);

        // exercise
        Test.startTest();
        final List<DomainProcessBinding__mdt> returnedDomainProcessBindings = DomainBindingExplorerController.getDomainProcessBindings(
            sObjectDeveloperName, triggerOperation
        );
        Test.stopTest();

        // validate
        System.assertEquals(
            mockDomainProcessBindings.size(),
            returnedDomainProcessBindings.size(),
            'Returned Domain Process Bindings size should match'
        );
    }

    @IsTest
    private static void getDomainProcessBindingsShouldThrowAuraHandledExceptionOnError() {
        // prepare
        Exception exceptionToThrow = new System.QueryException('This is an error message');

        // mock
        IDomainProcessBindingSelector domainProcessBindingsSelectorMock = (IDomainProcessBindingSelector) MOCKS.mock(
            IDomainProcessBindingSelector.class
        );
        MOCKS.startStubbing();
        MOCKS.when(domainProcessBindingsSelectorMock.sObjectType()).thenReturn(DomainProcessBinding__mdt.SObjectType);
        MOCKS.when(domainProcessBindingsSelectorMock.selectByRelatedDomainBindingSObjectTriggerOperation(
            fflib_Match.anyString(),
            fflib_Match.anyString()
        )).thenThrow(exceptionToThrow);
        MOCKS.stopStubbing();
        Application.Selector.setMock(domainProcessBindingsSelectorMock);

        // exercise
        Test.startTest();
        Exception caughtException;
        try {
            final List<DomainProcessBinding__mdt> returnedEntityDefinitions = DomainBindingExplorerController.getDomainProcessBindings(
                'these values do not matter',
                'for this specific test'
            );
        } catch (Exception e) {
            caughtException = e;
        }
        Test.stopTest();

        // validate
        System.assertNotEquals(null, caughtException, 'An exception should have been thrown and caught');
        System.assert(
            caughtException instanceof AuraHandledException,
            'Caught exception should be an instance of AuraHandledException'
        );
        System.assertEquals(
            exceptionToThrow.getMessage(),
            caughtException.getMessage(),
            'Caught Exception Message should match message from original exception'
        );
    }
}
