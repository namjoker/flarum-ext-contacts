import Component from 'flarum/Component';
import ItemList from 'flarum/utils/ItemList';
import listItems from 'flarum/helpers/listItems';
import app from 'flarum/app';

import ContactItem from 'avatar4eg/contacts/components/ContactItem';
import sortContacts from 'avatar4eg/contacts/utils/sortContacts';

export default class Contacts extends Component {
    view() {
        var items = this.items().toArray();

        return m('div', {
            className: 'Contacts',
            id: 'contacts'
        }, items.length > 0 ? [
            m('hr'),
            m('ul', {className: 'ContactList'},
                listItems(items)
            )] : '');
    }

    items() {
        const contacts = app.store.all('contacts');
        var contactItems = new ItemList();
        const addContact = contact => {
            contactItems.add('contact' + contact.id(), ContactItem.component({contact}));
        };
        sortContacts(contacts).map(addContact);

        return contactItems;
    }
}
