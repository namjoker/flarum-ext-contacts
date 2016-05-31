import LinkButton from 'flarum/components/LinkButton';
import Badge from 'flarum/components/Badge';

export default class ContactItem extends LinkButton {
    view() {
        const contact = this.props.contact;
        return this.getContactButton(contact);
    }

    getContactButton(contact) {
        if (contact.icon_type() === 'favicon') {
            return m('a', {
                className: 'ContactsButton Button Button--link',
                target: '_blank',
                href: contact.url(),
                title: contact.url()
            }, [
                Badge.component({
                    type: 'contacts',
                    icon: 'favicon-grey',
                    style: 'background-image: url("'+contact.icon()+'");background-size: 60%;background-position: 50% 50%;background-repeat: no-repeat;'
                }),
                ' ',
                contact.title()
            ]);
        } else {
            return m('a', {
                className: 'ContactsButton Button Button--link',
                target: '_blank',
                href: contact.url(),
                title: contact.url()
            }, [
                Badge.component({
                    type: 'contacts',
                    icon: contact.icon().replace('fa-', '')
                }),
                ' ',
                contact.title()
            ]);
        }
    }
}
