import SecureLS from 'secure-ls'

export const storageKey = 'vuex' // the key used by localStorage

export const secureStorage = new SecureLS({ isCompression: false })

const initialStoreContent = secureStorage.get(storageKey) // or localStorage.get(storageKey)
export const initialUnencryptedStorage = initialStoreContent
  ? JSON.parse(initialStoreContent)
  : {} // parse the localStorage value to an object when it's defined, else set it as an empty object
