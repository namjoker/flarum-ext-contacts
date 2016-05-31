import { extend } from 'flarum/extend';
import app from 'flarum/app';
import IndexPage from 'flarum/components/IndexPage';

import Contact from 'avatar4eg/contacts/models/Contact';
import Contacts from 'avatar4eg/contacts/components/Contacts';

app.initializers.add('avatar4eg-contacts', () => {
    app.store.models.contacts = Contact;
    extend(IndexPage.prototype, 'sidebarItems', function(items) {
        items.add('contacts', Contacts.component());
    });
});