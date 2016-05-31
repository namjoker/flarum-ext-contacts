import Contact from 'avatar4eg/contacts/models/Contact';
import addContactsPane from 'avatar4eg/contacts/addContactsPane';

app.initializers.add('avatar4eg-contacts', app => {
    app.store.models.contacts = Contact;
    addContactsPane();
});
