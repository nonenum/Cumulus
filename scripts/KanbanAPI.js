export default class KanbanAPI {
    static getItems(columnID) {
        const column = read().find(column => column.id == columnID);
    
        if (!column) {
            return [];
        }
    
        return column.items;
    }

    static insertItem(columnID, content) {
        const data = read();
        const column = data.find(column => column.id == columnID);
        const item = {
            id: Math.floor(Math.random() * 1000000),
            content
        };
    
        if (!column) {
            throw new Error("Column does not exist.");
        }
    
        column.items.push(item);
        save(data);
    
        return item;
    }

    static updateItem(itemID, newProps) {
        const data = read();
        const [item, currentColumn] = (() => {
            for (const column of data) {
                const item = column.items.find(item => item.id == itemID);
    
                if (item) {
                    return [item, column];
                }
            }
        })();
    
        if (!item) {
            throw new Error("Item not found.");
        }
    
        item.content = newProps.content === undefined ? item.content : newProps.content;
    
        if (newProps.columnID !== undefined && newProps.position !== undefined) {
            const targetColumn = data.find(column => column.id == newProps.columnID);
            
            if (!targetColumn) {
                throw new Error("Target column not found.")
            }
    
            currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
            targetColumn.items.splice(newProps.position, 0, item);
        }
    
        save(data);
    }

    static deleteItem(itemID) {
        const data = read();
    
        for (const column of data) {
            const item = column.items.find(item => item.id == itemID);
    
            if (item) {
                column.items.splice(column.items.indexOf(item), 1);
            }
        }
    
        save(data);
    }
}

function save(data) {
    localStorage.setItem("kanban-data", JSON.stringify(data));
}

function read() {
    const json = localStorage.getItem("kanban-data");

    if (!json) {
        return [
            {
                id: 1,
                items: []
            },
            {
                id: 2,
                items: []
            },
            {
                id: 3,
                items: []
            }   
        ];
    }

    return JSON.parse(json);
}