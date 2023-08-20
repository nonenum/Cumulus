import KanbanAPI from "./KanbanAPI.js";

export default class DropZone {
    static createZone() {
        const range = document.createRange();

        range.selectNode(document.body);

        const dropZone = range.createContextualFragment(`
            <div class="kanban__dropzone"></div>
        `).children[0];

        dropZone.addEventListener("dragover", e => {
            e.preventDefault();

            dropZone.classList.add("kanban__dropzone--active");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("kanban__dropzone--active");
        });

        dropZone.addEventListener("drop", e => {
            e.preventDefault();
            dropZone.classList.remove("kanban__dropzone--active");
        
            const columnElement = dropZone.closest(".kanban__column");
            const columnID = Number(columnElement.dataset.id);

            const dropZonesInColumn = Array.from(columnElement.querySelector(".kanban__dropzone"));
            const droppedIndex = dropZonesInColumn.indexOf(dropZone);

            const itemID = Number(e.dataTransfer.getData("text/plain"));
            const droppedItemElement = document.querySelector(`[data-id="${itemID}"]`);

            const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

            if (droppedItemElement.contains(dropZone)) {
                return;
            }

            insertAfter.after(droppedItemElement);

            KanbanAPI.updateItem(itemID, {
                columnID, position: droppedIndex
            });
        });

        return dropZone;
    }
}