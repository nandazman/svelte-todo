<script>
  import { onMount } from 'svelte';
  let todos = [];
  onMount(async () => {
    const resp = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20');
    todos = await resp.json();
  })
</script>

<div class="todos-container">
{#each todos as todo}
    <div class="todos">
      <h2 class="todos-title">{todo.title}</h2>
      <p class="todos-description">{todo.body}</p>
    </div>
{/each}
</div>

<style lang="scss">
  .todos-container {
    display: grid;
    grid-template-columns: repeat( auto-fill, 300px );
    column-gap: 2rem;
    row-gap: 3rem;
    justify-content: center;
    .todos {
      background: #195e83;
      border-radius: 5px;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      &:hover {
        box-shadow: 0 16px 24px 0 rgba(0,0,0,0.2);
        cursor: pointer;
      }
      .todos-title {
        padding: .5rem;
        text-align: center
      }
      .todos-description {
        padding: 1rem;
      }
    }
  }
</style>