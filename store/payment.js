import { getField, updateField } from 'vuex-map-fields'
export const state = () => ({
  intent: null,
  donationIntentId: sessionStorage.getItem('donationIntentId'),
  amount: 0,
  donorInfo: {
    title: null,
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    address_line1: null,
    address_line2: null,
    zip: null,
    country: null,
    city: null,
    communication: false,
    gdpr: false,
  },
})

export const getters = {
  getField,
  intentStatus(state) {
    return state.intent?.attributes?.status || null
  },
}

export const mutations = {
  updateField,
  SET_INTENT(state, intent) {
    state.intent = intent
  },
  updateDonorInfo(state, { field, value }) {
    console.log('mutating donorInfo for ', field)
    state.donorInfo[field] = value
  },

  SET_DONATION_INTENT_ID(state, donationIntentId) {
    sessionStorage.setItem('donationIntentId', donationIntentId)
    state.donationIntentId = donationIntentId
  },
  updateAmount(state, amount) {
    state.amount = Number(parseInt(amount))
  },
}

export const actions = {
  async getIntent({ commit }, intentId = null) {
    console.log('/store.payment/getIntent')
    if (!intentId) {
      throw new Error('Intent is null')
    }
    const {
      data: { data: paymentIntent },
    } = await this.$api.payment.get(`/intents/${intentId}`)
    commit('SET_INTENT', paymentIntent)
  },
  async confirm({ commit }, intentId = null) {
    console.log('getIntent')
    if (!intentId) {
      throw new Error('No donation intent provided')
    }
    return await this.$api.payment.post(`/authorize/confirm`, {
      data: {
        donation_intent_id: intentId,
      },
    })
  },
  async preProcess({ commit }, payload) {
    console.log('preProcess')
    console.log('payload', payload)
    const {
      organizationId,
      paymentProvider,
      paymentProviderReferenceId = null,
      amount = null,
      currency = null,
    } = payload
    const {
      data: { data: response },
    } = await this.$api.payment.post(`/authorize/pre-process`, {
      data: {
        amount,
        currency,
        organization_id: organizationId,
        payment_provider: paymentProvider,
        payment_provider_reference_id: paymentProviderReferenceId,
      },
    })
    console.log('response', response)

    return response
  },
  async process({ commit, state, rootState }, payload) {
    console.log('store process')
    const { name, referenceId, returnUrl } = payload
    const dataPayload = {
      payment_provider: {
        name,
        reference_id: referenceId,
        return_url: returnUrl,
      },
      donation: {
        amount: state.amount,
        currency: rootState.pages.page.attributes.settings.currency,
        donation_page_id: rootState.pages.page.attributes.id,
        organization_id:
          rootState.pages.page.attributes.internal_ids.organization_id,
        appeal_id: rootState.pages.page.attributes.internal_ids.appeal_id,
        campaign_id: rootState.pages.page.attributes.internal_ids.campaign_id,
      },
      donor: state.donorInfo,
      fingerprint: {},
      page: rootState.pages.page.attributes,
      utms: rootState.url.utms,
    }
    // lets save donor info in session
    sessionStorage.setItem('donor', JSON.stringify(dataPayload.donor))
    sessionStorage.setItem('donation', JSON.stringify(dataPayload.donation))
    return await this.$api.payment.post(`/authorize/process`, {
      data: dataPayload,
    })
  },

  validateDonorForm({ commit, state, dispatch }) {
    console.log('validateDonorForm')
    dispatch('validation/clearValidationErrors', null, { root: true })
    return this.$api.payment.post(`/authorize/validate`, {
      data: state.donorInfo,
    })
  },
}