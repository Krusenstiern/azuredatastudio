/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from 'vs/base/common/lifecycle';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IWorkbenchEnvironmentService } from 'vs/workbench/services/environment/common/environmentService';
import { IRemoteExplorerService } from 'vs/workbench/services/remote/common/remoteExplorerService';

export class ShowCandidateContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IRemoteExplorerService remoteExplorerService: IRemoteExplorerService,
		@IWorkbenchEnvironmentService workbenchEnvironmentService: IWorkbenchEnvironmentService,
	) {
		super();
		if (workbenchEnvironmentService.options && workbenchEnvironmentService.options.showCandidate) {
			this._register(remoteExplorerService.setCandidateFilter(async (candidates: { host: string, port: number, detail: string }[]): Promise<{ host: string, port: number, detail: string }[]> => {
				const filters: boolean[] = await Promise.all(candidates.map(candidate => workbenchEnvironmentService.options!.showCandidate!(candidate.host, candidate.port, candidate.detail)));
				const filteredCandidates: { host: string, port: number, detail: string }[] = [];
				if (filters.length !== candidates.length) {
					return candidates;
				}
				for (let i = 0; i < candidates.length; i++) {
					if (filters[i]) {
						filteredCandidates.push(candidates[i]);
					}
				}
				return filteredCandidates;
			}));
		}
	}
}
