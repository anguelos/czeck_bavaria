class Canvaces{
    constructor(canvaces_divid, selected_divid, img_url, gt_json, classes_json, config){
        var self = this;
        this.config = config;
        this.active = 0;
        this.set_classes(classes_json);
        this.set_boxes(gt_json);
        this.canvaces_div = document.getElementById(canvaces_divid);
        this.create_canvaces();
        
        this.img = new Image();
        this.img.onload = function(){
            self.cnv_image.width = self.img.width;
            self.cnv_image.height = self.img.height;
            self.ctx_image = self.cnv_image.getContext("2d");
            self.ctx_image.clearRect(0, 0, self.img.width, self.img.height);
            self.ctx_image.drawImage(self.img, 0, 0, self.img.width, self.img.height);

    
            self.cnv_boxes.width = self.img.width;
            self.cnv_boxes.height = self.img.height;
            self.ctx_boxes = self.cnv_boxes.getContext("2d");

            self.cnv_active.width = self.img.width;
            self.cnv_active.height = self.img.height;
            self.ctx_active = self.cnv_active.getContext("2d");

            self.cnv_interactive.width = self.img.width;
            self.cnv_interactive.height = self.img.height;
            self.ctx_interactive = self.cnv_interactive.getContext("2d");
            self.draw_boxes();
            self.draw_active();
        }
        this.img.src = img_url;

    }
    sort_boxes(){
        let order_idx=[];
        for(let n =0;n<this.rect_LTRB.length;n++){
            let order_val=(this.rect_LTRB[n][1]+this.rect_LTRB[n][3])*30+(this.rect_LTRB[n][0]+this.rect_LTRB[n][2]);
            order_idx.push([order_val,n]);
        }
        order_idx.sort();
        let new_active=0;
        let new_LTRB=[];
        let new_captions=[];
        let new_classes=[];
        for(let n=0;n<this.rect_LTRB.length;n++){
            let old_idx=order_idx[n][1];
            if(old_idx==this.active){
                new_active=n;
            }
            new_LTRB.push(this.rect_LTRB[old_idx]);
            new_captions.push(this.rect_captions[old_idx]);
            new_classes.push(this.rect_classes[old_idx]);
        }
        this.active=new_active;
        this.rect_LTRB = new_LTRB;
        this.rect_captions = new_captions;
        this.rect_classes = new_classes;
    }

    set_boxes(boxes_json){
        this.rect_LTRB=[];
        this.rect_captions=[];
        this.rect_classes=[];
        for(let box of JSON.parse(boxes_json)){
            this.rect_LTRB.push(box.ltrb);
            this.rect_captions.push(box.transcription);
            this.rect_classes.push(box.class_id);
        }
        this.sort_boxes();
    }
    set_classes(classes_json){
        let values=JSON.parse(classes_json);
        this.class_names = []
        this.class_colors = []
        for(let class_data of values){
            this.class_names.push(class_data.name);
            this.class_colors.push(class_data.color);
        }
    }

    draw_boxes(){
        this.ctx_boxes.clearRect(0, 0, this.img.width, this.img.height);
        let locations_by_color=[];
        for(let n=0;n<this.class_names.length;n++){
            locations_by_color.push([]);
        }
        for(let n=0;n<this.rect_LTRB.length;n++){
            locations_by_color[this.rect_classes[n]].push(this.rect_LTRB[n]);
        }
        this.ctx_boxes.clearRect(0, 0, this.img.width, this.img.height);
        this.ctx_boxes.globalAlpha = 0.2;
        for(var color_n=0; color_n<this.class_colors.length;color_n++){
            if(locations_by_color.length > 0){
                this.ctx_boxes.fillStyle = this.class_colors[color_n];
                for(let ltrb of locations_by_color[color_n]){
                        this.ctx_boxes.fillRect(ltrb[0], ltrb[1], ltrb[2]-ltrb[0], ltrb[3]-ltrb[1]);
                }
            }
        }
        this.ctx_boxes.globalAlpha = 0.5;
        this.ctx_boxes.lineWidth="2";
        for(var color_n=0; color_n<this.class_colors.length;color_n++){
            if(locations_by_color.length > 0){
                this.ctx_boxes.strokeStyle = this.class_colors[color_n];
                for(let ltrb of locations_by_color[color_n]){
                        this.ctx_boxes.strokeRect(ltrb[0], ltrb[1], ltrb[2]-ltrb[0], ltrb[3]-ltrb[1]);
                }
            }
        }
        this.ctx_boxes.globalAlpha = 1.0;
        this.ctx_boxes.strokeStyle = "black";
        this.ctx_boxes.fillStyle = "black";
        this.ctx_boxes.font = '18pt Calibri';
        this.ctx_boxes.shadowColor="black";
        this.ctx_boxes.shadowBlur=7;
        this.ctx_boxes.lineWidth=5;
        //this.ctx_boxes.fillStyle = this.config.transcription_font_color;
        for(var n=0;n<this.rect_LTRB.length;n++){
            this.ctx_boxes.strokeText(this.rect_captions, this.rect_LTRB[n][0], this.rect_LTRB[n][1]);
        }
        this.ctx_boxes.shadowBlur=0;
        this.ctx_boxes.fillStyle="white";
        for(var n=0;n<this.rect_LTRB.length;n++){
            this.ctx_boxes.fillText(this.rect_captions, this.rect_LTRB[n][0], this.rect_LTRB[n][1]);
        }        
    }
    draw_active(){
        this.ctx_active.clearRect(0, 0, this.img.width, this.img.height);
        if(this.rect_LTRB.length>0){
            var ltrb=this.rect_LTRB[this.active];
            this.ctx_active.beginPath();
            this.ctx_active.lineWidth="8";
            this.ctx_active.strokeStyle="black";
            this.ctx_active.rect(ltrb[0], ltrb[1], ltrb[2]-ltrb[0], ltrb[3]-ltrb[1]);
            this.ctx_active.stroke();

            this.ctx_active.beginPath();
            this.ctx_active.lineWidth="4";
            this.ctx_active.strokeStyle="white";
            this.ctx_active.rect(ltrb[0], ltrb[1], ltrb[2]-ltrb[0], ltrb[3]-ltrb[1]);
            this.ctx_active.stroke();

            this.ctx_active.beginPath();
            this.ctx_active.lineWidth="2";
            this.ctx_active.strokeStyle="black";
            this.ctx_active.rect(ltrb[0], ltrb[1], ltrb[2]-ltrb[0], ltrb[3]-ltrb[1]);
            this.ctx_active.stroke();
            var loc_w=(document.documentElement.clientWidth+ltrb[2]+ltrb[0])/2;
            var loc_h=(document.documentElement.clientHeight+ltrb[3]+ltrb[1])/2;
        }
    }
    
    create_canvaces(){
        let width=400;
        let height=300;
        this.canvaces_div.innerHTML ="";
        this.canvaces_div.style.borderStyle = "solid";
        this.canvaces_div.style.position = "relative";
        this.canvaces_div.style.width = width;
        this.canvaces_div.style.height = height;

        this.cnv_image = document.createElement("canvas");
        this.cnv_image.innerHTML = "This text is displayed because your browser does not support HTML5 Canvas.";
        this.cnv_image.style.zIndex=1;
        this.cnv_image.style.position = "absolute";
        this.cnv_image.style.left = 0;
        this.cnv_image.style.top = 0;
        this.cnv_image.style.height = height;
        this.cnv_image.style.width = width;
        //this.cnv_image.style.background="red";
        this.canvaces_div.appendChild(this.cnv_image);

        this.cnv_boxes = document.createElement("canvas");
        this.cnv_boxes.innerHTML = "This text is displayed because your browser does not support HTML5 Canvas.";
        this.cnv_boxes.style.position = "absolute";
        this.cnv_boxes.style.zIndex=2;    
        this.cnv_boxes.style.left = 0;
        this.cnv_boxes.style.top = 0;
        this.cnv_boxes.style.height = height;
        this.cnv_boxes.style.width = width;
        //this.cnv_boxes.style.background="green";
        this.canvaces_div.appendChild(this.cnv_boxes);

        this.cnv_active = document.createElement("canvas");
        this.cnv_active.innerHTML = "This text is displayed because your browser does not support HTML5 Canvas.";
        this.cnv_active.style.position = "absolute";
        this.cnv_active.style.zIndex=3;    
        this.cnv_active.style.left = 0;
        this.cnv_active.style.top = 0;
        this.cnv_active.style.height = height;
        this.cnv_active.style.width = width;
        //this.cnv_active.style.background="green";
        this.canvaces_div.appendChild(this.cnv_active);

        this.cnv_interactive = document.createElement("canvas");
        this.cnv_interactive.innerHTML = "This text is displayed because your browser does not support HTML5 Canvas.";
        this.cnv_interactive.style.position = "absolute";
        this.cnv_interactive.style.zIndex=4;    
        this.cnv_interactive.style.left = 0;
        this.cnv_interactive.style.top = 0;
        this.cnv_interactive.style.height = height;
        this.cnv_interactive.style.width = width;
        //this.cnv_interactive.style.background="green";
        this.canvaces_div.appendChild(this.cnv_interactive);
    }
}


