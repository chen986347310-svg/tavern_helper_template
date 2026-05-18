// L2 CDP Integration Test Runner
// Validates validateVariables via __TEST_applyValidatedUpdate in iframe context
// Usage: node cdp-l2-test.mjs [--port 9223]

import { writeFileSync } from 'node:fs';
const CDP_PORT = (() => { const i = process.argv.indexOf('--port'); return i !== -1 && process.argv[i+1] ? Number(process.argv[i+1]) : 9223; })();
const PASS='\x1b[32m[PASS]\x1b[0m',FAIL='\x1b[31m[FAIL]\x1b[0m',WARN='\x1b[33m[WARN]\x1b[0m';
let _ws,_msgId=0,_pending=new Map(),_collected=[];

async function connectCDP() {
  const r=await fetch('http://127.0.0.1:'+CDP_PORT+'/json');
  if(!r.ok)throw new Error('Cannot connect to Chrome');
  const t=await r.json();
  const st=t.find(x=>x.title?.includes('SillyTavern'));
  if(!st)throw new Error('No SillyTavern tab');
  const wsUrl=st.webSocketDebuggerUrl.replace('localhost','127.0.0.1');
  return new Promise((resolve,reject)=>{
    const ws=new WebSocket(wsUrl);
    ws.onopen=()=>{_ws=ws;ws.onmessage=({data})=>{
      const m=JSON.parse(data);
      if(m.method==='Runtime.executionContextCreated')_collected.push(m.params.context);
      if(m.id&&_pending.has(m.id)){_pending.get(m.id)(m);_pending.delete(m.id);}
    };resolve();};
    ws.onerror=()=>reject(new Error('WS error'));
    setTimeout(()=>reject(new Error('WS timeout')),5000);
  });
}

function cdpEval(expr,ctxId){
  return new Promise((resolve,reject)=>{
    const id=++_msgId;
    const p={expression:expr,returnByValue:true,awaitPromise:true};
    if(ctxId)p.contextId=ctxId;
    _ws.send(JSON.stringify({id,method:'Runtime.evaluate',params:p}));
    const t=setTimeout(()=>{_pending.delete(id);reject(new Error('eval timeout'));},15000);
    _pending.set(id,m=>{clearTimeout(t);resolve(m);});
  });
}

async function evalCtx(ctx,expr){
  const r=await cdpEval(expr,ctx);
  if(r.result?.exceptionDetails){
    const d=r.result.exceptionDetails;
    throw new Error(d.text+' '+(d.exception?.description||d.exception?.value||''));
  }
  return r.result?.result?.value;
}

const TD={
  '\u7cfb\u7edf':{'\u9636\u6bb5':'\u653b\u7565\u671f','\u5269\u4f59\u5929\u6570':30,'\u7075\u77f3':100},
  'NPC':{
    '\u767d\u82b7':{'\u597d\u611f\u5ea6':0,'\u653b\u7565\u503c':0,'\u7c98\u6ede\u8ba1\u6570':0,'\u72b6\u6001':'\u672a\u5f00\u59cb'},
    '\u82cf\u82b8':{'\u597d\u611f\u5ea6':0,'\u653b\u7565\u503c':0,'\u7c98\u6ede\u8ba1\u6570':0,'\u72b6\u6001':'\u672a\u5f00\u59cb'},
    '\u7eaa\u5170':{'\u597d\u611f\u5ea6':0,'\u653b\u7565\u503c':0,'\u7c98\u6ede\u8ba1\u6570':0,'\u72b6\u6001':'\u672a\u5f00\u59cb'},
    '\u6c88\u6708\u79cb':{'\u597d\u611f\u5ea6':0,'\u653b\u7565\u503c':0,'\u7c98\u6ede\u8ba1\u6570':0,'\u72b6\u6001':'\u672a\u5f00\u59cb'},
    '\u67f3\u7d20\u8863':{'\u597d\u611f\u5ea6':0,'\u653b\u7565\u503c':0,'\u7c98\u6ede\u8ba1\u6570':0,'\u72b6\u6001':'\u672a\u5f00\u59cb'},
  },
  '\u9053\u5177':{'\u62e5\u6709':{},'\u88c5\u5907':{'\u73a9\u5bb6':[],'\u767d\u82b7':[],'\u82cf\u82b8':[],'\u7eaa\u5170':[],'\u6c88\u6708\u79cb':[],'\u67f3\u7d20\u8863':[]}},
  '\u725d\u5974':{'\u5815\u843d\u5ea6':0,'\u725d\u9634\u51b3\u5c42\u6570':0},
  '\u573a\u666f':{'\u5df2\u89e3\u9501':[]},'\u5267\u60c5':{'\u5df2\u89e3\u9501':[]}
};
const TDJ=JSON.stringify(TD);

