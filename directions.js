const variant=document.documentElement.dataset.style;
const concepts={a:['A｜編輯式設計','像翻閱一本作品集，以明朝字、非對稱留白與畫廊光線，讓作品值得細看。'],b:['B｜海報式設計','以巨幅中文字、螢光黃與斜放積木畫，建立一眼記得的展覽海報感。'],c:['C｜溫暖人文設計','把作品與說明書放上暖色拼裝桌，讓欣賞、查詢與動手自然連在一起。']};
document.querySelector(`[data-variant="${variant}"]`).setAttribute('aria-current','page');
document.getElementById('concept-name').textContent=concepts[variant][0];
document.getElementById('concept-text').textContent=concepts[variant][1];
document.title=`${concepts[variant][0]}｜LFC 視覺草稿`;
let returnFocus;
function openDialog(dialog){returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('dialog-open');}
function closeDialog(dialog){dialog.close();document.body.classList.remove('dialog-open');returnFocus?.focus();}
document.querySelectorAll('[data-open-art]').forEach(button=>button.addEventListener('click',()=>openDialog(document.getElementById('art-dialog'))));
document.querySelectorAll('[data-open-pdf]').forEach(button=>button.addEventListener('click',()=>{const dialog=document.getElementById('pdf-dialog');const frame=dialog.querySelector('iframe');if(!frame.hasAttribute('src'))frame.src=frame.dataset.src;openDialog(dialog);}));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('[data-close]').addEventListener('click',()=>closeDialog(dialog));dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(dialog);});dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog(dialog);});});
document.querySelectorAll('.background-options button').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.art-stage').dataset.background=button.dataset.background;document.querySelectorAll('.background-options button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));