class ClassIdEditor{
    constructor(values, editor_div_id, selector_div_id){
        var self = this; // For this acces in callbacks

        this.class_names = [];
        this.class_colors = [];        
        for(let i=0;i<values.length;i++){
            this.class_names.push(values[i].name);
            this.class_colors.push(values[i].color);

        }
        this.selection = 0;

        this.dom_editor_div = document.getElementById(editor_div_id);
        this.dom_selector_div = document.getElementById(selector_div_id);
        this.dom_editor_div.innerHTML = "";
        this.dom_edit_tablebody = document.createElement("tbody");
        this.dom_edit_table = document.createElement("table");
        this.dom_edit_table.innerHTML = "<thead><tr><th>Class ID</th><th>Class Caption</th><th>Class Color</th><th></th></tr></thead>";
        this.dom_edit_tablefoot = document.createElement("tfoot");
        
        this.dom_edit_table.appendChild(this.dom_edit_tablebody);
        this.dom_edit_table.appendChild(this.dom_edit_tablefoot);
        this.dom_editor_div.appendChild(this.dom_edit_table);

        this.btn_add = document.createElement("button");
        this.btn_add.innerHTML = "Add Class";
        this.btn_add.onclick = function () {
            let row = document.createElement("tr");
            ClassIdEditor.populate_row(self.dom_edit_tablebody.rows.length, {name:"Change this", color:"#888888"}, row);
            self.dom_edit_tablebody.appendChild(row);
        }
        this.dom_edit_tablefoot.appendChild(this.btn_add);
    
        this.btn_remove = document.createElement("button");
        this.btn_remove.innerHTML = "Remove Last Class";
        this.btn_remove.onclick = function () {
            if(self.dom_edit_tablebody.rows.length > 1){
                self.dom_edit_tablebody.deleteRow(-1);
            }else{
                alert("At least one class is required, have "+self.dom_edit_tablebody.rows.length);
            }
        }
        this.dom_edit_tablefoot.appendChild(this.btn_remove);

        this.btn_reset = document.createElement("button");
        this.btn_reset.innerHTML = "Reset";
        this.btn_reset.onclick = function(){
            let values=[];
            for(let i=0;i<self.class_names.length;i++){
                values.push({name:self.class_names[i],color:self.class_colors[i]});
            }
            self.write_gui(values);
        }
        this.dom_edit_tablefoot.appendChild(this.btn_reset);

        this.btn_save = document.createElement("button");
        this.btn_save.innerHTML = "Save";
        this.btn_save.onclick = function(){
            values=self.read_gui();
            if(self.gui_values_ok(values)){
                self.class_names.length = 0;
                self.class_colors.length = 0;
                for(let val of values){
                    self.class_names.push(val.name);
                    self.class_colors.push(val.color);
                }
                self.draw_class_choices();
            }else{
                alert("Can not save Class Ids");
            }
        }
        this.dom_edit_tablefoot.appendChild(this.btn_save);
        this.draw_class_choices();
    }

