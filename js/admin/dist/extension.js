;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.sortable = factory(root.jQuery);
  }
}(this, function($) {
/*
 * HTML5 Sortable jQuery Plugin
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro> & Lukas Oppermann <lukas@vea.re>
 *
 *
 * Released under the MIT license.
 */
'use strict';
/*
 * variables global to the plugin
 */
var dragging;
var draggingHeight;
var placeholders = $();
var sortables = [];
/*
 * remove event handlers from items
 * @param [jquery Collection] items
 * @info event.h5s (jquery way of namespacing events, to bind multiple handlers to the event)
 */
var _removeItemEvents = function(items) {
  items.off('dragstart.h5s');
  items.off('dragend.h5s');
  items.off('selectstart.h5s');
  items.off('dragover.h5s');
  items.off('dragenter.h5s');
  items.off('drop.h5s');
};
/*
 * remove event handlers from sortable
 * @param [jquery Collection] sortable
 * @info event.h5s (jquery way of namespacing events, to bind multiple handlers to the event)
 */
var _removeSortableEvents = function(sortable) {
  sortable.off('dragover.h5s');
  sortable.off('dragenter.h5s');
  sortable.off('drop.h5s');
};
/*
 * attache ghost to dataTransfer object
 * @param [event] original event
 * @param [object] ghost-object with item, x and y coordinates
 */
var _attachGhost = function(event, ghost) {
  // this needs to be set for HTML5 drag & drop to work
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text', '');

  // check if setDragImage method is available
  if (event.dataTransfer.setDragImage) {
    event.dataTransfer.setDragImage(ghost.item, ghost.x, ghost.y);
  }
};
/**
 * _addGhostPos clones the dragged item and adds it as a Ghost item
 * @param [object] event - the event fired when dragstart is triggered
 * @param [object] ghost - .item = node, draggedItem = jQuery collection
 */
var _addGhostPos = function(e, ghost) {
  if (!ghost.x) {
    ghost.x = parseInt(e.pageX - ghost.draggedItem.offset().left);
  }
  if (!ghost.y) {
    ghost.y = parseInt(e.pageY - ghost.draggedItem.offset().top);
  }
  return ghost;
};
/**
 * _makeGhost decides which way to make a ghost and passes it to attachGhost
 * @param [jQuery selection] $draggedItem - the item that the user drags
 */
var _makeGhost = function($draggedItem) {
  return {
    item: $draggedItem[0],
    draggedItem: $draggedItem
  };
};
/**
 * _getGhost constructs ghost and attaches it to dataTransfer
 * @param [event] event - the original drag event object
 * @param [jQuery selection] $draggedItem - the item that the user drags
 * @param [object] ghostOpt - the ghost options
 */
// TODO: could $draggedItem be replaced by event.target in all instances
var _getGhost = function(event, $draggedItem) {
  // add ghost item & draggedItem to ghost object
  var ghost = _makeGhost($draggedItem);
  // attach ghost position
  ghost = _addGhostPos(event, ghost);
  // attach ghost to dataTransfer
  _attachGhost(event, ghost);
};
/*
 * return options if not set on sortable already
 * @param [object] soptions
 * @param [object] options
 */
var _getOptions = function(soptions, options) {
  if (typeof soptions === 'undefined') {
    return options;
  }
  return soptions;
};
/*
 * remove data from sortable
 * @param [jquery Collection] a single sortable
 */
var _removeSortableData = function(sortable) {
  sortable.removeData('opts');
  sortable.removeData('connectWith');
  sortable.removeData('items');
  sortable.removeAttr('aria-dropeffect');
};
/*
 * remove data from items
 * @param [jquery Collection] items
 */
var _removeItemData = function(items) {
  items.removeAttr('aria-grabbed');
  items.removeAttr('draggable');
  items.removeAttr('role');
};
/*
 * check if two lists are connected
 * @param [jquery Collection] items
 */
var _listsConnected = function(curList, destList) {
  if (curList[0] === destList[0]) {
    return true;
  }
  if (curList.data('connectWith') !== undefined) {
    return curList.data('connectWith') === destList.data('connectWith');
  }
  return false;
};
/*
 * destroy the sortable
 * @param [jquery Collection] a single sortable
 */
var _destroySortable = function(sortable) {
  var opts = sortable.data('opts') || {};
  var items = sortable.children(opts.items);
  var handles = opts.handle ? items.find(opts.handle) : items;
  // remove event handlers & data from sortable
  _removeSortableEvents(sortable);
  _removeSortableData(sortable);
  // remove event handlers & data from items
  handles.off('mousedown.h5s');
  _removeItemEvents(items);
  _removeItemData(items);
};
/*
 * enable the sortable
 * @param [jquery Collection] a single sortable
 */
var _enableSortable = function(sortable) {
  var opts = sortable.data('opts');
  var items = sortable.children(opts.items);
  var handles = opts.handle ? items.find(opts.handle) : items;
  sortable.attr('aria-dropeffect', 'move');
  handles.attr('draggable', 'true');
  // IE FIX for ghost
  // can be disabled as it has the side effect that other events
  // (e.g. click) will be ignored
  var spanEl = (document || window.document).createElement('span');
  if (typeof spanEl.dragDrop === 'function' && !opts.disableIEFix) {
    handles.on('mousedown.h5s', function() {
      if (items.index(this) !== -1) {
        this.dragDrop();
      } else {
        $(this).parents(opts.items)[0].dragDrop();
      }
    });
  }
};
/*
 * disable the sortable
 * @param [jquery Collection] a single sortable
 */
var _disableSortable = function(sortable) {
  var opts = sortable.data('opts');
  var items = sortable.children(opts.items);
  var handles = opts.handle ? items.find(opts.handle) : items;
  sortable.attr('aria-dropeffect', 'none');
  handles.attr('draggable', false);
  handles.off('mousedown.h5s');
};
/*
 * reload the sortable
 * @param [jquery Collection] a single sortable
 * @description events need to be removed to not be double bound
 */
var _reloadSortable = function(sortable) {
  var opts = sortable.data('opts');
  var items = sortable.children(opts.items);
  var handles = opts.handle ? items.find(opts.handle) : items;
  // remove event handlers from items
  _removeItemEvents(items);
  handles.off('mousedown.h5s');
  // remove event handlers from sortable
  _removeSortableEvents(sortable);
};
/*
 * public sortable object
 * @param [object|string] options|method
 */
var sortable = function(selector, options) {

  var $sortables = $(selector);
  var method = String(options);

  options = $.extend({
    connectWith: false,
    placeholder: null,
    // dragImage can be null or a jQuery element
    dragImage: null,
    disableIEFix: false,
    placeholderClass: 'sortable-placeholder',
    draggingClass: 'sortable-dragging',
    hoverClass: false
  }, options);

  /* TODO: maxstatements should be 25, fix and remove line below */
  /*jshint maxstatements:false */
  return $sortables.each(function() {

    var $sortable = $(this);

    if (/enable|disable|destroy/.test(method)) {
      sortable[method]($sortable);
      return;
    }

    // get options & set options on sortable
    options = _getOptions($sortable.data('opts'), options);
    $sortable.data('opts', options);
    // reset sortable
    _reloadSortable($sortable);
    // initialize
    var items = $sortable.children(options.items);
    var index;
    var startParent;
    var newParent;
    var placeholder = (options.placeholder === null) ? $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="' + options.placeholderClass + '"/>') : $(options.placeholder).addClass(options.placeholderClass);

    // setup sortable ids
    if (!$sortable.attr('data-sortable-id')) {
      var id = sortables.length;
      sortables[id] = $sortable;
      $sortable.attr('data-sortable-id', id);
      items.attr('data-item-sortable-id', id);
    }

    $sortable.data('items', options.items);
    placeholders = placeholders.add(placeholder);
    if (options.connectWith) {
      $sortable.data('connectWith', options.connectWith);
    }

    _enableSortable($sortable);
    items.attr('role', 'option');
    items.attr('aria-grabbed', 'false');

    // Mouse over class
    if (options.hoverClass) {
      var hoverClass = 'sortable-over';
      if (typeof options.hoverClass === 'string') {
        hoverClass = options.hoverClass;
      }

      items.hover(function() {
        $(this).addClass(hoverClass);
      }, function() {
        $(this).removeClass(hoverClass);
      });
    }

    // Handle drag events on draggable items
    items.on('dragstart.h5s', function(e) {
      e.stopImmediatePropagation();

      if (options.dragImage) {
        _attachGhost(e.originalEvent, {
          item: options.dragImage,
          x: 0,
          y: 0
        });
        console.log('WARNING: dragImage option is deprecated' +
        ' and will be removed in the future!');
      } else {
        // add transparent clone or other ghost to cursor
        _getGhost(e.originalEvent, $(this), options.dragImage);
      }
      // cache selsection & add attr for dragging
      dragging = $(this);
      dragging.addClass(options.draggingClass);
      dragging.attr('aria-grabbed', 'true');
      // grab values
      index = dragging.index();
      draggingHeight = dragging.height();
      startParent = $(this).parent();
      // trigger sortstar update
      dragging.parent().triggerHandler('sortstart', {
        item: dragging,
        placeholder: placeholder,
        startparent: startParent
      });
    });
    // Handle drag events on draggable items
    items.on('dragend.h5s', function() {
      if (!dragging) {
        return;
      }
      // remove dragging attributes and show item
      dragging.removeClass(options.draggingClass);
      dragging.attr('aria-grabbed', 'false');
      dragging.show();

      placeholders.detach();
      newParent = $(this).parent();
      dragging.parent().triggerHandler('sortstop', {
        item: dragging,
        startparent: startParent,
      });
      if (index !== dragging.index() ||
          startParent.get(0) !== newParent.get(0)) {
        dragging.parent().triggerHandler('sortupdate', {
          item: dragging,
          index: newParent.children(newParent.data('items')).index(dragging),
          oldindex: items.index(dragging),
          elementIndex: dragging.index(),
          oldElementIndex: index,
          startparent: startParent,
          endparent: newParent
        });
      }
      dragging = null;
      draggingHeight = null;
    });
    // Handle drop event on sortable & placeholder
    // TODO: REMOVE placeholder?????
    $(this).add([placeholder]).on('drop.h5s', function(e) {
      if (!_listsConnected($sortable, $(dragging).parent())) {
        return;
      }

      e.stopPropagation();
      placeholders.filter(':visible').after(dragging);
      dragging.trigger('dragend.h5s');
      return false;
    });

    // Handle dragover and dragenter events on draggable items
    items.add([this]).on('dragover.h5s dragenter.h5s', function(e) {
      if (!_listsConnected($sortable, $(dragging).parent())) {
        return;
      }

      e.preventDefault();
      e.originalEvent.dataTransfer.dropEffect = 'move';
      if (items.is(this)) {
        var thisHeight = $(this).height();
        if (options.forcePlaceholderSize) {
          placeholder.height(draggingHeight);
        }

        // Check if $(this) is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
        if (thisHeight > draggingHeight) {
          // Dead zone?
          var deadZone = thisHeight - draggingHeight;
          var offsetTop = $(this).offset().top;
          if (placeholder.index() < $(this).index() &&
              e.originalEvent.pageY < offsetTop + deadZone) {
            return false;
          }
          if (placeholder.index() > $(this).index() &&
              e.originalEvent.pageY > offsetTop + thisHeight - deadZone) {
            return false;
          }
        }

        dragging.hide();
        if (placeholder.index() < $(this).index()) {
          $(this).after(placeholder);
        } else {
          $(this).before(placeholder);
        }
        placeholders.not(placeholder).detach();
      } else {
        if (!placeholders.is(this) && !$(this).children(options.items).length) {
          placeholders.detach();
          $(this).append(placeholder);
        }
      }
      return false;
    });
  });
};

sortable.destroy = function(sortable) {
  _destroySortable(sortable);
};

sortable.enable = function(sortable) {
  _enableSortable(sortable);
};

sortable.disable = function(sortable) {
  _disableSortable(sortable);
};

$.fn.sortable = function(options) {
  return sortable(this, options);
};

return sortable;
}));
;
'use strict';

