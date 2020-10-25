
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var util = {
      getDurationFromNow(date) {
        const nextDate = new Date(date);
        const now = new Date();
        const diffInMs = substract(nextDate, now);
        const diffInMinutes = getMinutesDuration(diffInMs);
        if (diffInMinutes < 60) {
          return `${ceil(diffInMinutes)} min`;
        }
        const diffInHours = getHoursFromMinute(diffInMinutes);
        return `${ceil(diffInHours)} hours`;
      },
      getInitialExpDateWithAdditionalHours(hour = 0) {
        const date = new Date();
        if (date.getHours() + hour > 24) {
          const hours = date.getHours() + hour > 24 ? (date.getHours() + hour - 24) : (date.getHours() + hour);
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1} ${hour}:${date.getMinutes()}`;
        }
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${hour}:${date.getMinutes()}`;
      }
    };

    const substract = (a,b) => {
      return a - b;
    };

    const getMinutesDuration = (duration) => {
      return duration / (1000 * 60)
    };

    const ceil = (number) => {
      return Math.ceil(number);
    };

    const getHoursFromMinute = (minutes) => {
      return minutes / 60;
    };

    /* src\Todos.svelte generated by Svelte v3.24.0 */
    const file = "src\\Todos.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[7] = list;
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (46:0) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "There is nothing todo. Let's add some!";
    			attr_dev(div, "class", "no-todo svelte-1e6dpjc");
    			add_location(div, file, 46, 2, 1307);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(46:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:0) {#if todos.length}
    function create_if_block(ctx) {
    	let section;
    	let each_value = /*todos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "class", "todos-container svelte-1e6dpjc");
    			add_location(section, file, 22, 2, 440);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*todos, deleteTodo, util*/ 3) {
    				each_value = /*todos*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(22:0) {#if todos.length}",
    		ctx
    	});

    	return block;
    }

    // (24:2) {#each todos as todo, i}
    function create_each_block(ctx) {
    	let div5;
    	let div0;
    	let input;
    	let input_id_value;
    	let t0;
    	let label;
    	let label_for_value;
    	let t1;
    	let p;
    	let span0;
    	let t2_value = /*todo*/ ctx[6].priority + "";
    	let t2;
    	let span0_class_value;
    	let t3;
    	let span1;
    	let t4_value = /*todo*/ ctx[6].title + "";
    	let t4;
    	let t5;
    	let div3;
    	let div1;
    	let t6;
    	let div2;
    	let t7;
    	let t8_value = util.getDurationFromNow(/*todo*/ ctx[6].expired) + "";
    	let t8;
    	let t9;
    	let div4;
    	let t10;
    	let div5_class_value;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[4].call(input, /*each_value*/ ctx[7], /*i*/ ctx[8]);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[5](/*i*/ ctx[8], ...args);
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = space();
    			p = element("p");
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			span1 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t6 = space();
    			div2 = element("div");
    			t7 = text("Due in ");
    			t8 = text(t8_value);
    			t9 = space();
    			div4 = element("div");
    			t10 = space();
    			attr_dev(input, "class", "checkbox svelte-1e6dpjc");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", input_id_value = "todo-" + /*i*/ ctx[8]);
    			add_location(input, file, 26, 10, 622);
    			attr_dev(label, "for", label_for_value = "todo-" + /*i*/ ctx[8]);
    			attr_dev(label, "class", "svelte-1e6dpjc");
    			add_location(label, file, 27, 10, 720);
    			attr_dev(div0, "class", "checkbox-container svelte-1e6dpjc");
    			add_location(div0, file, 25, 8, 578);
    			attr_dev(span0, "class", span0_class_value = "priority " + /*todo*/ ctx[6].priority + " svelte-1e6dpjc");
    			add_location(span0, file, 30, 10, 817);
    			attr_dev(span1, "class", "title svelte-1e6dpjc");
    			add_location(span1, file, 31, 10, 890);
    			attr_dev(p, "class", "todos-description svelte-1e6dpjc");
    			add_location(p, file, 29, 8, 776);
    			attr_dev(div1, "class", "time svelte-1e6dpjc");
    			add_location(div1, file, 34, 10, 987);
    			attr_dev(div2, "class", "text-duration");
    			add_location(div2, file, 36, 10, 1035);
    			attr_dev(div3, "class", "duration svelte-1e6dpjc");
    			add_location(div3, file, 33, 8, 953);
    			attr_dev(div4, "class", "action svelte-1e6dpjc");
    			attr_dev(div4, "title", "delete todo");
    			add_location(div4, file, 40, 8, 1166);
    			attr_dev(div5, "class", div5_class_value = "todo-lists " + (/*todo*/ ctx[6].completed ? "complete" : "") + " svelte-1e6dpjc");
    			add_location(div5, file, 24, 6, 509);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, input);
    			input.checked = /*todo*/ ctx[6].completed;
    			append_dev(div0, t0);
    			append_dev(div0, label);
    			append_dev(div5, t1);
    			append_dev(div5, p);
    			append_dev(p, span0);
    			append_dev(span0, t2);
    			append_dev(p, t3);
    			append_dev(p, span1);
    			append_dev(span1, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, t7);
    			append_dev(div2, t8);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div5, t10);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", input_change_handler),
    					listen_dev(div4, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*todos*/ 1) {
    				input.checked = /*todo*/ ctx[6].completed;
    			}

    			if (dirty & /*todos*/ 1 && t2_value !== (t2_value = /*todo*/ ctx[6].priority + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*todos*/ 1 && span0_class_value !== (span0_class_value = "priority " + /*todo*/ ctx[6].priority + " svelte-1e6dpjc")) {
    				attr_dev(span0, "class", span0_class_value);
    			}

    			if (dirty & /*todos*/ 1 && t4_value !== (t4_value = /*todo*/ ctx[6].title + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*todos*/ 1 && t8_value !== (t8_value = util.getDurationFromNow(/*todo*/ ctx[6].expired) + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*todos*/ 1 && div5_class_value !== (div5_class_value = "todo-lists " + (/*todo*/ ctx[6].completed ? "complete" : "") + " svelte-1e6dpjc")) {
    				attr_dev(div5, "class", div5_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(24:2) {#each todos as todo, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*todos*/ ctx[0].length) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let todos = [];
    	let { totalTasks = 0 } = $$props;

    	const addTodo = data => {
    		todos.push(data);
    		todos.sort((a, b) => new Date(a.expired) - new Date(b.expired));
    		$$invalidate(0, todos);
    		$$invalidate(2, totalTasks = todos.length);
    	};

    	totalTasks = todos.length;

    	const deleteTodo = index => {
    		todos.splice(index, 1);
    		$$invalidate(0, todos);
    		$$invalidate(2, totalTasks = todos.length);
    	};

    	const writable_props = ["totalTasks"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Todos> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Todos", $$slots, []);

    	function input_change_handler(each_value, i) {
    		each_value[i].completed = this.checked;
    		$$invalidate(0, todos);
    	}

    	const click_handler = i => deleteTodo(i);

    	$$self.$set = $$props => {
    		if ("totalTasks" in $$props) $$invalidate(2, totalTasks = $$props.totalTasks);
    	};

    	$$self.$capture_state = () => ({
    		util,
    		todos,
    		totalTasks,
    		addTodo,
    		deleteTodo
    	});

    	$$self.$inject_state = $$props => {
    		if ("todos" in $$props) $$invalidate(0, todos = $$props.todos);
    		if ("totalTasks" in $$props) $$invalidate(2, totalTasks = $$props.totalTasks);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [todos, deleteTodo, totalTasks, addTodo, input_change_handler, click_handler];
    }

    class Todos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { totalTasks: 2, addTodo: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Todos",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get totalTasks() {
    		throw new Error("<Todos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalTasks(value) {
    		throw new Error("<Todos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addTodo() {
    		return this.$$.ctx[3];
    	}

    	set addTodo(value) {
    		throw new Error("<Todos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\NewTodos.svelte generated by Svelte v3.24.0 */
    const file$1 = "src\\NewTodos.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let select;
    	let option0;
    	let option1;
    	let t10;
    	let div3;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Title";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Deadline";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Priority";
    			t7 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Low";
    			option1 = element("option");
    			option1.textContent = "High";
    			t10 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "Add";
    			attr_dev(label0, "for", "title");
    			attr_dev(label0, "class", "svelte-1nhbtqs");
    			add_location(label0, file$1, 25, 4, 482);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "title");
    			attr_dev(input0, "class", "svelte-1nhbtqs");
    			add_location(input0, file$1, 26, 4, 520);
    			attr_dev(div0, "class", "input-group svelte-1nhbtqs");
    			add_location(div0, file$1, 24, 2, 451);
    			attr_dev(label1, "for", "deadline");
    			attr_dev(label1, "class", "svelte-1nhbtqs");
    			add_location(label1, file$1, 29, 4, 621);
    			attr_dev(input1, "type", "datetime-local");
    			attr_dev(input1, "id", "deadline");
    			attr_dev(input1, "class", "svelte-1nhbtqs");
    			add_location(input1, file$1, 30, 4, 665);
    			attr_dev(div1, "class", "input-group svelte-1nhbtqs");
    			add_location(div1, file$1, 28, 2, 590);
    			attr_dev(label2, "for", "priority");
    			attr_dev(label2, "class", "svelte-1nhbtqs");
    			add_location(label2, file$1, 33, 4, 781);
    			option0.__value = "low";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-1nhbtqs");
    			add_location(option0, file$1, 35, 6, 900);
    			option1.__value = "high";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-1nhbtqs");
    			add_location(option1, file$1, 36, 6, 940);
    			attr_dev(select, "name", "priority");
    			attr_dev(select, "id", "priority");
    			attr_dev(select, "class", "svelte-1nhbtqs");
    			if (/*todo*/ ctx[0].priority === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
    			add_location(select, file$1, 34, 4, 825);
    			attr_dev(div2, "class", "input-group svelte-1nhbtqs");
    			add_location(div2, file$1, 32, 2, 750);
    			attr_dev(button, "class", "add-button svelte-1nhbtqs");
    			add_location(button, file$1, 40, 4, 1042);
    			attr_dev(div3, "class", "input-group mt-auto svelte-1nhbtqs");
    			add_location(div3, file$1, 39, 2, 1003);
    			attr_dev(section, "class", "new-todo svelte-1nhbtqs");
    			add_location(section, file$1, 23, 0, 421);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*todo*/ ctx[0].title);
    			append_dev(section, t2);
    			append_dev(section, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*todo*/ ctx[0].expired);
    			append_dev(section, t5);
    			append_dev(section, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*todo*/ ctx[0].priority);
    			append_dev(section, t10);
    			append_dev(section, div3);
    			append_dev(div3, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[3]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[4]),
    					listen_dev(button, "click", /*addTodo*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*todo*/ 1 && input0.value !== /*todo*/ ctx[0].title) {
    				set_input_value(input0, /*todo*/ ctx[0].title);
    			}

    			if (dirty & /*todo*/ 1) {
    				set_input_value(input1, /*todo*/ ctx[0].expired);
    			}

    			if (dirty & /*todo*/ 1) {
    				select_option(select, /*todo*/ ctx[0].priority);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let todo = { title: "", priority: "low", expired: "" };
    	const dispatch = createEventDispatcher();

    	const addTodo = () => {
    		if (!todo.title || !todo.expired) {
    			alert("Please fill all the detail first!");
    			return;
    		}

    		dispatch("addTodo", todo);
    		$$invalidate(0, todo = { title: "", priority: "low", expired: "" });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NewTodos> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NewTodos", $$slots, []);

    	function input0_input_handler() {
    		todo.title = this.value;
    		$$invalidate(0, todo);
    	}

    	function input1_input_handler() {
    		todo.expired = this.value;
    		$$invalidate(0, todo);
    	}

    	function select_change_handler() {
    		todo.priority = select_value(this);
    		$$invalidate(0, todo);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		todo,
    		dispatch,
    		addTodo
    	});

    	$$self.$inject_state = $$props => {
    		if ("todo" in $$props) $$invalidate(0, todo = $$props.todo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		todo,
    		addTodo,
    		input0_input_handler,
    		input1_input_handler,
    		select_change_handler
    	];
    }

    class NewTodos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewTodos",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.24.0 */
    const file$2 = "src\\App.svelte";

    function create_fragment$2(ctx) {
    	let link;
    	let style;
    	let t1;
    	let main;
    	let header;
    	let p0;
    	let t3;
    	let p1;
    	let t4;
    	let t5;
    	let t6;
    	let newtodos;
    	let t7;
    	let todos;
    	let updating_totalTasks;
    	let current;
    	newtodos = new NewTodos({ $$inline: true });
    	newtodos.$on("addTodo", /*addTodo_handler*/ ctx[2]);

    	function todos_totalTasks_binding(value) {
    		/*todos_totalTasks_binding*/ ctx[4].call(null, value);
    	}

    	let todos_props = {};

    	if (/*tasks*/ ctx[1] !== void 0) {
    		todos_props.totalTasks = /*tasks*/ ctx[1];
    	}

    	todos = new Todos({ props: todos_props, $$inline: true });
    	/*todos_binding*/ ctx[3](todos);
    	binding_callbacks.push(() => bind(todos, "totalTasks", todos_totalTasks_binding));

    	const block = {
    		c: function create() {
    			link = element("link");
    			style = element("style");
    			style.textContent = "* {\r\n  margin: 0;\r\n  padding: 0;\r\n  box-sizing: border-box;  \r\n  font-family: 'Montserrat', sans-serif;\r\n}\r\nbody {\r\n  height: 100vh;\r\n  display: flex;\r\n  align-items: center;\r\n  flex-direction: column;\r\n}";
    			t1 = space();
    			main = element("main");
    			header = element("header");
    			p0 = element("p");
    			p0.textContent = "Todo Lists!";
    			t3 = space();
    			p1 = element("p");
    			t4 = text(/*tasks*/ ctx[1]);
    			t5 = text(" Tasks");
    			t6 = space();
    			create_component(newtodos.$$.fragment);
    			t7 = space();
    			create_component(todos.$$.fragment);
    			attr_dev(link, "href", "https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file$2, 1, 2, 17);
    			add_location(style, file$2, 2, 1, 128);
    			attr_dev(p0, "class", "title svelte-jnq19d");
    			add_location(p0, file$2, 29, 3, 574);
    			attr_dev(p1, "class", "remaining-task svelte-jnq19d");
    			add_location(p1, file$2, 30, 4, 612);
    			attr_dev(header, "class", "svelte-jnq19d");
    			add_location(header, file$2, 28, 2, 561);
    			attr_dev(main, "class", "svelte-jnq19d");
    			add_location(main, file$2, 27, 0, 551);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			append_dev(document.head, style);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, p0);
    			append_dev(header, t3);
    			append_dev(header, p1);
    			append_dev(p1, t4);
    			append_dev(p1, t5);
    			append_dev(main, t6);
    			mount_component(newtodos, main, null);
    			append_dev(main, t7);
    			mount_component(todos, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*tasks*/ 2) set_data_dev(t4, /*tasks*/ ctx[1]);
    			const todos_changes = {};

    			if (!updating_totalTasks && dirty & /*tasks*/ 2) {
    				updating_totalTasks = true;
    				todos_changes.totalTasks = /*tasks*/ ctx[1];
    				add_flush_callback(() => updating_totalTasks = false);
    			}

    			todos.$set(todos_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newtodos.$$.fragment, local);
    			transition_in(todos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newtodos.$$.fragment, local);
    			transition_out(todos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link);
    			detach_dev(style);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			destroy_component(newtodos);
    			/*todos_binding*/ ctx[3](null);
    			destroy_component(todos);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let totalTasks;
    	let newTodo = {};
    	let listTodo;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	const addTodo_handler = ({ detail }) => listTodo.addTodo(detail);

    	function todos_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			listTodo = $$value;
    			$$invalidate(0, listTodo);
    		});
    	}

    	function todos_totalTasks_binding(value) {
    		tasks = value;
    		($$invalidate(1, tasks), $$invalidate(5, totalTasks));
    	}

    	$$self.$capture_state = () => ({
    		Todos,
    		NewTodos,
    		totalTasks,
    		newTodo,
    		listTodo,
    		tasks
    	});

    	$$self.$inject_state = $$props => {
    		if ("totalTasks" in $$props) $$invalidate(5, totalTasks = $$props.totalTasks);
    		if ("newTodo" in $$props) newTodo = $$props.newTodo;
    		if ("listTodo" in $$props) $$invalidate(0, listTodo = $$props.listTodo);
    		if ("tasks" in $$props) $$invalidate(1, tasks = $$props.tasks);
    	};

    	let tasks;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(1, tasks = totalTasks);
    	return [listTodo, tasks, addTodo_handler, todos_binding, todos_totalTasks_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
