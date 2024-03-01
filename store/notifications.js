import { defineStore } from "pinia"

export const useNotificationsStore = defineStore('notifications', {

  state: () => ({
    text: '',
    color: '',
    timeout: '',
  }),
  actions: {
    show(payload) {
      this.showNotification(payload)
    },
    info(text) {
      this.showNotification({
        text,
        color: 'secondary',
      })
    },
    success(text) {
      this.showNotification({
        text,
        color: 'primary',
      })
    },
    danger(text) {
      this.showNotification({
        text,
        color: 'red',
      })
    },
  },

  showNotification(payload) {
    state.text = payload.text
    state.color = payload.color
    state.timeout = payload.timeout
  },
});