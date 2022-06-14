/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
public inherited sharing class EntityDefinitionsSelector extends ApplicationSObjectSelector implements IEntityDefinitionsSelector {
    public static IEntityDefinitionsSelector newInstance() {
        return (IEntityDefinitionsSelector) Application.Selector.newInstance(EntityDefinition.SObjectType);
    }

    public override List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField>{
            EntityDefinition.Id,
            EntityDefinition.DeveloperName,
            EntityDefinition.QualifiedApiName,
            EntityDefinition.Label
        };
    }

    @TestVisible
    private List<Schema.SObjectField> getAdditionalSObjectFieldList() {
        return new List<Schema.SObjectField>{};
    }

    public Schema.SObjectType getSObjectType() {
        return EntityDefinition.SObjectType;
    }

    public List<EntityDefinition> selectByApexTriggerable(final Boolean apexTriggerable) {
        return (List<EntityDefinition>) Database.query(
            newQueryFactory().setCondition('IsApexTriggerable =: apexTriggerable').toSOQL()
        );
    }
}