System.register('avatar4eg/contacts/addContactsPane', ['flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'avatar4eg/contacts/components/ContactsPage'], function (_export, _context) {
  var extend, AdminNav, AdminLinkButton, ContactsPage;

  _export('default', function () {
    app.routes.contacts = { path: '/contacts', component: ContactsPage.component() };

    app.extensionSettings['avatar4eg-contacts'] = function () {
      return m.route(app.route('contacts'));
    };

    extend(AdminNav.prototype, 'items', function (items) {
      items.add('contacts', AdminLinkButton.component({
        href: app.route('contacts'),
        icon: 'phone',
        children: app.translator.trans('avatar4eg-contacts.admin.nav.contacts_button'),
        description: app.translator.trans('avatar4eg-contacts.admin.nav.contacts_text')
      }));
    });
  });

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsAdminNav) {
      AdminNav = _flarumComponentsAdminNav.default;
    }, function (_flarumComponentsAdminLinkButton) {
      AdminLinkButton = _flarumComponentsAdminLinkButton.default;
    }, function (_avatar4egContactsComponentsContactsPage) {
      ContactsPage = _avatar4egContactsComponentsContactsPage.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('avatar4eg/contacts/components/ContactsPage', ['flarum/components/Page', 'flarum/components/Button', 'avatar4eg/contacts/components/EditContactModal', 'avatar4eg/contacts/utils/sortContacts'], function (_export, _context) {
    var Page, Button, EditContactModal, sortContacts, ContactsPage;


    function ContactItem(contact) {
        return [m('li', { "data-id": contact.id() }, [m('div', { className: 'ContactListItem-info' }, [m('span', { className: 'ContactListItem-name' }, [contact.title()]), Button.component({
            className: 'Button Button--link',
            icon: 'pencil',
            onclick: function onclick() {
                return app.modal.show(new EditContactModal({ contact: contact }));
            }
        })])])];
    }

    function loadSorter(element) {
        $(element).sortable().on('sortupdate', function (e, ui) {
            var order = $(element).children('li').map(function () {
                return {
                    id: $(this).data('id')
                };
            }).get();

            order.forEach(function (contact, i) {
                var item = app.store.getById('contacts', contact.id);
                item.pushData({
                    attributes: {
                        position: i
                    }
                });
            });

            app.request({
                url: app.forum.attribute('apiUrl') + '/contacts/order',
                method: 'POST',
                data: { order: order }
            });

            m.redraw.strategy('all');
            m.redraw();
        });
    }
    return {
        setters: [function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_avatar4egContactsComponentsEditContactModal) {
            EditContactModal = _avatar4egContactsComponentsEditContactModal.default;
        }, function (_avatar4egContactsUtilsSortContacts) {
            sortContacts = _avatar4egContactsUtilsSortContacts.default;
        }],
        execute: function () {
            ContactsPage = function (_Page) {
                babelHelpers.inherits(ContactsPage, _Page);

                function ContactsPage() {
                    babelHelpers.classCallCheck(this, ContactsPage);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ContactsPage).apply(this, arguments));
                }

                babelHelpers.createClass(ContactsPage, [{
                    key: 'view',
                    value: function view() {
                        return [m('div', { className: 'ContactsPage' }, [m('div', { className: 'ContactsPage-header' }, [m('div', { className: 'container' }, [m('p', {}, app.translator.trans('avatar4eg-contacts.admin.contacts.about_text')), Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('avatar4eg-contacts.admin.contacts.create_button'),
                            onclick: function onclick() {
                                return app.modal.show(new EditContactModal());
                            }
                        })])]), m('div', { className: 'ContactsPage-list' }, [m('div', { className: 'container' }, [m('div', { className: 'ContactItems' }, [m('label', {}, app.translator.trans('avatar4eg-contacts.admin.contacts.contacts')), m('ol', {
                            className: 'ContactList',
                            config: loadSorter
                        }, [sortContacts(app.store.all('contacts')).map(ContactItem)])])])])])];
                    }
                }]);
                return ContactsPage;
            }(Page);

            _export('default', ContactsPage);
        }
    };
});;
'use strict';

