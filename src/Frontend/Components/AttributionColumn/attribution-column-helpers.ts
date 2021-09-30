// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { View } from '../../enums/enums';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FollowUp, PackageInfo } from '../../../shared/shared-types';
import { SimpleThunkDispatch } from '../../state/actions/types';
import { setTemporaryPackageInfo } from '../../state/actions/resource-actions/all-views-simple-actions';
import { PanelPackage } from '../../types/types';
import {
  addResolvedExternalAttribution,
  removeResolvedExternalAttribution,
} from '../../state/actions/resource-actions/audit-view-simple-actions';
import {
  saveManualAndResolvedAttributionsToFile,
  setIsSavingDisabled,
} from '../../state/actions/resource-actions/save-actions';
import { useWindowHeight } from '../../util/use-window-height';
import { generatePurlFromPackageInfo, parsePurl } from '../../util/handle-purl';

const PRE_SELECTED_LABEL = 'Attribution was pre-selected';
const MARKED_FOR_REPLACEMENT_LABEL = 'Attribution is marked for replacement';

export function getDisplayTexts(
  temporaryPackageInfo: PackageInfo,
  selectedAttributionId: string,
  attributionIdMarkedForReplacement: string
): Array<string> {
  const displayTexts = [];
  if (temporaryPackageInfo.preSelected) {
    displayTexts.push(PRE_SELECTED_LABEL);
  }
  if (selectedAttributionId === attributionIdMarkedForReplacement) {
    displayTexts.push(MARKED_FOR_REPLACEMENT_LABEL);
  }
  return displayTexts;
}

export function getLicenseTextMaxRows(
  windowHeight: number,
  view: View
): number {
  const heightOfTextBoxes = 480;
  const heightOfNonLicenseTextComponents =
    heightOfTextBoxes + (view === View.Audit ? 34 : 0);
  const licenseTextMaxHeight = windowHeight - heightOfNonLicenseTextComponents;
  return Math.floor(licenseTextMaxHeight / 16);
}

export function getDiscreteConfidenceChangeHandler(
  temporaryPackageInfo: PackageInfo,
  dispatch: SimpleThunkDispatch
): (event: React.ChangeEvent<{ value: unknown }>) => void {
  return (event): void => {
    dispatch(
      setTemporaryPackageInfo({
        ...temporaryPackageInfo,
        attributionConfidence: Number(event.target.value),
      })
    );
  };
}

export function getFollowUpChangeHandler(
  temporaryPackageInfo: PackageInfo,
  dispatch: SimpleThunkDispatch
): (event: React.ChangeEvent<HTMLInputElement>) => void {
  return (event): void => {
    dispatch(
      setTemporaryPackageInfo({
        ...temporaryPackageInfo,
        followUp: event.target.checked ? FollowUp : undefined,
      })
    );
  };
}

export function getExcludeFromNoticeChangeHandler(
  temporaryPackageInfo: PackageInfo,
  dispatch: SimpleThunkDispatch
): (event: React.ChangeEvent<HTMLInputElement>) => void {
  return (event): void => {
    dispatch(
      setTemporaryPackageInfo({
        ...temporaryPackageInfo,
        excludeFromNotice: event.target.checked ? true : undefined,
      })
    );
  };
}

export function getFirstPartyChangeHandler(
  temporaryPackageInfo: PackageInfo,
  dispatch: SimpleThunkDispatch
): (event: React.ChangeEvent<HTMLInputElement>) => void {
  return (event): void => {
    dispatch(
      setTemporaryPackageInfo({
        ...temporaryPackageInfo,
        firstParty: event.target.checked,
      })
    );
  };
}

export function getResolvedToggleHandler(
  selectedPackage: PanelPackage | null,
  resolvedExternalAttributions: Set<string>,
  dispatch: SimpleThunkDispatch
): () => void {
  return (): void => {
    if (selectedPackage) {
      if (resolvedExternalAttributions.has(selectedPackage.attributionId)) {
        dispatch(
          removeResolvedExternalAttribution(selectedPackage.attributionId)
        );
      } else {
        dispatch(addResolvedExternalAttribution(selectedPackage.attributionId));
      }
      dispatch(saveManualAndResolvedAttributionsToFile());
    }
  };
}

export function selectedPackageIsResolved(
  selectedPackage: PanelPackage | null,
  resolvedExternalAttributions: Set<string>
): boolean {
  return selectedPackage
    ? resolvedExternalAttributions.has(selectedPackage.attributionId)
    : false;
}

