import { mount } from 'svelte';
import App from './App.svelte';

const target = document.getElementById('app');

if (target === null) {
  throw new Error('Could not find element with id "app" to mount the demo into.');
}

const app = mount(App, { target });

export default app;
