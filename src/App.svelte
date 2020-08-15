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
</script>

<main>
  <header>
  	<p class="title">Today Lists!</p>
    <p class="remaining-task">0 Task</p>
  </header>
  <Todos />
</main>

<style lang="scss" type="text/scss">
	main {
		padding: 1em;
    width: 100%;
    max-width:1180px;
	}

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .title {
      position: relative;
      letter-spacing: 0.5rem;
      font-weight: bold;
      font-size: 2.5rem;
      &:before {
        content: 'Today Lists';
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
  }

</style>