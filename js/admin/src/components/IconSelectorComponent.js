import Dropdown from 'flarum/components/Dropdown';
import ItemList from 'flarum/utils/ItemList';
import icon from 'flarum/helpers/icon';

export default class IconSelectorComponent extends Dropdown {
    static initProps(props) {
        super.initProps(props);

        props.className = 'icondropdown';
        props.buttonClassName = 'Button Button--icon';
        props.menuClassName = 'social-dropdown-menu';
    }

    init() {
        super.init();

        this.icons = {
            'social':
                ["fa-link", "fa-phone", "fa-at", "fa-globe", 'fa-amazon', 'fa-angellist', 'fa-apple', 'fa-behance', 'fa-bitbucket', 'fa-codepen', 'fa-connectdevelop', 'fa-dashcube', 'fa-delicious', 'fa-deviantart', 'fa-digg', 'fa-dribbble', 'fa-dropbox', 'fa-drupal', 'fa-facebook', 'fa-flickr', 'fa-foursquare', 'fa-get-pocket', 'fa-git', 'fa-github', 'fa-github-alt', 'fa-gittip', 'fa-google', 'fa-google-plus', 'fa-google-wallet', 'fa-gratipay', 'fa-hacker-news', 'fa-instagram', 'fa-ioxhost', 'fa-joomla', 'fa-jsfiddle', 'fa-lastfm', 'fa-leanpub', 'fa-linkedin', 'fa-meanpath', 'fa-medium', 'fa-odnoklassniki', 'fa-opencart', 'fa-pagelines', 'fa-paypal', 'fa-pied-piper-alt', 'fa-pinterest-p', 'fa-qq', 'fa-reddit', 'fa-renren', 'fa-sellsy', 'fa-share-alt', 'fa-shirtsinbulk', 'fa-simplybuilt', 'fa-skyatlas', 'fa-skype', 'fa-slack', 'fa-slideshare', 'fa-soundcloud', 'fa-spotify', 'fa-stack-exchange', 'fa-stack-overflow', 'fa-steam', 'fa-stumbleupon', 'fa-tencent-weibo', 'fa-trello', 'fa-tripadvisor', 'fa-tumblr', 'fa-twitch', 'fa-twitter', 'fa-viacoin', 'fa-vimeo', 'fa-vine', 'fa-vk', 'fa-wechat', 'fa-weibo', 'fa-weixin', 'fa-whatsapp', 'fa-wordpress', 'fa-xing', 'fa-y-combinator', 'fa-yelp', 'fa-youtube-play' ],
        };
    }

    view() {

        $(".iconpicker-image").error(() => {
            this.props.iconType('icon');
            this.props.icon(this.icons['social'][0]);
            m.redraw();
        });

        this.props.children = this.items().toArray();

        return super.view();
    }

    getButtonContent() {
        return [
            this.props.iconType() == 'favicon'
                ? [<img class="social-button" style="width: 14px;height: 14px;" src={this.props.icon()}></img>]
                : icon(this.props.icon().replace('fa-', ''), {}),
            this.props.caretIcon ? icon(this.props.caretIcon, {className: 'Button-caret'}) : ''
        ];
    }

    items() {
        const items = new ItemList();
        if(this.props.iconType() == 'favicon') this.faviconUrl = this.props.icon();

        if(this.faviconUrl) {
            items.add('favicon',(
                    m('div', {
                        onclick: () => {
                            this.props.iconType('favicon');
                            this.props.icon(this.faviconUrl);
                            m.redraw();
                        },
                        role: "button",
                        href: "#",
                        class: "iconpicker-item",
                        title: 'Favicon'
                    }, [<img class= "iconpicker-image" style="width: 14px;height: 14px;margin: 0 2px 0 2px;" src={this.faviconUrl}></img>])),
                101
            );
        }

        for(const index in this.icons['social']) {
            if(Object.prototype.hasOwnProperty.call(this.icons['social'], index)) {
                var highlighted = m.prop();
                if (this.props.icon() == this.icons['social'][index]) {
                    highlighted('iconpicker--highlighted');
                }
                items.add(this.icons['social'][index], (
                        m('div', {
                            onclick: () => {
                                this.props.iconType('icon');
                                m.redraw();
                                this.props.icon(this.icons['social'][index]);
                                m.redraw();
                            },
                            role: "button",
                            href: "#",
                            class: "iconpicker-item " + highlighted(),
                            title: '.' + this.icons['social'][index]
                        }, [icon(this.icons['social'][index].replace('fa-', ''), {className: 'social-icon'})])),
                    100
                );
            }
        }
        return items;
    }
}