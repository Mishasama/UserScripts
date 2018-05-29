// ==UserScript==
// @name         bilibili��ҳ�����APP��ҳ�Ƽ�
// @namespace    indefined
// @version      0.2.1.1
// @description  ΪBվ��ҳ����ҳ���APP��ҳ�Ƽ����ݣ��ṩ���/�����Ժ��ٿ�����ϲ��/������ϲ�����ܣ�ͬʱ�ṩȫվ���а�
// @author       indefined
// @match        *://www.bilibili.com/
// @license      MIT
// @connect      app.bilibili.com
// @connect      api.bilibili.com
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

const token = document.cookie.match(/bili_jct=(.{32});/)[1];
const recommend = document.querySelector('#bili_douga').cloneNode(true);
CreateCss();
InitRecommend();
InitRanking();

function CreateCss(){
	const css = document.createElement('style');
	css.type = 'text/css';
	css.innerHTML = `
		.dislike-botton,.tname {
		position: absolute;
		top: 2px;
		opacity: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: right;
		font-weight: bold;
		-webkit-transition: all .3s;
		-o-transition: all .3s;
		transition: all .3s;
		text-shadow: 0 1px black, 1px 0 black, -1px 0 black, 0 -1px black;
		color: white;
		}
		.spread-module .tname {
		left: 6px;
		}
		.spread-module .dislike-botton {
		right: 6px;
		font-size: 14px;
		}
		.dislike-list {
		display:none;
		}
		.dislike-list>div:hover {
		text-decoration: line-through;
		}
		.spread-module:hover .pic .tname
		,.spread-module .pic:hover .dislike-botton{
		opacity: 1;
		}
		.dislike-botton:hover .dislike-list{
		display:unset;
		}
		.dislike-cover {
		position: absolute;
		top: 0px;
		width: 100%;
		height: 100%;
		background:hsla(0,0%,100%,.9);
		text-align: -webkit-center;
		font-size: 15px;
		z-index: 2;
		}
		.toast {
		  position: fixed;
		  padding: 12px 24px;
		  font-size: 14px;
		  border-radius: 8px;
		  left:50%;
		  top:50%;
		  width: 240px;
		  margin-left: -120px;
		  color: #fff;
		  background-color: #ffb243;
		  box-shadow: 0 0.2em 0.1em 0.1em rgba(255,190,68,0.2);
		  transition: transform 0.4s cubic-bezier(0.22, 0.58, 0.12, 0.98);
		  animation: link-msg-move-in-top cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
		  z-index: 10000;
		}`;
	document.head.appendChild(css);
}

