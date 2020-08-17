<script>
  import { createEventDispatcher } from 'svelte';
  let todo = {
    title: '',
    priority: 'low',
    expired: ''
  };
  
  const dispatch = createEventDispatcher();
  const addTodo = () => {
    if (!todo.title || !todo.expired) {
      alert('Please fill all the detail first!');
      return;
    }
    dispatch("addTodo", todo);
    todo = {
      title: '',
      priority: 'low',
      expired: ''
    };
  }
</script>

<section class="new-todo">
  <div class="input-group">
    <label for="title">Title</label>
    <input type="text" id="title" bind:value="{todo.title}">
  </div>
  <div class="input-group">
    <label for="deadline">Deadline</label>
    <input type="datetime-local" id="deadline" bind:value="{todo.expired}">
  </div>
  <div class="input-group">
    <label for="priority">Priority</label>
    <select name="priority" id="priority" bind:value="{todo.priority}">
      <option value="low">Low</option>
      <option value="high">High</option>
    </select>
  </div>
  <div class="input-group mt-auto">
    <button class="add-button" on:click="{addTodo}">Add</button>
  </div>
</section>

<style lang="scss" type="text/scss">
  .new-todo {
    display: flex;
    justify-content: center;
    .input-group {
      padding: 1rem;
      [type="text"], button {
        padding: 8.5px;
      }
      button {
        cursor: pointer;
        background-color: #09ad7e;
        transition: background-color .25s;
        &:hover {
          background-color: #22dea8;
        }
      }
      select {
        padding: 7.5px;
      }
      &.mt-auto {
        margin-top: auto;
      }
    }
  }

  @media screen and (max-width: 825px) {
    .new-todo {
      flex-direction: column;
      .input-group {
        padding: .5rem;
        width: 100%;
        * {
          width: 100%;
        }
      }
    }
  }
</style>