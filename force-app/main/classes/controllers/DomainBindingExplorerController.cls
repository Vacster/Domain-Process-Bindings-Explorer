/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
public with sharing class DomainBindingExplorerController {
    @AuraEnabled(Cacheable=true)
    public static List<EntityDefinition> getEntityDefinitions() {
        try {
            return EntityDefinitionsSelector.newInstance().selectByApexTriggerable(true);
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
        try {
            return DomainProcessBindingSelector.newInstance()
                .selectByRelatedDomainBindingSObjectTriggerOperationAndAsync(
                    sObjectDeveloperName,
                    triggerOperation,
                    isAsync
                );
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