function InitRecommend () {
    recommend.id = 'recommend';
    recommend.querySelector('div.zone-title').innerHTML = `<div class="headline clearfix ">
		<i class="icon icon_t icon-douga"></i><span class="name">����ϲ��</span>
		<div class="read-push"><i class="icon icon_read"></i><span class="info">��һ��</span></div></div>`;
    const popular = document.querySelector('#home_popularize');
    const listBox = recommend.querySelector('div.storey-box.clearfix');
    popular.parentElement.insertBefore(recommend,popular.nextSibling);
    recommend.querySelector('.read-push').onclick = UpdateRecommend;
    UpdateRecommend();
    function UpdateRecommend () {
        while(listBox.firstChild) listBox.removeChild(listBox.firstChild);
        const status = getLoadingDiv();
        listBox.appendChild(status);
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${document.location.protocol}//app.bilibili.com/x/feed/index?build=1&mobi_app=android`,
            onload: res=>{
                try {
                    const rep = JSON.parse(res.response);
                    if (rep.code!=0){
                        status.firstChild.innerText = `����app��ҳʧ�� code ${rep.code} msg ${rep.message} �����Ի�򿪵����ն˲鿴������Ϣ`;
                        return console.log('����app��ҳʧ��',rep);
                    }
                    listBox.removeChild(status);
                    rep.data.forEach(data=>{
                        const item = CreateItem(data);
                        listBox.appendChild(item);
                    });
                } catch (e){
                    status.firstChild.innerText = `����app��ҳ�������� ${e} �����Ի�򿪵����ն˲鿴������Ϣ`;
                    console.error(e);
                }
            }
        });
    }

    function CreateItem (data){
        const item = document.createElement('div');
        item.className = 'spread-module';
        item.innerHTML = `
		  <a href="/video/av${data.param}/" target="_blank" data-tag_id="${data.tag?data.tag.tag_id:''}" data-id="${data.param}" data-goto="${data.goto}" data-mid="${data.mid}" data-rid="${data.tid}">
		  <div class="pic">
		  <div class="lazy-img"><img alt="${data.title}" src="${data.cover}@144w_90h.webp" /></div>
		  <span title="������${data.tname}" class="tname">${data.tname}</span>
		  <span class="dur">${formatNumber(data.duration,'time')}</span>
		  <div data-aid=${data.param} title="�Ժ��ٿ�" class="watch-later-trigger w-later"></div>
		  <div class="dislike-botton">��<div class="dislike-list"></div></div></div>
		  <p title="${data.title}" class="t">${data.title}</p>
		  <p class="num"><span class="play">
		  <i class="icon"></i>${formatNumber(data.play)}</span>
		  <span class="danmu"><i class="icon"></i>${formatNumber(data.danmaku)}</span>
		  </p></a>`;
        item.querySelector('.watch-later-trigger').onclick = WatchLater;
        if (data.dislike_reasons){
            const dislikeList = item.querySelector('.dislike-list');
            for (const reason of data.dislike_reasons){
                const dislikeItem = document.createElement('div');
                dislikeItem.dataset.reason_id = reason.reason_id;
                dislikeItem.innerText = reason.reason_name;
                dislikeItem.title = `�����Ϊ��${reason.reason_name}����ϲ��`;
                dislikeItem.onclick = DisLike;
                dislikeList.appendChild(dislikeItem);
            }
        }
        return item;
    }

    function DisLike (ev) {
        let target=ev.target,parent=target.parentNode;
        let cancel;
        let url =  `${document.location.protocol}//app.bilibili.com/x/feed/dislike`;
        if (parent.className!='dislike-list'){
            cancel = true;
            let deep = 1;
            while(parent.nodeName!='A'&&deep++<4){
                target = parent;
                parent=target.parentNode;
            }
            if (parent.nodeName!='A'){
                showError('�Ҳ������ڵ�');
                return false;
            }
            url += `/cancel`;
        }else{
            parent = ev.path[4];
        }
        url += `?goto=${parent.dataset.goto}&id=${parent.dataset.id}&mid=${parent.dataset.mid}&reason_id=${target.dataset.reason_id}&rid=${parent.dataset.rid}&tag_id=${parent.dataset.tag_id}`;
        const handleCover = ()=>{
            if (cancel){
                parent.removeChild(target);
            }else{
                const cover = document.createElement('div');
                cover.className = 'dislike-cover';
                cover.dataset.reason_id = target.dataset.reason_id;
                cover.innerHTML = `<div class="lazy-img"><br><br>�ύ�ɹ�����Ը�������Ժ��ٸ������ֶ�����<br><br><b>�����������</b></div>`;
                cover.onclick = DisLike;
                parent.appendChild(cover);
            }
        };
        //console.log(url);
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: res=>{
                try {
                    const par = JSON.parse(res.response);
                    if (par.code!=0){
                        showError(`����ϲ������ code ${par.code} msg ${par.message} �����Ի�򿪵����ն˲鿴������Ϣ`);
                        console.log('����ϲ����������',par,url,'����ϵ���߲��ṩ��ϸ��Ϣ');
                    }else{
                        handleCover();
                    }
                } catch (e){
                    showError(`����ϲ���������������Ի�򿪵����ն˲鿴������Ϣ`);
                    console.error(e,'����ϵ���߲��ṩ��ϸ��Ϣ');
                }
            }
        });
        return false;
    }

}