System.register('avatar4eg/contacts/components/EditContactModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/utils/string', 'flarum/components/Select', 'avatar4eg/contacts/components/IconSelectorComponent'], function (_export, _context) {
    var Modal, Button, slug, Select, IconSelectorComponent, EditContactModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsString) {
            slug = _flarumUtilsString.slug;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }, function (_avatar4egContactsComponentsIconSelectorComponent) {
            IconSelectorComponent = _avatar4egContactsComponentsIconSelectorComponent.default;
        }],
        execute: function () {
            EditContactModal = function (_Modal) {
                babelHelpers.inherits(EditContactModal, _Modal);

                function EditContactModal() {
                    babelHelpers.classCallCheck(this, EditContactModal);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(EditContactModal).apply(this, arguments));
                }

                babelHelpers.createClass(EditContactModal, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(Object.getPrototypeOf(EditContactModal.prototype), 'init', this).call(this);

                        this.contact = this.props.contact || app.store.createRecord('contacts');

                        this.itemTitle = m.prop(this.contact.title() || '');
                        this.type = m.prop(this.contact.type() || 'url');
                        this.url = m.prop(this.contact.url() || '');
                        this.icon = m.prop(this.contact.icon() || 'fa-link');
                        this.iconType = m.prop(this.contact.icon_type() || 'icon');

                        this.contactTypes = {
                            'titles': {
                                'url': app.translator.trans('avatar4eg-contacts.admin.edit_contact.type_url'),
                                'phone': app.translator.trans('avatar4eg-contacts.admin.edit_contact.type_phone'),
                                'mail': app.translator.trans('avatar4eg-contacts.admin.edit_contact.type_mail')
                            },
                            'links': {
                                'url': '',
                                'phone': 'tel:',
                                'mail': 'mailto:'
                            },
                            'icons': {
                                'url': 'fa-link',
                                'phone': 'fa-phone',
                                'mail': 'fa-at'
                            }
                        };
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'EditContactModal Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        var title = this.itemTitle();
                        return title ? title : app.translator.trans('avatar4eg-contacts.admin.edit_contact.title');
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        var _this2 = this;

                        var parent = this;
                        return [m('div', { className: 'Modal-body' }, [m('form', {
                            className: 'Form',
                            onsubmit: this.onsubmit.bind(this)
                        }, [m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-contacts.admin.edit_contact.title_label')), m('input', {
                            className: 'FormControl',
                            placeholder: app.translator.trans('avatar4eg-contacts.admin.edit_contact.title_placeholder'),
                            value: this.itemTitle(),
                            oninput: m.withAttr('value', this.itemTitle)
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-contacts.admin.edit_contact.type_label')), Select.component({
                            options: this.contactTypes['titles'],
                            onchange: function onchange(value) {
                                parent.type(value);
                                parent.url(parent.contactTypes['links'][value]);
                                parent.iconType('icon');
                                parent.icon(parent.contactTypes['icons'][value]);
                            },
                            value: this.type() || 'url'
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-contacts.admin.edit_contact.url_label')), m('input', {
                            className: 'FormControl',
                            type: 'url',
                            placeholder: app.translator.trans('avatar4eg-contacts.admin.edit_contact.url_placeholder'),
                            value: this.url(),
                            oninput: m.withAttr('value', function (value) {
                                _this2.url(value);
                                var urlpattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
                                if (urlpattern.test(_this2.url().toLowerCase())) {
                                    var iconurl = _this2.url().replace(/(:\/\/[^\/]+).*$/, '$1') + '/favicon.ico';
                                    _this2.icon(iconurl);
                                    _this2.iconType('favicon');
                                    m.redraw();
                                } else if (_this2.iconType() == 'favicon') {
                                    _this2.icon(parent.contactTypes['links']['url']);
                                    _this2.iconType('icon');
                                    m.redraw();
                                }
                            })
                        })]), m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('avatar4eg-contacts.admin.edit_contact.icon_label')), IconSelectorComponent.component({
                            icon: this.icon,
                            iconType: this.iconType
                        })]), m('div', { className: 'Form-group' }, [Button.component({
                            type: 'submit',
                            className: 'Button Button--primary EditContactModal-save',
                            loading: this.loading,
                            children: app.translator.trans('avatar4eg-contacts.admin.edit_contact.submit_button')
                        }), this.contact.exists ? Button.component({
                            type: 'button',
                            className: 'Button EditContactModal-delete',
                            onclick: this.deleteItem.bind(this),
                            children: app.translator.trans('avatar4eg-contacts.admin.edit_contact.delete_contact_button')
                        }) : ''])])])];
                    }
                }, {
                    key: 'onsubmit',
                    value: function onsubmit(e) {
                        var _this3 = this;

                        e.preventDefault();

                        this.loading = true;

                        this.contact.save({
                            title: this.itemTitle(),
                            url: this.url(),
                            type: this.type(),
                            icon: this.icon(),
                            icon_type: this.iconType()
                        }).then(function () {
                            return _this3.hide();
                        }, function (response) {
                            _this3.loading = false;
                            _this3.handleErrors(response);
                        });
                    }
                }, {
                    key: 'deleteItem',
                    value: function deleteItem() {
                        if (confirm(app.translator.trans('avatar4eg-contacts.admin.edit_contact.delete_contact_confirmation'))) {
                            this.contact.delete({}).then(function () {
                                return m.redraw();
                            });
                            this.hide();
                        }
                    }
                }]);
                return EditContactModal;
            }(Modal);

            _export('default', EditContactModal);
        }
    };
});;
'use strict';

