<svelte:head>
	<style>
    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;  
  }
  </style>
</svelte:head>
<script>
  import Todos from './Todos.svelte';
</script>

<main>
	<h1>Hello Todo List!</h1>
  <Todos />
</main>

<style>
	main {
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
    text-align: center;
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
    font-weight: 100;
    margin-bottom: 2rem;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>