function InitRanking(){
    const rankingAll = recommend.querySelector('#ranking_douga');
    rankingAll.id = 'ranking-all';
    const rankingHead = rankingAll.querySelector('.rank-head');
    rankingHead.firstChild.innerText = 'ȫվ����';
    const tab = rankingHead.querySelector('.bili-tab.rank-tab');
    const dropDown = rankingHead.querySelector('.bili-dropdown.rank-dropdown');
    const warp = rankingAll.querySelector('.rank-list-wrap');
    let type = 1;
    let day = 3;
    const data = {1:{},2:{}};
    const status = getLoadingDiv();
    const UpdateItems = target =>{
        target.removeChild(status);
        for (let i = 0;i<7;i++){
            const itemData = data[type][day][i];
            const item = document.createElement('li');
            item.className = 'rank-item';
            if (i<3) item.classList.add('highlight');
            item.innerHTML = `<i class="ri-num">${i+1}</i>
				<a href="/video/av${itemData.aid}/" target="_blank" title="${itemData.title} ����:${itemData.play} ${itemData.duration}" class="ri-info-wrap clearfix">
				<div class="ri-detail"><p class="ri-title">${itemData.title}</p><p class="ri-point">�ۺ����֣�${formatNumber(itemData.pts)}</p></div></a>`;
            if (i==0){
                item.className = 'rank-item show-detail first highlight';
                const a = item.querySelector('a');
                a.innerHTML = `<div class="lazy-img ri-preview"><img alt="${itemData.title}" src="${itemData.pic.split(':')[1]}@72w_45h.webp"></div><div class="ri-detail"><p class="ri-title">${itemData.title}</p>
				<p class="ri-point">�ۺ����֣�${formatNumber(itemData.pts)}</p></div><div data-aid="${itemData.aid}" title="��ӵ��Ժ��ٿ�" class="watch-later-trigger w-later"></div>`;
                a.lastChild.onclick = WatchLater;
            }
            target.appendChild(item);
        }
    };
    const UpdateRanking = ()=>{
        const target = type==1?warp.firstChild:warp.lastChild;
        while(target.firstChild) target.removeChild(target.firstChild);
        status.firstChild.innerText = '���ڼ���...';
        target.appendChild(status);
        rankingAll.lastChild.href = `/ranking/${type==1?'all':'origin'}/0/1/${day}/`;
        if (!data[type][day]){
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${document.location.protocol}//api.bilibili.com/x/web-interface/ranking?rid=0&day=${day}&type=${type}&arc_type=0`,
                onload: res=>{
                    try {
                        const rep = JSON.parse(res.response);
                        if (rep.code!=0){
                            status.firstChild.innerText = `�������а�ʧ�� code ${rep.code} msg ${rep.message} �����Ի�򿪵����ն˲鿴������Ϣ`;
                            return console.log('����app��ҳʧ�ܣ�����ϵ���߲��ṩ��ϸ��Ϣ',rep);
                        }
                        data[type][day] = rep.data.list;
                        UpdateItems(target);
                    } catch (e){
                        status.firstChild.innerText = `�������а������� ${e} �����Ի�򿪵����ն˲鿴������Ϣ`;
                        console.error(e,'����ϵ���߲��ṩ��ϸ��Ϣ');
                    }
                }
            });
        }else UpdateItems(target);
    };
    const UpdateStatus = ev=>{
        if (ev.target.className =='dropdown-item'){
            dropDown.firstChild.innerText = ev.target.innerText;
            dropDown.lastChild.childNodes.forEach(c=>c.style.display=c.style.display=='none'?'unset':'none');
            day = ev.target.innerText=='����'?3:7;
        }else{
            tab.childNodes.forEach(c=>{
                if (c==ev.target) c.removeEventListener('mouseover',UpdateStatus);
                else c.addEventListener('mouseover',UpdateStatus);
                c.classList.toggle('on');
            });
            type = ev.target.innerText=='ȫ��'?1:2;
            warp.classList.toggle('show-origin');
        }
        UpdateRanking();
    };
    dropDown.lastChild.childNodes.forEach(c=>c.onclick = UpdateStatus);
    tab.lastChild.addEventListener('mouseover',UpdateStatus);
    UpdateRanking();
}

function WatchLater (ev){
    const target = ev.target;
    const req = new XMLHttpRequest();
    const action = target.classList.contains('added')?'del':'add';
    req.open('POST','//api.bilibili.com/x/v2/history/toview/'+action);
    req.withCredentials = true;
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
    req.onload = res=>{
        try{
            var list = JSON.parse(res.target.response);
            if (list.code!=0){
                showError(`�����Ժ��ٿ����� code ${list.code} msg ${list.message} �����Ի�򿪵����ն˲鿴������Ϣ`);
                console.log('�����Ժ��ٿ���������',list,target,'����ϵ���߲��ṩ��ϸ��Ϣ');
                return;
            }
            target.classList.toggle('added');
            target.title = target.classList.contains('added')?'�Ƴ��Ժ��ٿ�':'�Ժ��ٿ�';
        }catch(e){
            showError(`�����Ժ��ٿ��������������Ի�򿪵����ն˲鿴������Ϣ`);
            console.error(e,'����ϵ���߲��ṩ��ϸ��Ϣ');
        }
    };
    req.send(`aid=${target.dataset.aid}&csrf=${token}`);
    return false;
}

function formatNumber (input,format='number'){
    if (format=='time'){
        let second = input%60;
        let minute = Math.floor(input/60);
        let hour;
        if (minute>60){
            hour = Math.floor(minute/60);
            minute = minute%60;
        }
        if (second<10) second='0'+second;
        if (minute<10) minute='0'+minute;
        return hour?`${hour}:${minute}:${second}`:`${minute}:${second}`;
    }else{
        return input>9999?`${(input/10000).toFixed(1)}��`:input||0;
    }
}

function getLoadingDiv(){
    const loading = document.createElement('div');
    loading.className = 'load-state';
    loading.innerHTML = '<span class="loading">���ڼ���...</span>';
    return loading;
}

function showError(msg){
    const toast = document.createElement('div');
    toast.innerHTML = `<div class="toast"><span >${msg}</span></div>`;
    document.body.append(toast);
    setTimeout(()=>document.body.removeChild(toast),4000);
    return false;
}