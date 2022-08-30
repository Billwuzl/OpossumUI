// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = { expect: { timeout: 15000 } };

export default config;