const INFRA = "window.__L2={snapshot:null,results:[],trace:[],updateCount:0};"+
  "window.__L2.snapshot=structuredClone(_.get(Mvu.getMvuData({type:'message',message_id:'latest'}),'stat_data'));"+
  "window.__L2_restore=function(){var m=Mvu.getMvuData({type:'message',message_id:'latest'});var c=structuredClone(m);c.stat_data=structuredClone(window.__L2.snapshot);return Mvu.replaceMvuData(c,{type:'message',message_id:'latest'});};"+
  "window.__L2_readVar=function(p){return _.get(_.get(Mvu.getMvuData({type:'message',message_id:'latest'}),'stat_data'),p);};"+
  "window.__L2_writeVar=function(p,v){var m=Mvu.getMvuData({type:'message',message_id:'latest'});var c=structuredClone(m);_.set(c.stat_data,p,v);return Mvu.replaceMvuData(c,{type:'message',message_id:'latest'});};"+
  "window.__L2_assert=function(a,e,n,w){var pass=JSON.stringify(a)===JSON.stringify(e);window.__L2.results.push({name:n,pass:pass,actual:a,expected:e,isWarn:!!w});};"+
  "window.__L2_checkOsc=function(p){var vs=[];function poll(i){if(i>=3)return Promise.resolve(vs.every(function(v){return v===vs[0]}));return new Promise(function(r){setTimeout(function(){vs.push(window.__L2_readVar(p));r(poll(i+1));},200)});}return poll(0);};"+
  "true";

