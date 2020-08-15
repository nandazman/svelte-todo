<script>
  import { onMount } from 'svelte';
  let todos = [];
  const total = 20;
  const middle = Math.floor(total / 2);
  onMount(async () => {
    const resp = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=' + total);
    todos = await resp.json();
  })
</script>

<section class="todos-container">
{#each todos as todo, i}
    <div class="todo-lists">
      <div class="checkbox-container">
        <input class="checkbox" type="checkbox" id="todo-{i}" />
        <label for="todo-{i}"></label>
      </div>
      <p class="todos-description">
        <span class="priority {i % 2 === 0 ? 'low' : 'high' }">{i % 2 === 0 ? 'low' : 'high' }</span>
        {todo.body}
      </p>
    </div>
{/each}
</section>

<style lang="scss" type="text/scss">
  .todos-container {
    box-shadow: 0 2px 25px 0 rgba(0,0,0,0.2);
    background: white;
    margin-top: 1rem;
    .todo-lists {
      padding: 1rem;
      border-bottom: 2px solid #dedede;
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
        &.low {
          background: #007bff;
          color: #fff;
        }
        &.high {
          background: #ff0000;
          color: #fff;
        }
      }
    } 
  }
</style>