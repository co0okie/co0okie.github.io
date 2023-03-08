'use strict'

class Page {
    /**
     * @param {Object} page
     * @param {Page} parent
     * @param {string} name
     * @param {string} path
     */
    constructor(page, parent = undefined, name = 'root', path = '/') {
        /** @type {Page} */
        this.parent = parent;
        /** @type {string} */
        this.name = name;
        /**
         * /name1/name2/.../nameN/ 
         * @type {string} 
         */
        this.path = path;

        if (page.header === 'children') {
            /** @type {HTMLElement} */
            this.header = document.createElement('header');

            let home = document.createElement('a');
            home.innerHTML = '李品翰的網站';
            home.addEventListener('click', e => {
                Page.to(this);
            });
            this.header.appendChild(home);
            for (let [name, childPage] of Object.entries(page.children)) {
                let a = document.createElement('a');
                a.innerHTML = childPage.text;
                a.addEventListener('click', e => {
                    Page.to(this.children.get(name));
                });
                this.header.appendChild(a);
            }
        } else if (page.header === 'parent') {
            this.header = this.parent.header;
        }

        if (page.nav === 'children') {
            /** @type {HTMLElement} */
            this.nav = document.createElement('nav');
            
            for (let [name, childPage] of Object.entries(page.children)) {
                let a = document.createElement('a');
                a.innerHTML = childPage.text;
                a.addEventListener('click', e => {
                    Page.to(this.children.get(name));
                });
                this.nav.appendChild(a);
            }
        } else if (page.nav === 'parent') {
            this.nav = this.parent.nav;
        }
        
        if (page.main === 'file') {
            /** @type {HTMLElement} */
            this.main = document.createElement('main');
            
            fetch(`${this.path}main.html`)
            .then(r => r.text())
            .then(s => this.main.innerHTML = s);
        }
        
        if (page.children) {
            /** @type {Map<string, Page>} */
            this.children = new Map();
            for (let [name, childPage] of Object.entries(page.children)) {
                this.children.set(name, new Page(childPage, this, name, this.path + name + '/'));
            }
        }
    }
    
    /** @type {Page} */
    static now;
    
    /** @param {Page} page */
    static to(page) {
        Page.now || document.body.appendChild(page.header);
        for (let e of ['header', 'nav', 'main']) {
            if ((Page.now && Page.now[e]) !== page[e]) {
                Page.now && Page.now[e]?.remove();
                document.body.append(page[e] || '');
            }
        }
        Page.now = page;
    }
}

const ROOT = new Page({
    children: {
        note: {
            text: '筆記',
            children: {
                compare: {
                    text: '程式語言比較',
                    header: 'parent',
                    nav: 'parent',
                    main: 'file'
                },
                linux: {
                    text: 'Linux',
                    header: 'parent',
                    nav: 'parent',
                    main: 'file'
                }
            },
            header: 'parent',
            nav: 'children',
            main: 'file'
        },
        work: {
            text: '作品',
            children: {
                acim: {
                    text: '旋轉磁場',
                    header: 'parent',
                    nav: 'parent',
                    main: 'file',
                },
                ffmpeg: {
                    text: 'FFmpeg',
                    header: 'parent',
                    nav: 'parent',
                    main: 'file'
                }
            },
            header: 'parent',
            nav: 'children'
        }
    },
    header: 'children',
    main: 'file'
});

Page.to(ROOT);