async function main(){
  console.log('\n=== L2 CDP Test ===\n');
  await connectCDP();
  console.log('[OK] Connected');

  // Enable Runtime to capture contexts
  _ws.send(JSON.stringify({id:++_msgId,method:'Runtime.enable'}));
  await new Promise(r=>setTimeout(r,2000));

  // Find iframe with __TEST_applyValidatedUpdate or eventOn
  let iframeCtx=null;
  for(const ctx of _collected){
    try{
      const r=await cdpEval('typeof __TEST_applyValidatedUpdate',ctx.id);
      if(r.result?.result?.value==='function'){iframeCtx=ctx.id;break;}
    }catch(e){}
  }
  if(!iframeCtx){
    for(const ctx of _collected){
      try{const r=await cdpEval('typeof eventOn',ctx.id);if(r.result?.result?.value==='function'){iframeCtx=ctx.id;break;}}catch(e){}
    }
  }
  if(!iframeCtx)throw new Error('No iframe context found. Is SillyTavern loaded?');
  console.log('[OK] Iframe context:',iframeCtx);

  // Wait for Mvu + __TEST
  for(let i=0;i<20;i++){
    try{const r=await evalCtx(iframeCtx,'typeof Mvu');if(r==='object')break;}catch(e){}
    await new Promise(r=>setTimeout(r,1000));
  }
  console.log('[OK] Mvu ready');

  // Inject infra
  await evalCtx(iframeCtx,INFRA);
  console.log('[OK] Infra injected');

  // Set snapshot
  await evalCtx(iframeCtx,'window.__L2.snapshot='+TDJ+';true');
  console.log('[OK] Snapshot set');

  const R=[];
  async function run(id,name,fn,warn){try{await evalCtx(iframeCtx,'window.__L2.results=[]');await fn();const rs=JSON.parse(await evalCtx(iframeCtx,'JSON.stringify(window.__L2.results)')||'[]');for(const r of rs)R.push({id,...r,isWarn:warn||r.isWarn});}catch(e){R.push({id,name,pass:false,actual:String(e.message||e).slice(0,200),expected:'no error',isWarn:!!warn});}}

  async function runT(id,name,pairs,check,warn){
    try{
      await evalCtx(iframeCtx,'__L2_restore()');
      const raw=await evalCtx(iframeCtx,'(async()=>JSON.stringify(await __TEST_applyValidatedUpdate('+JSON.stringify(pairs)+')))()');
      check(JSON.parse(raw));
    }catch(e){R.push({id,name,pass:false,actual:String(e.message||e).slice(0,200),expected:'success',isWarn:!!warn});}
  }

  // ═══ Phase 0 ═══
  console.log('\n--- Phase 0: API ---');
  await run('0.1','Mvu exists',async()=>{const v=await evalCtx(iframeCtx,'typeof Mvu');await evalCtx(iframeCtx,"window.__L2_assert('"+v+"','object','Mvu')");});
  await run('0.2','replaceMvuData',async()=>{const v=await evalCtx(iframeCtx,'typeof Mvu.replaceMvuData');await evalCtx(iframeCtx,"window.__L2_assert('"+v+"','function','replaceMvuData')");});
  await run('0.3','__TEST hook',async()=>{const v=await evalCtx(iframeCtx,'typeof __TEST_applyValidatedUpdate');if(v!=='function')throw new Error('is '+v);R.push({id:'0.3',name:'__TEST hook',pass:true,actual:v,expected:'function'});});

  if(R.some(r=>!r.pass)){report(R);cdp.close();process.exit(1);}

  // ═══ Phase 1: Basic R/W ═══
  console.log('\n--- Phase 1: R/W ---');
  await run('1.1','gems write/read',async()=>{await evalCtx(iframeCtx,'__L2_restore()');await evalCtx(iframeCtx,'__L2_writeVar(\"\u7cfb\u7edf.\u7075\u77f3\",999)');const v=await evalCtx(iframeCtx,'__L2_readVar(\"\u7cfb\u7edf.\u7075\u77f3\")');await evalCtx(iframeCtx,'__L2_assert('+v+',999,"gems")');});
  await run('1.2','favor write/read',async()=>{await evalCtx(iframeCtx,'__L2_restore()');await evalCtx(iframeCtx,'__L2_writeVar("NPC.\u767d\u82b7.\u597d\u611f\u5ea6",50)');const v=await evalCtx(iframeCtx,'__L2_readVar("NPC.\u767d\u82b7.\u597d\u611f\u5ea6")');await evalCtx(iframeCtx,'__L2_assert('+v+',50,"favor")');});
  await run('1.3','gonglue write/read',async()=>{await evalCtx(iframeCtx,'__L2_restore()');await evalCtx(iframeCtx,'__L2_writeVar("NPC.\u767d\u82b7.\u597d\u611f\u5ea6",50)');await evalCtx(iframeCtx,'__L2_writeVar("NPC.\u767d\u82b7.\u653b\u7565\u503c",5)');const v=await evalCtx(iframeCtx,'__L2_readVar("NPC.\u767d\u82b7.\u653b\u7565\u503c")');await evalCtx(iframeCtx,'__L2_assert('+v+',5,"gonglue")');});

  // ═══ Phase 2: Range ═══
  console.log('\n--- Phase 2: Range ---');
  await runT('2.1','favor overflow',[['NPC.\u767d\u82b7.\u597d\u611f\u5ea6',150]],r=>{R.push({id:'2.1',name:'favor overflow',pass:r.stat_data.NPC['\u767d\u82b7']['\u597d\u611f\u5ea6']===100,actual:r.stat_data.NPC['\u767d\u82b7']['\u597d\u611f\u5ea6'],expected:100});});
  await runT('2.2','favor negative',[['NPC.\u767d\u82b7.\u597d\u611f\u5ea6',-5]],r=>{R.push({id:'2.2',name:'favor negative',pass:r.stat_data.NPC['\u767d\u82b7']['\u597d\u611f\u5ea6']===0,actual:r.stat_data.NPC['\u767d\u82b7']['\u597d\u611f\u5ea6'],expected:0});});
  await runT('2.3','gems negative',[['\u7cfb\u7edf.\u7075\u77f3',-100]],r=>{R.push({id:'2.3',name:'gems negative',pass:r.stat_data['\u7cfb\u7edf']['\u7075\u77f3']===0,actual:r.stat_data['\u7cfb\u7edf']['\u7075\u77f3'],expected:0});});
  await runT('2.4','gonglue overflow',[['NPC.\u767d\u82b7.\u597d\u611f\u5ea6',50],['NPC.\u767d\u82b7.\u653b\u7565\u503c',105]],r=>{R.push({id:'2.4',name:'gonglue overflow',pass:r.stat_data.NPC['\u767d\u82b7']['\u653b\u7565\u503c']===100,actual:r.stat_data.NPC['\u767d\u82b7']['\u653b\u7565\u503c'],expected:100});});
  await runT('2.5','days floor',[['\u7cfb\u7edf.\u5269\u4f59\u5929\u6570',29.998]],r=>{R.push({id:'2.5',name:'days floor',pass:r.stat_data['\u7cfb\u7edf']['\u5269\u4f59\u5929\u6570']===29,actual:r.stat_data['\u7cfb\u7edf']['\u5269\u4f59\u5929\u6570'],expected:29});});

  // ═══ Phase 3: Game Logic ═══
  console.log('\n--- Phase 3: Logic ---');
  await runT('3.1','favor>=30 keeps gonglue',[['NPC.\u767d\u82b7.\u597d\u611f\u5ea6',30],['NPC.\u767d\u82b7.\u653b\u7565\u503c',5]],r=>{R.push({id:'3.1',name:'favor>=30',pass:r.stat_data.NPC['\u767d\u82b7']['\u653b\u7565\u503c']===5,actual:r.stat_data.NPC['\u767d\u82b7']['\u653b\u7565\u503c'],expected:5});});
  await runT('3.2','favor<30 clears gonglue',[['NPC.\u767d\u82b7.\u597d\u611f\u5ea6',29],['NPC.\u767d\u82b7.\u653b\u7565\u503c',5]],r=>{R.push({id:'3.2',name:'favor<30',pass:r.stat_data.NPC['\u767d\u82b7']['\u653b\u7565\u503c']===0,actual:r.stat_data.NPC['\u767d\u82b7']['\u653b\u7565\u503c'],expected:0});});
  await runT('3.3','sticky trigger',[['NPC.\u767d\u82b7.\u7c98\u6ede\u8ba1\u6570',3],['NPC.\u767d\u82b7.\u597d\u611f\u5ea6',50],['NPC.\u767d\u82b7.\u653b\u7565\u503c',0]],r=>{const g=r.stat_data.NPC['\u767d\u82b7']['\u653b\u7565\u503c'];R.push({id:'3.3',name:'sticky trigger',pass:g>0,actual:g,expected:'g>0'});});
  await runT('3.4','equip threshold',[['NPC.\u767d\u82b7.\u597d\u611f\u5ea6',20],['\u9053\u5177.\u88c5\u5907.\u767d\u82b7',['\u53e3\u585e']]],r=>{const eq=r.stat_data['\u9053\u5177']['\u88c5\u5907']['\u767d\u82b7'];R.push({id:'3.4',name:'equip threshold',pass:eq.length===0||!eq.includes('\u53e3\u585e'),actual:eq,expected:'\u53e3\u585e removed'});});
  await runT('3.5','NPC chain',[['NPC.\u82cf\u82b8.\u653b\u7565\u503c',5]],r=>{R.push({id:'3.5',name:'NPC chain',pass:r.stat_data.NPC['\u82cf\u82b8']['\u653b\u7565\u503c']===0,actual:r.stat_data.NPC['\u82cf\u82b8']['\u653b\u7565\u503c'],expected:0});});

  // ═══ Phase 4: Phase Switch ═══
  console.log('\n--- Phase 4: Switch ---');
  await runT('4.1','Phase 2 trigger',[['\u7cfb\u7edf.\u5269\u4f59\u5929\u6570',0]],r=>{R.push({id:'4.1',name:'Phase 2',pass:r.stat_data['\u7cfb\u7edf']['\u9636\u6bb5']==='\u725d\u5974\u671f'&&r.stat_data['\u7cfb\u7edf']['\u7075\u77f3']===0,actual:{s:r.stat_data['\u7cfb\u7edf']['\u9636\u6bb5'],g:r.stat_data['\u7cfb\u7edf']['\u7075\u77f3']},expected:{s:'\u725d\u5974\u671f',g:0}});});
  await run('4.2','Phase 2 freeze',async()=>{
    // Step 1: restore clean snapshot
    await evalCtx(iframeCtx,'__L2_restore()');
    // Step 2: trigger Phase 2 via __TEST (sets stage=牝奴期, gems=0)
    await evalCtx(iframeCtx,'(async()=>JSON.stringify(await __TEST_applyValidatedUpdate([["系统.剩余天数",0]])))()');
    // Step 3: do NOT restore - MVU now has Phase 2 data
    // Step 4: try to change favorability - should be frozen
    const raw=await evalCtx(iframeCtx,'(async()=>JSON.stringify(await __TEST_applyValidatedUpdate([["NPC.白芷.好感度",99]])))()');
    const r=JSON.parse(raw);
    const v=r.stat_data.NPC['白芷']['好感度'];
    R.push({id:'4.2',name:'Phase 2 freeze',pass:v===0,actual:v,expected:0});
  });

  // ═══ Phase 5: Dirty Data Coercion ═══
  console.log('\n--- Phase 5: Dirty Data ---');
  await run('5.1','null→0',async()=>{await evalCtx(iframeCtx,'__L2_restore()');const raw=await evalCtx(iframeCtx,'(async()=>JSON.stringify(await __TEST_applyValidatedUpdate([["NPC.白芷.好感度",null]])))()');const r=JSON.parse(raw);const v=r.stat_data.NPC['白芷']['好感度'];R.push({id:'5.1',name:'null→0',pass:v===0,actual:v,expected:0});});
  await run('5.2','string→999',async()=>{await evalCtx(iframeCtx,'__L2_restore()');const raw=await evalCtx(iframeCtx,'(async()=>JSON.stringify(await __TEST_applyValidatedUpdate([["系统.灵石","999"]])))()');const r=JSON.parse(raw);const v=r.stat_data['系统']['灵石'];R.push({id:'5.2',name:'string→999',pass:v===999,actual:v,expected:999});});
  await run('5.3','Infinity→100',async()=>{await evalCtx(iframeCtx,'__L2_restore()');const raw=await evalCtx(iframeCtx,'(async()=>JSON.stringify(await __TEST_applyValidatedUpdate([["NPC.白芷.好感度",Infinity]])))()');const r=JSON.parse(raw);const v=r.stat_data.NPC['白芷']['好感度'];R.push({id:'5.3',name:'Infinity→100',pass:v===100,actual:v,expected:100});});

  // Report
  report(R);
  _ws.close();
  process.exit(R.some(r=>!r.pass&&!r.isWarn)?1:0);
}

