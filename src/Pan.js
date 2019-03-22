'use strict'

class Pan {
    constructor() {
        this.zoom_in = 1.1;
        this.zoom_out = 1 / 1.1;
        this.zoom_inL = 1.15;
        this.zoom_outL = 1 / 1.15;
        this.rotate_angle = Math.PI / 500;
        this.rotate_angleL = Math.PI / 50;
        this.translatel = 1;
        this.translatelL = 5;

        this.drag = false;
        this.drag_point = null;
        this.is_dragging = false;
    }

    onMouseDown(editor, etype, e) {
        e.preventDefault();
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        this.drag = true;
        this.drag_point = {
            x: x,
            y: y
        }
    }

    onMouseUp(editor, etype, e) {
        this.is_dragging = false;
        this.drag = false;
    }

    onMouseLeave(editor, e) {
        this.drag = false;
        this.is_dragging = false;
    };

    onMouseMove(editor, etype, e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        e.preventDefault();
        if (this.drag) {
            this.is_dragging = true;
            let rest = {
                x: (x - this.drag_point.x),
                y: (y - this.drag_point.y)
            }
            editor.world.translateAdd(rest.x, rest.y);
            this.drag_point = {
                x: x,
                y: y
            }
            editor.world.applyTransform(editor.contextes);
            editor.draw();
            editor.drawForeground()
        }
    }

    onMouseWheel(editor, etype, e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        e.preventDefault();

        const mask = EventUtil.getModifiers(e)

        if(EventUtil.matchMask(mask, EventUtil.Modifiers.ALT)){

            editor.world.rotate(- Math.sign(e.deltaY) * Math.PI/100);
            editor.world.applyTransform(editor.contextes)
            editor.draw();
            editor.drawForeground()
            return
        }

        let z = 0;
        if (e.deltaY < 0) {
            z = this.zoom_in;
        } else {
            z = this.zoom_out;
        }
        let diff = editor.world.getTransformation().clone().inv().multiplyPoint(x, y).valueOf()
        editor.world.scaleOnPoint(z, z, diff[0], diff[1]);
        editor.world.applyTransform(editor.contextes)
        editor.draw();
        editor.drawForeground()
    }

}