    static populate_row(row_num, values_object,rowNode){  //  staticmethod
        let inpId = document.createElement("input");
        inpId.type="text";
        inpId.value=row_num;
        inpId.disabled=1
        let tdClassId = document.createElement("td");
        tdClassId.appendChild(inpId);

        let inpName = document.createElement("input");
        inpName.type="text";
        inpName.value=values_object.name;
        let tdClassName = document.createElement("td");
        tdClassName.appendChild(inpName);

        let inpColor = document.createElement("input");
        inpColor.type = "color";
        inpColor.value = values_object.color;
        let tdClassColor = document.createElement("td");
        tdClassColor.appendChild(inpColor);

        rowNode.appendChild(tdClassId);
        rowNode.appendChild(tdClassName);
        rowNode.appendChild(tdClassColor);
    };

    read_gui(){
        var res=[];
        for(let row of this.dom_edit_tablebody.children){
            res.push({name:row.children[1].children[0].value.trim(), color: row.children[2].children[0].value.trim()});
        }
        return res;
    }

    write_gui(class_label_values){
        this.dom_edit_tablebody.innerHTML = "";
        for(const row_values of class_label_values){
            let rowNode = document.createElement("tr");
            ClassIdEditor.populate_row(this.dom_edit_tablebody.rows.length, row_values, rowNode);
            this.dom_edit_tablebody.appendChild(rowNode);
        }
    }

