// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { createTestAppStore } from '../../../../test-helpers/render-component-with-store';
import {
  setAttributionIdMarkedForReplacement,
  setSelectedAttributionId,
  setTargetSelectedAttributionId,
} from '../attribution-view-simple-actions';
import {
  getAttributionIdMarkedForReplacement,
  getSelectedAttributionId,
  getTargetSelectedAttributionId,
} from '../../../selectors/attribution-view-resource-selectors';

describe('The load and navigation simple actions', () => {
  test('sets and gets selectedAttributionId', () => {
    const testStore = createTestAppStore();
    expect(getSelectedAttributionId(testStore.getState())).toBe('');

    testStore.dispatch(setSelectedAttributionId('Test'));
    expect(getSelectedAttributionId(testStore.getState())).toBe('Test');
  });

  test('sets and gets targetSelectedAttributionId', () => {
    const testStore = createTestAppStore();
    expect(getTargetSelectedAttributionId(testStore.getState())).toBe('');

    testStore.dispatch(setTargetSelectedAttributionId('test'));
    expect(getTargetSelectedAttributionId(testStore.getState())).toBe('test');
  });

  test('sets and gets attributionIdMarkedForReplacement', () => {
    const testStore = createTestAppStore();
    expect(getAttributionIdMarkedForReplacement(testStore.getState())).toBe('');

    testStore.dispatch(setAttributionIdMarkedForReplacement('test'));
    expect(getAttributionIdMarkedForReplacement(testStore.getState())).toBe(
      'test'
    );
  });
});