System.register('avatar4eg/contacts/components/IconSelectorComponent', ['flarum/components/Dropdown', 'flarum/utils/ItemList', 'flarum/helpers/icon'], function (_export, _context) {
    var Dropdown, ItemList, icon, IconSelectorComponent;
    return {
        setters: [function (_flarumComponentsDropdown) {
            Dropdown = _flarumComponentsDropdown.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }],
        execute: function () {
            IconSelectorComponent = function (_Dropdown) {
                babelHelpers.inherits(IconSelectorComponent, _Dropdown);

                function IconSelectorComponent() {
                    babelHelpers.classCallCheck(this, IconSelectorComponent);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(IconSelectorComponent).apply(this, arguments));
                }

                babelHelpers.createClass(IconSelectorComponent, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(Object.getPrototypeOf(IconSelectorComponent.prototype), 'init', this).call(this);

                        this.icons = {
                            'social': ["fa-link", "fa-phone", "fa-at", "fa-globe", 'fa-amazon', 'fa-angellist', 'fa-apple', 'fa-behance', 'fa-bitbucket', 'fa-codepen', 'fa-connectdevelop', 'fa-dashcube', 'fa-delicious', 'fa-deviantart', 'fa-digg', 'fa-dribbble', 'fa-dropbox', 'fa-drupal', 'fa-facebook', 'fa-flickr', 'fa-foursquare', 'fa-get-pocket', 'fa-git', 'fa-github', 'fa-github-alt', 'fa-gittip', 'fa-google', 'fa-google-plus', 'fa-google-wallet', 'fa-gratipay', 'fa-hacker-news', 'fa-instagram', 'fa-ioxhost', 'fa-joomla', 'fa-jsfiddle', 'fa-lastfm', 'fa-leanpub', 'fa-linkedin', 'fa-meanpath', 'fa-medium', 'fa-odnoklassniki', 'fa-opencart', 'fa-pagelines', 'fa-paypal', 'fa-pied-piper-alt', 'fa-pinterest-p', 'fa-qq', 'fa-reddit', 'fa-renren', 'fa-sellsy', 'fa-share-alt', 'fa-shirtsinbulk', 'fa-simplybuilt', 'fa-skyatlas', 'fa-skype', 'fa-slack', 'fa-slideshare', 'fa-soundcloud', 'fa-spotify', 'fa-stack-exchange', 'fa-stack-overflow', 'fa-steam', 'fa-stumbleupon', 'fa-tencent-weibo', 'fa-trello', 'fa-tripadvisor', 'fa-tumblr', 'fa-twitch', 'fa-twitter', 'fa-viacoin', 'fa-vimeo', 'fa-vine', 'fa-vk', 'fa-wechat', 'fa-weibo', 'fa-weixin', 'fa-whatsapp', 'fa-wordpress', 'fa-xing', 'fa-y-combinator', 'fa-yelp', 'fa-youtube-play']
                        };
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this2 = this;

                        $(".iconpicker-image").error(function () {
                            _this2.props.iconType('icon');
                            _this2.props.icon(_this2.icons['social'][0]);
                            m.redraw();
                        });

                        this.props.children = this.items().toArray();

                        return babelHelpers.get(Object.getPrototypeOf(IconSelectorComponent.prototype), 'view', this).call(this);
                    }
                }, {
                    key: 'getButtonContent',
                    value: function getButtonContent() {
                        return [this.props.iconType() == 'favicon' ? [m('img', { 'class': 'social-button', style: 'width: 14px;height: 14px;', src: this.props.icon() })] : icon(this.props.icon().replace('fa-', ''), {}), this.props.caretIcon ? icon(this.props.caretIcon, { className: 'Button-caret' }) : ''];
                    }
                }, {
                    key: 'items',
                    value: function items() {
                        var _this3 = this;

                        var items = new ItemList();
                        if (this.props.iconType() == 'favicon') this.faviconUrl = this.props.icon();

                        if (this.faviconUrl) {
                            items.add('favicon', m('div', {
                                onclick: function onclick() {
                                    _this3.props.iconType('favicon');
                                    _this3.props.icon(_this3.faviconUrl);
                                    m.redraw();
                                },
                                role: "button",
                                href: "#",
                                class: "iconpicker-item",
                                title: 'Favicon'
                            }, [m('img', { 'class': 'iconpicker-image', style: 'width: 14px;height: 14px;margin: 0 2px 0 2px;', src: this.faviconUrl })]), 101);
                        }

                        var _loop = function _loop(index) {
                            if (Object.prototype.hasOwnProperty.call(_this3.icons['social'], index)) {
                                highlighted = m.prop();

                                if (_this3.props.icon() == _this3.icons['social'][index]) {
                                    highlighted('iconpicker--highlighted');
                                }
                                items.add(_this3.icons['social'][index], m('div', {
                                    onclick: function onclick() {
                                        _this3.props.iconType('icon');
                                        m.redraw();
                                        _this3.props.icon(_this3.icons['social'][index]);
                                        m.redraw();
                                    },
                                    role: "button",
                                    href: "#",
                                    class: "iconpicker-item " + highlighted(),
                                    title: '.' + _this3.icons['social'][index]
                                }, [icon(_this3.icons['social'][index].replace('fa-', ''), { className: 'social-icon' })]), 100);
                            }
                        };

                        for (var index in this.icons['social']) {
                            var highlighted;

                            _loop(index);
                        }
                        return items;
                    }
                }], [{
                    key: 'initProps',
                    value: function initProps(props) {
                        babelHelpers.get(Object.getPrototypeOf(IconSelectorComponent), 'initProps', this).call(this, props);

                        props.className = 'icondropdown';
                        props.buttonClassName = 'Button Button--icon';
                        props.menuClassName = 'social-dropdown-menu';
                    }
                }]);
                return IconSelectorComponent;
            }(Dropdown);

            _export('default', IconSelectorComponent);
        }
    };
});;
'use strict';