    gui_values_ok(values){
        let names = new Set();
        let colors = new Set();
        for(let i=0; i < values.length; i++){
            if(values[i].name==""){
                alert("Empty name");
                return 0;
            }
            names.add(values[i].name);
            colors.add(values[i].color);
        }
        if((names.size!=values.length) ||(names.size!=colors.size)){
            alert("Sizes:"+values.length+","+names.size+","+colors.size);
            return 0;
        }
        return 1;
    }

    set_choice(choice){
        this.selection = choice;
        for(let i=0;i<this.class_buttons.length;i++){
            this.class_buttons[i].disabled = (i==choice);
        }
    }

    draw_class_choices(){
        var self=this;
        if (this.selection >= this.class_names.colors){
            this.selection=0;
        }
        this.dom_selector_div.innerHTML = "";
        this.class_buttons=[];
        let dom_select_table = document.createElement("table");
        let dom_selet_row = document.createElement("tr");
        for(let i=0;i<this.class_names.length;i++){
            let btn_num = i;
            let dom_td = document.createElement("td");
            let dom_btn = document.createElement("button");
            dom_btn.type="button";
            dom_btn.id = "class_choice_"+i;
            dom_btn.innerHTML = this.class_names[i];
            //dom_btn.style.background = this.class_colors[i];
            //dom_btn.style.textShadow = "0px 0px 4px #666666,0px 0px 2px #FFFFFF";
            dom_btn.style.textShadow = "0px 0px 3px "+this.class_colors[i];
            //dom_btn.style.borderRadius = "5px";
            dom_btn.onclick = function (){
                self.set_choice(btn_num);
            }
            dom_td.appendChild(dom_btn);
            dom_selet_row.appendChild(dom_td);
            this.class_buttons.push(dom_btn);
        }
        dom_select_table.appendChild(dom_selet_row);
        this.dom_selector_div.appendChild(dom_select_table);
        this.set_choice(this.selection);
    }
}