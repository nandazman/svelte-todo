<script>
  import util from './util.js';
  let todos = [];

  export let totalTasks = 0;
  export const addTodo = (data) => {
    todos.push(data);
    todos.sort((a,b) => new Date(a.expired) - new Date(b.expired));
    todos = todos;
    totalTasks = todos.length;
  }

  totalTasks = todos.length;

  const deleteTodo = (index) => {
    todos.splice(index, 1)
    todos = todos;
    totalTasks = todos.length;
  }
</script>

{#if todos.length}
  <section class="todos-container">
  {#each todos as todo, i}
      <div class="todo-lists {todo.completed ? 'complete' : ''}">
        <div class="checkbox-container">
          <input class="checkbox" bind:checked={todo.completed} type="checkbox" id="todo-{i}" />
          <label for="todo-{i}"></label>
        </div>
        <p class="todos-description">
          <span class="priority {todo.priority}">{todo.priority}</span>
          <span class="title">{todo.title}</span>
        </p>
        <div class="duration">
          <div class="time">
          </div>
          <div class="text-duration">
            Due in {util.getDurationFromNow(todo.expired)}
          </div>
        </div>
        <div class="action" title="delete todo" on:click={ () => deleteTodo(i) }>
        </div>
      </div>
  {/each}
  </section>
{:else}
  <div class="no-todo">
    There is nothing todo. Let's add some!
  </div>
{/if}

<style lang="scss" type="text/scss">
  .no-todo {
    margin-top: 3rem;
    text-align: center;
  }
  .todos-container {
    box-shadow: 0 2px 25px 0 rgba(0,0,0,0.2);
    background: white;
    margin-top: 1rem;
    .todo-lists {
      padding: 2rem 1rem;
      display: flex;
      justify-content: space-between;
      transition: background .25s;
      position: relative;
      &.complete {
        background: #09ad7e;
      }
      &:not(:last-child) {
        border-bottom: 2px solid #dedede;
      }
      .checkbox-container {
        height: 24px;
        width: 24px;
        .checkbox {
          position: absolute;
          left: -9999px;
          opacity: 0;
          & + label {
            position: relative;
            cursor: pointer;
            &:before {
              content: '';
              position: absolute;
              left: 0; 
              top: 0;
              width: 1.25rem; 
              height: 1.25rem;
              border: 2px solid #ccc;
              background: #fff;
              border-radius: 50%;
              box-shadow: inset 0 1px 3px rgba(0,0,0,.1);
            }
            &:after {
              content: '';
              position: absolute;
              top: .25em; 
              left: .45em;
              font-size: 1rem;
              line-height: 1;
              color: #09ad7e;
            }
            &:hover {
              &:before {
                border: 2px solid #6e9489;
              }
            }
          }
          &:checked {
            & + label {
              &:after {
                content: '\2713\0020';
              }
            }
          }
        }
      }

      .priority {
        display: inline-block;
        padding: .25em .4em;
        font-size: 75%;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: .25rem;
        padding: .15rem .5rem;
        &.low {
          background: #007bff;
          color: #fff;
        }
        &.high {
          background: #ff0000;
          color: #fff;
        }
      }
      .title {
        margin-left: 1rem;
      }
      .todos-description {
        margin-right: auto;
        margin-left: 2rem;
        max-width: 800px;
      }
      .duration {
        display: flex;
        width: 170px;
        .time {
          position: relative;
          width: 24px; 
          height: 24px;
          border: 1px solid #8e8a8a;
          background: #fff;
          border-radius: 50%;
          margin-right: .75rem;
          &:before {
            content: '';
            position: absolute;
            width: 5px;
            border-bottom: 1px solid black;
            left: 6px;
            top: 10px;
          }
          &:after {
            content: '';
            height: 7px;
            position: absolute;
            top: -5px;
            left: 11px;
            width: 1px;
            border-bottom: 9px solid black;
          }
        }
      }
      .action {
        width: 24px;
        height: 24px;
        position: relative;
        cursor: pointer;
        &:before {
          content: '';
          position: absolute;
          border-top: 1px solid black;
          width: 24px;
          transform: rotate(45deg);
          top: 10px;
        }
        &:after {
          content: '';
          position: absolute;
          border-top: 1px solid black;
          width: 24px;
          transform: rotate(135deg);
          top: 10px;
        }
      }
    } 
  }
  @media screen and (max-width: 640px) {
    .todos-container {
      
      .todo-lists {
        flex-direction: column;
        padding: 1rem;
        .action {
          position: absolute;
          top: 5px;
          right: 5px;
        }
        .todos-description {
          margin: 1rem 0;
          margin-left: 0;
        }
        .duration {
          // margin-left: auto;
        }
      }

    }
  }
</style>