public inherited sharing class EntityDefinitionsSelector extends ApplicationSObjectSelector implements IEntityDefinitionsSelector {
    public static IEntityDefinitionsSelector newInstance() {
        return (IEntityDefinitionsSelector) Application.Selector.newInstance(EntityDefinition.SObjectType);
    }

    public override List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField>{ EntityDefinition.Id, EntityDefinition.DeveloperName, EntityDefinition.Label };
    }

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
