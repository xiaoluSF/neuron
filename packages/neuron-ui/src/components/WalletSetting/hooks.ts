import { useState, useCallback, useMemo } from 'react'
import { History } from 'history'
import { MainActions, actionCreators } from 'containers/MainContent/reducer'
import i18n from 'utils/i18n'
import { Routes } from 'utils/const'
import { Wallet } from 'contexts/NeuronWallet/wallet'

interface MenuItemParams {
  id: string
}

export const useToggleDialog = (dispatch: React.Dispatch<any>) =>
  useCallback(
    (open: boolean) => {
      dispatch({
        type: MainActions.SetDialog,
        payload: {
          open,
        },
      })
    },
    [dispatch],
  )

export const useDeleteWallet = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  return {
    id: {
      value: id,
      set: (deleteId: string) => setId(deleteId),
      onChange: (e: React.FormEvent<{ value: string }>) => setId(e.currentTarget.value),
    },
    password: {
      value: password,
      onChange: (e: React.FormEvent<{ value: string }>) => setPassword(e.currentTarget.value),
    },
  }
}

export const useMenuItems = (
  deleteWallet: ReturnType<typeof useDeleteWallet>,
  history: History,
  toggleDialog: ReturnType<typeof useToggleDialog>,
  dispatch: React.Dispatch<any>,
) => {
  return useMemo(
    () => [
      {
        label: i18n.t('menuitem.select'),
        click: ({ id }: MenuItemParams) => {
          dispatch(actionCreators.activateWallet(id))
        },
      },
      {
        label: i18n.t('menuitem.backup'),
        click: ({ id }: MenuItemParams) => {
          dispatch(actionCreators.backupWallet(id))
        },
      },
      {
        label: i18n.t('menuitem.edit'),
        click: ({ id }: MenuItemParams) => {
          history.push(`${Routes.WalletEditor}/${id}`)
        },
      },
      {
        label: i18n.t('menuitem.remove'),
        click: ({ id }: MenuItemParams) => {
          deleteWallet.id.set(id)
          toggleDialog(true)
        },
      },
    ],
    [deleteWallet.id, dispatch, history, toggleDialog],
  )
}
export const useWalletToDelete = (deleteId: string, wallets: Wallet[]) =>
  useMemo(() => wallets.find(w => w.id === deleteId), [deleteId, wallets])

export const useHandleConfirm = (
  deleteWallet: ReturnType<typeof useDeleteWallet>,
  toggleDialog: ReturnType<typeof useToggleDialog>,
  dispatch: React.Dispatch<any>,
) =>
  useCallback(() => {
    toggleDialog(false)
    dispatch(
      actionCreators.deleteWallet({
        id: deleteWallet.id.value,
        password: deleteWallet.password.value,
      }),
    )
  }, [deleteWallet, toggleDialog, dispatch])

export default {
  useToggleDialog,
  useDeleteWallet,
  useMenuItems,
  useWalletToDelete,
  useHandleConfirm,
}
