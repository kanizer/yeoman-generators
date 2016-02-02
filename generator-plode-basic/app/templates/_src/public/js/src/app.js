import 'babel-polyfill'; // adds a lot of weight, but req'd for promises in ie 9
import Handlebars from 'handlebars';
import request from 'superagent';
import ieRequest from 'superagent-legacyiesupport';
import ClassList from './ClassList';
import template from  '../../templates/template.hbs';

const hbs = Handlebars.compile(template);
const apiUrl = 'http://demo8953473.mockable.io/topmusic';

class App {

    constructor() {
        // update ie/js support status
        let htmlCl = this.getClassList(document.documentElement);
        if(htmlCl.contains('lt-ie9')) {
            return;
        }
        htmlCl.remove('no-js');

        // temporary
        this.container = document.querySelector('.wrapper');

        this.populateData()
            .then(this.render.bind(this));
    }

    // ie < 10 is wack
    getClassList(el) {
        if(el.classList) {
            return el.classList;
        }
        return new ClassList(el);
    }

    populateData() {
        return new Promise((resolve, reject) => {
            request
                .get(apiUrl)
                .use(ieRequest)
                .end((err, res) => {
                    if(err) {
                        // service only exists as a possibly temporary sample in a pull req;
                        // mock a response with local data if the service request fails
                        setTimeout(() => resolve(data), 50);
                    }
                    resolve(res.body);
                });
        });
    }

    render(d = {}) {
        let thresh = 25;
        d.songs.map(item => {
            item.title = (item.artist + ' - ' + item.title);
            if(item.title.length > thresh) {
                item.title = item.title.substr(0, thresh - 3) + '...';
            }
            if(item.artist.length > thresh) {
                item.artist = item.artist.substr(0, thresh - 3) + '...';
            }
            this.container.appendChild(this.createEl(item));
            return item;
        });
    }

    createEl(d = {}, templ = hbs) {
        let div = document.createElement('div');
        div.innerHTML = templ(d).trim();

        // convert to reg array
        let nodes = div.childNodes;
        let elements = [];
        let i = nodes.length;
        while(elements.length !== nodes.length) {
            elements.unshift(nodes[i--]);
        }

        if(elements.length !== 1) {
            throw new Error('Bad templ format!');
        }

        return nodes[0];
    }
}

const app = new App();
