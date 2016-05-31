'use strict';

System.register('avatar4eg/contacts/components/ContactItem', ['flarum/components/LinkButton', 'flarum/components/Badge'], function (_export, _context) {
    var LinkButton, Badge, ContactItem;
    return {
        setters: [function (_flarumComponentsLinkButton) {
            LinkButton = _flarumComponentsLinkButton.default;
        }, function (_flarumComponentsBadge) {
            Badge = _flarumComponentsBadge.default;
        }],
        execute: function () {
            ContactItem = function (_LinkButton) {
                babelHelpers.inherits(ContactItem, _LinkButton);

                function ContactItem() {
                    babelHelpers.classCallCheck(this, ContactItem);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ContactItem).apply(this, arguments));
                }

                babelHelpers.createClass(ContactItem, [{
                    key: 'view',
                    value: function view() {
                        var contact = this.props.contact;
                        return this.getContactButton(contact);
                    }
                }, {
                    key: 'getContactButton',
                    value: function getContactButton(contact) {
                        if (contact.icon_type() === 'favicon') {
                            return m('a', {
                                className: 'ContactsButton Button Button--link',
                                target: '_blank',
                                href: contact.url(),
                                title: contact.url()
                            }, [Badge.component({
                                type: 'contacts',
                                icon: 'favicon-grey',
                                style: 'background-image: url("' + contact.icon() + '");background-size: 60%;background-position: 50% 50%;background-repeat: no-repeat;'
                            }), ' ', contact.title()]);
                        } else {
                            return m('a', {
                                className: 'ContactsButton Button Button--link',
                                target: '_blank',
                                href: contact.url(),
                                title: contact.url()
                            }, [Badge.component({
                                type: 'contacts',
                                icon: contact.icon().replace('fa-', '')
                            }), ' ', contact.title()]);
                        }
                    }
                }]);
                return ContactItem;
            }(LinkButton);

            _export('default', ContactItem);
        }
    };
});;
'use strict';

System.register('avatar4eg/contacts/components/Contacts', ['flarum/Component', 'flarum/utils/ItemList', 'flarum/helpers/listItems', 'flarum/app', 'avatar4eg/contacts/components/ContactItem', 'avatar4eg/contacts/utils/sortContacts'], function (_export, _context) {
    var Component, ItemList, listItems, app, ContactItem, sortContacts, Contacts;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }, function (_flarumHelpersListItems) {
            listItems = _flarumHelpersListItems.default;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_avatar4egContactsComponentsContactItem) {
            ContactItem = _avatar4egContactsComponentsContactItem.default;
        }, function (_avatar4egContactsUtilsSortContacts) {
            sortContacts = _avatar4egContactsUtilsSortContacts.default;
        }],
        execute: function () {
            Contacts = function (_Component) {
                babelHelpers.inherits(Contacts, _Component);

                function Contacts() {
                    babelHelpers.classCallCheck(this, Contacts);
                    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Contacts).apply(this, arguments));
                }

                babelHelpers.createClass(Contacts, [{
                    key: 'view',
                    value: function view() {
                        var items = this.items().toArray();
                        console.log(items);

                        return m('div', {
                            className: 'Contacts',
                            id: 'contacts'
                        }, items.length > 0 ? [m('hr'), m('ul', { className: 'ContactList' }, listItems(items))] : '');
                    }
                }, {
                    key: 'items',
                    value: function items() {
                        var contacts = app.store.all('contacts');
                        var contactItems = new ItemList();
                        var addContact = function addContact(contact) {
                            contactItems.add('contact' + contact.id(), ContactItem.component({ contact: contact }));
                        };
                        sortContacts(contacts).map(addContact);

                        return contactItems;
                    }
                }]);
                return Contacts;
            }(Component);

            _export('default', Contacts);
        }
    };
});;
'use strict';

System.register('avatar4eg/contacts/main', ['flarum/extend', 'flarum/app', 'flarum/components/IndexPage', 'avatar4eg/contacts/models/Contact', 'avatar4eg/contacts/components/Contacts'], function (_export, _context) {
    var extend, app, IndexPage, Contact, Contacts;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsIndexPage) {
            IndexPage = _flarumComponentsIndexPage.default;
        }, function (_avatar4egContactsModelsContact) {
            Contact = _avatar4egContactsModelsContact.default;
        }, function (_avatar4egContactsComponentsContacts) {
            Contacts = _avatar4egContactsComponentsContacts.default;
        }],
        execute: function () {

            app.initializers.add('avatar4eg-contacts', function () {
                app.store.models.contacts = Contact;
                extend(IndexPage.prototype, 'sidebarItems', function (items) {
                    items.add('contacts', Contacts.component());
                });
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