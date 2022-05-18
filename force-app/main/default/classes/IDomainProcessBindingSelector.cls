public interface IDomainProcessBindingSelector extends IApplicationSObjectSelector {
    List<DomainProcessBinding__mdt> selectActiveByRelatedDomainBindingSObjectTriggerOperationAndAsync(
        final String sObjectDeveloperName,
        final String triggerOperation,
        final Boolean isAsync
    );
}
