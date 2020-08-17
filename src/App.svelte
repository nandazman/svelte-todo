<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400&display=swap" rel="stylesheet">
	<style>
    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;  
    font-family: 'Montserrat', sans-serif;
  }
  body {
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  </style>
</svelte:head>
<script>
  import Todos from './Todos.svelte';
  import NewTodos from './NewTodos.svelte';
  let totalTasks;
  let newTodo = {};
  let listTodo;
  $: tasks = totalTasks;

</script>

<main>
  <header>
  	<p class="title">Todo Lists!</p>
    <p class="remaining-task">{tasks} Tasks</p>
  </header>
  <NewTodos on:addTodo={({ detail }) => listTodo.addTodo(detail)} />
  <Todos bind:this={listTodo} bind:totalTasks={tasks} />
</main>

<style lang="scss" type="text/scss">
	main {
		padding: 5rem;
    width: 100%;
    max-width:1180px;
	}

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    .title {
      position: relative;
      letter-spacing: 0.5rem;
      font-weight: bold;
      font-size: 2.5rem;
      &:before {
        content: 'Todo Lists!';
        position: absolute;
        left: -5rem;
        width: max-content;
        z-index: -1;
        color: #dedede82;
        font-size: 7rem;
        top: -1.25rem;
        font-weight: normal;
      }
    }
    .remaining-task {
      margin-top: .5rem;
      color: #868686;
    }
  }

  @media screen and (max-width: 640px) {
    main {
      padding: 1rem;
    }
    header {
      .title {
        letter-spacing: 0.2rem;
        &:before {
          font-size: 3rem;
          left: -1rem;
          top: .25rem;
        }
      }
    }
  }

</style>