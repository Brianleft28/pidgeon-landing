import { mount } from 'svelte';
import App from './App.svelte';

const target = document.getElementById('root');
if (!target) throw new Error('Could not find root element to mount to');

const app = mount(App, { target });

export default app;
