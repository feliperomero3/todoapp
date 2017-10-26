// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone.localStorage.html)
// to persist Backbone models within your browser.
// http://backbonejs.org/examples/todos/index.html

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function () {

    // Todo Model
    // ----------

    // Our basic todo model has title, order, and done attributes.
    var Todo = Backbone.Model.extend({

        // Defaults attributes for the todo item.
        defaults: function() {
            return {
                title: "empty todo...",
                order: Todos.nextOrder(),
                done: false
            };
        },

        // Toggle the 'done' state of this todo item.
        toggle: function() {
            this.save({done: !this.get("done")});
        }
    });

    // Todo Collection
    // ---------------

    // The collection of todos is backed by *localStorage* instead of a remote 
    // server
    var TodoList = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Todo,

        // Save all of the todo items under the "todos-backbone" namespace.
        localStorage: new Backbone.LocalStorage("todos-backbone"),

        // Filter down the list of all todo items that are finished.
        done: function() {
            return this.where({done: true});
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: 'order'

    });

    // Create our global collection of **Todos**.
    var Todos = new TodoList;
  
    // Todo Item View
    // --------------
  
    // The DOM element for a todo item...
    var TodoView = Backbone.View.extend({

        // ... is a list tag.
        tagName: "li",

        // Cache the template function for a single item.
        template: _.template($('#item-template').html()),

        // The DOM events specific to an item.
        events: {
            "click .toggle"   : "toggleDone",
            "dblclick .view"  : "edit",
            "click a.destroy" : "clear",
            "keypress .edit"  : "updateOnEnter",
            "blur .edit"      : "close"
        },

        // The TodoView listens for changes to its model, re-rendering.
        // Since there's a one-to-one correspondence between a **Todo**
        // and a **TodoView** in this app, we set a direct reference
        // on the model for convenience.
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        // Re-render the titles of the todo item.
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },

        // Toggle de "done" state of the model.
        toggleDone: function() {
            this.model.toggle();
        },

        // Switch this view into "editing" mode, displaying the input field.
        edit: function() {
            this.$el.addClass('editing');
            this.input.focus();
        },

        // Close the "editing" mode, saving changes to the todo.
        close: function() {
            var value = this.input.val();
            if (!value) {
                this.clear();
            } else {
                this.model.save({title: value});
                this.$el.removeClass('editing');                
            }
        },

        // If you hit Enter, we're through editing this item.
        updateOnEnter: function() {
            if (e.keycode == 13) {
                this.close();
            }
        },

        // Remove the item, destroy the model.
        clear: function() {
            this.model.destroy();
        }
    });

    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.


})();