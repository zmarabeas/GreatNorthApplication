import { writable } from 'svelte/store';

export const userStore = writable({ 
  name: '', 
  phone: '',
  email: '',
  note: '',
  questions: [],
});

export const updateUser = (name, questions, phone, email, note) => {
  userStore.update((u) => {
    u.name = name;
    u.questions = questions;
    u.phone = phone; 
    u.email = email; 
    u.note = note;
    return u;
  });
}

export const resetUser = () => {
  user.update((u) => {
    u.name = '';
    u.questions = [];
    u.phone = '';
    u.email = '';
    u.note = '';
    return u;
  });
}
