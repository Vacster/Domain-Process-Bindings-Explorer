public interface IEntityDefinitionsSelector extends IApplicationSObjectSelector {
    List<EntityDefinition> selectByApexTriggerable(final Boolean apexTriggerable);
}