System.register('avatar4eg/contacts/main', ['avatar4eg/contacts/models/Contact', 'avatar4eg/contacts/addContactsPane'], function (_export, _context) {
    var Contact, addContactsPane;
    return {
        setters: [function (_avatar4egContactsModelsContact) {
            Contact = _avatar4egContactsModelsContact.default;
        }, function (_avatar4egContactsAddContactsPane) {
            addContactsPane = _avatar4egContactsAddContactsPane.default;
        }],
        execute: function () {

            app.initializers.add('avatar4eg-contacts', function (app) {
                app.store.models.contacts = Contact;
                addContactsPane();
            });
        }
    };
});;
'use strict';

System.register('avatar4eg/contacts/models/Contact', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    var Model, mixin, Contact;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Contact = function (_mixin) {
                babelHelpers.inherits(Contact, _mixin);

                function Contact() {
                    babelHelpers.classCallCheck(this, Contact);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Contact).apply(this, arguments));
                }

                return Contact;
            }(mixin(Model, {
                title: Model.attribute('title'),
                type: Model.attribute('type'),
                url: Model.attribute('url'),
                icon: Model.attribute('icon'),
                icon_type: Model.attribute('icon_type'),
                position: Model.attribute('position')
            }));

            _export('default', Contact);
        }
    };
});;
"use strict";

System.register("avatar4eg/contacts/utils/sortContacts", [], function (_export, _context) {
  function sortContacts(contacts) {
    return contacts.slice(0).sort(function (a, b) {
      var aPos = a.position();
      var bPos = b.position();

      if (bPos === null) return -1;
      if (aPos === null) return 1;

      return a.position() - b.position();
    });
  }

  _export("default", sortContacts);

  return {
    setters: [],
    execute: function () {}
  };
});