export function getLicenseTextLabelText(
  licenseName: string | undefined,
  isEditable: boolean,
  frequentLicensesNameOrder: Array<string>
): string {
  return licenseName &&
    frequentLicensesNameOrder
      .map((name) => name.toLowerCase())
      .includes(licenseName.toLowerCase())
    ? `Standard license text implied. ${
        isEditable ? 'Insert notice text if necessary.' : ''
      }`
    : 'License Text (to appear in attribution document)';
}

interface MergeButtonDisplayState {
  hideMarkForReplacementButton: boolean;
  hideUnmarkForReplacementButton: boolean;
  hideOnReplaceMarkedByButton: boolean;
  deactivateReplaceMarkedByButton: boolean;
}

export function getMergeButtonsDisplayState(
  currentView: View,
  attributionIdMarkedForReplacement: string,
  selectedAttributionId: string,
  packageInfoWereModified: boolean,
  attributionIsPreSelected: boolean
): MergeButtonDisplayState {
  const isAttributionView = currentView === View.Attribution;
  const anyAttributionMarkedForReplacement =
    attributionIdMarkedForReplacement !== '';
  const selectedAttributionIsMarkedForReplacement =
    selectedAttributionId === attributionIdMarkedForReplacement;

  return {
    hideMarkForReplacementButton:
      !isAttributionView || selectedAttributionIsMarkedForReplacement,
    hideUnmarkForReplacementButton:
      !isAttributionView ||
      !anyAttributionMarkedForReplacement ||
      !selectedAttributionIsMarkedForReplacement,
    hideOnReplaceMarkedByButton:
      !isAttributionView ||
      !anyAttributionMarkedForReplacement ||
      selectedAttributionIsMarkedForReplacement,
    deactivateReplaceMarkedByButton:
      packageInfoWereModified || attributionIsPreSelected,
  };
}

export function usePurl(
  dispatch: SimpleThunkDispatch,
  packageInfoWereModified: boolean,
  temporaryPackageInfo: PackageInfo,
  displayPackageInfo: PackageInfo,
  selectedPackage: PanelPackage | null
): {
  temporaryPurl: string;
  isDisplayedPurlValid: boolean;
  handlePurlChange: (event: React.ChangeEvent<{ value: string }>) => void;
} {
  const [temporaryPurl, setTemporaryPurl] = useState<string>('');
  const isDisplayedPurlValid: boolean = parsePurl(temporaryPurl).isValid;

  useEffect(() => {
    dispatch(
      setIsSavingDisabled(
        (!packageInfoWereModified || !isDisplayedPurlValid) &&
          !temporaryPackageInfo.preSelected
      )
    );
  }, [
    dispatch,
    packageInfoWereModified,
    isDisplayedPurlValid,
    temporaryPackageInfo,
  ]);

  useEffect(() => {
    setTemporaryPurl(generatePurlFromPackageInfo(displayPackageInfo) || '');
  }, [displayPackageInfo, selectedPackage]);

  function handlePurlChange(event: React.ChangeEvent<{ value: string }>): void {
    setTemporaryPurl(event.target.value);
    const { isValid, purl } = parsePurl(event.target.value);
    if (isValid && purl) {
      dispatch(
        setTemporaryPackageInfo({
          ...temporaryPackageInfo,
          packageName: purl.packageName,
          packageVersion: purl.packageVersion,
          packageNamespace: purl.packageNamespace,
          packageType: purl.packageType,
          packagePURLAppendix: purl.packagePURLAppendix,
        })
      );
    }
  }

  return {
    temporaryPurl,
    isDisplayedPurlValid,
    handlePurlChange,
  };
}

export function useRows(
  view: View,
  resetViewIfThisIdChanges = ''
): {
  isLicenseTextShown: boolean;
  setIsLicenseTextShown: Dispatch<SetStateAction<boolean>>;
  licenseTextRows: number;
  copyrightRows: number;
  commentRows: number;
} {
  const [isLicenseTextShown, setIsLicenseTextShown] = useState<boolean>(false);
  const licenseTextRows = getLicenseTextMaxRows(useWindowHeight(), view);

  useEffect(() => {
    setIsLicenseTextShown(false);
  }, [resetViewIfThisIdChanges]);

  const copyrightRows = isLicenseTextShown ? 1 : 6;
  const commentRows = isLicenseTextShown ? 1 : Math.max(licenseTextRows - 2, 1);

  return {
    isLicenseTextShown,
    setIsLicenseTextShown,
    licenseTextRows,
    copyrightRows,
    commentRows,
  };
}
