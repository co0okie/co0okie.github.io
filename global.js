'use strict'

class Directory {
    constructor({name, text = name, children, main, clickToExpand = true}, parent) {
        this.name = name;
        this.parent = parent;
        this.main = main;
        
        this.button = document.createElement('div');
        this.button.classList.add('button');
        this.button.innerHTML = text;
        this.button.style.paddingLeft = this.level / 2 - 0.1 + 'em';
        main && this.button.addEventListener('click', e => cd(this));
        
        if (children) {
            this.children = new Map();
            
            this.container = document.createElement('div');
            this.container.classList.add('container');
            this.container.style.display = clickToExpand ? 'none' : 'block';
            
            clickToExpand && this.button.addEventListener('click', e => {
                const style = this.container.style;
                if (style.display === 'block') this.collapse();
                else style.display = 'block';
            });
            
            for (let childInfo of children) {
                let child = new Directory(childInfo, this);
                this.container.append(child.button, child.container || '');
                this.children.set(child.name, child);
            }
        }
    }
    
    get path() {
        return this.parent ? `${this.parent.path}${this.name}/` : '/';
    }
    
    get level() {
        return this.parent?.level + 1 || 0;
    }
    
    collapse() {
        if (!this.children) return;
        for (let child of this.children.values()) child.collapse();
        this.container.style.display = 'none';
    }
}

const ROOT = new Directory({
    name: 'root',
    text: '李品翰的網站',
    main: ['html'],
    children: [{
        name: 'note',
        text: '筆記',
        main: ['html'],
        children: [{
            name: 'compare',
            text: '程式語言比較',
            main: ['html', 'css']
        }, {
            name: 'linux',
            text: 'Linux',
            main: ['html']
        }]
    }, {
        name: 'work',
        text: '作品',
        children: [{
            name: 'acim',
            text: '旋轉磁場',
            main: ['html']
        }, {
            name: 'ffmpeg',
            text: 'FFmpeg',
            main: ['html']
        }]
    }],
    clickToExpand: false
});

const cd = (() => {
    let pwd;
    return (dir) => {
        if (pwd === dir) return;
    
        if (pwd?.css) pwd.css.remove();
        if (pwd) pwd.button.style.boxShadow = '';
        
        if (dir.main?.includes('html')) {
            fetch(dir.path + 'main.html')
            .then(r => r.text())
            .then(t => MAIN.innerHTML = t);
        }
        
        if (dir.main?.includes('css')) {
            if (dir.css) {
                document.head.appendChild(dir.css);
            } else {
                fetch(dir.path + 'main.css')
                .then(r => r.text())
                .then(t => {
                    dir.css = document.createElement('style');
                    dir.css.innerHTML = t;
                    document.head.appendChild(dir.css);
                });
            }
        }
        
        dir.button.style.boxShadow = 'inset 0.2em 0 #fff';
        
        history.pushState(undefined, undefined, `/?dir=${dir.path}`);
        pwd = dir;
    }
})();

const SWITCH = document.querySelector('body > div'); // toggle header show/hide
const HEADER = document.querySelector('body > header');
const MAIN = document.querySelector('body > main');
HEADER.append(ROOT.button, ROOT.container);
HEADER.style.display = 'block';
SWITCH.addEventListener('click', e => {
    HEADER.style.display = (HEADER.style.display === 'block') ? 'none' : 'block';
});

window.addEventListener('load', e => {
    let dir = new URLSearchParams(window.location.search)
        .get('dir')?.split('/').filter(s => s)
        .reduce((p, c) => p.children?.get(c) || p, ROOT)
        || ROOT;
    (function expand(d) {
        if (!d.parent) return;
        d.parent.container.style.display = 'block';
        expand(d.parent);
    })(dir);
    cd(dir);
});