// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { PackageInfo } from '../../../../shared/shared-types';
import { FilterType, PopupType, View } from '../../../enums/enums';
import { State } from '../../../types/types';
import { getPackageInfoOfSelectedAttribution } from '../../selectors/all-views-resource-selectors';
import { getSelectedView } from '../../selectors/view-selector';
import { AppThunkAction, AppThunkDispatch } from '../../types';
import { setTemporaryPackageInfo } from '../resource-actions/all-views-simple-actions';
import { getAttributionOfDisplayedPackageInManualPanel } from '../../selectors/audit-view-resource-selectors';
import {
  ACTION_CLOSE_POPUP,
  ACTION_OPEN_POPUP,
  ACTION_RESET_VIEW_STATE,
  ACTION_SET_IS_LOADING,
  ACTION_SET_TARGET_VIEW,
  ACTION_SET_VIEW,
  ACTION_UPDATE_ACTIVE_FILTERS,
  ClosePopupAction,
  OpenPopupAction,
  ResetViewStateAction,
  SetIsLoadingAction,
  SetTargetView,
  SetView,
  UpdateActiveFilters,
} from './types';
import { setMultiSelectSelectedAttributionIds } from '../resource-actions/attribution-view-simple-actions';

export function resetViewState(): ResetViewStateAction {
  return { type: ACTION_RESET_VIEW_STATE };
}

export function navigateToView(view: View): AppThunkAction {
  return (dispatch: AppThunkDispatch, getState: () => State): void => {
    if (getSelectedView(getState()) === view) {
      return;
    }

    dispatch(setTargetView(null));
    dispatch(setView(view));
    dispatch(setMultiSelectSelectedAttributionIds([]));

    const updatedTemporaryPackageInfo: PackageInfo =
      view === View.Audit
        ? getAttributionOfDisplayedPackageInManualPanel(getState())
        : getPackageInfoOfSelectedAttribution(getState());
    dispatch(setTemporaryPackageInfo(updatedTemporaryPackageInfo));
  };
}

function setView(view: View): SetView {
  return {
    type: ACTION_SET_VIEW,
    payload: view,
  };
}

export function setTargetView(targetView: View | null): SetTargetView {
  return {
    type: ACTION_SET_TARGET_VIEW,
    payload: targetView,
  };
}

export function openPopup(
  popup: PopupType,
  attributionId?: string
): OpenPopupAction {
  return {
    type: ACTION_OPEN_POPUP,
    payload: {
      popup,
      attributionId,
    },
  };
}

export function closePopup(): ClosePopupAction {
  return { type: ACTION_CLOSE_POPUP };
}

export function updateActiveFilters(
  filterType: FilterType
): UpdateActiveFilters {
  return {
    type: ACTION_UPDATE_ACTIVE_FILTERS,
    payload: filterType,
  };
}

export function setIsLoading(isLoading: boolean): SetIsLoadingAction {
  return { type: ACTION_SET_IS_LOADING, payload: isLoading };
}
