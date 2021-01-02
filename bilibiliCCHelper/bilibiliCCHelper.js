// ==UserScript==
// @name         Bilibili CC字幕工具
// @namespace    indefined
// @version      0.5.20
// @description  可以在B站加载外挂本地字幕、下载B站的CC字幕，旧版B站播放器可启用CC字幕
// @author       indefined
// @supportURL   https://github.com/indefined/UserScripts/issues
// @include      http*://www.bilibili.com/video/*
// @include      http*://www.bilibili.com/bangumi/play/ss*
// @include      http*://www.bilibili.com/bangumi/play/ep*
// @include      http*://www.bilibili.com/watchlater/
// @include      http*://www.bilibili.com/medialist/play/ml*
// @include      http*://www.bilibili.com/blackboard/html5player.html*
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const elements = {
        subtitleStyle:`
<style type="text/css">
/*对齐，悬停按钮显示菜单*/
#subtitle-setting-panel>div>* {margin-right: 5px;}
#bilibili-player-subtitle-btn:hover>#subtitle-setting-panel {display: block!important;}
/*滑动选择样式*/
#subtitle-setting-panel input[type="range"] {
  background-color: #ebeff4;
  -webkit-appearance: none;
  height:4px;
  transform: translateY(-4px);
}
#subtitle-setting-panel input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  background: #fff;
  border-radius: 15px;
  border: 1px solid;
}
/*复选框和其对应标签样式*/
#subtitle-setting-panel input[type="checkbox"]{display:none;}
#subtitle-setting-panel input ~ label {cursor:pointer;}
#subtitle-setting-panel input:checked ~ label:before {content: '\\2714';}
#subtitle-setting-panel input ~ label:before{
  width: 12px;
  height:12px;
  line-height: 14px;
  vertical-align: text-bottom;
  border-radius: 3px;
  border:1px solid #d3d3d3;
  display: inline-block;
  text-align: center;
  content: ' ';
}
/*悬停显示下拉框样式*/
#subtitle-setting-panel .bpui-selectmenu:hover .bpui-selectmenu-list{display:block;}
/*滚动条样式*/
#subtitle-setting-panel ::-webkit-scrollbar{width: 7px;}
#subtitle-setting-panel ::-webkit-scrollbar-track{border-radius: 4px;background-color: #EEE;}
#subtitle-setting-panel ::-webkit-scrollbar-thumb{border-radius: 4px;background-color: #999;}
</style>`,
        oldEnableIcon:`
<svg width="22" height="28" viewbox="0 0 22 30" xmlns="http://www.w3.org/2000/svg">
  <path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m4.07787,6.88102l14,0a2,2 0 0 1 2,2l0,10a2,2 0 0 \
1 -2,2l-14,0a2,2 0 0 1 -2,-2l0,-10a2,2 0 0 1 2,-2zm5,5.5a1,1 0 1 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 \
2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0zm8,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -2,2l0\
,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0z"/></svg>`,
        oldDisableIcon:`
<svg width="22" height="28" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg">
  <path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m15.172,21.87103l-11.172,0a2,2 0 0 1 -2,-2l0,-10c0,\
-0.34 0.084,-0.658 0.233,-0.938l-0.425,-0.426a1,1 0 1 1 1.414,-1.414l15.556,15.556a1,1 0 0 1 -1.414,1.414l-2.192,\
-2.192zm-10.21,-10.21c-0.577,0.351 -0.962,0.986 -0.962,1.71l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,\
-1l0,-1a1,1 0 0 1 0.713,-0.958l-1.751,-1.752zm1.866,-3.79l11.172,0a2,2 0 0 1 2,2l0,10c0,0.34 -0.084,0.658 -0.233,\
0.938l-2.48,-2.48a1,1 0 0 0 -0.287,-1.958l-1.672,0l-1.328,-1.328l0,-0.672a1,1 0 0 1 1,-1l2,0a1,1 0 0 0 0,-2l-3,\
0a2,2 0 0 0 -1.977,1.695l-5.195,-5.195z"/></svg>`,
        newDisableIcon:`
<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">\
<path d="M15.172 18H4a2 2 0 0 1-2-2V6c0-.34.084-.658.233-.938l-.425-.426a1 1 0 1 1 1.414-1.414l15.556 15.556a1 \
1 0 0 1-1.414 1.414L15.172 18zM4.962 7.79C4.385 8.141 4 8.776 4 9.5v3a2 2 0 0 0 2 2h3a1 1 0 0 0 0-2H7a1 1 0 0 1\
-1-1v-1a1 1 0 0 1 .713-.958L4.962 7.79zM6.828 4H18a2 2 0 0 1 2 2v10c0 .34-.084.658-.233.938l-2.48-2.48A1 1 0 0 \
0 17 12.5h-1.672L14 11.172V10.5a1 1 0 0 1 1-1h2a1 1 0 0 0 0-2h-3a2 2 0 0 0-1.977 1.695L6.828 4z" fill="#fff" \
fill-rule="evenodd"></path></svg>`,
        newEnableIcon:`
<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">\
<path d="M4 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm5 5.5a1 1 0 1 0 0-2H6a2 \
2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a1 1 0 0 0 0-2H7a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h2zm8 0a1 1 0 0 0 0-2h-3a2 \
2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a1 1 0 0 0 0-2h-2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h2z" fill="#fff" \
fill-rule="evenodd"></path></svg>`,
        createAs(nodeType,config,appendTo){
            const element = document.createElement(nodeType);
            config&&this.setAs(element,config);
            appendTo&&appendTo.appendChild(element);
            return element;
        },
        setAs(element,config,appendTo){
            config&&Object.entries(config).forEach(([key, value])=>{
                element[key] = value;
            });
            appendTo&&appendTo.appendChild(element);
            return element;
        },
        getAs(selector,config,appendTo){
            if(selector instanceof Array) {
                return selector.map(item=>this.getAs(item));
            }
            const element = document.body.querySelector(selector);
            element&&config&&this.setAs(element,config);
            element&&appendTo&&appendTo.appendChild(element);
            return element;
        },
        createSelector(config,appendTo){
            const selector = this.createAs('div',{
                className:"bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute",
                style:"width:"+config.width
            },appendTo),
                  selected = config.datas.find(item=>item.value==config.initValue),
                  label = this.createAs('div',{
                      className:'bpui-selectmenu-txt',
                      innerHTML: selected?selected.content:config.initValue
                  },selector),
                  arraw = this.createAs('div',{
                      className:'bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down'
                  },selector),
                  list = this.createAs('ul',{
                      className:'bpui-selectmenu-list bpui-selectmenu-list-left',
                      style:`max-height:${config.height||'100px'};overflow:hidden auto;white-space:nowrap;`,
                      onclick:e=>{
                          label.dataset.value = e.target.dataset.value;
                          label.innerHTML = e.target.innerHTML;
                          config.handler(e.target.dataset.value);
                      }
                  },selector);
            config.datas.forEach(item=>{
                this.createAs('li',{
                    className:'bpui-selectmenu-list-row',
                    innerHTML:item.content
                },list).dataset.value = item.value;
            });
            return selector;
        },
        createRadio(config,appendTo){
            this.createAs('input',{
                ...config,type: "radio",style:"cursor:pointer;5px;vertical-align: middle;"
            },appendTo);
            this.createAs('label',{
                style:"margin-right: 5px;cursor:pointer;vertical-align: middle;",
                innerText:config.value
            },appendTo).setAttribute('for',config.id);
        }
    };

    //编码器，用于将B站BCC字幕编码为常见字幕格式下载
    const encoder = {
        //内嵌ASS格式头
        assHead : [
            '[Script Info]',
            `Title: ${document.title}`,
            'ScriptType: v4.00+',
            'Collisions: Reverse',
            'PlayResX: 1280',
            'PlayResY: 720',
            'WrapStyle: 3',
            'ScaledBorderAndShadow: yes',
            '; ----------------------',
            '; 本字幕由CC字幕助手自动转换',
            `; 字幕来源${document.location}`,
            '; 脚本地址https://greasyfork.org/scripts/378513',
            '; 设置了字幕过长自动换行，但若字幕中没有空格换行将无效',
            '; 字体大小依据720p 48号字体等比缩放',
            '; 如显示不正常请尝试使用SRT格式',
            '','[V4+ Styles]',
            'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, '
            +'BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, '
            +'BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
            'Style: Default,Segoe UI,48,&H00FFFFFF,&HF0000000,&H00000000,&HF0000000,1,0,0,0,100,100,0,0.00,1,1,3,2,30,30,20,1',
            '','[Events]',
            'Format: Layer, Start, End, Style, Actor, MarginL, MarginR, MarginV, Effect, Text'
        ],
        showDialog(data){
            if(!data||!(data.body instanceof Array)){
                throw '数据错误';
            }
            const settingDiv = elements.createAs('div',{
                style :'position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0,0,0,0.4);z-index: 1048576;'
            },document.body),
                  panel = elements.createAs('div',{
                      style:'left: 50%;top: 50%;position: absolute;padding: 15px;background:white;'
                      + 'border-radius: 8px;margin: auto;transform: translate(-50%,-50%);',
                      innerHTML: '<h2 style="font-size: 20px;color: #4fc1e9;font-weight: 400;margin-bottom: 10px;">字幕下载</h2>'
                      + '<a href="https://greasyfork.org/scripts/378513" target="_blank" style="position:absolute;right:20px;top:30px">'
                      + `当前版本：${typeof(GM_info)!="undefined"&&GM_info.script.version||'unknow'}</a>`
                  },settingDiv),
                  textArea = this.textArea = elements.createAs('textarea',{
                      style: 'width: 400px;min-width: 300px;height: 400px;resize: both;padding: 5px;line-height: normal;border: 1px solid #e5e9ef;margin: 0px;'
                  },panel),
                  bottomPanel = elements.createAs('div',{},panel);
            textArea.setAttribute('readonly',true);
            elements.createRadio({
                id:'subtitle-download-ass',name: "subtitle-type",value:"ASS",
                onchange: ()=>this.encodeToASS(data.body)
            },bottomPanel);
            elements.createRadio({
                id:'subtitle-download-srt',name: "subtitle-type",value:"SRT",checked:'checked',
                onchange: ()=>this.encodeToSRT(data.body)
            },bottomPanel);
            elements.createRadio({
                id:'subtitle-download-lrc',name: "subtitle-type",value:"LRC",
                onchange: ()=>this.encodeToLRC(data.body)
            },bottomPanel);
            elements.createRadio({
                id:'subtitle-download-txt',name: "subtitle-type",value:"TXT",
                onchange: ()=>this.updateDownload(data.body.map(item=>item.content).join('\r\n'),'txt')
            },bottomPanel);
            elements.createRadio({
                id:'subtitle-download-bcc',name: "subtitle-type",value:"BCC",
                onchange: ()=>this.updateDownload(JSON.stringify(data,undefined,2),'bcc')
            },bottomPanel);
            //下载
            this.actionButton = elements.createAs('a',{
                className: 'bpui-button bpui-state-disabled bui bui-button bui-button-disabled bui-button-blue',
                innerText: "下载",style: 'height: 24px;margin-right: 5px;'
            },bottomPanel);
            //关闭
            elements.createAs('button',{
                innerText: "关闭",className: "bpui-button bui bui-button bui-button-blue",style:'border:none',
                onclick: ()=>document.body.removeChild(settingDiv)
            },bottomPanel);
            //默认转换SRT格式
            this.encodeToSRT(data.body);
        },
        updateDownload(result,type){
            this.textArea.value = result;
            URL.revokeObjectURL(this.actionButton.href);
            this.actionButton.classList.remove('bpui-state-disabled','bui-button-disabled');
            this.actionButton.href = URL.createObjectURL(new Blob([result],{type:'text/'+type}));
            this.actionButton.download = `${document.title}.${type}`;
        },
        encodeToLRC(data){
            this.updateDownload(data.map(({from,to,content})=>{
                return `${this.encodeTime(from,'LRC')} ${content.replace(/\n/g,' ')}`;
            }).join('\r\n'),'lrc');
        },
        encodeToSRT(data){
            this.updateDownload(data.map(({from,to,content},index)=>{
                return `${index+1}\r\n${this.encodeTime(from)} --> ${this.encodeTime(to)}\r\n${content}`;
            }).join('\r\n\r\n'),'srt');
        },
        encodeToASS(data){
            this.assHead[1] = `Title: ${document.title}`;
            this.assHead[10] = `; 字幕来源${document.location}`;
            this.updateDownload(this.assHead.concat(data.map(({from,to,content})=>{
                return `Dialogue: 0,${this.encodeTime(from,'ASS')},${this.encodeTime(to,'ASS')},*Default,NTP,0000,0000,0000,,${content.replace(/\n/g,'\\N')}`;
            })).join('\r\n'),'ass');
        },
        encodeTime(input,format='SRT'){
            let time = new Date(input*1000),
                ms = time.getMilliseconds(),
                second = time.getSeconds(),
                minute = time.getMinutes(),
                hour = Math.floor(input/60/60);
            if (format=='SRT'){
                if (hour<10) hour = '0'+hour;
                if (minute<10) minute = '0'+minute;
                if (second<10) second = '0'+second;
                if (ms<10) ms = '00'+ms;
                else if (ms<100) ms = '0'+ms;
                return `${hour}:${minute}:${second},${ms}`;
            }
            else if(format=='ASS'){
                ms = (ms/10).toFixed(0);
                if (minute<10) minute = '0'+minute;
                if (second<10) second = '0'+second;
                if (ms<10) ms = '0'+ms;
                return `${hour}:${minute}:${second}.${ms}`;
            }
            else{
                ms = (ms/10).toFixed(0);
                minute += hour*60;
                if (minute<10) minute = '0'+minute;
                if (second<10) second = '0'+second;
                if (ms<10) ms = '0'+ms;
                return `[${minute}:${second}.${ms}]`;
            }
        }
    };

    //解码器，用于读取常见格式字幕并将其转换为B站可以读取BCC格式字幕
    const decoder = {
        srtReg:/(?:(\d+):)?(\d{1,2}):(\d{1,2})[,\.](\d{1,3})\s*(?:-->|,)\s*(?:(\d+):)?(\d{1,2}):(\d{1,2})[,\.](\d{1,3})\r?\n([.\s\S]+)/,
        assReg:/Dialogue:.*,(\d+):(\d{1,2}):(\d{1,2}\.?\d*),\s*?(\d+):(\d{1,2}):(\d{1,2}\.?\d*)(?:.*?,){7}(.+)/,
        encodings:['UTF-8','GB18030','BIG5','UNICODE','JIS','EUC-KR'],
        encoding:'UTF-8',
        dialog:undefined,
        reader:undefined,
        file:undefined,
        data:undefined,
        statusHandler:undefined,
        show(handler){
            this.statusHandler = handler;
            if(!this.dialog){
                this.moveAction = ev=>this.dialogMove(ev);
                this.dialog = elements.createAs('div',{
                    id :'subtitle-local-selector',
                    style :'position:fixed;z-index:1048576;padding:10px;top:50%;left:calc(50% - 185px);'
                    +'box-shadow: 0 0 4px #e5e9ef;border: 1px solid #e5e9ef;background:white;border-radius:5px;color:#99a2aa',
                    innerHTML:'<style type="text/css">'
                    +'.bpui-selectmenu-arrow:hover + ul.bpui-selectmenu-list.bpui-selectmenu-list-left,'
                    +'ul.bpui-selectmenu-list.bpui-selectmenu-list-left:hover {display: block;}</style>'
                },elements.getAs('#bilibiliPlayer'));
                //标题栏，可拖动对话框
                elements.createAs('div',{
                    style:"margin-bottom: 5px;cursor:move;user-select:none;line-height:1;",
                    innerText:'本地字幕选择',
                    onmousedown:this.moveAction
                },this.dialog);
                //选择字幕，保存文件对象并调用处理文件
                elements.createAs('input',{
                    style: "margin-bottom: 5px;width: 370px;",
                    innerText: '选择字幕',
                    type: 'file',accept:'.lrc,.ass,.ssa,.srt,.bcc,.sbv,.vtt',
                    oninput:  ({target})=> this.readFile(this.file = target.files&&target.files[0])
                },this.dialog);
                elements.createAs('br',{},this.dialog);
                //文件编码选择，保存编码并调用处理文件
                elements.createAs('label',{style: "margin-right: 10px;",innerText: '字幕编码'},this.dialog);
                elements.createAs('select',{
                    style: "width: 80px;height: 20px;border-radius: 4px;line-height: 20px;border:1px solid #ccd0d7;",
                    title:'如果字幕乱码可尝试更改编码',
                    innerHTML:this.encodings.reduce((result,item)=>`${result}<option value="${item}">${item}</option>`,''),
                    oninput:  ({target})=> this.readFile(this.encoding = target.value)
                },this.dialog);
                //字幕偏移，保存DOM对象以便修改显示偏移，更改时调用字幕处理显示
                elements.createAs('label',{
                    style: "margin-left: 10px;",innerText: '时间偏移(s)',title:'字幕相对于视频的时间偏移，双击此标签复位时间偏移',
                    ondblclick:()=> +this.offset.value&&this.handleSubtitle(this.offset.value=0)
                },this.dialog);
                this.offset = elements.createAs('input',{
                    style: "margin-left: 10px;width: 50px;border: 1px solid #ccd0d7;border-radius: 4px;line-height: 20px;",
                    type:'number', step:0.5, value:0,
                    title:'负值表示将字幕延后，正值将字幕提前',
                    oninput:  ()=> this.handleSubtitle()
                },this.dialog);
                //关闭按钮
                elements.createAs('button',{
                    style: "margin-left: 10px;border:none;width:max-content;",innerText: '关闭面板',
                    className:'bpui-button bui bui-button bui-button-blue',
                    onclick:  ()=> elements.getAs('#bilibiliPlayer').removeChild(this.dialog)
                },this.dialog);
                //文件读取器，载入文件
                this.reader = new FileReader();
                this.reader.onloadend = ()=> this.decodeFile()
                this.reader.onerror = e=> bilibiliCCHelper.toast('载入字幕失败',e);
            }
            else{
                elements.getAs('#bilibiliPlayer').appendChild(this.dialog);
                this.handleSubtitle();
            }
        },
        dialogMove(ev){
            if (ev.type=='mousedown'){
                this.offsetT = ev.pageY-this.dialog.offsetTop;
                this.offsetL = ev.pageX-this.dialog.offsetLeft;
                document.body.addEventListener('mouseup',this.moveAction);
                document.body.addEventListener('mousemove',this.moveAction);
            }
            else if (ev.type=='mouseup'){
                document.body.removeEventListener('mouseup',this.moveAction);
                document.body.removeEventListener('mousemove',this.moveAction);
            }
            else{
                this.dialog.style.top = ev.pageY - this.offsetT + 'px';
                this.dialog.style.left = ev.pageX - this.offsetL +'px';
            }
        },
        readFile(){
            if(!this.file) {
                this.data = undefined;
                return bilibiliCCHelper.toast('没有文件');
            }
            this.reader.readAsText(this.file,this.encoding)
        },
        handleSubtitle(){
            if(!this.data) return;
            const offset = +this.offset.value;
            bilibiliCCHelper.updateSubtitle(!offset?this.data:{
                body:this.data.body.map(({from,to,content})=>({
                    from:from - offset,
                    to:to - offset,
                    content
                }))
            }).then(()=>{
                if('function'==typeof(this.statusHandler)) this.statusHandler(true);
                bilibiliCCHelper.toast(`载入本地字幕:${this.file.name},共${this.data.body.length}行,偏移:${offset}s`);
            }).catch(e=>{
                bilibiliCCHelper.toast('载入字幕失败',e);
            });
        },
        decodeFile(){
            try{
                const type = this.file.name.split('.').pop().toLowerCase();
                switch(type){
                    case 'lrc':this.data = this.decodeFromLRC(this.reader.result);break;
                    case 'ass':case 'ssa': this.data = this.decodeFromASS(this.reader.result);break;
                    case 'srt':case 'sbv':case 'vtt': this.data = this.decodeFromSRT(this.reader.result);break;
                    case 'bcc':this.data = JSON.parse(this.reader.result);break;
                    default:throw('未知文件类型'+type);break;
                }
                console.log(this.data);
                this.handleSubtitle();
            }
            catch(e){
                bilibiliCCHelper.toast('解码字幕文件失败',e);
            };
        },
        decodeFromLRC(input){
            if(!input) return;
            const data = [];
            input.split('\n').forEach(line=>{
                let match = line.match(/((\[\d+:\d+\.?\d*\])+)(.*)/);
                if (!match) {
                    if(match=line.match(/\[offset:(\d+)\]/i)) {
                        this.offset.value = +match[1]/1000;
                    }
                    //console.log('跳过非正文行',line);
                    return;
                }
                const times = match[1].match(/\d+:\d+\.?\d*/g);
                times.forEach(time=>{
                    const t = time.split(':');
                    data.push({
                        time:t[0]*60 + (+t[1]),
                        content:match[3].trim().replace('\r','')
                    });
                });
            });
            return {
                body:data.sort((a,b)=>a.time-b.time).map((item,index)=>(
                    item.content!=''&&{
                        from:item.time,
                        to:index==data.length-1?item.time+20:data[index+1].time,
                        content:item.content
                    }
                )).filter(item=>item)
            };
        },
        decodeFromSRT(input){
            if(!input) return;
            const data = [];
            let split = input.split('\n\n');
            if(split.length==1) split = input.split('\r\n\r\n');
            split.forEach(item=>{
                const match = item.match(this.srtReg);
                if (!match){
                    //console.log('跳过非正文行',item);
                    return;
                }
                data.push({
                    from:match[1]*60*60||0 + match[2]*60 + (+match[3]) + (match[4]/1000),
                    to:match[5]*60*60||0 + match[6]*60 + (+match[7]) + (match[8]/1000),
                    content:match[9].trim().replace(/{\\.+?}/g,'').replace(/\\N/gi,'\n').replace(/\\h/g,' ')
                });
            });
            return {body:data.sort((a,b)=>a.from-b.from)};
        },
        decodeFromASS(input){
            if(!input) return;
            const data = [];
            let split = input.split('\n');
            split.forEach(line=>{
                const match = line.match(this.assReg);
                if (!match){
                    //console.log('跳过非正文行',line);
                    return;
                }
                data.push({
                    from:match[1]*60*60 + match[2]*60 + (+match[3]),
                    to:match[4]*60*60 + match[5]*60 + (+match[6]),
                    content:match[7].trim().replace(/{\\.+?}/g,'').replace(/\\N/gi,'\n').replace(/\\h/g,' ')
                });
            });
            return {body:data.sort((a,b)=>a.from-b.from)};
        }
    };//decoder END

    //旧版播放器CC字幕助手，需要维护整个设置面板和字幕逻辑
    const oldPlayerHelper = {
        setting:undefined,
        subtitle:undefined,
        selectedLan:undefined,
        isclosed:true,
        resizeRate: 100,
        configs:{
            color:[
                {value:'16777215',content:'<span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span>'},
                {value:'16007990',content:'<b style="color:#F44336;text-shadow: #000 0px 0px 1px">红色</b>'},
                {value:'10233776',content:'<b style="color:#9C27B0;text-shadow: #000 0px 0px 1px">紫色</b>'},
                {value:'6765239',content:'<b style="color:#673AB7;text-shadow: #000 0px 0px 1px">深紫色</b>'},
                {value:'4149685',content:'<b style="color:#3F51B5;text-shadow: #000 0px 0px 1px">靛青色</b>'},
                {value:'2201331',content:'<b style="color:#2196F3;text-shadow: #000 0px 0px 1px">蓝色</b>'},
                {value:'240116',content:'<b style="color:#03A9F4;text-shadow: #000 0px 0px 1px">亮蓝色</b>'}
            ],
            position:[
                {value:'bl',content:'左下角'},
                {value:'bc',content:'底部居中'},
                {value:'br',content:'右下角'},
                {value:'tl',content:'左上角'},
                {value:'tc',content:'顶部居中'},
                {value:'tr',content:'右上角'}
            ],
            shadow:[
                {value:'0',content:'无描边',style:''},
                {value:'1',content:'重墨',style:`text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px,#000 -1px 0px 1px;`},
                {value:'2',content:'描边',style:`text-shadow: #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px;`},
                {value:'3',content:'45°投影',style:`text-shadow: #000 1px 1px 2px, #000 0px 0px 1px;`}
            ]
        },
        saveSetting(){
            try{
                const playerSetting = localStorage.bilibili_player_settings?JSON.parse(localStorage.bilibili_player_settings):{};
                playerSetting.subtitle = this.setting;
                localStorage.bilibili_player_settings = JSON.stringify(playerSetting);
            }catch(e){
                bilibiliCCHelper.toast('保存字幕设置错误',e);
            }
        },
        changeStyle(){
            this.fontStyle.innerHTML = `span.subtitle-item-background{opacity: ${this.setting.backgroundopacity};}`
                + `span.subtitle-item-text {color:#${("000000"+this.setting.color.toString(16)).slice(-6)};}`
                + `span.subtitle-item {font-size: ${this.setting.fontsize*this.resizeRate}%;line-height: 110%;}`
                + `span.subtitle-item {${this.configs.shadow[this.setting.shadow].style}}`;
        },
        changePosition(){
            this.subtitleContainer.className = 'subtitle-position subtitle-position-'
                 +(this.setting.position||'bc');
            this.subtitleContainer.style = '';
        },
        changeResize(){
            this.resizeRate = this.setting.scale?bilibiliCCHelper.window.player.getWidth()/1280*100:100;
            this.changeStyle();
        },
        changeSubtitle(value=this.subtitle.subtitles[0].lan){
            this.selectedLanguage.innerText = bilibiliCCHelper.getSubtitleInfo(value).lan_doc;
            if(value=='close'){
                if(!this.isclosed) {
                    this.isclosed = true;
                    bilibiliCCHelper.loadSubtitle(value);
                    //更换本地字幕不切换设置中的字幕开关状态
                    if(this.selectedLan!='local') this.setting.isclosed = true;
                }
                this.downloadBtn.classList.add('bpui-state-disabled','bpui-button-icon');
                this.icon.innerHTML = elements.oldDisableIcon;
            }
            else if(value=='local') {
                //本地字幕解码器产生加载事件后再切换状态
                decoder.show((status)=>{
                    if(status==true){
                        this.downloadBtn.classList.add('bpui-state-disabled','bpui-button-icon');
                        this.isclosed = false;
                        this.selectedLan = value;
                        this.icon.innerHTML = elements.oldEnableIcon;
                    }
                });
            }
            else{
                this.isclosed = false;
                this.selectedLan = value;
                this.icon.innerHTML = elements.oldEnableIcon;
                this.setting.lan = value;
                this.setting.isclosed = false;
                bilibiliCCHelper.loadSubtitle(value);
                this.downloadBtn.classList.remove('bpui-state-disabled','bpui-button-icon');
            }
        },
        toggleSubtitle(){
            if(this.isclosed) {
                this.changeSubtitle(this.selectedLan);
            }
            else{
                this.changeSubtitle('close');
            }
        },
        initSubtitle(){
            if(this.setting.isclosed) {
                this.changeSubtitle('close');
            }
            else{
                //查找本视频是否有之前选择过的语言，如果有则选择之前的语言
                const lan = bilibiliCCHelper.getSubtitleInfo(this.setting.lan)&&this.setting.lan
                this.changeSubtitle(lan);
            }
            //没有字幕时设置下一次切换字幕行为为本地字幕
            if(!this.subtitle.count) this.selectedLan = 'local';
            this.changeResize();
        },
        initUI(){
            const preBtn = elements.getAs('.bilibili-player-video-btn-quality');
            if(!preBtn) throw('没有找到视频清晰度按钮');
            this.subtitleContainer = elements.getAs('.bilibili-player-video-subtitle>div');
            const btn = preBtn.insertAdjacentElement('afterEnd',elements.createAs('div',{
                className:"bilibili-player-video-btn",
                id:'bilibili-player-subtitle-btn',
                style:"display: block;",
                innerHTML:elements.subtitleStyle,
                onclick:(e)=>{
                    if(!this.panel.contains(e.target)) this.toggleSubtitle();
                }
            }));
            //按钮
            this.icon = elements.createAs('span',{
                innerHTML: this.setting.isclosed?elements.oldDisableIcon:elements.oldEnableIcon
            },btn);
            //字幕样式表
            this.fontStyle = elements.createAs('style',{type:"text/css"},btn);
            const panel = this.panel = elements.createAs('div',{
                id:'subtitle-setting-panel',
                style:'position: absolute;bottom: 28px;right: 30px;background: white;border-radius: 4px;'
                +'text-align: left;padding: 13px;display: none;cursor:default;'
            },btn),
                  languageDiv = elements.createAs('div',{innerHTML:'<div>字幕</div>'},panel),
                  sizeDiv = elements.createAs('div',{innerHTML:'<div>字体大小</div>'},panel),
                  colorDiv = elements.createAs('div',{innerHTML:'<span>字幕颜色</span>'},panel),
                  shadowDiv = elements.createAs('div',{innerHTML:'<span>字幕描边</span>'},panel),
                  positionDiv = elements.createAs('div',{innerHTML:'<span>字幕位置</span>'},panel),
                  opacityDiv = elements.createAs('div',{innerHTML:'<div>背景不透明度</div>'},panel);
            //选择字幕
            this.selectedLanguage = elements.createSelector({
                width:'100px',height:'180px',initValue:'close',
                handler:(value)=>this.changeSubtitle(value),
                datas:this.subtitle.subtitles.map(({lan,lan_doc})=>({content:lan_doc,value:lan}))
            },languageDiv).firstElementChild;
            //下载字幕
            this.downloadBtn = elements.createAs('button',{
                className: "bpui-button",style: 'padding:0 8px;',
                innerText: "下载",
                onclick: ()=>{
                    if(this.selectedLan=='close') return;
                    bilibiliCCHelper.getSubtitle(this.selectedLan).then(data=>{
                        encoder.showDialog(data);
                    }).catch(e=>{
                        bilibiliCCHelper.toast('获取字幕失败',e);
                    });
                }
            },languageDiv);
            //上传字幕
            elements.createAs('a',{
                className: this.subtitle.allow_submit?'bpui-button':'bpui-button bpui-state-disabled',
                innerText: '添加字幕',
                href: !this.subtitle.allow_submit?'javascript:'
                :`https://member.bilibili.com/v2#/zimu/my-zimu/zimu-editor?cid=${window.cid}&${window.aid?`aid=${window.aid}`:`bvid=${window.bvid}`}`,
                target: '_blank',
                style: 'margin-right: 0px;height: 24px;padding:0 6px;',
                title: this.subtitle.allow_submit?'':'本视频无法添加字幕，可能原因是:\r\n·UP主未允许观众投稿字幕\r\n·您未达到UP主设置的投稿字幕条件',
            },languageDiv);
            //字体大小
            elements.createAs('input',{
                style:"width: 70%;",type:"range",step:"25",
                value: (this.setting.fontsize==0.6?0
                        :this.setting.fontsize==0.8?25
                        :this.setting.fontsize==1.3?75
                        :this.setting.fontsize==1.6?100:50),
                oninput:(e)=>{
                    const v = e.target.value/25;
                    this.setting.fontsize = v>2?(v-2)*0.3+1:v*0.2+0.6;
                    this.changeStyle();
                }
            },sizeDiv);
            //自动缩放
            elements.createAs('input',{
                id:'subtitle-auto-resize',
                type:"checkbox",
                checked:this.setting.scale,
                onchange:(e)=>this.changeResize(this.setting.scale = e.target.checked)
            },sizeDiv);
            elements.createAs('label',{
                style:"cursor:pointer",
                innerText:'自动缩放'
            },sizeDiv).setAttribute('for','subtitle-auto-resize');
            //字幕颜色
            elements.createSelector({
                width:'74%',height:'120px',
                initValue:this.setting.color,
                handler:(value)=>this.changeStyle(this.setting.color=parseInt(value)),
                datas:this.configs.color
            },colorDiv);
            //字幕阴影
            elements.createSelector({
                width:'74%',height:'120px',
                initValue:this.setting.shadow,
                handler:(value)=>this.changeStyle(this.setting.shadow=value),
                datas:this.configs.shadow
            },shadowDiv);
            //字幕位置
            elements.createSelector({
                width:'74%',initValue:this.setting.position,
                handler:(value)=>this.changePosition(this.setting.position=value),
                datas:this.configs.position
            },positionDiv);
            //背景透明度
            elements.createAs('input',{
                style:"width: 100%;",
                type:"range",
                value: this.setting.backgroundopacity*100,
                oninput:(e)=>{
                    this.changeStyle(this.setting.backgroundopacity = e.target.value/100);
                }
            },opacityDiv);
            //播放器缩放
            bilibiliCCHelper.window.player.addEventListener('video_resize', (event) => {
                this.changeResize(event);
            });
            //退出页面保存配置
            bilibiliCCHelper.window.addEventListener("beforeunload", (event) => {
                this.saveSetting();
            });
            //初始化字幕
            this.initSubtitle();
            console.log('init cc helper button done');
        },
        init(subtitle){
            this.subtitle = subtitle;
            this.selectedLan = undefined;
            try {
                if (!localStorage.bilibili_player_settings) throw '当前播放器没有设置信息';
                this.setting = JSON.parse(localStorage.bilibili_player_settings).subtitle;
                if (!this.setting) throw '当前播放器没有字幕设置';
            }catch (e) {
                bilibiliCCHelper.toast('bilibili CC字幕助手读取设置出错,将使用默认设置:', e);
                this.setting = {backgroundopacity: 0.5,color: 16777215,fontsize: 1,isclosed: false,scale: true,shadow: "0", position: 'bc'};
            }
            this.initUI();
        }
    };//oldPlayerHelper END

    //新版播放器CC字幕助手，需要维护下载按钮/本地字幕选项/关闭选项/需要时监听CC字幕按钮
    const newPlayerHelper = {
        iconBtn:undefined,
        icon:undefined,
        panel:undefined,
        downloadBtn:undefined,
        selectedLan:undefined,
        selectedLocal:false,
        hasSubtitles:false,
        updateDownloadBtn(value='close'){
            this.selectedLan = value;
            if(value=='close'){
                this.downloadBtn.classList.add('bui-button-disabled','bpui-button-icon');
            }
            else{
                this.selectedLocal = false;
                this.downloadBtn.classList.remove('bui-button-disabled','bpui-button-icon');
            }
        },
        initUI(){
            const downloadBtn = this.downloadBtn = this.panel.nextElementSibling.cloneNode(),
                  selector = this.panel.querySelector('ul'),
                  selectedItem = selector.querySelector('li.bui-select-item.bui-select-item-active'),
                  closeItem = selector.querySelector('li.bui-select-item[data-value="close"]'),
                  localItem = closeItem.cloneNode();
            elements.setAs(downloadBtn,{
                style: 'min-width:unset!important',innerText: '下载',
                onclick: ()=>{
                    if(this.selectedLan=='close') return;
                    bilibiliCCHelper.getSubtitle(this.selectedLan).then(data=>{
                        encoder.showDialog(data);
                    }).catch(e=>{
                        bilibiliCCHelper.toast('获取字幕失败',e);
                    });
                }
            });
            this.panel.insertAdjacentElement('afterend',downloadBtn);
            this.updateDownloadBtn(selectedItem&&selectedItem.dataset.value);
            //本地字幕
            elements.setAs(localItem,{
                innerText: '本地字幕',
                onclick: ()=> {
                    decoder.show((status)=>{
                        if(status==true){
                            this.selectedLocal = true;
                            this.downloadBtn.classList.add('bui-button-disabled','bpui-button-icon');
                            this.icon.innerHTML = elements.newEnableIcon;
                        }
                    });
                }
            },selector);
            //选中本地字幕后关闭需要手动执行
            closeItem.addEventListener('click',()=>{
                if(!this.selectedLocal) return;
                this.selectedLocal = false;
                bilibiliCCHelper.loadSubtitle('close');
                this.icon.innerHTML = elements.newDisableIcon;
            });
            //视频本身没有字幕时，点击CC字幕按钮切换本地字幕和关闭
            //视频本身有字幕时播放器自身会切换到视频自身字幕
            if(!this.hasSubtitles){
                this.icon&&this.icon.addEventListener('click',({target})=>{
                    if(!this.selectedLocal) localItem.click();
                    else closeItem.click();
                });
            }
            new MutationObserver((mutations,observer)=>{
                mutations.forEach(mutation=>{
                    if(!mutation.target||mutation.type!='attributes') return;
                    if(mutation.target.classList.contains('bui-select-item-active')&&mutation.target.dataset.value){
                        this.updateDownloadBtn(mutation.target.dataset.value);
                    }
                });
            }).observe(selector,{
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
            console.log('Bilibili CC Helper init new UI success.');
        },
        init(subtitle){
            this.hasSubtitles = subtitle.count;
            this.selectedLan = undefined;
            this.selectedLocal = false;
            this.iconBtn = elements.getAs('.bilibili-player-video-btn-subtitle');
            this.panel = elements.getAs('.bilibili-player-video-subtitle-setting-lan');
            this.icon = this.iconBtn.querySelector('.bilibili-player-iconfont-subtitle span');
            //提高字幕位置高度，避免被遮挡无法拖动
            elements.createAs('style', {innerHTML:'.bilibili-player-video-subtitle {z-index: 20;}'}, document.head);
            if(this.panel){
                this.initUI();
                //设置ID标记视频为已注入，防止二次初始化
                this.iconBtn.id = 'bilibili-player-subtitle-btn';
            }
            else if(this.iconBtn){
                //强制显示新版播放器CC字幕按钮，不管视频有没有字幕，反正可以选择本地字幕
                this.iconBtn.style = 'display:block';
                //视频本身没有字幕时把按钮图标设置成关闭状态
                if(!this.hasSubtitles&&this.icon) this.icon.innerHTML = elements.newDisableIcon;
                //设置ID标记视频为已注入，防止二次初始化
                this.iconBtn.id = 'bilibili-player-subtitle-btn';
                new MutationObserver((mutations,observer)=>{
                    for (const mutation of mutations){
                        if(!mutation.target) continue;
                        if(mutation.target.classList.contains('bilibili-player-video-subtitle-setting-lan')){
                            observer.disconnect();
                            this.panel = mutation.target;
                            this.initUI();
                            return;
                        }
                    }
                }).observe(this.iconBtn,{
                    childList: true,
                    subtree: true
                });
            }
            else{
                throw('找不到新播放器按钮');
            }
        },
    };//newPlayerHelper END

    //启动器
    const bilibiliCCHelper = {
        window:"undefined"==typeof(unsafeWindow)?window:unsafeWindow,
        player:undefined,
        cid:undefined,
        subtitle:undefined,
        datas:undefined,
        toast(msg,error){
            if(error) console.error(msg,error);
            if(!this.toastDiv){
                this.toastDiv = document.createElement('div');
                this.toastDiv.className = 'bilibili-player-video-toast-item';
            }
            const panel = elements.getAs('.bilibili-player-video-toast-top');
            if(!panel) return;
            clearTimeout(this.removeTimmer);
            this.toastDiv.innerText = msg + (error?`:${error}`:'');
            panel.appendChild(this.toastDiv);
            this.removeTimmer = setTimeout(()=>{
                panel.contains(this.toastDiv)&&panel.removeChild(this.toastDiv)
            },3000);
        },
        async updateSubtitle(data){
            this.window.player.updateSubtitle(data);
        },
        loadSubtitle(lan){
            this.getSubtitle(lan)
                .then(data=>this.updateSubtitle(data))
                .then(()=>this.toast(lan=='close'?'字幕已关闭':`载入字幕:${this.getSubtitleInfo(lan).lan_doc}`))
                .catch(e=>this.toast('载入字幕失败',e));
        },
        async getSubtitle(lan){
            if(this.datas[lan]) return this.datas[lan];
            const item = this.getSubtitleInfo(lan);
            if(!item) throw('找不到所选语言字幕'+lan);
            return fetch(item.subtitle_url)
                .then(res=>res.json())
                .then(data=>(this.datas[lan] = data));
        },
        getSubtitleInfo(lan){
            return this.subtitle.subtitles.find(item=>item.lan==lan);
        },
        async setupData(){
            if(this.cid==this.window.cid && this.subtitle) return this.subtitle;
            if(location.pathname=='/blackboard/html5player.html') {
                let match = location.search.match(/cid=(\d+)/i);
                if(!match) return;
                this.window.cid = match[1];
                match = location.search.match(/aid=(\d+)/i);
                if(match) this.window.aid = match[1];
                match = location.search.match(/bvid=(\d+)/i);
                if(match) this.window.bvid = match[1];
            }
            this.cid = this.window.cid;
            this.aid = this.window.aid;
            this.bvid = this.window.bvid;
            this.player = this.window.player;
            this.subtitle = undefined;
            this.datas = {close:{body:[]},local:{body:[]}};
            decoder.data = undefined;
            if(!window.cid||(!window.aid&&!window.bvid)) return;
            return fetch(`//api.bilibili.com/x/player/v2?cid=${this.cid}${this.aid?`&aid=${this.aid}`:`&bvid=${this.bvid}`}`).then(res=>{
                if (res.status==200) {
                    return res.json().then(ret=>{
                        if (ret.code == -404) {
                            return fetch(`//api.bilibili.com/x/v2/dm/view?${this.aid?`aid=${this.aid}`:`bvid=${this.bvid}`}&oid=${this.cid}&type=1`).then(res=>{
                                return res.json()
                            }).then(ret=>{
                                if (ret.code!=0) throw('无法读取本视频APP字幕配置'+ret.message);
                                this.subtitle = ret.data && ret.data.subtitle || {subtitles:[]};
                                this.subtitle.count = this.subtitle.subtitles.length;
                                this.subtitle.subtitles.forEach(item=>(item.subtitle_url = item.subtitle_url.replace(/https?:\/\//,'//')))
                                this.subtitle.subtitles.push({lan:'close',lan_doc:'关闭'},{lan:'local',lan_doc:'本地字幕'});
                                this.subtitle.allow_submit = false;
                                return this.subtitle;
                            });
                        }
                        if(ret.code!=0||!ret.data||!ret.data.subtitle) throw('读取视频字幕配置错误:'+ret.code+ret.message);
                        this.subtitle = ret.data.subtitle;
                        this.subtitle.count = this.subtitle.subtitles.length;
                        this.subtitle.subtitles.push({lan:'close',lan_doc:'关闭'},{lan:'local',lan_doc:'本地字幕'});
                        return this.subtitle;
                    });
                }
                else {
                    throw('请求字幕配置失败:'+res.statusText);
                }
            })
        },
        tryInit(){
            this.setupData().then(subtitle=>{
                if(!subtitle) return;
                if(elements.getAs('#bilibili-player-subtitle-btn')) {
                    console.log('CC助手已初始化');
                }
                else if(elements.getAs('.bilibili-player-video-btn-repeat')){
                    oldPlayerHelper.init(subtitle);
                }
                else if(elements.getAs('.bilibili-player-video-danmaku-setting')){
                    newPlayerHelper.init(subtitle);
                }
            }).catch(e=>{
                this.toast('CC字幕助手配置失败',e);
            });
        },
        init(){
            this.tryInit();
            new MutationObserver((mutations, observer)=>{
                //console.log(mutations)
                mutations.forEach(mutation=>{
                    if(!mutation.target) return;
                    if(mutation.target.getAttribute('stage')==1){
                        this.tryInit();
                    }
                });
            }).observe(document.body,{
                childList: true,
                subtree: true,
            });
        }
    };
    bilibiliCCHelper.init();
})();