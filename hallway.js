document.getElementById('concept-name').textContent='B｜走廊掛畫展示';
document.getElementById('concept-text').textContent='保留海報式的大字與螢光黃，把積木畫放進暖白走廊，預覽它融入日常空間的樣子。';
document.title='B｜走廊掛畫示意 · LFC 積木畫';
function setScene(background){document.querySelector('.art-stage').dataset.background=background;document.querySelectorAll('.background-options button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.background===background)));}
document.querySelectorAll('[data-open-art]').forEach(button=>button.addEventListener('click',()=>setScene('corridor')));
document.querySelectorAll('[data-open-original]').forEach(button=>button.addEventListener('click',()=>{setScene('dark');openDialog(document.getElementById('art-dialog'));}));
