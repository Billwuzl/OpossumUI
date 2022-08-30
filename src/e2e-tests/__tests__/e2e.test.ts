// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { ElectronApplication, Page } from 'playwright';
import {
  conditionalIt,
  E2E_TEST_TIMEOUT,
  getApp,
} from '../test-helpers/test-helpers';
import * as os from 'os';
import { expect } from '@playwright/test';

jest.setTimeout(E2E_TEST_TIMEOUT);

describe('The OpossumUI', () => {
  let app: ElectronApplication;
  let window: Page;

  beforeEach(async () => {
    app = await getApp();
    window = await app.firstWindow();
    await window.waitForLoadState();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should launch app', async () => {
    expect(await window.title()).toBe('OpossumUI');
  });

  it('should find view buttons', async () => {
    const auditViewButton = window.locator('text=Audit');
    await expect(auditViewButton).toHaveCount(1);
    const attributionViewButton = window.locator('text=Attribution');
    await expect(attributionViewButton).toHaveCount(1);
    const reportViewButton = window.locator('text=Report');
    await expect(reportViewButton).toHaveCount(1);
  });
});

describe('Open file via command line', () => {
  let app: ElectronApplication;
  let window: Page;

  beforeEach(async () => {
    app = await getApp('src/e2e-tests/test-resources/opossum_input_e2e.json');
    window = await app.firstWindow();
    await window.waitForLoadState();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should open file when provided as command line arg', async () => {
    const frontendEntry = window.locator('text=Frontend');
    await expect(frontendEntry).toHaveCount(1);

    const electronBackendEntry = window.locator('text=ElectronBackend');
    await electronBackendEntry.click();

    const mainTsEntry = window.locator('text=main.ts');
    await mainTsEntry.click();

    const jsQueryPackage = window.locator('text=jQuery, 16.13.1');
    await expect(jsQueryPackage).toHaveCount(1);
  });

  // getOpenLinkListener does not work properly on Linux
  conditionalIt(os.platform() !== 'linux')(
    'should open an error popup if the base url is invalid',
    async () => {
      const electronBackendEntry = window.locator('text=ElectronBackend');
      await electronBackendEntry.click();
      const openLinkIcon = window.locator("[aria-label='link to open']");
      await openLinkIcon.click();

      await expect(window.locator('text=Cannot open link.')).toHaveCount(1);

      const typesEntry = window.locator('text=Types');
      await typesEntry.click();
      await window.locator("[aria-label='link to open']").click();

      const errorPopup = window.locator('text=Cannot open link.');
      await expect(errorPopup).toHaveCount(1);
    }
  );
});
