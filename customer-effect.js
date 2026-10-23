(() => {
  'use strict';
  function init(){
    const name=document.getElementById('name'),search=document.getElementById('search-btn'),login=document.getElementById('login-view'),gallery=document.getElementById('gallery-view'),grid=document.getElementById('gallery-grid'),status=document.getElementById('login-result'),main=document.getElementById('main-container'),notice=document.getElementById('gallery-demo-notice');
    const dialog=document.getElementById('customer-art-dialog'),stage=dialog.querySelector('.viewer-stage'),roomArt=dialog.querySelector('.room-art'),detailArt=dialog.querySelector('.detail-art'),original=document.getElementById('viewer-original'),viewerStatus=document.getElementById('viewer-status'),cropSelect=document.getElementById('room-crop'),cropControls=dialog.querySelector('.viewer-crop-controls'),mount=dialog.querySelector('.room-mounted');
    let returnFocus=null,activeCard=null,artWidth=0,artHeight=0;
    function updateStatus(){
      const sample=dialog.dataset.sample==='true'?'AI 展示作品，非客戶訂單。':'';
      if(stage.dataset.mode==='detail'){viewerStatus.textContent=sample+'原圖細節保留完整圖片與對照內容。';return;}
      const label={left:'左圖',top:'上圖',full:'整張圖片'}[mount.dataset.crop]||'圖片';
      viewerStatus.textContent=sample+`走廊取用${label}；AI 情境以長邊 60 公分、牆高 260 公分示意，實際尺寸以訂單為準。`;
    }
    function setMode(mode){stage.dataset.mode=mode;cropControls.hidden=mode!=='room';dialog.querySelectorAll('[data-view-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.viewMode===mode)));updateStatus();}
    function scaleArtwork(){
      const crop=cropSelect.value==='auto'?(artWidth>=artHeight?'left':'top'):cropSelect.value;
      mount.dataset.crop=crop;
      const croppedWidth=artWidth*(crop==='left' ? .5 : 1),croppedHeight=artHeight*(crop==='top' ? .5 : 1);
      const aspect=dialog.dataset.sample==='true'&&crop==='full' ? .753 : (croppedWidth/croppedHeight||.753);
      const heightCm=aspect>1?60/aspect:60,widthCm=heightCm*aspect,pxPerCm=726/260,heightPx=heightCm*pxPerCm,widthPx=widthCm*pxPerCm;
      dialog.style.setProperty('--mounted-aspect',String(aspect));
      dialog.style.setProperty('--mounted-width',`${widthPx/1536*100}%`);
      dialog.style.setProperty('--mounted-left',`${(1536*.675-widthPx/2)/1536*100}%`);
      dialog.style.setProperty('--mounted-top',`${(780-(150+heightCm/2)*pxPerCm)/1024*100}%`);
      updateStatus();
    }
    roomArt.addEventListener('load',()=>{artWidth=roomArt.naturalWidth;artHeight=roomArt.naturalHeight;scaleArtwork();});
    roomArt.addEventListener('error',()=>{viewerStatus.textContent='圖片暫時無法顯示，請使用「開啟原圖」查看。';});
    cropSelect.addEventListener('change',()=>{if(activeCard)activeCard.dataset.roomCrop=cropSelect.value;scaleArtwork();});
    function openArtwork(card,mode){
      const anchor=card.querySelector('a'),image=anchor?.querySelector('img');if(!image)return;
      returnFocus=document.activeElement;activeCard=card;artWidth=image.naturalWidth;artHeight=image.naturalHeight;dialog.dataset.sample=String(card.dataset.sample==='true');
      cropSelect.value=card.dataset.roomCrop||(card.dataset.sample==='true'?'full':'auto');
      document.getElementById('customer-art-title').textContent=card.dataset.remark||'積木畫效果';
      original.href=anchor.href;roomArt.src=image.currentSrc||image.src;detailArt.src=image.currentSrc||image.src;scaleArtwork();setMode(mode);dialog.showModal();document.body.classList.add('dialog-open');
    }
    document.getElementById('close-art').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');if(returnFocus?.isConnected)returnFocus.focus();});
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
    dialog.querySelectorAll('[data-view-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.viewMode)));
    function decorateCards(){
      grid.querySelectorAll('.gallery-card').forEach((card,index)=>{
        if(card.dataset.enhanced==='true')return;const anchor=card.querySelector('a'),image=anchor?.querySelector('img');if(!image)return;
        card.dataset.enhanced='true';anchor.rel='noopener noreferrer';anchor.setAttribute('aria-label',`查看${card.dataset.remark||`作品 ${index+1}`}的展示效果`);image.alt=card.dataset.remark||`積木畫作品 ${index+1}`;
        const overlay=document.createElement('span');overlay.className='thumb-open';overlay.textContent='檢視效果 ↗';anchor.appendChild(overlay);
        const actions=document.createElement('div');actions.className='work-actions';
        [['room','走廊展示 ↗'],['detail','原圖細節 ↗']].forEach(([mode,label])=>{const button=document.createElement('button');button.type='button';button.dataset.openMode=mode;button.textContent=label;actions.appendChild(button);});card.appendChild(actions);
      });
    }
    new MutationObserver(decorateCards).observe(grid,{childList:true,subtree:true});
    grid.addEventListener('click',event=>{
      if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const button=event.target.closest('[data-open-mode]'),anchor=event.target.closest('.gallery-card a'),card=event.target.closest('.gallery-card');
      if(!card||(!button&&!anchor?.querySelector('img')))return;event.preventDefault();openArtwork(card,button?.dataset.openMode||'room');
    });
    function updateView(){const resultsVisible=!gallery.classList.contains('hidden');main.dataset.view=resultsVisible?'gallery':'lookup';search.disabled=!resultsVisible&&!!status.querySelector('.loader');if(resultsVisible)document.getElementById('gallery-title').focus();}
    new MutationObserver(updateView).observe(gallery,{attributes:true,attributeFilter:['class']});
    new MutationObserver(()=>{search.disabled=!!status.querySelector('.loader')&&gallery.classList.contains('hidden');}).observe(status,{childList:true,subtree:true});
    document.getElementById('customer-lookup-form').addEventListener('submit',event=>{event.preventDefault();if(!search.disabled)search.click();});
    name.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.isComposing){event.preventDefault();if(!search.disabled)search.click();}});
    document.getElementById('back-btn').addEventListener('click',()=>{notice.classList.add('hidden');const url=new URL(location.href);url.searchParams.delete('demo');history.replaceState(null,'',url);name.focus();});
    if(new URLSearchParams(location.search).get('demo')==='1'){
      document.getElementById('gallery-title').textContent='積木畫展示示意';notice.classList.remove('hidden');
      const card=document.createElement('div');card.className='gallery-card';card.dataset.sample='true';card.dataset.remark='橘貓的日常 · AI 展示示意';const anchor=document.createElement('a');anchor.href='direction-art.png';anchor.target='_blank';const image=document.createElement('img');image.src='direction-art.png';image.alt='橘貓積木畫 AI 示意';anchor.appendChild(image);const caption=document.createElement('div');caption.className='p-3';caption.textContent=card.dataset.remark;card.append(anchor,caption);grid.replaceChildren(card);decorateCards();login.classList.add('hidden');gallery.classList.remove('hidden');
    }
    updateView();
  }
  if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init);else init();
})();