function report(R){
  console.log('\n'+'='.repeat(60));
  console.log(' L2 CDP Test Report');
  console.log('='.repeat(60));
  for(const r of R){const s=r.isWarn?WARN:(r.pass?PASS:FAIL);const a=typeof r.actual==='object'?JSON.stringify(r.actual):String(r.actual);const e=typeof r.expected==='object'?JSON.stringify(r.expected):String(r.expected);console.log('  '+s+' '+r.id+' '+r.name+'  '+(r.pass?a:'expected: '+e+', got: '+a));}
  const t=R.length,p=R.filter(r=>r.pass).length,f=R.filter(r=>!r.pass&&!r.isWarn).length,w=R.filter(r=>r.isWarn).length;
  console.log('-'.repeat(60));
  console.log('  Total: '+t+' | Passed: '+p+' | Failed: '+f+' | Warned: '+w);
  console.log('='.repeat(60));
  writeFileSync('l2-report.json',JSON.stringify({timestamp:new Date().toISOString(),summary:{total:t,passed:p,failed:f,warned:w},tests:R.map(r=>({id:r.id,name:r.name,status:r.isWarn?'WARN':(r.pass?'PASS':'FAIL'),actual:r.actual,expected:r.expected}))},null,2));
  console.log('[OK] l2-report.json saved');
}

main().catch(e=>{console.error('\n[FATAL]',e.stack||e.message||e);process.exit(2);});
