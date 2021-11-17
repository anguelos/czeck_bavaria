function createUI(page_id){
        alert("Grouting begins{"+page_id+"}");
        var user_name="N/A";
        var rectangles_ltrb = [];
        var captions = [];
        var deleted_rectangles_ltrb = [];
        var deleted_captions = [];
        var active_box=-1;

        function relabel_boxes(){
            alert("Relabeling");
            var tmp_rectangles_ltrb = JSON.parse(JSON.stringify(rectangles_ltrb));
            var tmp_captions = JSON.parse(JSON.stringify(captions));
        }

        function set_colors(element,value){
            if(element === undefined && value === undefined){
                document.getElementById("w_prefix_color_empty").innerHTML="#FF0000";
                document.getElementById("w_prefix_color_full").innerHTML="#00FF00";
                document.getElementById("l_prefix_color_empty").innerHTML="#FF00FF";
                document.getElementById("l_prefix_color_full").innerHTML="#00FF00";
                document.getElementById("g_prefix_color_empty").innerHTML="#0000FF";
                document.getElementById("g_prefix_color_full").innerHTML="#0000FF";
                document.getElementById("other_prefix_color_empty").innerHTML="#0000FF";
                document.getElementById("other_prefix_color_full").innerHTML="#0000FF";
                document.getElementById("transcription_font_color").innerHTML="#888888";
                document.getElementById("transcription_font_type").innerHTML="Calibri";
                document.getElementById("transcription_font_size").innerHTML="18pt";
            }else if(element.constructor === String && value === undefined){
                var reply=window.prompt(element.split("_").join(" "),document.getElementById(element).innerHTML.trim());
                if(element=="transcription_font_type"){
                    if(reply.length>0){
                        document.getElementById(element).innerHTML=reply;
                    }else{
                        alert("Font must be a non-empty striong");
                    }
                }else if(element=="transcription_font_size"){
                    if(reply.match(/^[0-9a-f][0-9a-f]pt/i)){
                        document.getElementById(element).innerHTML=reply;
                    }else{
                        alert("Expecting font size of the format 18pt got "+reply);
                    }
                }else{
                    if(reply.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]/i)){
                        document.getElementById(element).innerHTML=reply;
                    }else{
                        alert("Expecting Color of the format #AA00FF got "+reply);
                    }
                }
            }else if(w_prefix_color_empty in element && w_prefix_color_full in element && l_prefix_color_empty in element ){ //TODO (anguelos) improve the check;
                document.getElementById("w_prefix_color_empty").innerHTML=element["w_prefix_color_empty"];
                document.getElementById("w_prefix_color_full").innerHTML=element["w_prefix_color_full"];
                document.getElementById("l_prefix_color_empty").innerHTML=element["l_prefix_color_empty"];
                document.getElementById("l_prefix_color_full").innerHTML=element["l_prefix_color_full"];
                document.getElementById("g_prefix_color_empty").innerHTML=element["g_prefix_color_empty"];
                document.getElementById("g_prefix_color_full").innerHTML=element["g_prefix_color_full"];
                document.getElementById("other_prefix_color_empty").innerHTML=element["other_prefix_color_empty"];
                document.getElementById("other_prefix_color_full").innerHTML=element["other_prefix_color_full"];
                document.getElementById("transcription_font_color").innerHTML=element["transcription_font_color"];
                document.getElementById("transcription_font_type").innerHTML=element["transcription_font_type"];
                document.getElementById("transcription_font_size").innerHTML=element["transcription_font_size"];
            }else {
                document.getElementById(element).innerHTML=value;
            }
        }
        function get_colors(){
            var element={};
            element["w_prefix_color_empty"]=document.getElementById("w_prefix_color_empty").innerHTML;
            element["w_prefix_color_full"]=document.getElementById("w_prefix_color_full").innerHTML;
            element["l_prefix_color_empty"]=document.getElementById("l_prefix_color_empty").innerHTML;
            element["l_prefix_color_full"]=document.getElementById("l_prefix_color_full").innerHTML;
            element["g_prefix_color_empty"]=document.getElementById("g_prefix_color_empty").innerHTML;
            element["g_prefix_color_full"]=document.getElementById("g_prefix_color_full").innerHTML;
            element["other_prefix_color_empty"]=document.getElementById("other_prefix_color_empty").innerHTML;
            element["other_prefix_color_full"]=document.getElementById("other_prefix_color_full").innerHTML;
            element["transcription_font_color"]=document.getElementById("transcription_font_color").innerHTML;
            element["transcription_font_type"]=document.getElementById("transcription_font_type").innerHTML;
            element["transcription_font_size"]=document.getElementById("transcription_font_size").innerHTML;
            return element;
        }

        function update_new_caption_prefix(prefix_str){
            var btn_textblock=document.getElementById("btn_textblock");
            var btn_textline=document.getElementById("btn_textline");
            var btn_word=document.getElementById("btn_word");
            var btn_graphic=document.getElementById("btn_graphic");
            var btn_custom=document.getElementById("btn_custom");
            btn_textblock.style.color = "";
            btn_textline.style.color = "";
            btn_word.style.color = "";
            btn_graphic.style.color = "";
            btn_custom.style.color = "";
            if(prefix_str==="B"){
                document.getElementById("new_caption_prefix").innerHTML=prefix_str;
                btn_textblock.style.color = "#AAAAAA";
            }else if(prefix_str==="L"){
                document.getElementById("new_caption_prefix").innerHTML=prefix_str;
                btn_textline.style.color = "#AAAAAA";
            }else if(prefix_str==="W"){
                document.getElementById("new_caption_prefix").innerHTML=prefix_str;
                btn_word.style.color = "#AAAAAA";
            }else if(prefix_str==="G"){
                document.getElementById("new_caption_prefix").innerHTML=prefix_str;
                btn_graphic.style.color = "#AAAAAA";
            }else if(prefix_str===""){
                var previous_value=document.getElementById("new_caption_prefix").innerHTML;
                alert("previous caption "+previous_value);
                document.getElementById("new_caption_prefix").innerHTML=window.prompt("Custom Prefix: ",previous_value);
                btn_custom.style.color = "#AAAAAA";
            }else{
                document.getElementById("new_caption_prefix").innerHTML=prefix_str;
                btn_custom.style.color = "#AAAAAA";
            }
        }

        function read_keys_actions(){
            var key_actions=new Map([]);
            var table = document.getElementById("keys_table");
            for (var i = 1, row; row = table.rows[i]; i++) {
                var key=table.rows[i].cells[0].innerHTML.trim();
                var val=parseInt(table.rows[i].cells[1].innerHTML);
                key_actions[key]=val;
            }
            return key_actions;
        }

        function update_keys_actions(m){
            var table = document.getElementById("keys_table");
            table.innerHTML = "";
            var hrow = table.insertRow();
            var th1=document.createElement("th");th1.innerHTML="Action";
            var th2=document.createElement("th");th2.innerHTML="ASCII Code";
            var th3=document.createElement("th");th3.innerHTML="String";
            hrow.appendChild(th1);hrow.appendChild(th2);hrow.appendChild(th3);
            for(var key in m){
                (function(){
                var row=table.insertRow();
                var cell_caption=row.insertCell();
                var cell_code=row.insertCell();
                var cell_string=row.insertCell();
                var cell_button=row.insertCell();
                cell_caption.innerHTML=key;
                cell_code.innerHTML=m[key]+"";
                cell_string.innerHTML=String.fromCharCode(m[key]);
                var btn = document.createElement("BUTTON");
                btn.appendChild(document.createTextNode(key));
                cell_button.appendChild(btn);
                btn.onclick=function(){
                    var new_val=window.prompt("New Code for :"+cell_caption.innerHTML,cell_code.innerHTML);
                    if(!isNaN(new_val) || new_val<13 || new_val>127){
                        m[key]=new_val;
                        cell_code.innerHTML=parseInt(new_val);
                        cell_string.innerHTML=String.fromCharCode(m[key]);
                    }else{
                        alert("Code must be a valid ascii code");
                    }
                };
                })();
            }
        }

        function save_preferences(){
            var d = new Date();
            var exdays=1000;
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            user_name=document.getElementById("user_name").innerHTML
            var data_base64 = btoa(JSON.stringify([read_keys_actions(),user_name,document.getElementById("new_caption_prefix").innerHTML],get_colors()));
            document.cookie = "data_base64="+data_base64+";" + expires + ";path=/";
        }

        function toggle_settings(){
            var settings_div=document.getElementById("settingsdiv");
            var canvases_div=document.getElementById("canvases_div");
            if(settings_div.style.display === "none"){
                settings_div.style.display = "block";
                canvases_div.style.display = "none";
            }else{
                settings_div.style.display = "none";
                canvases_div.style.display = "block";
                key_actions=read_keys_actions();
            }
        }

        function load_preferences(){
            if(document.cookie.indexOf('data_base64=')){
                alert("No Key in Cookie:"+ca);
                user_name="N/A";
                document.getElementById("user_name").innerHTML=user_name;
                update_keys_actions(read_keys_actions());
                update_new_caption_prefix(document.getElementById("new_caption_prefix").innerHTML);
            }else{
                //update_keys_actions(read_keys_actions());
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');

                for(var i = 0; i <ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf("data_base64=") == 0) {
                        keys_user_type_colors=JSON.parse(atob(c.substring("object_type=".length, c.length)));

                        update_keys_actions(keys_user_type_colors[0]);

                        user_name=keys_user_type_colors[1];
                        document.getElementById("user_name").innerHTML=user_name;

                        update_new_caption_prefix(keys_user_type_colors[2]);

                        set_colors(keys_user_type_colors[3]);
                    }
                }
            }
        }

        $(document).ready(function(){
            $.when($.ajax("/{{id}}.json")).then(function(data,textStatus,jqXHR){
                console.log(data);
                rectangles_ltrb=data[0];
                rectangles_ltrb=data.rectangles_ltrb;
                captions=data[1];
                captions=data.captions;
                console.log(captions);
                draw_boxes();
            });

            var new_caption_prefix=document.getElementById("new_caption_prefix").innerHTML;
            //var img_id="{{id}}";
            var img_id=page_id;
            var layer_image=$('#layer_image')[0];
            var layer_boxes=$('#layer_boxes')[0];
            var layer_active=$('#layer_active')[0];
            var layer_interactive=$('#layer_active')[0];
            var ctx_image;
            var ctx_boxes;
            var ctx_active;
            var ctx_interactive;
            var img = new Image();

            var begin_x=-1;
            var begin_y=-1;

            function draw_image() {
                ctx_image.clearRect(0, 0, img.width, img.height);
                ctx_image.drawImage(img, 0, 0,img.width,img.height);
            }

            function select_by_coordinates(xy){
                active_box=-1;
                for(var n = 0; n<rectangles_ltrb.length;n++){
                    var ltrb=rectangles_ltrb[n];
                    if(ltrb[0]<xy[0] && ltrb[2]>xy[0] && ltrb[1]<xy[1] && ltrb[3]>xy[1] ){
                        active_box=n;
                    }else{
                        var a=1;
                    }
                }
            }

            function upload_rectangles_captions(){
                var xhr = new XMLHttpRequest();
                var url = "/{{id}}.json";
                xhr.open("PUT", url, true);
                xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
                //xhr.onreadystatechange = function () {}; # Was here from POST example
                var data = JSON.stringify({"rectangles_ltrb":rectangles_ltrb,"captions":captions,"user":document.getElementById('user_name').innerHTML});
                xhr.send(data);
            }

            function draw_boxes() {
                if (rectangles_ltrb.length>0){
                    //"w_prefix_color_empty","w_prefix_color_full","l_prefix_color_empty","l_prefix_color_full","g_prefix_color_empty","g_prefix_color_full","other_prefix_color_empty","other_prefix_color_full",transcription_font_color

                    var other_prefix_color_full=document.getElementById("other_prefix_color_full").innerHTML.trim();
                    var other_prefix_color_empty=document.getElementById("other_prefix_color_empty").innerHTML.trim();

                    var w_prefix_color_empty=document.getElementById("w_prefix_color_empty").innerHTML.trim();
                    var w_prefix_color_full=document.getElementById("w_prefix_color_full").innerHTML.trim();

                    var l_prefix_color_empty=document.getElementById("l_prefix_color_empty").innerHTML.trim();
                    var l_prefix_color_full=document.getElementById("l_prefix_color_full").innerHTML.trim();

                    var g_prefix_color_empty=document.getElementById("g_prefix_color_empty").innerHTML.trim();
                    var g_prefix_color_full=document.getElementById("g_prefix_color_full").innerHTML.trim();

                    var transcription_font_color=document.getElementById("transcription_font_color").innerHTML.trim();

                    var color_mapping={};
                    color_mapping[other_prefix_color_full]=[];
                    color_mapping[other_prefix_color_empty]=[];

                    color_mapping[w_prefix_color_empty]=[];
                    color_mapping[w_prefix_color_full]=[];

                    color_mapping[l_prefix_color_empty]=[];
                    color_mapping[l_prefix_color_full]=[];

                    color_mapping[g_prefix_color_empty]=[];
                    color_mapping[g_prefix_color_full]=[];

                    for(var k=0;k<captions.length;k++){
                        var [prefix, postfix]=captions[k].split("@").slice(0, 2);
                        if(prefix=="W"){
                            if(postfix==""){
                                color_mapping[w_prefix_color_empty].push(k);
                            }else{
                                color_mapping[w_prefix_color_full].push(k);
                            }
                        } else if(prefix=="G"){
                            if(postfix==""){
                                color_mapping[g_prefix_color_empty].push(k);
                            }else{
                                color_mapping[g_prefix_color_full].push(k);
                            }
                        } else if(prefix=="L"){
                            if(postfix==""){
                                color_mapping[l_prefix_color_empty].push(k);
                            }else{
                                color_mapping[l_prefix_color_full].push(k);
                            }
                        } else {
                            if(postfix==""){
                                color_mapping[other_prefix_color_empty].push(k);
                            }else{
                                color_mapping[other_prefix_color_full].push(k);
                            }
                        }
                    }

                    ctx_boxes.clearRect(0, 0, img.width, img.height);
                    ctx_boxes.globalAlpha = 0.2;

                    for(var color in color_mapping){
                       ctx_boxes.fillStyle = color;
                       var rect_ids=color_mapping[color];
                       for(var n=0;n<rect_ids.length;n++){
                            var ltrb=rectangles_ltrb[rect_ids[n]];
                            ctx_boxes.fillRect(ltrb[0], ltrb[1], ltrb[2]-ltrb[0], ltrb[3]-ltrb[1]);
                       }
                    }

                    ctx_boxes.globalAlpha = 1.0;
                    ctx_boxes.lineWidth="2";
                    for(var n=0;n<rectangles_ltrb.length;n++){
                        ctx_boxes.rect(rectangles_ltrb[n][0], rectangles_ltrb[n][1], rectangles_ltrb[n][2]-rectangles_ltrb[n][0], rectangles_ltrb[n][3]-rectangles_ltrb[n][1]);
                    }
                    ctx_boxes.font = '18pt Calibri';
                    ctx_boxes.fillStyle = transcription_font_color;
                    for(var n=0;n<rectangles_ltrb.length;n++){
                        var caption_list=captions[n].split("@");
                        caption_list.splice(0,1)
                        ctx_boxes.fillText(caption_list.join("@"), rectangles_ltrb[n][0], rectangles_ltrb[n][1]);
                    }
                }else{
                    ctx_boxes.clearRect(0, 0, img.width, img.height);
                }
            }

            function draw_active() {
                ctx_active.clearRect(0, 0, img.width, img.height);
                if(active_box>=0){
                    var ltrb=rectangles_ltrb[active_box];
                    ctx_active.beginPath();
                    ctx_active.lineWidth="4";
                    ctx_active.strokeStyle="green";
                    ctx_active.rect(ltrb[0], ltrb[1], ltrb[2]-ltrb[0], ltrb[3]-ltrb[1]);
                    ctx_active.stroke();
                    var loc_w=(document.documentElement.clientWidth+ltrb[2]+ltrb[0])/2;
                    var loc_h=(document.documentElement.clientHeight+ltrb[3]+ltrb[1])/2;
                    selected_image_canvas,div_selected_id,div_selected_caption
                    var canvas=document.getElementById("selected_image_canvas");

                    document.getElementById("div_selected_id").innerHTML=""+active_box;
                    document.getElementById("div_selected_caption").innerHTML=captions[active_box].split("@")[1];
                    document.getElementById("div_selected_prefix").innerHTML=captions[active_box].split("@")[0];
                }
            }

            function scroll_to_active() {
                var ltrb=rectangles_ltrb[active_box];
                var move_to_x=((ltrb[2]+ltrb[0])-window.innerWidth)/2;
                var move_to_y=((ltrb[3]+ltrb[1])-window.innerHeight)/2;
                window.scrollTo(move_to_x,move_to_y);
            }

            img.onload = function () {
                load_preferences();
                layer_image=$('#layer_image')[0]
                layer_boxes=$('#layer_boxes')[0]
                layer_active=$('#layer_active')[0]
                layer_interactive=$('#layer_interactive')[0]

                layer_image.width=img.width
                layer_image.height=img.height

                layer_boxes.width=img.width
                layer_boxes.height=img.height

                layer_active.width=img.width
                layer_active.height=img.height

                layer_interactive.width=img.width
                layer_interactive.height=img.height

                ctx_image=layer_image.getContext("2d");
                ctx_boxes=layer_boxes.getContext("2d");
                ctx_active=layer_active.getContext("2d");
                ctx_interactive=layer_interactive.getContext("2d");

                ctx_boxes.fillStyle = "#0000FF";
                ctx_interactive.fillStyle = "#FF00FF";
                ctx_interactive.globalAlpha = .2;

                draw_image();
                draw_boxes();

                function writeMessage(canvas, message) {
                    var context = canvas.getContext('2d');
                    ctx_interactive.clearRect(0, 0, canvas.width, canvas.height);
                    ctx_interactive.font = '18pt Calibri';
                    ctx_interactive.fillStyle = 'black';
                    ctx_interactive.fillText(message, 0, 25);
                }

                function getMousePos(canvas, evt) {
                    var rect = canvas.getBoundingClientRect();
                    return {
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top
                    };
                }

                layer_interactive.addEventListener('mousedown', function(evt) {
                    var mousePos = getMousePos(layer_interactive, evt);
                    begin_x=mousePos.x;
                    begin_y=mousePos.y;

                }, false);

                layer_interactive.addEventListener('mouseup', function(evt) {
                    var mousePos = getMousePos(layer_interactive, evt);
                    var l=Math.round(Math.min(mousePos.x,begin_x));
                    var t=Math.round(Math.min(mousePos.y,begin_y));
                    var r=Math.round(Math.max(mousePos.x,begin_x));
                    var b=Math.round(Math.max(mousePos.y,begin_y));
                    if((r-l)*(b-t)>25){
                        active_box=rectangles_ltrb.push([l,t,r,b])-1;
                        var new_caption_prefix=document.getElementById("new_caption_prefix").innerHTML;
                        captions.push(new_caption_prefix+"@");
                        draw_boxes();
                        draw_active();
                        upload_rectangles_captions();
                        console.warn("CP: "+new_caption_prefix+"");
                    }else{
                        select_by_coordinates([(l+r)/2,(t+b)/2]);
                        draw_active();
                    }
                    begin_x=-1
                    begin_y=-1
                    ctx_interactive.clearRect(0,0,img.width,img.height);
                }, false);

                layer_interactive.addEventListener('mousemove', function(evt) {
                    var mousePos = getMousePos(layer_interactive, evt);
                    if (begin_x>0 && begin_y>0){
                        ctx_interactive.clearRect(0,0,img.width,img.height);
                        ctx_interactive.fillRect(begin_x,begin_y,mousePos.x-begin_x,mousePos.y-begin_y);
                    }
                }, false);

                document.addEventListener("keypress", function(evt) {
                    var key_actions=read_keys_actions();
                    switch(parseInt(evt.keyCode)){
                        case key_actions["Edit Selected"]: //enter -> edit caption
                            if(active_box>=0){
                                var broken_caption=captions[active_box].split("@");
                                var current_caption_prefix=broken_caption[0];
                                broken_caption.splice(0,1);
                                var current_caption=broken_caption.join("@");
                                captions[active_box]=current_caption_prefix+"@"+window.prompt("Caption",current_caption);
                                upload_rectangles_captions();
                                draw_boxes();
                            }else{
                                alert("No object selected");
                            }
                            break;
                        case key_actions["Edit Next"]: //e -> edit next caption
                            if(active_box>=0){
                                draw_boxes();
                                active_box+=1;
                                active_box=active_box%rectangles_ltrb.length;
                                var broken_caption=captions[active_box].split("@");
                                var current_caption_prefix=broken_caption[0];
                                broken_caption.splice(0,1);
                                var current_caption=broken_caption.join("@");
                                captions[active_box]=current_caption_prefix+"@"+window.prompt("Caption",current_caption);
                                upload_rectangles_captions();
                                draw_boxes();
                            }else{
                                alert("No object selected");
                            }
                            break;
                        case  key_actions["Select Next"]: //n -> next
                            active_box+=1;
                            active_box=active_box%rectangles_ltrb.length;
                            draw_active();
                            var ltrb=rectangles_ltrb[active_box];
                            scroll_to_active();
                            break;
                        case  key_actions["Select Previous"]: //p -> previous
                            active_box+=(rectangles_ltrb.length-1);
                            active_box=active_box%rectangles_ltrb.length;
                            draw_active();
                            scroll_to_active();
                            break;
                        case  key_actions["Set Caption Type"]: // c -> edit caption prefix
                            var new_caption_prefix=document.getElementByID("new_caption_prefix").innerHTML;
                            new_caption_prefix=window.prompt("Object Type",caption_prefix);
                            if(new_caption_prefix == "W" || new_caption_prefix == "G" || new_caption_prefix == "L" || new_caption_prefix == "B"|| new_caption_prefix == ""){
                                update_new_caption_prefix(new_caption_prefix);
                            }else{
                                update_new_caption_prefix(new_caption_prefix);
                            }
                            break;
                        case  key_actions["Delete Selected"]: //d -> delete
                            //draw_boxes();
                            if(active_box>=0){
                                deleted_rectangles_ltrb.push(rectangles_ltrb[active_box]);
                                deleted_captions.push(captions[active_box]);
                                rectangles_ltrb.splice(active_box,1);
                                captions.splice(active_box,1);
                                active_box=active_box%rectangles_ltrb.length;
                                draw_boxes();
                                draw_active();
                                scroll_to_active();
                            }
                            break;
                        case  key_actions["Undelete Selected"]: //z -> undo
                            //draw_boxes();
                            if(deleted_captions.length>0){
                                rectangles_ltrb.push(deleted_rectangles_ltrb.pop());
                                captions.push(deleted_captions.pop());
                                active_box=rectangles_ltrb.length-1;
                                draw_boxes();
                                draw_active();
                                scroll_to_active();
                            }
                            break;
                        case key_actions["Settings"]: //h -> help
                            relabel_boxes();
                            toggle_settings();
                            break;
                        default:
                            alert("Unknown code:"+evt.keyCode);
                    }
                }, false);
            }
            img.src = "/"+page_id+".jpg";
            alert("img.src"+img.src);
            $(window).on('load', function() {
                draw_boxes();
                $("#cover").hide();
                toggle_settings();
            });
        });
}