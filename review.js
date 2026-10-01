/* ARQGOV Conceptual Review v1.2. Static, browser-local. No server or analytics. */
(() => {
  'use strict';
  const D=window.LEXIMETRICS_DATA;
  const VERSION='ARQGOV-review-1.3';
  const MODEL='ARQGOV-English-1.2 / review-module-1.3';
  const KEY='ARQGOV_CONCEPT_REVIEWS_V1';
  const DRAFT_KEY='ARQGOV_CONCEPT_DRAFTS_V1';
  const PROFILE='ARQGOV_REVIEWER_PROFILE_V1';
  const dlg=document.getElementById('reviewDialog');
  const body=document.getElementById('reviewDialogBody');
  const title=document.getElementById('reviewDialogTitle');
  const count=document.getElementById('reviewCount');
  let records=read(KEY,[]), drafts=read(DRAFT_KEY,{}), identity=read(PROFILE,{name:'',email:''});
  let active=null, storageOK=true;
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function read(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback;}catch(e){return fallback;}}
  function store(key,value){try{localStorage.setItem(key,JSON.stringify(value));storageOK=true;return true;}catch(e){storageOK=false;return false;}}
  function findItem(id){for(const d of D.dimensions){const item=d.items.find(x=>x.id===id);if(item)return {d,item};}return null;}
  function resolve(kind,id,index){
    if(kind==='category'||kind==='field'){
      const match=findItem(id);if(!match)return null;const {d,item}=match;
      const n=Number(index);
      if(kind==='field'&&(!Number.isInteger(n)||n<0||n>=item.fields.length))return null;
      const f=kind==='field'?item.fields[n]:null;
      return {kind,id,field_index:f?n:null,field_label:f?f.label:'Overall category',target_id:kind==='field'?`${id}::field-${n}`:id,dimension_id:d.id,label:`${d.en} / ${item.name}`,reference:`${d.source} · ${d.table||'prose'} · entry ${item.position}`,original:f?f.value:(item.fields.map(x=>`${x.label}: ${x.value||'[blank in manuscript]'}`).join(' | '))};
    }
    if(kind==='dimension'){
      const d=D.dimensions.find(x=>x.id===id);return d&&{kind,id,field_index:null,field_label:'Dimension overview',target_id:id,dimension_id:id,label:d.en,reference:`${d.source} · ${d.table||'prose'}`,original:d.overview};
    }
    if(kind==='auxiliary'){
      const a=D.aux.find(x=>x.id===id);return a&&{kind,id,field_index:null,field_label:'Additional measurement',target_id:id,dimension_id:'additional_measurement',label:a.name,reference:a.source,original:a.description};
    }
    if(kind==='case_edge'){
      const e=D.caseEdges.find(x=>x.id===id);return e&&{kind,id,field_index:null,field_label:'Illustrative relationship',target_id:id,dimension_id:'relationships',label:`${e.source} → ${e.target}: ${e.label}`,reference:`${e.source_note} · visual interpretation`,original:`${e.label}; type candidate: ${e.type}. This example is stylized, not empirical coding.`};
    }
    if(kind==='conceptual_link'){
      const match=id.match(/^([a-z]+)>([a-z]+):(observable|composition|inference|measurement)$/);if(!match)return null;
      const [,from,to,role]=match;return {kind,id,field_index:null,field_label:'Map connection',target_id:id,dimension_id:'conceptual_map',label:`${from} → ${to} (${role})`,reference:'Interactive theoretical map · editorial/analytical visualization',original:`The map draws ${from} → ${to} as a link classified as ${role}. This is a proposed visualization, not an author-approved claim.`};
    }
    return null;
  }
  const choices=[['keep','Keep as proposed'],['clarify','Clarification needed'],['revision','Suggest a revision'],['overlap','Potential overlap with another category'],['discuss','Further discussion needed']];
  const targetKey=(name,t)=>`${String(name).trim().toLocaleLowerCase('en-US')}||${t.kind}||${t.target_id}`;
  function updateCount(){count.textContent=String(records.length);document.getElementById('reviewWorkspaceBtn').setAttribute('aria-label',`Open conceptual review workspace, ${records.length} saved notes`);}
  function show(){if(!dlg.open)dlg.showModal();}
  function alertStatus(message,err=false){const el=document.getElementById('reviewFeedback');if(el){el.textContent=message;el.classList.toggle('error',err);}}
  function storageNotice(){return '<p class="review-privacy">Notes and drafts are saved only in this browser on this device. No content is sent to the site, GitHub or Igor automatically. To deliver your review, export the CSV and attach it to an email. On a shared computer, other users of this browser profile may see local notes.</p>';}
  function draftKey(t){return `${t.kind}||${t.target_id}`;}
  function open(kind,id,index){const t=resolve(kind,id,index);if(!t)return;active=t;title.textContent='Review '+t.field_label.toLowerCase();
    const saved=records.find(r=>r.record_key===targetKey(identity.name,t));
    const d=drafts[draftKey(t)]||{};
    body.innerHTML=`<div class="review-reference"><b>${safe(t.label)}</b><small>${safe(t.reference)} · Stable ID: ${safe(t.target_id)}</small><span>${safe(t.field_label)}</span><p>${safe(t.original||'[blank in the manuscript]')}</p></div>
      <form id="reviewForm" class="review-form">
        <div class="review-two"><label>Reviewer name <span class="req">*</span><input name="reviewer" required maxlength="160" autocomplete="name" value="${safe(d.reviewer??identity.name)}" placeholder="David Levi-Faur / Rotem Medzini"></label><label>Email (optional)<input name="email" type="email" maxlength="200" value="${safe(d.email??identity.email)}" placeholder="Institutional email"></label></div>
        <label>Assessment <span class="req">*</span><select name="assessment" required><option value="">Select a position...</option>${choices.map(([v,l])=>`<option value="${v}" ${((d.assessment??saved?.assessment)===v)?'selected':''}>${safe(l)}</option>`).join('')}</select></label>
        <label>Comments / observations<textarea name="comment" rows="5" maxlength="20000" placeholder="What should be maintained, clarified or reconsidered?">${safe(d.comment??saved?.comment??'')}</textarea></label>
        <label>Suggested refinement (optional)<textarea name="proposal" rows="5" maxlength="20000" placeholder="Alternative definition, example or conceptual connection...">${safe(d.proposal??saved?.proposed_revision??'')}</textarea></label>
        <div id="reviewFeedback" class="review-feedback" role="status"></div>
        <div class="review-form-actions"><button class="review-primary" type="submit">${saved?'Update saved note':'Save note locally'}</button><button type="button" class="review-secondary" id="goReviewWorkspace">Review overview ↗</button>${saved?'<button type="button" class="review-danger" id="removeReviewNote">Delete saved note</button>':''}</div>
      </form>${storageNotice()}`;
    const form=document.getElementById('reviewForm');
    form.addEventListener('input',()=>{const q=Object.fromEntries(new FormData(form));drafts[draftKey(t)]=q;store(DRAFT_KEY,drafts);});
    form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;
      const q=Object.fromEntries(new FormData(form));const name=String(q.reviewer||'').trim();if(!name||!q.assessment){alertStatus('Name and assessment are required.',true);return;}
      const oldKey=targetKey(name,t);const old=records.find(r=>r.record_key===oldKey);
      const rec={record_key:oldKey,schema_version:VERSION,model_version:MODEL,manuscript:D.title,reviewer_name:name,reviewer_email:String(q.email||'').trim(),element_type:t.kind,element_id:t.id,review_item_id:t.target_id,dimension_id:t.dimension_id,category_label:t.label,field_label:t.field_label,source_reference:t.reference,original_text:t.original,assessment:q.assessment,comment:String(q.comment||''),proposed_revision:String(q.proposal||''),updated_at_utc:new Date().toISOString()};
      records=records.filter(r=>r.record_key!==oldKey);records.push(rec);identity={name,email:rec.reviewer_email};delete drafts[draftKey(t)];const ok=store(KEY,records);store(PROFILE,identity);store(DRAFT_KEY,drafts);updateCount();alertStatus(ok?'Saved in this browser. Export CSV to share.':'Storage is unavailable: note is held only in this open page. Export CSV now.',!ok);
      document.querySelector('#reviewForm .review-primary').textContent='Update saved note';
    });
    document.getElementById('goReviewWorkspace').onclick=workspace;
    if(saved)document.getElementById('removeReviewNote').onclick=()=>{if(!confirm('Remove this saved note from this browser?'))return;records=records.filter(r=>r.record_key!==saved.record_key);store(KEY,records);updateCount();workspace();};
    show();
  }
  function workspace(){active=null;title.textContent='Review workspace';body.innerHTML=`<p class="review-lead">Review conceptual categories and links, then export all saved observations as a structured CSV for Igor. Annotations do not modify the manuscript or the atlas.</p>
      <div class="review-two"><label>Current reviewer<input id="workspaceReviewer" maxlength="160" value="${safe(identity.name)}" placeholder="Reviewer name"></label><label>Email (optional)<input id="workspaceEmail" type="email" maxlength="200" value="${safe(identity.email)}" placeholder="Institutional email"></label></div>
      <div class="review-toolbar"><button class="review-primary" id="exportReviewCsv" type="button" ${records.length?'':'disabled'}>1 · Download CSV for Igor (${records.length})</button><button class="review-secondary" id="prepareReviewMail" type="button" ${records.length?'':'disabled'}>2 · Prepare email</button><button class="review-secondary" id="exportReviewBackup" type="button" ${records.length?'':'disabled'}>Backup JSON</button><label class="review-import">Import backup JSON<input id="importReviewBackup" type="file" accept="application/json,.json" hidden></label></div>
      <div id="reviewFeedback" class="review-feedback" role="status"></div>${storageNotice()}
      <div class="review-list-title"><h3>Saved observations (${records.length})</h3><small>Each record is linked to one specific conceptual element or manuscript field.</small></div>
      <div class="review-saved-list">${records.length?records.slice().sort((a,b)=>a.category_label.localeCompare(b.category_label)).map(r=>`<article class="review-saved-item"><div><b>${safe(r.category_label)}</b><small>${safe(r.field_label)} · ${safe(r.reviewer_name)} · ${safe(r.assessment)}</small><p>${safe(r.comment||r.proposed_revision||'No explanatory note.')}</p></div><button type="button" class="review-secondary" data-edit-key="${safe(r.record_key)}">Edit</button></article>`).join(''):'<p class="review-empty">No saved notes yet. Open a category, an individual field, a map connection or a relationship edge to begin.</p>'}</div>`;
    document.getElementById('workspaceReviewer').addEventListener('change',e=>{identity.name=e.target.value.trim();store(PROFILE,identity);});document.getElementById('workspaceEmail').addEventListener('change',e=>{identity.email=e.target.value.trim();store(PROFILE,identity);});
    document.getElementById('exportReviewCsv').onclick=exportCsv;
    document.getElementById('exportReviewBackup').onclick=()=>download('ARQGOV_review_backup.json','application/json;charset=utf-8',JSON.stringify({schema_version:VERSION,exported_at_utc:new Date().toISOString(),records},null,2));
    document.getElementById('prepareReviewMail').onclick=()=>{const subject=encodeURIComponent('ARQGOV conceptual review — CSV attached');const msg=encodeURIComponent('Dear Igor,\n\nPlease find my ARQGOV conceptual review attached. I downloaded the CSV from the interactive atlas and attached it manually.\n\nBest regards,\n'+(identity.name||'[Reviewer]'));location.href=`mailto:igor.machado@cnj.jus.br?subject=${subject}&body=${msg}`;alertStatus('Email draft opened, if supported. Please attach the CSV you downloaded. The browser cannot attach it automatically.');};
    document.getElementById('importReviewBackup').addEventListener('change',importJson);
    body.querySelectorAll('[data-edit-key]').forEach(b=>b.onclick=()=>{const r=records.find(x=>x.record_key===b.dataset.editKey);if(!r)return;identity={name:r.reviewer_name,email:r.reviewer_email};store(PROFILE,identity);open(r.element_type,r.element_id,r.element_type==='field'?Number(r.review_item_id.match(/field-(\d+)$/)?.[1]):undefined);});
    show();
  }
  function csvSafe(v){let s=String(v??'');if(/^[\s\uFEFF]*[=+@-]/u.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  const header=['schema_version','model_version','manuscript','reviewer_name','reviewer_email','review_item_id','element_type','element_id','dimension_id','category_label','field_label','source_reference','original_text','assessment','comment','proposed_revision','updated_at_utc'];
  function exportCsv(){if(!records.length)return;const lines=[header.map(csvSafe).join(','),...records.map(r=>header.map(k=>csvSafe(r[k])).join(','))];download('ARQGOV_conceptual_review_'+new Date().toISOString().slice(0,10)+'.csv','text/csv;charset=utf-8','\uFEFF'+lines.join('\r\n')+'\r\n');alertStatus('CSV downloaded. To send it to Igor, attach the downloaded CSV manually to your email.');}
  function download(name,type,contents){const blob=new Blob([contents],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  async function importJson(e){const file=e.target.files?.[0];if(!file)return;try{if(file.size>5_000_000)throw Error('Backup too large.');const obj=JSON.parse(await file.text());if(obj.schema_version!==VERSION||!Array.isArray(obj.records))throw Error('Unsupported review backup format.');let added=0;for(const r of obj.records){if(!r||typeof r!=='object'||!r.reviewer_name||!r.element_type||!r.element_id||!r.review_item_id||!choices.some(x=>x[0]===r.assessment))continue;const t=resolve(r.element_type,r.element_id,r.element_type==='field'?Number(String(r.review_item_id).match(/field-(\d+)$/)?.[1]):undefined);if(!t||r.review_item_id!==t.target_id)continue;const key=targetKey(r.reviewer_name,t);const candidate={...r,record_key:key,schema_version:VERSION};const old=records.find(x=>x.record_key===key);if(!old||String(candidate.updated_at_utc)>String(old.updated_at_utc)){records=records.filter(x=>x.record_key!==key);records.push(candidate);added++;}}store(KEY,records);updateCount();workspace();alertStatus(`${added} record(s) imported or updated. Please review before exporting.`);}catch(err){alertStatus('Import failed: '+err.message,true);} }
  document.getElementById('reviewWorkspaceBtn').addEventListener('click',workspace);
  document.getElementById('reviewClose').addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
  window.ARQGOV_REVIEW={open,workspace,get count(){return records.length;}};
  updateCount();
})();
