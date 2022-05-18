/*
 * Copyright (c) 2022, Kamil Segebre
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
public interface IEntityDefinitionsSelector extends IApplicationSObjectSelector {
    List<EntityDefinition> selectByApexTriggerable(final Boolean apexTriggerable);
}
