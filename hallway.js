document.getElementById('concept-name').textContent='B｜走廊掛畫展示';
document.getElementById('concept-text').textContent='保留海報式的大字與螢光黃，把積木畫放進暖白走廊，預覽它融入日常空間的樣子。';
document.title='B｜走廊掛畫示意 · LFC 積木畫';
// The AI room has no measured real-world scale. These are explicit preview assumptions.
// Calibrate against the FRONT wall only, not the full image including the floor.
const hallwayScale={imageWidth:1536,imageHeight:1024,wallTop:54,wallFloor:780,wallHeightCm:260,artHeightCm:60,artAspect:.753,centerHeightCm:150,centerX:.675};
const pixelsPerCm=(hallwayScale.wallFloor-hallwayScale.wallTop)/hallwayScale.wallHeightCm;
const artHeightPx=hallwayScale.artHeightCm*pixelsPerCm;
const artWidthPx=artHeightPx*hallwayScale.artAspect;
const artTopPx=hallwayScale.wallFloor-(hallwayScale.centerHeightCm+hallwayScale.artHeightCm/2)*pixelsPerCm;
document.documentElement.style.setProperty('--art-width',`${100*artWidthPx/hallwayScale.imageWidth}%`);
document.documentElement.style.setProperty('--art-left',`${100*(hallwayScale.centerX*hallwayScale.imageWidth-artWidthPx/2)/hallwayScale.imageWidth}%`);
document.documentElement.style.setProperty('--art-top',`${100*artTopPx/hallwayScale.imageHeight}%`);
document.querySelectorAll('[data-scale-note]').forEach(note=>{note.textContent=`暫定畫作約 ${Math.round(hallwayScale.artHeightCm*hallwayScale.artAspect)} × ${hallwayScale.artHeightCm} 公分；牆高假設 ${hallwayScale.wallHeightCm} 公分，掛畫中心離地 ${hallwayScale.centerHeightCm} 公分。`;});
function setScene(background){document.querySelector('.art-stage').dataset.background=background;document.querySelectorAll('.background-options button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.background===background)));}
document.querySelectorAll('[data-open-art]').forEach(button=>button.addEventListener('click',()=>setScene('corridor')));
document.querySelectorAll('[data-open-original]').forEach(button=>button.addEventListener('click',()=>{setScene('dark');openDialog(document.getElementById('art-dialog'));}));
