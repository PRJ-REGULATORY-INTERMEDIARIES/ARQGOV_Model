/* Relational Leximetrics Atlas — static GitHub Pages app. No trackers, frameworks or network requests. */
(() => {
'use strict';
const D=window.LEXIMETRICS_DATA;
if(!D){document.body.textContent='Could not load data.js.';return;}
const $=(sel,root=document)=>root.querySelector(sel);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svgNS='http://www.w3.org/2000/svg';
const S=(name,attrs={},text)=>{const el=document.createElementNS(svgNS,name);Object.entries(attrs).forEach(([key,val])=>el.setAttribute(key,String(val)));if(text!==undefined)el.textContent=text;return el;};
const statusName=s=>({textual:'ORIGINAL TABLE',lacuna:'NO DEFINITION / EXAMPLE',parcial:'PARTIAL DEFINITION',prosa:'MANUSCRIPT PROSE'}[s]||s);
const statusCls=s=>(s==='lacuna'||s==='parcial')?'partial':s==='prosa'?'prose':'';
const dimension=id=>D.dimensions.find(d=>d.id===id);
const pageNames={map:'OVERVIEW',catalog:'CATEGORIES',network:'RELATIONAL NETWORK',method:'METHODOLOGY'};
let activeView='map',activeFamily='objects',previousFocus=null;
let viewBox={x:0,y:0,w:1480,h:760};
const bounds={w:1480,h:760};
function notify(message){$('#announce').textContent=message;}
function setView(view,opts={}){
 if(!pageNames[view])return;
 activeView=view;
 $$('.view').forEach(section=>section.classList.toggle('active',section.id==='view-'+view));
 $$('.nav-button').forEach(btn=>{const selected=btn.dataset.view===view;btn.classList.toggle('active',selected);if(selected)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');});
 $('#breadcrumb').textContent=pageNames[view];
 if(view==='catalog')renderCatalog();
 if(opts.updateHash!==false)history.replaceState(null,'','#'+view+(view==='catalog'?'/'+activeFamily:''));
 if(!opts.keepScroll)window.scrollTo({top:0,behavior:'instant'});
 notify('Opened view: '+pageNames[view]);
}
$$('[data-view]').forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.view)));
$('#topSearchBtn').addEventListener('click',()=>{setView('catalog');$('#catalogSearch').focus();});
$$('[data-goto]').forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.goto)));
function initDeepLink(){let [,v,f]=location.hash.match(/^#(map|catalog|network|method)(?:\/([a-z-]+))?$/)||[];if(f&&dimension(f))activeFamily=f;if(v)setView(v,{updateHash:false});}
window.addEventListener('hashchange',initDeepLink);
const statEntries=[['08','DIMENSIONS'],['83','CATEGORIES ACROSS DIMENSIONS'],['10','RELATIONSHIP ATTRIBUTES'],['03','EMPIRICAL LAYERS']];
// The subtotal below is computed from data; R/I/T/B is a meta-row, not an actor family.
statEntries[1][0]=String(D.dimensions.reduce((a,d)=>a+d.count,0));
$('#stats').innerHTML=statEntries.map(([n,t])=>`<span class="stat-pill"><strong>${esc(n)}</strong>${esc(t)}</span>`).join('');
/* ----------------------------------------------------- theoretical SVG */
const graph=$('#theoryGraph');
const graphNodes=[
 {id:'law',title:'LEGAL TEXT',sub:['law · provision · statement'],x:36,y:320,w:200,h:108,kind:'root',source:'p. 3; §4.1'},
 {id:'objects',title:'01 · OBJECTS',sub:['What is governed','8 categories'],x:322,y:16,w:205,h:99,kind:'base'},
 {id:'actors',title:'02 · ACTORS',sub:['Who participates','9 families · R/I/T/B'],x:322,y:160,w:205,h:99,kind:'base'},
 {id:'functions',title:'03 · FUNCTIONS',sub:['Work performed','8 categories'],x:322,y:304,w:205,h:99,kind:'base'},
 {id:'mechanisms',title:'04 · MECHANISMS',sub:['How influence operates','23 entries'],x:322,y:448,w:205,h:99,kind:'base'},
 {id:'relationships',title:'05 · RELATIONSHIPS',sub:['How A connects to B','10 types + 10 attributes'],x:322,y:592,w:205,h:99,kind:'base'},
 {id:'observation',title:'OBSERVATION',sub:['Law × Provision × Object','× Actor A × Function ×','Mechanism × Relation × Actor B'],x:646,y:299,w:252,h:154,kind:'root',source:'§4.1, p. 18'},
 {id:'strategies',title:'06 · STRATEGIES',sub:['Obligation patterns','9 categories · overlap'],x:974,y:176,w:205,h:110,kind:'inference'},
 {id:'architectures',title:'07 · ARCHITECTURES',sub:['Relational configuration','10 architectures'],x:974,y:420,w:205,h:110,kind:'inference'},
 {id:'logics',title:'08 · GOV. LOGICS',sub:['Coordinating principle','6 logics (prose)'],x:1253,y:300,w:196,h:112,kind:'inference'},
 {id:'intermediation',title:'INTERMEDIATION',sub:['6 measurement dimensions'],x:961,y:627,w:220,h:85,kind:'aux'},
 {id:'selfreg',title:'SELF-REGULATION',sub:['3 measurement dimensions'],x:1230,y:627,w:220,h:85,kind:'aux'}
];
const byNode=Object.fromEntries(graphNodes.map(n=>[n.id,n]));
const edges=[];
['objects','actors','functions','mechanisms','relationships'].forEach(id=>edges.push({from:'law',to:id,role:'observable'}));
['objects','actors','functions','mechanisms','relationships'].forEach(id=>edges.push({from:id,to:'observation',role:'composition'}));
for(const id of ['strategies','architectures'])edges.push({from:'observation',to:id,role:'inference'});
edges.push({from:'strategies',to:'logics',role:'inference'},{from:'architectures',to:'logics',role:'inference'},{from:'architectures',to:'intermediation',role:'measurement'},{from:'architectures',to:'selfreg',role:'measurement'});
function gpath(a,b){
 const x1=a.x+a.w,y1=a.y+a.h/2,x2=b.x,y2=b.y+b.h/2;
 if(b.id==='intermediation'||b.id==='selfreg'){return `M ${a.x+a.w/2} ${a.y+a.h} C ${a.x+a.w/2} ${a.y+a.h+66},${b.x+b.w/2} ${b.y-48},${b.x+b.w/2} ${b.y}`;}
 const m=Math.max(35,(x2-x1)*.49);return `M ${x1} ${y1} C ${x1+m} ${y1}, ${x2-m} ${y2}, ${x2} ${y2}`;
}
function focusNode(id){
 $$('.graph-node',graph).forEach(el=>el.classList.toggle('faded',el.dataset.id!==id));
 $$('.graph-edge',graph).forEach(el=>el.classList.toggle('faded',el.dataset.from!==id&&el.dataset.to!==id));
}
function clearFocusNode(){ $$('.graph-node, .graph-edge',graph).forEach(el=>el.classList.remove('faded')); }
function renderGraph(){
 graph.replaceChildren();
 const defs=S('defs');
 const marker=S('marker',{id:'gArrow',viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'6',markerHeight:'6',orient:'auto-start-reverse'});marker.append(S('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:'#a0bec5'}));defs.append(marker);
 graph.append(defs);
 graph.append(S('rect',{x:0,y:0,width:1480,height:760,fill:'transparent',class:'pan-background'}));
 edges.forEach(e=>{const stroke=e.role==='measurement'?'#c6a76b':e.role==='inference'?'#76a8ae':'#afc7ca';const path=S('path',{d:gpath(byNode[e.from],byNode[e.to]),fill:'none',stroke,'stroke-width':e.role==='inference'?2.3:1.65,'stroke-dasharray':e.role==='measurement'?'5 5':'none','marker-end':'url(#gArrow)',class:'graph-edge','data-from':e.from,'data-to':e.to});graph.append(path);const hit=S('path',{d:gpath(byNode[e.from],byNode[e.to]),class:'concept-edge-hit',fill:'none',stroke:'transparent','stroke-width':13,tabindex:0,role:'button','aria-label':'Review conceptual connection '+e.from+' to '+e.to});const open=()=>window.ARQGOV_REVIEW.open('conceptual_link',e.from+'>'+e.to+':'+e.role);hit.addEventListener('pointerdown',event=>event.stopPropagation());hit.addEventListener('click',event=>{event.stopPropagation();open();});hit.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}});graph.append(hit);});
 // The dashed line signals conceptual compatibility rather than causal determination.
 graph.append(S('path',{d:'M 1077 286 L 1077 420',stroke:'#8fa5b1','stroke-dasharray':'4 6','stroke-width':1.35,fill:'none'}));
 graph.append(S('text',{x:1090,y:360,fill:'#7796a1','font-size':10,'font-weight':650},'coexistence'));
 graphNodes.forEach(n=>{
  const color={root:['#10374b','#4ec6b0','#fff','#c0d8db'],base:['#f3faf9','#60b1a4','#154858','#64818a'],inference:['#eef4f8','#6a9bb5','#214c65','#6c8494'],aux:['#fff5e5','#d9a85e','#6b552d','#92734c']}[n.kind];
  const g=S('g',{class:'graph-node','data-id':n.id,tabindex:0,role:'button','aria-label':'Open details for '+n.title});
  g.append(S('rect',{x:n.x,y:n.y,width:n.w,height:n.h,rx:9,fill:color[0],stroke:color[1],'stroke-width':1.6}));
  g.append(S('rect',{x:n.x,y:n.y,width:5,height:n.h,rx:2,fill:color[1],stroke:'none'}));
  g.append(S('text',{x:n.x+17,y:n.y+29,fill:color[2],'font-size':n.kind==='root'?15:14,'font-weight':800,'letter-spacing':'.5px'},n.title));
  n.sub.forEach((line,i)=>g.append(S('text',{x:n.x+17,y:n.y+52+i*16,fill:color[3],'font-size':n.kind==='aux'?11:12,'font-weight':i===0?650:450},line)));
  g.append(S('text',{x:n.x+n.w-20,y:n.y+26,fill:color[1],'font-size':14,'font-weight':700},'↗'));
  g.addEventListener('click',()=>openGraphNode(n.id));
  g.addEventListener('mouseenter',()=>focusNode(n.id));g.addEventListener('mouseleave',clearFocusNode);
  g.addEventListener('focus',()=>focusNode(n.id));g.addEventListener('blur',clearFocusNode);
  g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();openGraphNode(n.id);}});
  graph.append(g);
 });
 updateViewbox();
}
function updateViewbox(){graph.setAttribute('viewBox',`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);}
function zoom(factor){const nw=Math.max(570,Math.min(1900,viewBox.w*factor));const ratio=nw/viewBox.w;const nh=viewBox.h*ratio;const cx=viewBox.x+viewBox.w/2,cy=viewBox.y+viewBox.h/2;viewBox={x:cx-nw/2,y:cy-nh/2,w:nw,h:nh};updateViewbox();}
$('#zoomIn').addEventListener('click',()=>zoom(.83));$('#zoomOut').addEventListener('click',()=>zoom(1.2));$('#zoomReset').addEventListener('click',()=>{viewBox={x:0,y:0,w:1480,h:760};updateViewbox();});
let panning=null;
graph.addEventListener('pointerdown',ev=>{if(ev.button!==0||ev.target.closest('.graph-node'))return;panning={x:ev.clientX,y:ev.clientY,box:{...viewBox}};graph.classList.add('dragging');graph.setPointerCapture(ev.pointerId);});
graph.addEventListener('pointermove',ev=>{if(!panning)return;const rect=graph.getBoundingClientRect();viewBox.x=panning.box.x-(ev.clientX-panning.x)*panning.box.w/rect.width;viewBox.y=panning.box.y-(ev.clientY-panning.y)*panning.box.h/rect.height;updateViewbox();});
function stopPan(){panning=null;graph.classList.remove('dragging');}graph.addEventListener('pointerup',stopPan);graph.addEventListener('pointercancel',stopPan);
/* ----------------------------------------------------- inspector */
function openInspector(content,eyebrow='CONCEPT PROFILE'){
 previousFocus=document.activeElement;
 $('#inspectorEyebrow').textContent=eyebrow;
 $('#inspectorContent').innerHTML=content;
 $('#overlay').hidden=false;
 $('#inspector').inert=false;$('#inspector').classList.add('open');$('#inspector').setAttribute('aria-hidden','false');
 document.body.style.overflow='hidden';$('#closeInspector').focus();
}
function closeInspector(){const box=$('#inspector');box.classList.remove('open');box.setAttribute('aria-hidden','true');box.inert=true;$('#overlay').hidden=true;document.body.style.overflow='';if(previousFocus&&document.contains(previousFocus)&&typeof previousFocus.focus==='function')previousFocus.focus();}
$('#closeInspector').addEventListener('click',closeInspector);$('#overlay').addEventListener('click',closeInspector);
document.addEventListener('keydown',ev=>{if($('#reviewDialog').open)return;if(ev.key==='Escape'&&$('#inspector').classList.contains('open')){closeInspector();return;}if(ev.key==='Tab'&&$('#inspector').classList.contains('open')){const focusables=$$('button:not([disabled]),[href],input:not([disabled])',$('#inspector'));if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus();}else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus();}}});
$('#inspectorContent').addEventListener('click',ev=>{
 const openItem=ev.target.closest('[data-inspect-item]');if(openItem){const [d,i]=openItem.dataset.inspectItem.split('::');openCategory(d,i);}
 const openFam=ev.target.closest('[data-family-nav]');if(openFam){activeFamily=openFam.dataset.familyNav;closeInspector();setView('catalog');}
 const aux=ev.target.closest('[data-aux]');if(aux)openAux(aux.dataset.aux);
 const review=ev.target.closest('[data-review-kind]');if(review)window.ARQGOV_REVIEW.open(review.dataset.reviewKind,review.dataset.reviewId,review.dataset.reviewField);
});
function openGraphNode(id){
 if(dimension(id))return openDimension(id);
 if(id==='intermediation'||id==='selfreg')return openAux(id);
 if(id==='law')return openInspector(`<h2>Legal text as the starting point</h2><p class="lead">The structure is anchored in a law, provision and statement. The manuscript emphasizes that one provision may generate several relationships and one relationship may be constituted through more than one provision.</p><div class="source-line">Source: p. 3; §4.1, pp. 18–19.</div><h3>Traceability rule</h3><div class="info-box">Preserve identifiers at the law, article, paragraph and statement levels; each relationship must be retrievable in the supporting legal text.</div>`, 'LEGAL ANCHOR');
 if(id==='observation')return openInspector(`<h2>The relational observation</h2><p class="lead">The substantive unit is the legally constituted relationship; the legal provision remains the principal textual anchor.</p><div class="info-box">Law × Provision × Object × Actor A × Function × Mechanism × Relationship × Actor B</div><h3>What attributes accompany an edge?</h3><p>Legal basis, direction, authority, discretion, information, accountability, sanctions, remedies and other attributes specified in the manuscript.</p><div class="source-line">§4.1, p. 18; §3.5, p. 12.</div><h3>Coding precautions</h3><p>One provision may yield several observations. Do not assign abstract labels such as “polycentric” or “enhanced self-regulation” at the outset: these should emerge through aggregation (§4.2).</p><button class="related-chip" data-aux="attrs" type="button">Explore the ten attributes ↗</button>`, 'METHODOLOGICAL UNIT');
}
function openDimension(id){
 const d=dimension(id);if(!d)return;
 const isInf=['strategies','architectures','logics'].includes(id);
 const roleNote=id==='actors'?'<h3>Relational roles (additional row in T03)</h3><div class="info-box">R/I/T/B: Rule-maker, Rule-Intermediaries, Rule-Taker and Rule-Beneficiaries. This is a separate row in the manuscript (§3.2, p. 8), not counted as a tenth institutional actor family.</div>':'';
 openInspector(`<div class="eyebrow">DIMENSION ${String(D.dimensions.indexOf(d)+1).padStart(2,'0')} / 08</div><h2>${esc(d.en)}</h2><p class="lead">${esc(d.subtitle)}.</p><div class="source-line">${esc(d.source)} · ${d.table?'table '+esc(d.table):'categories named in the prose'}</div><h3>Organizing definition</h3><p>${esc(d.overview)}</p>${roleNote}<h3>Dimension content · ${d.count} entries</h3><div class="source-list">${d.items.map(it=>`<button type="button" data-inspect-item="${esc(id)}::${esc(it.id)}">${esc(it.name)} ${it.status==='lacuna'?'· ⚑ missing':it.status==='parcial'?'· ◐ partial':''} <span style="float:right">↗</span></button>`).join('')}</div><h3>Operationalization note</h3><div class="info-box ${id==='mechanisms'?'warn':''}">${esc(d.rule)} ${isInf?'Identification requires aggregation and an explicit inferential justification.':''}</div>${id==='relationships'?'<p><button class="related-chip" type="button" data-aux="attrs">Ten relationship attributes ↗</button></p>':''}<div class="review-callout"><b>Review this dimension</b><p>Assess its structure or suggest improvements to the conceptual grouping.</p><button class="review-primary" type="button" data-review-kind="dimension" data-review-id="${esc(id)}">Review dimension ↗</button></div><div class="detail-footer">${esc(D.sourceNote)}</div>`,'CONCEPTUAL DIMENSION');
}
function openCategory(dimId,itemId){
 const d=dimension(dimId);if(!d)return;const item=d.items.find(i=>i.id===itemId);if(!item)return;
 const sourceKind=item.status==='prosa'?'Enumeration in the prose':'Original table entry';
 let content=`<div class="eyebrow">${esc(d.en)} · ENTRY ${String(item.position).padStart(2,'0')}</div><h2>${esc(item.name)}</h2><span class="tag ${statusCls(item.status)}">${statusName(item.status)}</span><p class="lead">${esc(sourceKind)} — ${esc(d.source)}.</p><h3>Source fields preserved</h3><div class="detail-fields">`;
 item.fields.forEach((field,i)=>content+=`<div class="detail-field"><b>${esc(field.label)}</b><p class="${field.value?'':'missing'}">${field.value?esc(field.value):'Blank in the manuscript—not filled through inference.'}</p><button type="button" class="review-inline" data-review-kind="field" data-review-id="${esc(item.id)}" data-review-field="${i}">Review this field ↗</button></div>`);
 content+='</div>';
 if(item.status==='lacuna')content+='<h3>Operationalization warning</h3><div class="info-box warn">The term appears in the table, but the manuscript supplies neither a definition nor an illustrative legal device. Do not attribute an allegedly author-approved coding rule to it.</div>';
 if(item.status==='parcial')content+='<h3>Operationalization warning</h3><div class="info-box warn">This entry is only partially populated in the manuscript. The missing information remains explicit.</div>';
 content+=`<h3>Relationship to the model</h3><div class="info-box">${esc(d.rule)} <strong>Analytical note:</strong> ${esc(dimensionHint(dimId))}</div><h3>Provenance</h3><div class="source-line">${esc(d.source)} · ${esc(d.table||'§3.8')} · entry ${item.position}. ${esc(D.manuscript)}.</div><div class="review-callout"><b>Conceptual review</b><p>Comment on this category as a whole, or use the buttons beside individual manuscript fields above.</p><button type="button" class="review-primary" data-review-kind="category" data-review-id="${esc(item.id)}">Review this category ↗</button></div><div class="detail-footer">This panel does not replace a formally validated codebook.</div>`;
 openInspector(content,'PROFILE · '+d.en.toUpperCase());
}
function dimensionHint(id){return ({objects:'Link the object to the relational record without assuming that substantive categories are mutually exclusive.',actors:'Distinguish institutional family from the R/I/T/B position occupied in each legal relationship.',functions:'Ask which governance task is assigned to whom.',mechanisms:'Identify how the legal device exerts influence; do not conflate mechanism, instrument and function.',relationships:'Record a typed, directed link between Actor A and Actor B, together with its attributes.',strategies:'Infer combinations of requirements and mechanisms without assuming all categories are exclusive.',architectures:'Demonstrate the minimum configuration of nodes and edges supporting the classification.',logics:'Require a reasoned justification for the organizing principles; the manuscript defines no scoring system.'})[id];}
function openAux(id){
 const a=D.aux.find(x=>x.id===id);if(!a)return;
 const content=`<div class="eyebrow">ADDITIONAL MEASUREMENT</div><h2>${esc(a.name)}</h2><p class="lead">${esc(a.description)}</p><div class="source-line">${esc(a.source)}</div><h3>Documented items (${a.items.length})</h3><div class="detail-fields">${a.items.map(item=>`<div class="detail-field"><b>${esc(item.name)}</b><p>${esc(item.value)}</p></div>`).join('')}</div><h3>Methodological status</h3><div class="info-box">The manuscript names these dimensions but does not provide a complete empirical rubric for every threshold, weight or formula. Any derived index requires a separate protocol and validation.</div><div class="review-callout"><b>Review this additional measurement</b><button type="button" class="review-primary" data-review-kind="auxiliary" data-review-id="${esc(a.id)}">Add review ↗</button></div>`;
 openInspector(content,'ADDITIONAL DIMENSION');
}
$$('[data-open-aux]').forEach(el=>el.addEventListener('click',()=>openAux(el.dataset.openAux)));
/* ----------------------------------------------------- catalogue */
function renderFamilies(){
 $('#familyTabs').innerHTML=D.dimensions.map((d,i)=>`<button type="button" role="tab" aria-selected="${d.id===activeFamily}" class="family-tab ${d.id===activeFamily?'active':''}" data-family="${d.id}">${String(i+1).padStart(2,'0')} ${esc(d.pt)} <small>${d.count}</small></button>`).join('');
 $$('.family-tab').forEach(btn=>btn.addEventListener('click',()=>{activeFamily=btn.dataset.family;$('#catalogSearch').value='';$('#statusFilter').value='all';renderCatalog();history.replaceState(null,'','#catalog/'+activeFamily);}));
}
function renderCatalog(){
 renderFamilies();const d=dimension(activeFamily);if(!d)return;
 $('#categorySource').textContent=d.source+(d.table?' · '+d.table:' · prose');$('#categoryName').textContent=d.pt+' / '+d.en;$('#categoryDescription').textContent=d.overview;
 const q=$('#catalogSearch').value.trim().toLocaleLowerCase('en-US');const status=$('#statusFilter').value;
 const items=d.items.filter(i=>{
  const corpus=[i.name,...i.fields.flatMap(f=>[f.label,f.value])].join(' ').toLocaleLowerCase('en-US');
  return (!q||corpus.includes(q))&&(status==='all'||status==='incomplete'&&['lacuna','parcial'].includes(i.status)||status==='complete'&&!['lacuna','parcial'].includes(i.status));
 });
 $('#categoryCount').innerHTML=`${items.length}<small>OF ${d.count} ENTRADAS</small>`;
 $('#catalogItems').innerHTML=items.length?items.map(i=>{
 const description=i.fields.slice(1).map(f=>f.value).find(Boolean)||'No definition in the manuscript.';
 return `<button type="button" class="category-card" data-item="${esc(i.id)}"><span class="card-index">${esc(d.en.toUpperCase())} / ${String(i.position).padStart(2,'0')}</span><h3>${esc(i.name)}</h3><p>${esc(description.length>132?description.slice(0,132)+'…':description)}</p><div class="category-card-foot"><span class="tag ${statusCls(i.status)}">${statusName(i.status)}</span><span class="card-arrow" aria-hidden="true">↗</span></div></button>`;
 }).join(''):'<div class="empty-state">No entries match this search and filter combination.</div>';
 $$('.category-card').forEach(btn=>btn.addEventListener('click',()=>openCategory(activeFamily,btn.dataset.item)));
}
$('#catalogSearch').addEventListener('input',renderCatalog);$('#statusFilter').addEventListener('change',renderCatalog);
/* ----------------------------------------------------- example network */
function openCaseEdge(id){const e=D.caseEdges.find(x=>x.id===id);if(!e)return;
 openInspector(`<div class="eyebrow">RELATIONAL EXAMPLE · ${esc(e.source_note)}</div><h2>${esc(e.source==='reg'?'Regulator':e.source==='cert'?'Certifier':'Firm')} → ${esc(e.target==='reg'?'Regulator':e.target==='cert'?'Certifier':e.target==='firm'?'Firm':'Consumer')}</h2><p class="lead"><strong>${esc(e.label)}</strong> · ${esc(e.translation)}.</p><h3>Related type</h3><div class="detail-field"><b>Relationship family in §3.5 table</b><p>${esc(e.type)}</p></div><h3>What does this arrow demonstrate?</h3><p>One pair of actors may appear in multiple, legally distinct connections. In applied coding, every arrow must have its own function, mechanism, modality and textual evidence.</p><div class="info-box warn"><strong>Limitation:</strong> this network reproduces stylized examples listed by the author; it does not represent observations extracted from any specific law. Mapping an arrow to a relationship family is an interpretive visual aid.</div><div class="source-line">Source of the relationship list: ${esc(e.source_note)}. See the relationship table, p. 11.</div><div class="review-callout"><b>Review this illustrative connection</b><p>Comment on the mapping or on the relationship itself.</p><button type="button" class="review-primary" data-review-kind="case_edge" data-review-id="${esc(e.id)}">Review connection ↗</button></div>`,'ILLUSTRATIVE RELATIONAL EVENT');}
function renderCaseGraph(){
 const s=$('#caseGraph');s.replaceChildren();const defs=S('defs');const m=S('marker',{id:'caseArrow',viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto'});m.append(S('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:'#4c8e9b'}));defs.append(m);s.append(defs);
 D.caseEdges.forEach(e=>{const g=S('g',{class:'case-edge-group',tabindex:0,role:'button','aria-label':e.source+' '+e.label+' '+e.target});g.append(S('path',{d:e.path,class:'case-edge-path'}));g.append(S('path',{d:e.path,class:'case-edge-hit'}));g.append(S('text',{x:e.lx,y:e.ly,'text-anchor':'middle',class:'case-edge-label'},e.label));g.addEventListener('click',()=>openCaseEdge(e.id));g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();openCaseEdge(e.id);}});s.append(g);});
 D.caseNodes.forEach(n=>{const g=S('g',{class:'case-node',tabindex:0,role:'button','aria-label':'Role '+n.name});g.append(S('rect',{x:n.x-90,y:n.y-44,width:180,height:88}));g.append(S('text',{x:n.x,y:n.y-4,'text-anchor':'middle',class:'name'},n.name));g.append(S('text',{x:n.x,y:n.y+19,'text-anchor':'middle',class:'desc'},n.subtitle));g.addEventListener('click',()=>openInspector(`<h2>${esc(n.name)}</h2><p class="lead">${esc(n.subtitle)}.</p><p>Roles are context dependent. An actor may occupy different R/I/T/B positions depending on the relationship being observed.</p><div class="source-line">§3.2, p. 8; §3.5, p. 12.</div>`,'ILLUSTRATIVE NODE'));g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();g.dispatchEvent(new Event('click'));}});s.append(g);});
 $('#edgeCards').innerHTML=D.caseEdges.map((e,i)=>`<button class="edge-card" type="button" data-edge="${esc(e.id)}"><b>${String(i+1).padStart(2,'0')} · ${esc(e.label)}</b><small>${esc(e.type)}</small></button>`).join('');
 $$('.edge-card').forEach(btn=>btn.addEventListener('click',()=>openCaseEdge(btn.dataset.edge)));
}
/* ----------------------------------------------------- methods + QA */
function renderMethod(){
 const attr=D.aux.find(a=>a.id==='attrs');$('#attrList').innerHTML=attr.items.map(a=>`<div class="micro-row"><b>${esc(a.name)}</b><span>${esc(a.value)}</span></div>`).join('');
 $('#metricOverview').innerHTML=D.aux.filter(a=>a.id!=='attrs').map(a=>`<button type="button" class="metric-btn" data-metric="${a.id}"><span><b>${esc(a.name)}</b><br><small>${esc(a.source)}</small></span><span aria-hidden="true">↗</span></button>`).join('');
 $$('[data-metric]').forEach(btn=>btn.addEventListener('click',()=>openAux(btn.dataset.metric)));
 $('#axesGrid').innerHTML=D.strategicAxes.map((a,i)=>`<article class="axis-box"><div class="eyebrow">AXIS ${i+1}</div><b>${esc(a.name)}</b><p>${esc(a.terms)}</p><small>${esc(a.source)}</small></article>`).join('');
 $('#auditGrid').innerHTML=D.audit.map(a=>`<article class="audit-item"><button type="button" aria-expanded="false"><span class="audit-id">${esc(a.id)}</span><span>${esc(a.issue)}</span><span aria-hidden="true">＋</span></button><div class="audit-body"><p><strong>Location:</strong> ${esc(a.place)}</p><p><strong>Evidence:</strong> ${esc(a.evidence)}</p><p><strong>Analytical implication:</strong> ${esc(a.implication)}</p></div></article>`).join('');
 $$('.audit-item button').forEach(btn=>btn.addEventListener('click',()=>{let art=btn.closest('.audit-item');let on=art.classList.toggle('open');btn.setAttribute('aria-expanded',String(on));btn.querySelector('span:last-child').textContent=on?'−':'＋';}));
 $('#crosslinkList').innerHTML=D.crosslinks.map(x=>`<article class="crosslink-row"><strong>${esc(x.pair)}</strong><p>${esc(x.question)}</p><small>${esc(x.source)} · ${esc(x.status)}</small></article>`).join('');
}
renderGraph();renderCatalog();renderCaseGraph();renderMethod();initDeepLink();
})();
