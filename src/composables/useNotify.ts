import { useQuasar } from 'quasar';

export function useNotify() {
  const $q = useQuasar();

  function success(msg: string) {
    $q.notify({
      type: 'positive',
      message: msg,
      position: 'top-right',
      timeout: 2000,
    });
  }

  function error(msg: string) {
    $q.notify({
      type: 'negative',
      message: msg,
      position: 'top-right',
      timeout: 2000,
    });
  }

  return { success, error };
}
