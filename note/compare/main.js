fetch('/note/compare/table.json')
.then(r => r.json())
.then(json => {
    let table = document.createElement('table');
    MAIN.appendChild(table);
    
    let thead = document.createElement('thead');
    
    let tbody = document.createElement('tbody');
    table.append(thead, tbody);
    
    // top left empty
    let theadTr = document.createElement('tr');
    thead.appendChild(theadTr);
    theadTr.appendChild(document.createElement('th'));
    
    // thead
    for (let language of json.head.languages) {
        let th = document.createElement('th');
        theadTr.appendChild(th);
        th.innerHTML = language;
    }
    
    // tbody
    for (let title of json.head.titles) {
        let tr = document.createElement('tr');
        tbody.appendChild(tr);
        let th = document.createElement('th');
        tr.appendChild(th);
        th.innerHTML = title.replaceAll(' ', '<br>');
        
        // td
        for (let language of json.head.languages) {
            let td = document.createElement('td');
            tr.appendChild(td);
            let content = json.body[language][title];
            if (content) {
                td.innerHTML = content.join('<br>');
            } else {
                td.classList.add('empty');
            }
        }
    }
});

