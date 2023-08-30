# SuperNavigation

## Not Your Average Navigation

SuperNavigation is a powerful, customizable navigation library for Svelte and SvelteKit applications. It aims to bring a mobile UX to the web, making PWAs one step closer to a true native experience.

### Caution
Not ready for production, Documentation is under progress

### Features

- Easy-to-use API for navigation between screens
- Customizable header and screen styles
- Dynamic screen loading
- Built with TypeScript for type safety
- Supports deep routing and nesting
- Refreshable navigation states
- Optimized for SvelteKit with server-side rendering support
- Tailwind out of the box

## Installation

To install SuperNavigation, run the following command:

```bash
npm install super-navigation
```

Or if you're using Yarn:

```bash
yarn add super-navigation
```

## Usage

### Stack navigation example 
You can find a full working example at `https://github.com/0xDjole/super-navigation/tree/master/src/routes`. Pull `https://github.com/0xDjole/super-navigation` and run `npm run dev` to play with the very basic example.

```svelte
<script lang="ts">
  import { navigation } from 'super-navigation';
</script>

<Stack
  defaultIndex={0}
  screens={[
    {
      component: FakeScreen,
      title: 'Screen 1',
      headerClass: 'bg-gray-500 border-solid border-b-2 border-gray-300',
      path: '/'
		},
    {
      component: FakeScreen2,
      title: 'Screen 2',
      path: '/screen2',
      headerClass: 'bg-gray-500 border-solid border-b-2 border-gray-300',
      backDefault: '/'
    }
  ]}
/>
```

FakeScreen component

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { navigation } from 'super-navigation';

  onMount(() => {
    navigation?.loadUp();
  });
</script>

<div style="height: 100%; background-color: red;">
  <span class="text-white">Screen 1</span>
  <div>
    <button class="bg-green-300 p-3" on:click={() => navigation?.navigate('/screen2')}>
      Go to screen 2
    </button>
  </div>
</div>
```

## ``` navigation.navigate('/path') ``` 
This is how you are navigating to different screens.

## ``` navigation.getSearchParam('param') ``` 
Get the current query parameters

## ``` navigation.back();``` 
Go to the previous screen

## ```navigation.loadUp();``` 
SuperNavigation is optimized for SvelteKit, allowing for server-side rendering of the initial screen with regular ```+page.svelte``` from the routes. You then switch to client-side navigation ```navigation.loadUp()``` and perform regular navigation with ```navigation.navigate('/path')```.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
