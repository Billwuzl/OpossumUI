// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import {
  PanelAttributionData,
  getContainedExternalPackages,
} from '../util/get-contained-packages';
import { AttributionIdsWithCountAndResourceId } from '../types/types';

let cachedExternalData: PanelAttributionData | null = null;

self.onmessage = ({
  data: { selectedResourceId, externalData, resolvedExternalAttributions },
}): void => {
  // externalData = null is used to empty the cached data
  if (externalData !== undefined) {
    cachedExternalData = externalData;
  }

  if (selectedResourceId) {
    if (cachedExternalData) {
      const attributionIdsWithCount = getContainedExternalPackages({
        selectedResourceId,
        externalData: cachedExternalData,
        resolvedExternalAttributions,
      });
      const output: AttributionIdsWithCountAndResourceId = {
        resourceId: selectedResourceId,
        attributionIdsWithCount,
      };

      self.postMessage({
        output,
      });
    } else {
      self.postMessage({
        output: null,
      });
    }
  }
};

self.onerror = (): void => {
  cachedExternalData = null;
};
