import { writable } from 'svelte/store'

export const db = writable()

export const user = writable()

export const books = writable([])