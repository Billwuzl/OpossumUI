// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { createTestAppStore } from '../../../../test-helpers/render-component-with-store';
import {
  setAttributionIdMarkedForReplacement,
  setMultiSelectSelectedAttributionIds,
  setSelectedAttributionId,
  setTargetSelectedAttributionId,
} from '../attribution-view-simple-actions';
import {
  getMultiSelectSelectedAttributionIds,
  getSelectedAttributionId,
  getTargetSelectedAttributionId,
} from '../../../selectors/attribution-view-resource-selectors';
import { getAttributionIdMarkedForReplacement } from '../../../selectors/all-views-resource-selectors';

describe('The load and navigation simple actions', () => {
  it('sets and gets selectedAttributionId', () => {
    const testStore = createTestAppStore();
    expect(getSelectedAttributionId(testStore.getState())).toBe('');

    testStore.dispatch(setSelectedAttributionId('Test'));
    expect(getSelectedAttributionId(testStore.getState())).toBe('Test');
  });

  it('sets and gets targetSelectedAttributionId', () => {
    const testStore = createTestAppStore();
    expect(getTargetSelectedAttributionId(testStore.getState())).toBe(null);

    testStore.dispatch(setTargetSelectedAttributionId('test'));
    expect(getTargetSelectedAttributionId(testStore.getState())).toBe('test');
  });

  it('sets and gets attributionIdMarkedForReplacement', () => {
    const testStore = createTestAppStore();
    expect(getAttributionIdMarkedForReplacement(testStore.getState())).toBe('');

    testStore.dispatch(setAttributionIdMarkedForReplacement('test'));
    expect(getAttributionIdMarkedForReplacement(testStore.getState())).toBe(
      'test'
    );
  });

  it('sets and gets multiSelectSelectedAttributionIds', () => {
    const testStore = createTestAppStore();
    expect(
      getMultiSelectSelectedAttributionIds(testStore.getState())
    ).toStrictEqual([]);

    testStore.dispatch(setMultiSelectSelectedAttributionIds(['id_1']));
    expect(
      getMultiSelectSelectedAttributionIds(testStore.getState())
    ).toStrictEqual(['id_1']);
  });
});
