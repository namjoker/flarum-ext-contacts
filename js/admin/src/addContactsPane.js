import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import ContactsPage from 'avatar4eg/contacts/components/ContactsPage';

export default function() {
  app.routes.contacts = {path: '/contacts', component: ContactsPage.component()};

  app.extensionSettings['avatar4eg-contacts'] = () => m.route(app.route('contacts'));

  extend(AdminNav.prototype, 'items', items => {
    items.add('contacts', AdminLinkButton.component({
      href: app.route('contacts'),
      icon: 'phone',
      children: app.translator.trans('avatar4eg-contacts.admin.nav.contacts_button'),
      description: app.translator.trans('avatar4eg-contacts.admin.nav.contacts_text')
    }));
  });
}
