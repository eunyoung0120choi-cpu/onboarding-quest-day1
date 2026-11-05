
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const ART={"reception": "assets/office-reception.webp", "lounge": "assets/office-lounge.webp", "workspace": "assets/office-workspace.webp"};
const Q=[{id:'lobby',time:'09:00',icon:'🏢',label:'로비 체크인',desc:'사원증을 받고 첫 인사를 나눠요',x:52,y:57,art:'reception',sc:'lobby'},
{id:'team',time:'10:00',icon:'👥',label:'팀 합류',desc:'사무실에서 팀 리더와 버디를 만나요',x:60,y:45,art:'workspace',sc:'office'},
{id:'setup',time:'11:00',icon:'💻',label:'업무환경 세팅',desc:'PC유지보수실에서 기본 도구를 익혀요',x:68,y:62,art:'workspace',sc:'pc'},
{id:'lunch',time:'12:00',icon:'☕',label:'함께하는 점심',desc:'구내식당에서 동료와 친해져요',x:45,y:58,art:'lounge',sc:'canteen'},
{id:'culture',time:'14:00',icon:'⭐',label:'조직문화 체험',desc:'협업 방식과 AI 활용 문화를 알아요',x:28,y:55,art:'lounge',sc:'train'},
{id:'ai',time:'15:00',icon:'🤖',label:'AI와 일하기',desc:'Report Lab과 Meeting Lab 실무 게임에 도전해요',x:52,y:45,art:'workspace',sc:'train'},
{id:'prio',time:'16:00',icon:'📚',label:'업무 우선순위 게임',desc:'방향키로 쏟아지는 업무를 분류해요',x:78,y:52,art:'workspace',sc:'train'},
{id:'finish',time:'17:00',icon:'🚩',label:'첫 출근 완료',desc:'하루를 돌아보고 웰컴 배지를 받아요',x:52,y:57,art:'reception',sc:'lobby2'}];
const KEY='nova_day1_story_v2';const fresh=()=>({skillLab:{},name:'신입사원',look:'blazer',complete:{},choices:{},tasks:{},started:false,history:[],scenarios:{},coachLog:[],games:{report:{prompt:'',generated:false,review:[],done:false,mistakes:0},minutes:{index:0,answers:[],mistakes:0,done:false}}});let S=fresh();try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object')S={...fresh(),...saved}}catch(e){}S.games={report:{...fresh().games.report,...(S.games?.report||{})},minutes:{...fresh().games.minutes,...(S.games?.minutes||{})}};if(!Array.isArray(S.games.report.review))S.games.report.review=[];if(!Array.isArray(S.games.minutes.answers))S.games.minutes.answers=[];let currentStory=null,step=0,walkTimer=null,toastTimer=null,sound=false,keyboard={};let player={x:44,y:78};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const count=()=>Q.filter(q=>S.complete[q.id]).length;const next=()=>Q.find(q=>!S.complete[q.id])||Q[Q.length-1];
const htmlEscape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function avatarSVG(look){const hair=look==='short'?'#34354c':look==='chestnut'?'#9b6546':'#4c3945';const suit=look==='short'?'#8594c1':look==='chestnut'?'#e8ae9c':'#f3f1ff';const neck=look==='short'?'#e6b49c':'#f7cfba';return `<svg viewBox="0 0 94 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="hair" x2="1" y2="1"><stop stop-color="${hair}"/><stop offset="1" stop-color="#201a2e"/></linearGradient><linearGradient id="face" x2=".7" y2="1"><stop stop-color="#ffe5d2"/><stop offset="1" stop-color="${neck}"/></linearGradient><linearGradient id="shirt" x2=".9" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="${suit}"/></linearGradient></defs><ellipse cx="46" cy="125" rx="24" ry="5" fill="#1c2a4d44"/><rect x="28" y="102" width="14" height="22" rx="6" fill="#58637f"/><rect x="51" y="102" width="14" height="22" rx="6" fill="#58637f"/><rect x="26" y="119" width="19" height="8" rx="4" fill="#48455c"/><rect x="50" y="119" width="19" height="8" rx="4" fill="#48455c"/><rect x="19" y="64" width="54" height="46" rx="18" fill="url(#shirt)" stroke="#8d8cab5e"/><path d="M27 69L44 91 61 69" fill="none" stroke="#ccbfe7" stroke-width="3"/><path d="M44 91v17" stroke="#c0b7dd" stroke-width="2"/><rect x="17" y="72" width="12" height="31" rx="6" fill="url(#face)" transform="rotate(7 23 80)"/><rect x="65" y="72" width="12" height="31" rx="6" fill="url(#face)" transform="rotate(-7 65 80)"/><ellipse cx="47" cy="41" rx="31" ry="35" fill="url(#hair)"/><ellipse cx="47" cy="46" rx="27" ry="29" fill="url(#face)"/><path d="M20 42Q16 10 41 10Q73 4 74 37Q59 30 53 20Q45 34 20 42" fill="url(#hair)"/><path d="M18 45Q14 69 23 80L29 75 26 48Z" fill="${hair}"/><ellipse cx="36" cy="49" rx="3.5" ry="4.5" fill="#42394a"/><ellipse cx="57" cy="49" rx="3.5" ry="4.5" fill="#42394a"/><circle cx="37" cy="47.5" r="1.1" fill="#fff"/><circle cx="58" cy="47.5" r="1.1" fill="#fff"/><path d="M42 63Q47 67 53 62" stroke="#bb737c" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="28" cy="57" rx="7" ry="3" fill="#f2a3a080"/><ellipse cx="66" cy="57" rx="7" ry="3" fill="#f2a3a080"/></svg>`}
function renderAvatar(){ $('avatar').classList.add('player3d'); $('avatar').innerHTML=`<img src="${PLAYER}" alt="플레이어" draggable="false">`; $('miniAvatar').classList.add('playerThumb'); $('miniAvatar').innerHTML=`<img src="${PLAYER}" alt="플레이어">`; }
function render(){const n=count(),q=next();$('headerProgress').textContent=n+' / '+Q.length+' 완료';$('countNav').textContent=n+'/'+Q.length;$('percentSide').textContent=Math.round(n/Q.length*100)+'%';$('progressSide').style.width=(n/Q.length*100)+'%';$('clock').textContent=q.time;$('sceneName').textContent=q.label;$('nextTitle').textContent=n===Q.length?'🏅 DAY 1, 성공적으로 마쳤어요!':`✦ 다음 여정 · ${q.label}`;$('nextDesc').textContent=n===Q.length?'오늘의 기록을 돌아보고 나만의 첫 출근 배지를 확인해 보세요.':q.desc;$('nextBtn').textContent=n===Q.length?'내 첫날 기록 보기 →':'이 장소로 이동하기 →';$('stageStatus').textContent=n===Q.length?'🏅 8개 미션 완료!':`✦ 진행률 ${Math.round(n/Q.length*100)}%`;
 $('journey').innerHTML=Q.map(p=>`<button data-go="${p.id}" class="${S.complete[p.id]?'done':''} ${q.id===p.id?'current':''}"><span class="journeyIcon">${S.complete[p.id]?'✅':p.icon}</span><span class="journeyInfo"><span>${p.time}</span><strong>${p.label}</strong></span><span class="chev">›</span></button>`).join('');renderSpots();renderChips();document.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>goto(Q.find(q=>q.id===el.dataset.go))));renderAvatar();}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2700)}
function playSound(){if(!sound)return;try{let a=new (window.AudioContext||window.webkitAudioContext)();[523,659,784].forEach((f,i)=>{const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.type='sine';o.frequency.value=f;let t=a.currentTime+i*.1;g.gain.setValueAtTime(.00001,t);g.gain.exponentialRampToValueAtTime(.07,t+.03);g.gain.exponentialRampToValueAtTime(.00001,t+.27);o.start(t);o.stop(t+.3)});setTimeout(()=>a.close(),850)}catch(e){}}
function moveTo(x,y,callback){[x,y]=groundPoint(x,y);$('avatar').classList.add('walking');$('avatar').style.left=x+'%';$('avatar').style.top=y+'%';player={x,y};clearTimeout(walkTimer);walkTimer=setTimeout(()=>{$('avatar').classList.remove('walking');walkTimer=null;callback?.()},690)}
function modal({title,label='DAY 1 · ONBOARDING',html='',art='reception',actions=[]}){document.querySelector('.modal').classList.remove('labMode','guideMode');$('modalLabel').textContent=label;$('modalTitle').textContent=title;$('modalArt').style.backgroundImage=`linear-gradient(180deg,#ffffff16,#ffffff36),url('${ART[art]}')`;$('modalContent').innerHTML=html;$('modalButtons').innerHTML='';actions.forEach(a=>{let b=document.createElement('button');b.className=a.secondary?'secondary':'primary';b.textContent=a.text;b.disabled=a.disabled||false;b.addEventListener('click',a.fn);$('modalButtons').appendChild(b)});$('overlay').classList.add('open');document.body.classList.add('modalOpen')}
function closeModal(){stopPrio();$('overlay').classList.remove('open');document.body.classList.remove('modalOpen');currentStory=null;step=0;$('stage').focus()}
const speech=(who,face,txt)=>{const actor=who.includes('지훈')?'jihoon':who.includes('유나')?'yuna':who.includes('민준')?'minjun':who.includes('나리')?'nari':who.includes('하준')?'hajun':who.includes('서윤')?'seo':who.includes(S.name)?'player':null;const src=actor==='seo'?SEO:actor==='player'?PLAYER:actor?CHARACTERS[actor]:null;const portrait=src?`<img src="${src}" alt="${who}" loading="lazy">`:face;return `<div class="speaker"><div class="speakerPortrait">${portrait}</div><div><strong>${who}</strong><span>${txt}</span></div></div>`};
const p=t=>`<p class="copy">${t}</p>`;
function choiceView({title,art,who,face,role,copy,choices,back,select}){modal({title,label:'DAY 1 · CHOOSE YOUR RESPONSE',art,html:speech(who,face,role)+p(copy)+`<div class="choices">${choices.map((x,i)=>`<button class="choice" data-choice="${i}"><span>${x.icon||'✦'}</span>${x.text}<span class="pick">›</span></button>`).join('')}</div>`,actions:[{text:'나중에 할게요',secondary:true,fn:closeModal}]});document.querySelectorAll('[data-choice]').forEach(el=>el.addEventListener('click',()=>select(Number(el.dataset.choice))))}
function finish(q){S.complete[q.id]=true;save();playSound();render();closeModal();toast(`🎉 ${q.label} 완료! (${count()}/${Q.length})`);if(cur<SCN.length-1&&sceneDone(cur))setTimeout(()=>toast('🚪 문이 열렸어요! 다음 장소의 문을 클릭하거나 E 키를 눌러요'),2800);if(count()===Q.length){confetti();setTimeout(showBadge,600)}}
function story(q){currentStory=q.id;step=0;openQuest(q)}
function openQuest(q){if(!q)return;if(S.complete[q.id]&&q.id!=='ai'){modal({title:`${q.icon} ${q.label}`,label:'ALREADY COMPLETED',art:q.art,html:p('이미 완료한 미션이에요. 언제든 이 공간을 다시 탐험할 수 있어요.'),actions:[{text:'계속 둘러보기',fn:closeModal}]});return}if(q.id==='finish'&&count()<Q.length-1){modal({title:'오늘의 여정을 조금 더 걸어볼까요?',art:'reception',html:p(`퇴근 전에 남은 미션을 마무리해 봐요. 현재 <b>${count()} / ${Q.length}</b>개 완료했어요.`),actions:[{text:'남은 미션으로',fn:()=>{closeModal();goto(next())}}]});return}currentStory=q.id;const intro={lobby:()=>{choiceView({title:'어서 오세요, 오늘부터 동료예요!',art:'reception',who:'서윤 · People팀',face:'👩🏻‍💼',role:'첫 출근을 안내하는 HR 담당자',copy:`“${htmlEscape(S.name)}님, NOVA LAB에 오신 걸 환영해요! 첫날이라 기분이 어떠세요?”`,choices:[{icon:'🌤',text:'설레요! 새로운 시작이 기대돼요.'},{icon:'🌧',text:'솔직히 조금 긴장돼요.'},{icon:'✨',text:'궁금한 게 정말 많아요.'}],select:i=>{S.choices.feeling=['설렘','긴장','호기심'][i];save();modal({title:'처음인 오늘을 함께할게요',art:'reception',html:speech('서윤 · People팀','👩🏻‍💼','함께하는 첫 출근')+p([`“그 기대감 오래 간직하면 좋겠어요. 오늘은 작은 발견을 하나씩 모아봐요!”`,`“긴장되는 게 자연스러워요. 모르는 건 언제든 질문해 주세요. 오늘은 혼자 하는 날이 아니에요.”`,`“궁금한 게 많은 동료는 늘 반가워요! 오늘은 마음껏 살펴보고 질문해 보세요.”`][i])+`<div class="taskRow">🪪 사원증 수령 <span>대기 중</span></div>`,actions:[{text:'사원증 받고 체크인하기 →',fn:()=>{modal({title:'입사 첫날, 체크인 완료!',art:'reception',html:speech('서윤 · People팀','👩🏻‍💼','사원증 발급 완료')+p('사원증을 받았어요. 이제 팀 동료들을 만나러 가 볼까요?')+`<div class="diary">🪪 <b>${htmlEscape(S.name)}</b> 님의 NOVA LAB 사원증<br>신입 동료 · DAY 1 입장 완료</div>`,actions:[{text:'체크인 완료',fn:()=>finish(q)}]})}}]})}})},
team:()=>choiceView({title:'팀원들과 첫 인사를 나눠봐요',art:'workspace',who:'지훈 · 팀 리더',face:'👨🏻‍💻',role:'팀 리더 · 협업을 중요하게 생각해요',copy:'“우리 팀에서는 직급보다 아이디어를 먼저 듣고, 완성보다 함께 시도하는 걸 중요하게 생각해요. 어떤 방식으로 인사를 시작해 볼까요?”',choices:[{icon:'👋',text:'먼저 웃으며 자기소개를 한다.'},{icon:'❓',text:'요즘 팀이 고민하는 업무를 질문한다.'},{icon:'🤝',text:'도움이 필요한 일이 있는지 물어본다.'}],select:i=>{S.choices.intro=['먼저 인사','업무에 관심','도움 제안'][i];save();modal({title:'함께 일할 동료를 소개할게요',art:'workspace',html:speech('유나 · 버디','👩🏻','신입사원을 돕는 첫 번째 동료')+p(['“이렇게 먼저 인사해 주니 저도 반갑네요! 어려운 건 언제든 제게 물어보세요.”','“저희는 요즘 팀의 AI 활용 방식을 실험하고 있어요. 함께 이야기해요!”','“정말 고마워요! 우선은 회사에 적응하는 데 집중해도 괜찮아요.”'][i])+`<div class="diary">💡 팀의 세 가지 약속<br>① 질문은 언제든 환영해요<br>② 작은 아이디어부터 실험해요<br>③ 배운 것은 함께 공유해요</div>`,actions:[{text:'동료들과 인사 완료',fn:()=>finish(q)}]})}}),
setup:()=>setupStage(q),lunch:()=>choiceView({title:'점심시간, 버디와 이야기하기',art:'lounge',who:'유나 · 버디',face:'👩🏻',role:'점심시간을 함께하는 동료',copy:'“처음 출근한 날엔 점심이 제일 어색하죠. 오늘은 같이 먹어요! 무엇이 가장 궁금하세요?”',choices:[{icon:'🍜',text:'회사 식당과 주변 맛집을 알려주세요.'},{icon:'💬',text:'팀원들은 보통 어떻게 소통해요?'},{icon:'☕',text:'쉬는 시간엔 어디서 커피를 마셔요?'}],select:i=>{S.choices.lunch=['식당','소통','휴식'][i];save();modal({title:'점심시간의 작은 대화',art:'lounge',html:speech('유나 · 버디','👩🏻','동료의 이야기')+p(['“회사 식당은 2층이에요. 메뉴가 다양해서 매일 고르는 재미가 있답니다.”','“업무 이야기는 문서와 채팅으로 공유하고, 긴급한 건 직접 이야기해요. 질문도 편하게 해주세요.”','“로비 옆 라운지가 인기예요! 커피 한 잔하면서 생각을 정리하곤 해요.”'][i])+p('처음엔 작은 대화 하나가 동료와 친해지는 시작이 될 수 있어요.'),actions:[{text:'즐거운 점심 마치기',fn:()=>finish(q)}]})}}),
culture:()=>cultureStage(q),ai:()=>showAiGameHub(q),prio:()=>prioGame(q),finish:()=>finishStage(q)};intro[q.id]?.()}
function setupStage(q){
 const rows=[
  {key:'협업 메신저 접속',icon:'💬',guide:'messenger',title:'협업 메신저 다운로드 및 로그인'},
  {key:'업무 캘린더 확인',icon:'🗓️',guide:'m365',title:'업무 캘린더 / M365 설치'},
  {key:'보안 가이드 확인',icon:'🔒',guide:'network',title:'보안 가이드 및 사내망 설정'}
 ];
 S.tasks.setup=S.tasks.setup||{};
 const done=rows.filter(r=>S.tasks.setup[r.key]).length;
 modal({title:'나의 첫 업무환경을 준비해요',label:'DAY 1 · WORKSPACE SETUP',art:'workspace',
 html:speech('민준 · IT팀','👨🏻‍💻','업무환경 안내')+
 p('각 항목에서 관련 가이드를 열어볼 수 있어요. 현재 가이드는 준비 중이며, 실제 설치 없이 데모로 진행할 수 있어요.')+
 `<div class="guide-setup-list">${rows.map((r,i)=>`<div class="guide-setup-row ${S.tasks.setup[r.key]?'checked':''}"><div class="guide-ico">${r.icon}</div><div class="guide-setup-info"><strong>${r.title}</strong><small>${S.tasks.setup[r.key]?'✓ 데모 확인 완료':'연결된 가이드 · '+r.title}</small></div><button data-task-guide="${i}">${S.tasks.setup[r.key]?'다시 보기':'가이드 열기'}</button></div>`).join('')}</div>`+
 `<p class="smallNote">${done} / 3개 데모 체크 완료 · 가이드 본문은 추후 등록 예정입니다.</p>`,
 actions:[{text:'나중에 하기',secondary:true,fn:closeModal},{text:'설정 완료',disabled:done<3,fn:()=>finish(q)}]});
 document.querySelectorAll('[data-task-guide]').forEach(el=>el.addEventListener('click',()=>{
  const row=rows[Number(el.dataset.taskGuide)];openGuidePlaceholder(row.guide,{source:'setup',key:row.key,q});
 }));
}
function cultureStage(q){choiceView({title:'AI를 활용하는 우리 팀의 방식',art:'workspace',who:'지훈 · 팀 리더',face:'👨🏻‍💻',role:'새로운 아이디어를 함께 실험해요',copy:'“반복 업무를 줄일 수 있는 AI 아이디어가 생겼어요. 팀에 어떻게 제안할까요?”',choices:[{icon:'💭',text:'혼자 완벽하게 만든 뒤 공유한다.'},{icon:'🤝',text:'동료와 작은 시안을 공유하고 함께 검토한다.'},{icon:'⌛',text:'문제가 생길 수 있으니 시도하지 않는다.'}],select:i=>{S.choices.culture=i;save();const feedback=i===1?'“함께 초안을 실험하는 방식이 우리 팀 문화와 잘 맞아요.”':'“좋은 고민이에요. 우리 팀에서는 완성보다 안전한 작은 실험과 공유를 중요하게 생각해요.”';modal({title:'새로운 시도에는 원칙도 필요해요',art:'workspace',html:speech('지훈 · 팀 리더','👨🏻‍💻','피드백')+p(feedback)+p('“그런데 AI 도구에 회사 내부 자료를 넣어야 한다면 어떻게 할까요?”')+`<div class="choices"><button class="choice" data-security="0">⚡ 빠르게 결과를 보려고 그대로 입력한다.</button><button class="choice" data-security="1">🔒 보안 규정을 확인하고 승인된 도구를 사용한다.</button></div><p class="smallNote" id="securityHelp">한 가지를 선택해 보세요.</p>`,actions:[{text:'뒤로',secondary:true,fn:()=>cultureStage(q)}]});document.querySelectorAll('[data-security]').forEach(b=>b.addEventListener('click',()=>{const selected=+b.dataset.security;if(selected===0){$('securityHelp').textContent='회사 데이터는 먼저 보안 규정을 확인해야 해요. 다른 답을 선택해 보세요.';return}S.choices.security='보안 우선';save();modal({title:'우리 팀의 일하는 방식, 이해 완료!',art:'workspace',html:speech('지훈 · 팀 리더','👨🏻‍💻','EXPERIMENT · SHARE · RESPECT')+p('우리는 새로운 기술을 호기심 있게 배우고, 작은 실험을 공유하며, 회사 정보는 책임감 있게 다뤄요.')+`<div class="diary">✨ 오늘 기억할 문화<br>실험은 작게, 배움은 함께, 정보는 안전하게.</div>`,actions:[{text:'조직문화 미션 완료',fn:()=>finish(q)}]})}))}})}
function finishStage(q){choiceView({title:'어느새 퇴근 시간이에요',art:'lounge',who:'서윤 · People팀',face:'👩🏻‍💼',role:'첫날 회고',copy:`“${htmlEscape(S.name)}님, 오늘 하루 어땠나요? 오늘의 기분을 한 단어로 남겨볼까요?”`,choices:[{icon:'🌟',text:'새로운 시작이 설레요.'},{icon:'🌿',text:'긴장은 되지만 조금 편해졌어요.'},{icon:'🚀',text:'내일부터는 더 적극적으로 해보고 싶어요.'}],select:i=>{S.choices.end=['설렘','안도','기대'][i];save();modal({title:'첫 출근의 작은 성장을 축하해요',art:'lounge',html:speech('서윤 · People팀','👩🏻‍💼','오늘의 여정 마무리')+p('처음에는 모든 게 낯설지만 오늘 만든 작은 연결들이 내일의 자신감이 될 거예요.')+`<div class="diary">📝 나의 첫 출근 기록<br>시작의 기분: ${htmlEscape(S.choices.feeling||'새로운 시작')}<br>팀과의 첫 연결: ${htmlEscape(S.choices.intro||'동료를 만남')}<br>점심시간의 관심사: ${htmlEscape(S.choices.lunch||'회사생활')}<br>퇴근길의 기분: ${htmlEscape(S.choices.end)}</div>`,actions:[{text:'첫 출근 완료하고 배지 받기',fn:()=>finish(q)}]})}})}

const AI=[{t:'첫 보고서, 어떻게 요청할까요?',c:'“지난달 고객 문의를 정리한 보고서 초안이 내일 오전까지 필요해요. AI에게 어떻게 요청할래요?”',o:[['“보고서 써줘”라고 요청한다','막연하면 AI도 추측으로 써요. 목적·분량·형식을 알려주면 훨씬 쓸 만해져요.',0],['팀장 보고용·1페이지·요약-원인-제안 순서로 부탁하고, 고객 실명은 뺀다','목적·형식·보안까지 챙긴 요청이에요. 결과를 바로 다듬을 수 있어요.',1],['고객 명단 파일을 통째로 붙여 넣는다','고객 개인정보는 승인된 도구 밖에 넣으면 안 돼요. 필요한 내용만 익명화해 쓰세요.',0]]},
{t:'회의록 정리, 공유 전에는?',c:'“AI가 회의 메모를 요약해 줬어요. 팀에 공유하기 전에 뭘 할까요?”',o:[['그대로 팀에 공유한다','AI는 담당자나 기한을 틀리게 적기도 해요. 공유 전 확인이 필요해요.',0],['결정사항·담당자·기한을 원본 메모와 대조해 고친 뒤 공유한다','가장 좋은 습관이에요. AI는 초안, 책임은 내가 져요.',1],['못 믿겠으니 처음부터 직접 쓴다','초안은 AI에게 맡기고 검증만 해도 시간이 크게 줄어요.',0]]}];
const PROMPT='역할: 신입 팀원\n목적: [누구에게 무엇을 보고하는지]\n분량·형식: [예: 1페이지, 요약-원인-제안]\n참고 내용: [개인정보를 뺀 핵심 내용]\n요청: 위 조건으로 초안을 써줘. 모호한 부분은 먼저 질문해줘.';
function aiStage(q,i=0){if(!S.games.report.done||!S.games.minutes.done){showAiGameHub(q);return}if(i>=AI.length){modal({title:'AI와 일하는 3가지 습관',label:'DAY 1 · AI AT WORK',art:'workspace',html:speech('나리 · AI 코치','👩🏻‍💻','AI는 도구, 책임은 사람')+`<div class="diary">① 맥락 주기: 목적·분량·형식을 알려줘요<br>② 검증하기: AI의 결과는 초안으로 봐요<br>③ 정보 지키기: 승인된 도구에 개인정보는 빼요</div><p class="copy">바로 써먹을 프롬프트 틀이에요.</p><div class="diary"><pre>${htmlEscape(PROMPT)}</pre></div>`,actions:[{text:'프롬프트 틀 복사',secondary:true,fn:()=>navigator.clipboard?.writeText(PROMPT).then(()=>toast('복사했어요!')).catch(()=>toast('복사를 지원하지 않는 환경이에요.'))},{text:'AI 미션 완료',fn:()=>finish(q)}]});return}
const s=AI[i];choiceView({title:s.t,art:'workspace',who:'나리 · AI 코치',face:'👩🏻‍💻',role:`AI와 일하기 · ${i+1}/${AI.length}`,copy:s.c,choices:s.o.map(x=>({icon:'💬',text:x[0]})),select:j=>{const x=s.o[j];modal({title:x[2]?'좋은 선택이에요!':'조금 아쉬워요',art:'workspace',html:p(x[1]),actions:[{text:x[2]?'다음 →':'다시 고르기',fn:()=>aiStage(q,x[2]?i+1:i)}]})}})}

/* AI Learning Studio: restored v5 mini-games, integrated into the eight-quest v11 journey. */
const LAB_SOURCE=[['교육 운영 차수','12회'],['교육 참여 인원','84명'],['교육 만족도','4.6 / 5.0'],['이전 만족도','4.3 / 5.0']];
const LAB_REPORT_LINES=['교육은 총 12회 운영했다.','교육 참여자는 총 94명이었다.','교육 만족도는 4.9점으로 집계됐다.','이전 만족도는 4.3점이었다.'];
const LAB_MEETING=[
 {who:'서윤',text:'신입사원 온보딩 안내문은 B안으로 확정하겠습니다.',kind:1,why:'팀이 선택한 안을 확정한 발언이므로 결정사항이에요.'},
 {who:'지훈',text:'민준님, 목요일까지 업무용 계정 점검 결과를 공유해 주세요.',kind:2,why:'담당자와 마감일이 지정된 실행 과제예요.'},
 {who:'유나',text:'참고로 지난 교육 만족도는 4.6점이었습니다.',kind:3,why:'상황을 이해하기 위한 배경 정보이며 새로운 과제는 아니에요.'},
 {who:'하린',text:'AI 활용 가이드 초안은 제가 금요일 오전까지 작성하겠습니다.',kind:2,why:'작성 담당자와 기한이 있는 실행 과제예요.'},
 {who:'서윤',text:'웰컴키트는 다음 달부터 새 디자인으로 적용합시다.',kind:1,why:'실행 방향을 확정하는 의사결정이에요.'},
 {who:'지훈',text:'오늘 교육장 창가 풍경이 참 좋네요.',kind:3,why:'업무 결정이나 실행 과제가 아닌 잡담·참고 발언이에요.'}
];
const LAB_SAMPLE='목적: 팀장에게 교육 현황 보고. 자료: 제공된 가상 교육 데이터(12회, 84명, 만족도 4.6점, 이전 4.3점)만 사용. 형식: 핵심 성과 3가지와 개선 제안 1가지. 확인되지 않은 수치나 사실은 만들지 말 것.';
let activeLab=null,labPick=1,labFeedback='',labQuest=null;
function labDialog({title,label='CHAPTER 05 · AI LEARNING STUDIO',html='',actions=[]}){modal({title,label,html,art:'workspace',actions});document.querySelector('.modal').classList.add('labMode')}
function labFeedbackHTML(){return labFeedback?`<div role="status" class="labFeedback ${labFeedback.startsWith('✓')?'good':''}">${htmlEscape(labFeedback)}</div>`:''}
function labProgress(cur,total){return `<div class="labStep"><span>MISSION PROGRESS</span><strong>${cur} / ${total}</strong></div><div class="labProgress"><i style="width:${cur/total*100}%"></i></div>`}
function labStatus(done){return `<span class="labStatus ${done?'done':''}">${done?'✓ CLEAR':'● 도전 가능'}</span>`}
function showAiGameHub(q=Q.find(t=>t.id==='ai')){
 labQuest=q;activeLab=null;labFeedback='';
 const rg=S.games.report.done,mg=S.games.minutes.done;
 const html=`<div class="labIntro"><span class="star">✦</span><div><b>15:00 · 사내 교육장</b><span>AI를 업무에 활용할 때는 정확한 요청과 결과 검토가 중요해요. 두 가지 실무 상황을 직접 해결해 보세요.</span></div></div>`+
 `<div class="labCards"><button type="button" id="launchReport" class="labCard"><span class="labNo">02 / REPORT LAB</span><span class="labVisual">📊</span><strong>첫 보고서, 3시간이 30분으로</strong><small>가상 데이터를 보고 프롬프트를 만들고, AI 초안의 수치 오류를 찾아요.</small>${labStatus(rg)}</button>`+
 `<button type="button" id="launchMeeting" class="labCard"><span class="labNo">03 / MEETING LAB</span><span class="labVisual">📝</span><strong>회의록 정리 마스터</strong><small>회의 발언 6개를 결정사항·실행 과제·참고사항으로 구분해요.</small>${labStatus(mg)}</button></div>`+
 (rg&&mg?`<div class="labFeedback good">✓ 두 게임을 모두 완료했어요! ${S.complete.ai?'이수 완료 상태입니다.':'AI 활용 원칙을 확인해 교육을 마무리해요.'}</div>`:'')+
 `<p class="labNote">※ NOVA LAB의 교육 수치와 회의 발언은 모두 가상입니다. 실제 회사 자료나 개인정보를 입력하지 마세요. 보고서 초안은 실습용으로 미리 준비된 예시입니다.</p>`;
 const actions=rg&&mg?(S.complete.ai?[{text:'교육장으로 돌아가기',fn:closeModal}]:[{text:'AI 활용 원칙 확인하고 교육 완료 →',fn:()=>aiStage(q,0)},{text:'교육장으로 돌아가기',secondary:true,fn:closeModal}]):[{text:'교육장으로 돌아가기',fn:closeModal},{text:'AI 활용 가이드',secondary:true,fn:()=>companyGuide('gloss')}];
 labDialog({title:'우리 회사는 이렇게 일해요!',html,actions});
 $('launchReport').addEventListener('click',()=>showReportLab(q));
 $('launchMeeting').addEventListener('click',()=>showMeetingLab(q));
}
function showReportLab(q=labQuest){
 labQuest=q;activeLab='report';const g=S.games.report;
 if(g.done){labDialog({title:'GAME 02 · 보고서 검토 완료',label:'REPORT LAB · CLEAR',html:`<div class="labFinish">📄</div><div class="labFeedback good">✓ AI 초안의 수치 오류 2개를 찾아 수정했어요.<br>참여 인원 94명 → 84명 / 만족도 4.9점 → 4.6점</div><p class="copy">AI가 작성한 보고서는 출처와 사실을 반드시 확인한 뒤 제출해야 해요.</p>`,actions:[{text:'회의록 게임으로 →',fn:()=>showMeetingLab(q)},{text:'게임 선택 화면',secondary:true,fn:()=>showAiGameHub(q)}]});return}
 const gen=g.generated;
 const html=labProgress(gen?1:0,2)+`<div class="labGrid"><div class="labSource"><h4>📂 제공 자료 · 가상 데이터</h4>${LAB_SOURCE.map(([k,v])=>`<div class="labDataRow"><span>${htmlEscape(k)}</span><b>${htmlEscape(v)}</b></div>`).join('')}<p class="smallNote">확인된 원자료만 사용하세요.</p></div>`+
 `<div class="labEditor"><label for="labReportPrompt">AI에게 전달할 프롬프트를 작성해 보세요</label><textarea id="labReportPrompt" maxlength="1800" spellcheck="false" placeholder="목적, 제공 데이터, 보고서 형식, 검증 조건을 작성해 보세요…">${htmlEscape(g.prompt)}</textarea><div class="labEditorFoot"><button type="button" class="labMiniBtn" id="labSample">✦ 좋은 프롬프트 예시</button><span class="smallNote">Ctrl + Enter 실행 · 40자 이상</span></div></div></div>`+
 (gen?`<div class="labGenerated"><h4>✦ AI DRAFT · 실습용 보고서 초안</h4><p class="smallNote">다음 4개 문장 중 원자료와 일치하지 않는 문장 2개를 선택하세요.</p>${LAB_REPORT_LINES.map((line,i)=>`<button type="button" class="labSelect ${g.review.includes(i)?'marked':''}" data-review="${i}" aria-pressed="${g.review.includes(i)}"><span>${g.review.includes(i)?'☑':'□'}</span> ${htmlEscape(line)}</button>`).join('')}</div>`:'')+labFeedbackHTML();
 labDialog({title:'GAME 02 · 첫 보고서, 3시간이 30분으로',label:'REPORT LAB · 프롬프트 + 수치 검증',html,actions:[{text:gen?'선택한 2개 오류 검토 →':'프롬프트 제출 · 초안 생성 →',fn:submitReportLab},{text:'게임 선택으로',secondary:true,fn:()=>showAiGameHub(q)}]});
 $('labReportPrompt').addEventListener('input',e=>{g.prompt=e.target.value.slice(0,1800);save()});
 $('labSample').addEventListener('click',()=>{g.prompt=LAB_SAMPLE;labFeedback='✓ 목적·자료·형식·검증 조건을 포함한 예시예요.';save();showReportLab(q)});
 document.querySelectorAll('[data-review]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.review);g.review=g.review.includes(i)?g.review.filter(x=>x!==i):[...g.review,i];labFeedback='';save();showReportLab(q)}));
}
function submitReportLab(){
 const g=S.games.report;const field=$('labReportPrompt');if(field)g.prompt=field.value.slice(0,1800);
 if(!g.generated){if(g.prompt.trim().length<40){labFeedback='목적, 제공 데이터, 원하는 형식을 포함해서 프롬프트를 40자 이상 작성해 보세요.';save();showReportLab();return}g.generated=true;labFeedback='✓ 실습용 AI 초안이 준비됐어요. 원자료와 비교해 수치 오류 2개를 찾아보세요.';save();showReportLab();return}
 const check=[...g.review].sort((a,b)=>a-b);
 if(check.length!==2||check[0]!==1||check[1]!==2){g.mistakes=(g.mistakes||0)+1;labFeedback='아직 검토가 필요해요. 원자료의 참여 인원 84명과 만족도 4.6점을 다시 대조해 보세요.';save();showReportLab();return}
 g.done=true;save();activeLab=null;labFeedback='';
 labDialog({title:'GAME 02 · 보고서 검토 성공!',label:'REPORT LAB · CLEAR',html:`<div class="labFinish">📈</div><div class="labFeedback good">✓ 수치 오류 2개를 정확히 발견했어요!</div><div class="labMinutes"><h3>검증 완료 · 교육 운영 보고서</h3><p>교육 운영: 12회 / 교육 참여자: 84명 / 만족도: 4.6점 / 이전 만족도: 4.3점</p><h4>수정한 오류</h4><p>참여 인원: 94명 → 84명<br>교육 만족도: 4.9점 → 4.6점</p><h4>오늘의 원칙</h4><p>AI는 초안을 돕지만, 원자료 확인과 제출 책임은 사람이 져요.</p></div>`,actions:[{text:'회의록 게임으로 →',fn:()=>showMeetingLab()},{text:'게임 선택 화면',secondary:true,fn:showAiGameHub}]});
}
function showMeetingLab(q=labQuest){
 labQuest=q;activeLab='meeting';const g=S.games.minutes;
 if(g.done){return showMeetingSummary(q)}
 const line=LAB_MEETING[g.index];if(!line){g.done=true;save();return showMeetingSummary(q)}
 const html=labProgress(g.index,LAB_MEETING.length)+`<div class="labTranscript"><div class="byline">● MEETING TRANSCRIPT / ${String(g.index+1).padStart(2,'0')} · ${htmlEscape(line.who)} · 14:${String(10+g.index*4).padStart(2,'0')}</div><blockquote>“${htmlEscape(line.text)}”</blockquote></div><p class="copy" style="margin-bottom:6px">이 발언을 어떻게 분류해야 할까요?</p>`+
 `<div class="labChoices">${[['결정사항','방향이나 안을 확정'],['실행 과제','담당자·기한이 있는 할 일'],['참고사항','맥락·정보·잡담']].map(([label,desc],i)=>`<button type="button" class="labChoice ${labPick===i+1?'chosen':''}" data-kind="${i+1}" aria-pressed="${labPick===i+1}"><span class="labDigit">${i+1}</span><span><strong>${label}</strong><small>${desc}</small></span></button>`).join('')}</div>`+labFeedbackHTML()+`<p class="labKeyboard"><kbd>↑</kbd> <kbd>↓</kbd> 선택 이동 · <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> 바로 선택 · <kbd>Enter</kbd> 확정</p>`;
 labDialog({title:'GAME 03 · 회의록 정리 마스터',label:'MEETING LAB · 발언 분류',html,actions:[{text:g.index===LAB_MEETING.length-1?'마지막 발언 분류하기 →':'이 발언 분류하기 →',fn:submitMeetingLab},{text:'게임 선택으로',secondary:true,fn:()=>showAiGameHub(q)}]});
 document.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>selectMeetingKind(Number(b.dataset.kind))));
}
function selectMeetingKind(k){labPick=k;document.querySelectorAll('[data-kind]').forEach(b=>{const chosen=Number(b.dataset.kind)===k;b.classList.toggle('chosen',chosen);b.setAttribute('aria-pressed',String(chosen))})}
function submitMeetingLab(){
 const g=S.games.minutes,line=LAB_MEETING[g.index];if(!line)return;
 if(labPick!==line.kind){g.mistakes=(g.mistakes||0)+1;labFeedback='다시 생각해 보세요! '+line.why;save();showMeetingLab();return}
 g.answers.push(line.kind);g.index++;labPick=1;labFeedback='✓ 정확해요! '+line.why;
 if(g.index>=LAB_MEETING.length){g.done=true;save();activeLab=null;labFeedback='';return showMeetingSummary()}
 save();showMeetingLab();
}
function showMeetingSummary(q=labQuest){activeLab=null;const g=S.games.minutes;
 const html=`<div class="labFinish">🗒️</div><div class="labMinutes"><h3>온보딩 개선 회의록</h3><h4>결정사항</h4><p>• 온보딩 안내문 B안 확정<br>• 웰컴키트 새 디자인 다음 달부터 적용</p><h4>실행 과제</h4><p>• 민준: 업무용 계정 점검 결과 공유 (목요일)<br>• 하린: AI 활용 가이드 초안 작성 (금요일 오전)</p><h4>참고사항</h4><p>• 이전 교육 만족도 4.6점</p></div><div class="labFeedback good">✓ 6개 발언 분류 완료 · 담당자와 마감일을 확인했어요! (오답 ${g.mistakes||0}회)</div>`;
 const summary='온보딩 개선 회의록\n[결정] 온보딩 안내문 B안 확정; 웰컴키트 다음 달부터 새 디자인\n[실행] 민준: 계정 점검 결과 공유(목요일); 하린: AI 활용 가이드 초안(금요일 오전)\n[참고] 이전 교육 만족도 4.6점';
 labDialog({title:'GAME 03 · 첫 회의록 완성!',label:'MEETING LAB · CLEAR',html,actions:[{text:'게임 선택 화면으로 →',fn:()=>showAiGameHub(q)},{text:'회의록 복사하기',secondary:true,fn:()=>{if(navigator.clipboard?.writeText){navigator.clipboard.writeText(summary).then(()=>toast('회의록을 복사했어요!')).catch(()=>toast('복사를 지원하지 않는 환경이에요.'))}else toast('복사를 지원하지 않는 환경이에요.')}}]});
}
document.addEventListener('keydown',e=>{
 if(!$('overlay')?.classList.contains('open')||!document.querySelector('.modal')?.classList.contains('labMode'))return;
 if(activeLab==='report'&&(e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();submitReportLab();return}
 if(activeLab!=='meeting'||['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;
 if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();selectMeetingKind(((labPick-1+(e.key==='ArrowDown'?1:2))%3)+1);return}
 if(['1','2','3'].includes(e.key)){e.preventDefault();selectMeetingKind(Number(e.key));return}
 if(e.key==='Enter'){e.preventDefault();submitMeetingLab()}
});

const GLOSS=[['컨펌','확인·승인받기. “컨펌 부탁드려요” = 이대로 진행해도 되는지 봐주세요'],['얼라인','방향과 기대치를 맞추는 일. 시작 전에 맞추면 재작업이 줄어요'],['리마인드','깜빡하지 않게 다시 알려주는 일'],['팔로업','진행 상황을 이어서 챙기고 확인하는 일'],['아젠다','회의에서 다룰 안건'],['에스컬레이션','혼자 풀기 어려운 이슈를 상위 담당자에게 공유하는 일'],['FYI','참고만 해주세요. 꼭 답할 필요는 없어요'],['ASAP / ETA','가능한 빨리 / 예상 완료 시점'],['드래프트','완성 전 초안. 먼저 보여주고 피드백받는 용도'],['싱크','진행 상황을 짧게 공유하며 맞추는 대화'],['버디 (사내)','첫 몇 달 적응을 돕는 동료'],['원온원 (사내)','팀 리더와 1:1로 고민·피드백을 나누는 면담'],['NOVA톡 (사내)','사내 메신저']];
const FAQ=[['연차는 언제부터 쓸 수 있나요?','입사 후 바로 쓸 수 있어요. 최소 하루 전에 팀 리더와 일정을 공유하고 시스템에 신청해요.'],['반차는 어떻게 쓰나요?','오전·오후 반차 모두 가능해요. 연차와 같은 방식으로 신청해요.'],['몸이 아플 땐 어떻게 하나요?','출근 전 팀 리더에게 메신저로 먼저 알리고, 병가나 연차로 처리해요.'],['출퇴근 시간은 어떻게 되나요?','기본은 9시~6시이고, 팀 합의에 따라 유연근무를 쓸 수 있어요.'],['늦거나 외근할 때는요?','늦을 것 같으면 출근 전에 알려요. 외근은 일정을 캘린더에 공유해요.'],['재택근무는 가능한가요?','주 1~2회 가능하며, 팀 일정과 맞춰 사전에 공유해요.'],['복지포인트는 어디에 쓰나요?','건강·문화·자기계발 항목에 쓸 수 있어요. 사용 가능 항목은 복지 페이지에서 확인해요.'],['점심 식대는 어떻게 되나요?','회사 식대 지원이 있고, 사외 식사는 지원 한도 안에서 정산해요.'],['경비는 어떻게 청구하나요?','영수증을 사진으로 남기고, 사용 후 일정 기간 안에 경비 시스템에 올려 팀 리더 승인을 받아요.'],['장비나 계정에 문제가 생기면?','IT팀(민준)에게 먼저 문의해요. 급한 건 NOVA톡 IT 채널을 이용해요.']];
const GUIDE_LIBRARY=[
 {id:'messenger',icon:'💬',title:'사내 메신저 다운로드',desc:'사내 메신저 설치, 첫 로그인, 알림 및 채널 사용 안내',category:'커뮤니케이션'},
 {id:'m365',icon:'🗂️',title:'M365 설치 매뉴얼',desc:'Microsoft 365 설치와 Outlook, Word, Excel, 업무 캘린더 설정',category:'업무환경'},
 {id:'teams',icon:'👥',title:'Teams 설치 매뉴얼',desc:'Microsoft Teams 설치, 로그인, 회의 참석과 협업 채널 안내',category:'커뮤니케이션'},
 {id:'network',icon:'🛡️',title:'사내망 설정 방법',desc:'사내 유·무선 네트워크 연결 및 기본 보안 점검 절차',category:'IT · 보안'},
 {id:'appstore',icon:'🛍️',title:'사내 앱 스토어 다운로드',desc:'업무에 필요한 승인 앱 검색 및 설치 안내',category:'업무환경'},
 {id:'cafeteria',icon:'🍱',title:'구내식당 앱 사용법',desc:'식단 조회, 식권·결제 방법 및 이용 안내',category:'생활 · 편의'},
 {id:'benefits',icon:'🎁',title:'복지몰 이용 가이드',desc:'복지몰 접속, 복지포인트 조회 및 이용 방법',category:'복리후생'},
 {id:'security',icon:'🔐',title:'보안 프로그램 설치',desc:'필수 보안 프로그램 확인과 업무용 기기 보안 수칙',category:'IT · 보안'},
 {id:'calendar',icon:'📅',title:'업무 캘린더 설정',desc:'일정 공유, 회의 초대 및 업무 캘린더 동기화 방법',category:'업무환경'},
 {id:'account',icon:'🪪',title:'계정·비밀번호 초기 설정',desc:'사내 계정 최초 로그인과 비밀번호 변경 및 인증 안내',category:'IT · 보안'}
];
function openGuidePlaceholder(id, context=null){
 const g=GUIDE_LIBRARY.find(x=>x.id===id);if(!g)return companyGuide('manual');
 const fromSetup=context&&context.source==='setup';
 const key=context?.key,q=context?.q;
 const actions=fromSetup?
 [{text:'업무환경 세팅으로',secondary:true,fn:()=>setupStage(q)},
  {text:S.tasks.setup?.[key]?'이미 데모 확인 완료 ✓':'데모 확인 완료로 표시',fn:()=>{
    S.tasks.setup=S.tasks.setup||{};S.tasks.setup[key]=true;save();setupStage(q);
  }}]:
 [{text:'가이드 목록으로',fn:()=>companyGuide('manual')},{text:'닫기',secondary:true,fn:closeModal}];
 modal({title:g.title,label:'NOVA LAB · GUIDE',art:'workspace',
  html:`<div class="guide-coming"><div class="symbol">📚</div><h3>가이드 준비 중</h3><p><b>${htmlEscape(g.title)}</b> 매뉴얼은 아직 등록되지 않았어요.</p><p>추후 실제 회사의 안내서, 설치 파일 및 접속 링크를 이곳에 연결할 예정이에요.</p></div>`+
  `<p class="smallNote">이 페이지는 포트폴리오용 가상 온보딩 데모입니다. 현재는 실제 다운로드나 설치가 진행되지 않습니다.</p>`,actions});
 document.querySelector('.modal').classList.add('guideMode');
}
function companyGuide(tab='gloss'){
 if(!['gloss','manual','faq'].includes(tab))tab='gloss';
 const tabs=`<div class="guide-tabs" role="tablist" aria-label="회사 가이드 분류">${[['gloss','용어집'],['manual','가이드'],['faq','자주 묻는 질문']].map(([k,v])=>`<button type="button" role="tab" aria-selected="${tab===k}" class="${tab===k?'active':''}" data-gt="${k}">${v}</button>`).join('')}</div>`;
 const body=tab==='gloss'?
   `<p class="guide-intro">회사에서 자주 쓰는 표현을 빠르게 찾아보세요.</p><input class="control" id="gq" placeholder="용어 검색 (예: 컨펌)"><div class="gl">${GLOSS.map(g=>`<div data-t="${htmlEscape(g[0]+' '+g[1])}"><b>${htmlEscape(g[0])}</b> · ${htmlEscape(g[1])}</div>`).join('')}</div>`
 :tab==='manual'?
   `<p class="guide-intro">NOVA LAB의 업무 환경과 사내 서비스를 소개하는 가이드 목록이에요. 현재는 <b>목록만 준비됐고, 내용은 등록 예정</b>이에요.</p>`+
   `<div class="guide-grid">${GUIDE_LIBRARY.map(g=>`<article class="guide-card"><div class="guide-card-top"><span class="guide-ico">${g.icon}</span><h4>${htmlEscape(g.title)}</h4></div><p>${htmlEscape(g.desc)}</p><div class="guide-meta">${htmlEscape(g.category)} · 문서 준비 중</div><button type="button" class="guide-open" data-open-guide="${g.id}" aria-label="${htmlEscape(g.title)} 열기">열기 →</button></article>`).join('')}</div>`+
   `<p class="smallNote">* 실제 매뉴얼이 준비되면 이 항목에 PDF나 사내 링크를 연결할 수 있어요.</p>`
 : FAQ.map(f=>`<details class="faq"><summary>${htmlEscape(f[0])}</summary><p>${htmlEscape(f[1])}</p></details>`).join('')+
   '<p class="smallNote">* NOVA LAB의 가상 규정 예시예요. 실제 회사에서는 사내 규정을 꼭 확인하세요.</p>';
 modal({title:'NOVA LAB 회사 가이드',label:'COMPANY GUIDE',art:'reception',html:tabs+body,
  actions:[{text:'닫기',fn:closeModal}]});
 document.querySelector('.modal').classList.add('guideMode');
 document.querySelectorAll('[data-gt]').forEach(b=>b.addEventListener('click',()=>companyGuide(b.dataset.gt)));
 document.querySelectorAll('[data-open-guide]').forEach(b=>b.addEventListener('click',()=>openGuidePlaceholder(b.dataset.openGuide)));
 const gq=$('gq');if(gq)gq.addEventListener('input',()=>{
  const v=gq.value.trim().toLowerCase();document.querySelectorAll('[data-t]').forEach(d=>{d.style.display=d.dataset.t.toLowerCase().includes(v)?'':'none'});
 });
}

const MAP="assets/office-map.webp";const LOBBY="assets/lobby-front.webp";const SEO="assets/npc-seo.png";const PLAYER="assets/player.png";const CHARACTERS={jihoon:"assets/npc-jihoon.webp",yuna:"assets/npc-yuna.webp",minjun:"assets/npc-minjun.webp",nari:"assets/npc-nari.webp",hajun:"assets/npc-hajun.webp"};ART.reception=LOBBY;
const MAIN=$('officeArt').getAttribute('src');let cur=0,lastHint='';
const SCN=[{id:'lobby',name:'로비',image:'lobby',door:[23,55],start:[60,86]},{id:'office',name:'사무실',map:[0,0],door:[94,60],start:[63,92]},{id:'pc',name:'PC유지보수실',map:[50,0],start:[26,86]},{id:'canteen',name:'구내식당',map:[0,50],start:[92,91]},{id:'train',name:'사내 교육장',map:[50,50],start:[10,90]},{id:'lobby2',name:'로비 (퇴근)',image:'lobby',start:[60,86]}];
const sceneDone=i=>Q.filter(q=>q.sc===SCN[i].id).every(q=>S.complete[q.id]);
const unlocked=i=>SCN.slice(0,i).every((_,j)=>sceneDone(j));
function setScene(id){const i=SCN.findIndex(s=>s.id===id);if(i<0)return;cur=i;const sc=SCN[i],img=$('officeArt'),a=$('avatar');if(sc.image==='lobby'){img.src=LOBBY;img.style.transform='none';img.style.objectFit='cover';img.style.objectPosition='center center'}else if(sc.map){img.src=MAP;img.style.transformOrigin='0 0';img.style.transform=`scale(${sc.z||2}) translate(${-sc.map[0]}%,${-sc.map[1]}%)`;img.style.objectFit='fill';img.style.objectPosition='center'}else{img.src=MAIN;img.style.transform='none';img.style.objectFit='cover'}const st=sc.start||[18,79];player={x:st[0],y:st[1]};a.classList.add('direct');a.style.transition='none';a.style.left=st[0]+'%';a.style.top=st[1]+'%';void a.offsetWidth;setTimeout(()=>{a.classList.remove('direct');a.style.transition=''},100);render();toast(`📍 ${sc.name}`)}
function spots(){const sc=SCN[cur],n=next(),a=Q.filter(q=>q.sc===sc.id).map(q=>({k:'q',q,x:q.x,y:q.y,icon:S.complete[q.id]?'✓':q.icon,label:q.label,done:!!S.complete[q.id],act:q.id===n.id}));if(cur<SCN.length-1)a.push({k:'door',x:(sc.door||[88,80])[0],y:(sc.door||[88,80])[1],icon:'🚪',label:'다음 장소로',act:sceneDone(cur),lock:!sceneDone(cur)});return a}

/* Fixed floor anchors are scene-relative percentages, matching each enlarged map quadrant. */
const NPC={
  lobby:[{key:'seo',name:'서윤 People팀',x:38,y:81,cls:'npcSeo',src:SEO}],
  finish:[{key:'seo',name:'서윤 People팀',x:38,y:81,cls:'npcSeo',src:SEO}],
  team:[{key:'jihoon',name:'지훈 팀장',x:73,y:87,src:CHARACTERS.jihoon},
        {key:'yuna',name:'유나 버디',x:88,y:85,src:CHARACTERS.yuna}],
  setup:[{key:'minjun',name:'민준 IT팀',x:78,y:85,src:CHARACTERS.minjun}],
  lunch:[{key:'yuna',name:'유나 버디',x:85,y:84,src:CHARACTERS.yuna}],
  culture:[{key:'jihoon',name:'지훈 팀장',x:12,y:81,src:CHARACTERS.jihoon}],
  ai:[{key:'nari',name:'나리 AI 코치',x:61,y:83,src:CHARACTERS.nari}],
  prio:[{key:'hajun',name:'하준 선배',x:77,y:81,src:CHARACTERS.hajun}]
};
const APPROACH={lobby:[59,87],team:[63,91],setup:[27,88],lunch:[93,91],culture:[10,89],ai:[10,89],prio:[10,89],finish:[59,87]};
const DOOR_APPROACH={lobby:[21,83],office:[91,91],pc:[28,91],canteen:[92,90],train:[13,90]};
const WALK_AREAS={
 lobby:[[13,73],[61,73],[69,83],[64,95],[10,95]],
 lobby2:[[13,73],[61,73],[69,83],[64,95],[10,95]],
 office:[[52,91],[61,82],[78,73],[94,72],[94,94],[52,94]],
 pc:[[11,80],[30,79],[39,87],[47,88],[46,95],[11,95]],
 canteen:[[68,93],[75,78],[94,76],[94,95],[68,95]],
 train:[[10,78],[21,81],[26,94],[10,94]]
};
function pointInside(p,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
 const a=poly[i],b=poly[j];if(((a[1]>p[1])!==(b[1]>p[1]))&&(p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]))yes=!yes;
}return yes}
function groundPoint(x,y){x=Math.max(7,Math.min(94,x));y=Math.max(63,Math.min(94,y));const poly=WALK_AREAS[SCN[cur].id];if(!poly||pointInside([x,y],poly))return [x,y];let best=[x,y],dist=Infinity;for(let i=0;i<poly.length;i++){
 const a=poly[i],b=poly[(i+1)%poly.length],vx=b[0]-a[0],vy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*vx+(y-a[1])*vy)/(vx*vx+vy*vy)));const nx=a[0]+t*vx,ny=a[1]+t*vy,d=(nx-x)**2+(ny-y)**2;if(d<dist){dist=d;best=[nx,ny]}
}return best}
function approachFor(s){if(s.k==='door')return DOOR_APPROACH[SCN[cur].id]||[80,88];return APPROACH[s.q?.id]||[50,88]}
function npcHtml(){return Q.filter(q=>q.sc===SCN[cur].id).flatMap(q=>(NPC[q.id]||[]).map(n=>`<div class="npc npc3d ${n.cls||''}" style="left:${n.x}%;top:${n.y}%"><img src="${n.src}" alt="${n.name}" draggable="false"><b class="npcTag">${n.name}</b></div>`)).join('')}
function renderSpots(){const exitBtn=$('doorShortcut');if(exitBtn){const available=cur<SCN.length-1&&sceneDone(cur);exitBtn.classList.toggle('visible',available);exitBtn.disabled=!available;exitBtn.textContent=available?`🚪 ${SCN[cur+1].name}으로 이동 →`:'다음 공간으로 →';} $('markers').innerHTML=npcHtml()+spots().map((s,i)=>`<button class="marker ${s.done?'done':''} ${s.act?'active':''} ${s.k==='door'?'door':''} ${s.lock?'locked':''}" style="left:${s.x}%;top:${s.y}%" data-spot="${i}" aria-label="${s.label}">${s.icon}<span>${s.label}</span></button>`).join('');document.querySelectorAll('[data-spot]').forEach(b=>b.addEventListener('click',()=>{const s=spots()[+b.dataset.spot];moveTo(...approachFor(s),()=>act(s))}))}
function renderChips(){$('chips').innerHTML=SCN.map((s,i)=>`<button class="chip ${i===cur?'on':''}" data-sc="${i}" ${unlocked(i)?'':'disabled'}>${s.name}</button>`).join('');document.querySelectorAll('[data-sc]').forEach(b=>b.addEventListener('click',()=>setScene(SCN[+b.dataset.sc].id)))}
function act(s){if(s.k==='q')openQuest(s.q);else if(s.lock)toast('이 장소의 미션을 먼저 마무리해요.');else setScene(SCN[cur+1].id)}
function near(){return spots().sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0]}
function interact(){const s=near();if(s&&Math.hypot(s.x-player.x,s.y-player.y)<22)act(s);else toast('방향키로 가까이 가서 E 키를 눌러보세요.')}
function hintTick(){const s=near(),t=s&&Math.hypot(s.x-player.x,s.y-player.y)<22?`<b>E</b> ${s.label}`:'방향키·WASD로 이동하고, 가까이 가면 <b>E</b> 키로 말을 걸어요';if(t!==lastHint){lastHint=t;$('hint').innerHTML=t}}
function goto(q){if(!q)return;const i=SCN.findIndex(s=>s.id===q.sc);if(!unlocked(i)){toast('앞 장소의 미션을 먼저 마무리해요.');return}const go=()=>moveTo(...(APPROACH[q.id]||[50,88]),()=>openQuest(q));if(cur!==i){setScene(q.sc);setTimeout(go,150)}else{toast(`${q.time} · ${q.label}로 이동 중…`);go()}}
const TASKS=[['고객사 장애 문의, 30분 안에 회신 필요','up'],['다음 주 팀 회의 자료 초안','right'],['내 담당이 아닌 계정 권한 요청','left'],['사내 설문 (마감 3주 뒤)','down'],['오늘 3시 팀장 보고 자료 마무리','up'],['지난 회의록 폴더 정리','down']];
const LANE={up:'⬆ 지금 바로',right:'➡ 일정 잡기',left:'⬅ 담당자에게 넘기기',down:'⬇ 나중에'};
let pg=null;function stopPrio(){if(pg){clearInterval(pg.iv);document.removeEventListener('keydown',pg.kh);pg=null}}
function prioGame(q){stopPrio();modal({title:'업무 산더미! 우선순위 게임',label:'DAY 1 · PRIORITY GAME',art:'workspace',html:speech('하준 · 선배','👨🏻','첫날 오후, 업무가 한꺼번에 왔어요')+p('카드가 나오면 <b>방향키</b>(또는 WASD, 버튼)로 분류해요. 카드당 7초!')+`<div class="diary">⬆ 지금 바로 (급하고 중요)<br>➡ 일정 잡기 (중요하지만 급하지 않음)<br>⬅ 담당자에게 넘기기 (내 일이 아님)<br>⬇ 나중에 (급하지도 중요하지도 않음)</div>`,actions:[{text:'게임 시작',fn:()=>runPrio(q)}]})}
function runPrio(q){pg={i:0,ok:0,miss:[],t:0};modal({title:'우선순위를 정해요',label:'DAY 1 · PRIORITY GAME',art:'workspace',html:`<div class="diary" id="pcard" style="font-size:14px;text-align:center"></div><div class="progress" style="margin:12px 0"><i id="pbar" style="width:100%;transition:none"></i></div><div class="pad">${Object.keys(LANE).map(k=>`<button data-k="${k}">${LANE[k]}</button>`).join('')}</div><p class="smallNote" id="pmsg" style="margin-top:10px">방향키를 눌러 시작!</p>`,actions:[{text:'그만하기',secondary:true,fn:closeModal}]});
const show=()=>{$('pcard').innerHTML=`<b>${pg.i+1} / ${TASKS.length}</b><br>${TASKS[pg.i][0]}`;pg.t=0},
end=()=>{const r=pg;stopPrio();modal({title:`${r.ok} / ${TASKS.length} 정확하게 분류했어요`,label:'DAY 1 · RESULT',art:'workspace',html:(r.miss.length?`<div class="diary">다시 볼 업무<br>${r.miss.join('<br>')}</div>`:`<div class="diary">모두 정확해요! 🎉</div>`)+p('급하고 중요하면 바로, 중요하지만 급하지 않으면 일정으로, 내 일이 아니면 담당자에게, 나머지는 나중에!'),actions:[{text:'다시 도전',secondary:true,fn:()=>prioGame(q)},{text:'미션 완료',fn:()=>finish(q)}]})},
ans=k=>{if(!pg)return;const c=TASKS[pg.i][1];if(k===c){pg.ok++;$('pmsg').textContent='✅ 좋아요!'}else{pg.miss.push(`${TASKS[pg.i][0]} → ${LANE[c]}`);$('pmsg').textContent=(k==='x'?'⏰ 시간 초과! ':'❌ ')+'정답은 '+LANE[c]}pg.i++;pg.i>=TASKS.length?end():show()};
pg.kh=e=>{const k={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'}[e.key];if(k){e.preventDefault();ans(k)}};document.addEventListener('keydown',pg.kh);document.querySelectorAll('[data-k]').forEach(b=>b.addEventListener('click',()=>ans(b.dataset.k)));pg.iv=setInterval(()=>{pg.t+=100;$('pbar').style.width=(100-pg.t/70)+'%';if(pg.t>=7000)ans('x')},100);show()}
function confetti(){for(let i=0;i<35;i++){const e=document.createElement('div');e.className='confetti';e.style.left=(Math.random()*100)+'vw';e.style.background=['#7865eb','#ffc47e','#80c8b9','#f1a4c7'][i%4];e.style.animationDelay=(Math.random()*.7)+'s';document.body.appendChild(e);setTimeout(()=>e.remove(),3500)}}
function showBadge(){const n=count();modal({title:n===Q.length?'DAY 1 마스터! 첫날을 완주했어요 🎉':'내 웰컴 배지',label:'MY ACHIEVEMENT',art:'lounge',html:`<div class="badgeArt" style="${n===Q.length?'':'filter:grayscale(1);opacity:.55'}">🏅</div>`+p(n===Q.length?`${htmlEscape(S.name)}님, 오늘의 여덟 가지 경험을 모두 완주했어요. 이제 NOVA LAB의 새로운 동료예요!`:`8개 미션을 완료하면 첫 출근 기념 배지를 받을 수 있어요. 현재 ${n} / ${Q.length} 완료했어요.`)+`<div class="diary" style="text-align:center"><b>FIRST DAY · NOVA LAB</b><br>${n===Q.length?'여덟 단계의 첫 출근 완료':'나의 첫 출근은 진행 중'}</div>`,actions:[{text:'여정으로 돌아가기',fn:closeModal},{text:'내 기록 보기',secondary:true,fn:showDiary}]})}
function showDiary(){const n=count();const c=S.choices;modal({title:'나만의 첫 출근 기록',label:'MY DAY · JOURNAL',art:'lounge',html:`<div class="diary"><b>✦ ${htmlEscape(S.name)} 님의 DAY 1</b><br>완료한 퀘스트: ${n} / ${Q.length}<br>첫 출근 기분: ${htmlEscape(c.feeling||'아직 기록 전')}<br>팀에서의 첫 인사: ${htmlEscape(c.intro||'아직 기록 전')}<br>점심 대화: ${htmlEscape(c.lunch||'아직 기록 전')}<br>퇴근길 마음: ${htmlEscape(c.end||'아직 기록 전')}</div>`+p(n===Q.length?'오늘의 기록은 이 브라우저에 자동 저장돼요. 내일의 나도 이 경험을 기억할 거예요.':'여정의 선택들이 여기에 하나씩 기록돼요.'),actions:[{text:'돌아가기',fn:closeModal},{text:'기록 복사하기',secondary:true,fn:()=>{const text=`NOVA LAB DAY 1 | ${S.name}\n완료: ${n}/${Q.length}\n처음 기분: ${c.feeling||'-'}\n팀과의 인사: ${c.intro||'-'}\n점심 대화: ${c.lunch||'-'}\n퇴근길: ${c.end||'-'}`;navigator.clipboard?.writeText(text).then(()=>toast('기록을 복사했어요!')).catch(()=>toast('복사를 지원하지 않는 환경이에요.'))}}]})}
function guide(){modal({title:'오피스 탐험 가이드',label:'HOW TO PLAY',art:'reception',html:p('NOVA LAB의 첫 출근 하루를 사전에 경험하는 인터랙티브 온보딩 웹앱입니다.')+`<div class="diary">🎮 방향키 또는 WASD: 캐릭터 이동<br>📍 E 키: 가까운 동료·문과 상호작용 (🚪 문은 다음 장소로)<br>💬 E 또는 Enter: 가까운 동료와 상호작용<br>📝 선택의 기록: 나의 첫날 일지에 저장<br>🏅 8개 미션 완주: 웰컴 배지 획득</div>`+p('이 앱은 가상 업무환경 체험용이며, 실제 사내 정보나 계정이 필요하지 않아요.'),actions:[{text:'좋아요, 시작해요!',fn:closeModal}]})}
function start(){if(S.started){goto(next());return}modal({title:'안녕하세요, 오늘부터 동료예요!',label:'WELCOME TO NOVA LAB',art:'reception',html:p('첫 출근 하루를 시작하기 전에, 캐릭터와 이름을 정해볼까요?')+`<label class="smallNote" for="playerName">캐릭터 이름</label><input id="playerName" class="control" maxlength="12" placeholder="어떻게 불러드릴까요?" value="${htmlEscape(S.name==='신입사원'?'':S.name)}"><p class="smallNote">나의 캐릭터</p><div class="choices"><button class="choice ${S.look==='blazer'?'selected':''}" data-look="blazer">👩🏻‍💼 화이트 블레이저</button><button class="choice ${S.look==='short'?'selected':''}" data-look="short">👨🏻‍💻 스마트 캐주얼</button><button class="choice ${S.look==='chestnut'?'selected':''}" data-look="chestnut">👩🏻‍💻 코지 오피스룩</button></div>`,actions:[{text:'내 첫 출근 시작하기 →',fn:()=>{S.name=($('playerName').value||'신입사원').trim().slice(0,12);S.started=true;save();render();closeModal();goto(Q[0])}}]});document.querySelectorAll('[data-look]').forEach(el=>el.addEventListener('click',()=>{S.look=el.dataset.look;save();document.querySelectorAll('[data-look]').forEach(b=>b.classList.toggle('selected',b===el));renderAvatar()}))}
function updateNav(k){document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===k));({journey:()=>{closeModal();goto(next())},quests:()=>{modal({title:'오늘의 여덟 가지 미션',art:'reception',html:`<div class="taskGrid">${Q.map(q=>`<div class="taskRow"><span>${S.complete[q.id]?'✅':q.icon} ${q.time} ${q.label}</span><button data-list="${q.id}">이동</button></div>`).join('')}</div>`,actions:[{text:'닫기',fn:closeModal}]});document.querySelectorAll('[data-list]').forEach(el=>el.addEventListener('click',()=>{closeModal();goto(Q.find(q=>q.id===el.dataset.list))}))},diary:showDiary,guide:companyGuide,badge:showBadge})[k]?.()}
$('nextBtn').onclick=()=>count()===Q.length?showDiary():S.started?goto(next()):start();$('doorShortcut').onclick=()=>{if(cur<SCN.length-1&&sceneDone(cur))setScene(SCN[cur+1].id);else toast('이 장소의 미션을 먼저 마무리해요.');};$('close').onclick=closeModal;$('overlay').addEventListener('click',e=>{if(e.target===$('overlay'))closeModal()});$('help').onclick=guide;$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'♪':'♫';toast(sound?'효과음을 켰어요':'효과음을 껐어요')};$('reset').onclick=()=>{if(confirm('첫 출근을 처음부터 다시 시작할까요? 저장된 기록이 초기화됩니다.')){S=fresh();save();player={x:44,y:78};$('avatar').style.left='44%';$('avatar').style.top='78%';setScene('lobby');start()}};document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>updateNav(b.dataset.nav));$('touchTalk').onclick=interact;
const keymap={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};window.addEventListener('keydown',e=>{if($('overlay').classList.contains('open')){if(e.key==='Escape')closeModal();return}const k=e.key.length===1?e.key.toLowerCase():e.key;if(['e','Enter',' '].includes(k)){e.preventDefault();interact();return}if(keymap[k]){e.preventDefault();keyboard[k]=true}});window.addEventListener('keyup',e=>{delete keyboard[e.key.length===1?e.key.toLowerCase():e.key]});window.addEventListener('blur',()=>{keyboard={}});document.querySelectorAll('[data-move]').forEach(b=>{const k={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[b.dataset.move];b.addEventListener('pointerdown',e=>{e.preventDefault();keyboard[k]=true});['pointerup','pointercancel','pointerleave'].forEach(t=>b.addEventListener(t,()=>delete keyboard[k]))});$('stage').addEventListener('click',e=>{if(e.target.closest('button'))return;const r=$('stage').getBoundingClientRect();const x=((e.clientX-r.left)/r.width)*100;const y=((e.clientY-r.top)/r.height)*100;moveTo(x,y)});let prev=0;function frame(t){let dt=Math.min((t-prev)/1000,.06)||0;prev=t;if(!$('overlay').classList.contains('open')){let dx=0,dy=0;for(const k of Object.keys(keyboard)){dx+=keymap[k]?.[0]||0;dy+=keymap[k]?.[1]||0}if(dx||dy){let mag=Math.hypot(dx,dy);let [x,y]=groundPoint(player.x+dx/mag*26*dt,player.y+dy/mag*26*dt);player={x,y};$('avatar').style.left=x+'%';$('avatar').style.top=y+'%';$('avatar').classList.add('walking','direct')}else if(!walkTimer)$('avatar').classList.remove('walking','direct')}hintTick();requestAnimationFrame(frame)}requestAnimationFrame(frame);setScene(next().sc);if(!S.started)setTimeout(start,420);else toast(`${htmlEscape(S.name)}님, 돌아오셨네요! 오늘의 여정을 이어가요.`)

/* NOVA LAB — DAY1 v6: preserved original mission engine; this layer extends it. */
const SKILL_MAP=[
 {id:'ai',name:'AI 활용과 검증',icon:'🤖',missions:['culture','ai'],extra:'ai',desc:'AI 요청 작성, 생성 결과 확인, 보안 원칙'},
 {id:'collab',name:'협업 커뮤니케이션',icon:'🤝',missions:['team','lunch'],extra:'collab',desc:'첫 인사, 동료와의 소통, 협업 판단'},
 {id:'solve',name:'문제 해결과 우선순위',icon:'🧩',missions:['setup','prio'],extra:'solve',desc:'업무환경 탐색, 중요도와 긴급도 분류'},
 {id:'culture',name:'조직 적응과 문화 이해',icon:'🌱',missions:['lobby','culture','finish'],extra:'culture',desc:'조직문화 이해, 첫날 적응, 회고'}
];
const SCENARIOS=[
 {id:'collab',title:'🤝 다른 팀과의 협업 요청',role:'버디 · 유나',situation:'오늘 오후 다른 팀에서 갑자기 자료를 요청했어요. 그런데 내일까지 마무리해야 하는 업무도 있어요. 어떻게 대응할까요?',options:[['급한 요청이니 기존 업무를 말없이 미뤄요.','상대의 요청은 돕지만 기존 일정이 어긋날 위험이 있어요.',0],['요청 목적·기한을 확인하고, 팀 리더와 우선순위를 조율해요.','요청의 맥락을 확인하고 영향받는 사람과 조율한 판단이에요.',1],['내 업무가 아니니 바로 거절해요.','협업할 여지가 있는지 먼저 확인할 수 있어요.',0]]},
 {id:'solve',title:'🧩 보고서 수치가 다를 때',role:'AI 코치 · 나리',situation:'AI가 만든 월간 보고서의 성과 수치가 원본 데이터와 일치하지 않아요. 다음 행동은?',options:[['보고 시간이 촉박하니 AI 수치로 제출해요.','생성 결과는 근거가 될 수 없어요. 원본 자료 대조가 우선이에요.',0],['원자료를 대조하고 차이를 수정한 다음 출처를 명시해요.','정확성과 책임 소재를 모두 챙겼어요.',1],['AI를 다시 실행하고 새 결과를 그대로 제출해요.','재생성만으로 정확성이 보장되지는 않아요.',0]]},
 {id:'culture',title:'🌱 새로운 업무방식 제안',role:'팀 리더 · 지훈',situation:'반복적인 교육 안내 업무에 AI 자동화 아이디어가 생겼어요. 어떻게 시작할까요?',options:[['승인 없이 실무 개인정보를 AI에 넣어 바로 개발해요.','업무 개선보다 개인정보와 보안 점검이 우선이에요.',0],['가상 데이터로 작은 시안을 만들고 팀과 검토해요.','안전한 파일럿으로 참여와 변화관리를 함께 설계했어요.',1],['실패할 수도 있으니 아이디어를 이야기하지 않아요.','작은 실험과 피드백으로 위험을 낮출 수 있어요.',0]]}
];
S.scenarios=S.scenarios||{};
S.history=Array.isArray(S.history)?S.history:[];
S.coachLog=Array.isArray(S.coachLog)?S.coachLog:[];
const AI_URL_KEY='nova_day1_ai_endpoint_v6';
const storageRead=(k,session=false)=>{try{return (session?sessionStorage:localStorage).getItem(k)||''}catch{return ''}};
const storageWrite=(k,v,session=false)=>{try{(session?sessionStorage:localStorage).setItem(k,v)}catch{}};
const storageDelete=(k,session=false)=>{try{(session?sessionStorage:localStorage).removeItem(k)}catch{}};
const aiConfig=()=>({url:storageRead(AI_URL_KEY).trim()||'https://onboarding-quest-day1.vercel.app/api/ai',code:storageRead('nova_day1_access_code',true)});
function hasAI(){const v=aiConfig();return /^https:\/\/[^\s]+\/api\/ai\/?$/.test(v.url)&&!!v.code}
async function requestAI(task,data){const {url,code}=aiConfig();if(!hasAI())throw new Error('AI 연결 설정에서 Vercel 주소와 데모 접속 코드를 입력해 주세요.');
 const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),22000);
 try{const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json','x-demo-code':code},body:JSON.stringify({task,data}),signal:ctl.signal,cache:'no-store'});
 const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.error||'AI 서버에 연결할 수 없어요 ('+r.status+')');
 if(typeof body.text!=='string'||!body.text.trim())throw new Error('AI 응답이 비어 있어요.');return body.text.slice(0,7000)
 }catch(e){if(e.name==='AbortError')throw new Error('응답 시간이 길어 연결을 종료했어요. 잠시 후 재시도해 주세요.');throw e}finally{clearTimeout(t)}
}
function attachNavV6(){const nav=document.querySelector('nav.nav');if(!nav||nav.querySelector('[data-feature]'))return;
 const div=document.createElement('div');div.className='navDivider';nav.appendChild(div);
 const caption=document.createElement('div');caption.className='navCaption';caption.textContent='✦ GROWTH & AI';nav.appendChild(caption);
 [['passport','🎯','Skill Passport'],['report','📋','온보딩 결과 리포트'],['coach','💬','AI 코치'],['scenario','🧩','상황별 시뮬레이션'],['analytics','📊','HR 관리자 뷰'],['settings','⚙','AI 연결 설정'],['about','📎','기획자 노트']].forEach(([id,ico,name])=>{const b=document.createElement('button');b.type='button';b.dataset.feature=id;b.innerHTML=`<span class="ico">${ico}</span> ${name}`;b.addEventListener('click',()=>{document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');({passport:showPassport,report:showLearningReport,coach:showAICoach,scenario:showScenarioHub,analytics:showAnalytics,settings:showAISettings,about:showProjectNotes})[id]();});nav.appendChild(b)});
}
const achieved=id=>SKILL_MAP.find(x=>x.id===id);
function skillStats(){return SKILL_MAP.map(k=>{const normal=k.missions.filter(x=>S.complete[x]).length,extra=!!S.scenarios[k.extra]?.success,total=k.missions.length+1,score=normal+(extra?1:0);return {...k,score,total,percent:Math.round(100*score/total),evidence:[...k.missions.filter(x=>S.complete[x]).map(id=>Q.find(q=>q.id===id)?.label||id),...(extra?['상황별 시뮬레이션 완료']:[])]}})}
function showProjectNotes(){const html=`<div class="featureKicker">THE DESIGN CHALLENGE</div><div class="featureNotice"><b>문제 정의</b><br>기존 온보딩 자료는 신입사원이 일방적으로 읽거나 따라 하는 데 그치기 쉬워요. 실제 업무에 적용할 수 있는 상황과 피드백을 첫날에 제공하려면 무엇이 필요할까요?</div>`+
 `<div class="featureKicker">LEARNING DESIGN</div><div class="choiceFlex"><div class="skillCard"><b>① 가상의 오피스 탐험</b><small>공간을 이동하면서 정보에 필요한 순간에 접근하는 경험 설계</small></div><div class="skillCard"><b>② 실무 기반 선택과 검증</b><small>보고서 오류 탐지, 회의 발언 분류, 업무 우선순위, 조직문화 상황 판단</small></div><div class="skillCard"><b>③ 즉각적 피드백과 성장 기록</b><small>선택별 결과 확인, 8개 퀘스트 기록, Skill Passport, 회고 리포트</small></div><div class="skillCard"><b>④ AX 기반 운영 확장</b><small>AI 코치·보고서·회의록 API 연동과 로컬 관리자 화면</small></div></div>`+
 `<div class="featureKicker">IMPLEMENTATION SCOPE</div><div class="featureNotice">가상의 NOVA LAB을 배경으로 기획한 <b>개인 포트폴리오용 HRD 프로토타입</b>입니다. 실제 신입사원 교육생의 만족도, 이수율, 성과 개선 효과를 검증한 서비스는 아닙니다. AI 실습은 실제 연결과 시뮬레이션을 명확히 구분합니다.</div>`+
 `<div class="featureKicker">EVALUATION PLAN</div><div class="featureNotice">실제 적용 시 검증할 지표 예시: 시작 대비 완료율, 미션별 중단 지점, 정답·재도전 현황, 참여자 주관식 피드백, 입사 초기 적응 지원 만족도. 지표 수집 전 개인정보 및 사용자 동의 설계가 필요합니다.</div>`;
 modal({title:'이 온보딩을 이렇게 설계했어요',label:'HRD DESIGNER NOTES · PORTFOLIO',art:'reception',html,actions:[{text:'Skill Passport 보기',fn:showPassport},{text:'여정으로 돌아가기',secondary:true,fn:closeModal}]});}
function showPassport(){const html=`<div class="featureNotice">나의 미션 수행 기록을 역량별 학습 경험으로 연결한 <b>포트폴리오 데모</b>예요. 이는 역량 자격증이나 실제 업무 능력의 검증 점수가 아니에요.</div>`+
 `<div class="featureBadgeSet"><span>👤 ${htmlEscape(S.name)}</span><span>🏅 완료 퀘스트 ${count()}/8</span><span>🧩 상황 미션 ${Object.values(S.scenarios).filter(x=>x?.success).length}/3</span></div>`+
 `<div class="skillGrid">${skillStats().map(k=>`<div class="skillCard"><div class="skillTag">${k.icon} LEARNING EXPERIENCE</div><b>${k.name}</b><div class="featureBarRow"><span>${k.score} / ${k.total} 활동</span><span>${k.percent}%</span></div><div class="skillBar"><i style="width:${k.percent}%"></i></div><small>${k.desc}</small><div class="skillEvidence">${k.evidence.length?'✔ '+k.evidence.map(htmlEscape).join('<br>✔ '):'아직 기록된 학습 경험이 없어요.'}</div></div>`).join('')}</div>`;
 modal({title:'My Skill Passport',label:'LEARNING EXPERIENCE · DAY 1',art:'workspace',html,actions:[{text:'상황별 시뮬레이션',secondary:true,fn:showScenarioHub},{text:'학습 리포트 보기',fn:showLearningReport}]})}
function createReportText(){const {name,choices:c}=S;return [`NOVA LAB · DAY 1 학습 결과 리포트`,'포트폴리오용 가상 회사 데모 · 실제 역량평가 아님','',`참여자: ${name}`,`진행: ${count()} / ${Q.length} 미션`,...Q.map(q=>`${S.complete[q.id]?'[완료]':'[미완료]'} ${q.time} ${q.label}`),'','[학습 경험 · Skill Passport]',...skillStats().map(k=>`${k.name}: ${k.score}/${k.total} 활동 · ${k.evidence.join(', ')||'아직 없음'}`),'','[실무 체험]',`Report Lab: ${S.games.report.done?'완료':'미완료'} / 오류검토 재시도 ${S.games.report.mistakes||0}회`,`Meeting Lab: ${S.games.minutes.done?'완료':'미완료'} / 오답 ${S.games.minutes.mistakes||0}회`, ...SCENARIOS.map(s=>`${s.title}: ${S.scenarios[s.id]?.success?'완료':'미완료'}`),'','[첫날 회고]',`첫 기분: ${c.feeling||'-'}`,`첫 인사: ${c.intro||'-'}`,`점심 대화: ${c.lunch||'-'}`,`퇴근길: ${c.end||'-'}`,'','참고: 해당 기록은 이 브라우저에서만 저장됩니다.'].join('\n')}
function downloadReport(){const text=createReportText(),blob=new Blob([text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='NOVA_LAB_DAY1_학습리포트.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
function showLearningReport(){const n=count(),skills=skillStats();const html=`<div class="insightGrid"><div class="insightCard"><small>QUEST COMPLETION</small><strong>${n}/8</strong><b>오늘의 퀘스트</b></div><div class="insightCard"><small>LEARNING EXPERIENCES</small><strong>${skills.reduce((a,k)=>a+k.score,0)}</strong><b>역량 연결 활동</b></div></div>`+
 `<div class="featureKicker">나의 여정</div><table class="miniTable"><tbody>${Q.map(q=>`<tr><td>${q.icon} ${q.time} ${q.label}</td><td>${S.complete[q.id]?'✅ 완료':'◻ 진행 전'}</td></tr>`).join('')}</tbody></table>`+
 `<div class="featureKicker">학습 후 돌아보기</div><div class="featureNotice">Report Lab: ${S.games.report.done?'완료':'진행 전'} · Meeting Lab: ${S.games.minutes.done?'완료':'진행 전'} · 상황 시뮬레이션: ${Object.values(S.scenarios).filter(s=>s?.success).length}/3</div>`+
 `<div class="featureNotice">이 결과는 개인 브라우저의 학습 기록을 정리한 시연용 리포트이며, 교육 효과나 실제 역량 향상을 검증한 결과는 아닙니다.</div>`;
 modal({title:`${htmlEscape(S.name)}님의 온보딩 결과 리포트`,label:'PERSONAL LEARNING REPORT',art:'lounge',html,actions:[{text:'텍스트 리포트 저장',fn:downloadReport},{text:'Skill Passport 보기',secondary:true,fn:showPassport},{text:'기록 복사',secondary:true,fn:()=>navigator.clipboard?.writeText(createReportText()).then(()=>toast('학습 기록을 복사했어요!')).catch(()=>toast('복사할 수 없어요.'))}]})}
function showAnalytics(){const finished=Q.filter(q=>S.complete[q.id]),ms=Math.round(count()/Q.length*100),hist=S.history||[],skills=skillStats();const html=
 `<div class="featureNotice warn"><b>관리자 화면 · 데모 모드</b><br>현재는 이 브라우저의 단일 참여자 데이터를 시각화합니다. 여러 직원의 정보나 조직 전체 통계는 수집하지 않으며, 실제 운영용 관리자 인증·DB는 연결되지 않았어요.</div>`+
 `<div class="insightGrid"><div class="insightCard"><small>THIS BROWSER</small><strong>1</strong><b>로컬 데모 참여자</b></div><div class="insightCard"><small>MISSION COMPLETION</small><strong>${ms}%</strong><b>${count()}/${Q.length} 미션 완료</b></div><div class="insightCard"><small>AI LAB</small><strong>${Number(!!S.games.report.done)+Number(!!S.games.minutes.done)}/2</strong><b>실무 체험 완료</b></div><div class="insightCard"><small>SCENARIOS</small><strong>${Object.values(S.scenarios).filter(s=>s?.success).length}/3</strong><b>상황 판단 완료</b></div></div>`+
 `<div class="featureKicker">미션별 진행 상태</div><table class="miniTable"><thead><tr><th>미션</th><th>경험</th><th>기록</th></tr></thead><tbody>${Q.map(q=>`<tr><td>${q.time} ${htmlEscape(q.label)}</td><td>${S.complete[q.id]?'완료':'대기'}</td><td>${htmlEscape(hist.find(h=>h.id===q.id)?.at?.slice(0,16)?.replace('T',' ')||'-')}</td></tr>`).join('')}</tbody></table>`+
 `<div class="featureKicker">역량 연계 활동 현황</div>${skills.map(k=>`<div class="featureBarRow"><span>${k.icon} ${k.name}</span><span>${k.score}/${k.total}</span></div><div class="skillBar"><i style="width:${k.percent}%"></i></div>`).join('')}`+
 `<div class="featureNotice">운영 인사이트 예시: 미완료 단계에서 안내 문구와 동선을 점검할 수 있습니다. 여러 참여자의 실제 이탈률을 계산하려면 동의·인증·서버 데이터 수집 설계가 추가로 필요해요.</div>`;
 modal({title:'HR 관리자 대시보드',label:'LEARNING ANALYTICS · LOCAL DEMO',art:'workspace',html,actions:[{text:'현재 데이터 JSON 내보내기',fn:()=>{const out={name:S.name,completed:S.complete,history:S.history,skills:skills.map(({id,score,total})=>({id,score,total})),scenarios:S.scenarios,games:{report:{done:S.games.report.done,mistakes:S.games.report.mistakes||0},minutes:{done:S.games.minutes.done,mistakes:S.games.minutes.mistakes||0}}};const a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}));a.href=u;a.download='nova_lab_local_demo_analytics.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),500)}},{text:'돌아가기',secondary:true,fn:closeModal}]})}
function showScenarioHub(){const html=`<div class="featureNotice">실제 직장에서 마주할 만한 상황을 선택하고 판단해 보세요. 각 미션은 Skill Passport에 학습 경험으로 연결돼요.</div><div class="choiceFlex">${SCENARIOS.map(s=>`<button type="button" data-scenario="${s.id}">${s.title}<br><small>${S.scenarios[s.id]?.success?'✅ 올바른 대응 경험 완료':'판단 연습하기 →'}</small></button>`).join('')}</div>`;
 modal({title:'상황별 협업 시뮬레이션',label:'WORKPLACE DECISION LAB',art:'workspace',html,actions:[{text:'Skill Passport 보기',secondary:true,fn:showPassport},{text:'닫기',fn:closeModal}]});document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>showScenario(b.dataset.scenario)))}
function showScenario(id){const sc=SCENARIOS.find(x=>x.id===id);if(!sc)return;const html=`<div class="featureKicker">${htmlEscape(sc.role)}</div><div class="featureAnswer">${htmlEscape(sc.situation)}</div><div class="choiceFlex">${sc.options.map(([o],i)=>`<button type="button" data-schoice="${i}">${i+1}. ${htmlEscape(o)}</button>`).join('')}</div>`;
 modal({title:sc.title,label:'INTERACTIVE SCENARIO',art:'workspace',html,actions:[{text:'다른 상황',secondary:true,fn:showScenarioHub}]});document.querySelectorAll('[data-schoice]').forEach(b=>b.addEventListener('click',()=>answerScenario(id,Number(b.dataset.schoice))));}
function answerScenario(id,idx){const sc=SCENARIOS.find(s=>s.id===id),opt=sc?.options[idx];if(!opt)return;const correct=!!opt[2];S.scenarios[id]={success:correct||!!S.scenarios[id]?.success,attempts:(S.scenarios[id]?.attempts||0)+1,last:idx,at:new Date().toISOString()};save();const h=`<div class="featureAnswer">${htmlEscape(opt[1])}</div><div class="featureNotice">${correct?'✓ 현장 적용에 가까운 판단이에요. Skill Passport에 이 학습 경험을 기록했어요.':'다른 선택을 통해 결과를 비교해 보세요.'}</div>`;
 modal({title:correct?'✅ 좋은 판단이에요!':'💡 다른 방법도 생각해 볼까요?',label:'SITUATION FEEDBACK',art:'workspace',html:h,actions:[{text:correct?'다른 상황 도전':'다시 선택하기',fn:correct?showScenarioHub:()=>showScenario(id)},{text:'AI 코치의 추가 설명',secondary:true,fn:()=>giveScenarioAIFeedback(sc,opt)},{text:'Skill Passport',secondary:true,fn:showPassport}]})}
async function giveScenarioAIFeedback(sc,opt){if(!hasAI())return showAISettings('AI 코치 연결 후 맞춤형 피드백을 받을 수 있어요.');modal({title:'AI 코치에게 물어보는 중...',label:'AI COACH',html:'<div class="featureNotice">방금 선택한 대응을 분석하고 있어요.</div>',actions:[]});try{const t=await requestAI('scenario',{situation:sc.situation,choice:opt[0]});modal({title:'AI 코치의 상황 피드백',label:'AI COACH · LIVE',html:`<div class="featureAnswer">${htmlEscape(t)}</div>`,actions:[{text:'다른 상황 도전',fn:showScenarioHub}]})}catch(e){modal({title:'연결을 확인해 주세요',html:`<div class="featureNotice warn">${htmlEscape(e.message)}</div>`,actions:[{text:'AI 설정',fn:showAISettings},{text:'돌아가기',secondary:true,fn:showScenarioHub}]})}}
function showAISettings(notice=''){const config=aiConfig();const html=`<div class="featureNotice">GitHub Pages는 정적 웹사이트라서 Claude API 비밀키를 직접 보관할 수 없어요. Vercel 서버에 비밀키를 보관하고, 이 화면에서는 <b>API 주소</b>와 <b>데모 접속 코드</b>만 설정합니다.</div>`+
 (notice?`<div class="featureNotice warn">${htmlEscape(notice)}</div>`:'')+
 `<label class="featureKicker" for="aiEndpoint">Vercel API 주소</label><input id="aiEndpoint" class="featureInput" type="url" value="${htmlEscape(config.url)}" placeholder="https://your-project.vercel.app/api/ai" autocomplete="off">`+
 `<label class="featureKicker" for="aiDemoCode">데모 접속 코드 (Claude API 키 아님)</label><input id="aiDemoCode" class="featureInput" type="password" placeholder="Vercel DEMO_ACCESS_CODE 환경변수" value="${htmlEscape(config.code)}" autocomplete="off">`+
 `<div class="featureNotice warn">AI 사용 시 입력한 가상 실습 내용이 설정한 AI 서버로 전송됩니다. 실제 회사 자료, 기밀, 개인정보는 입력하지 마세요. 데모 코드는 현재 탭의 세션 동안만 저장해요.</div>`;
 modal({title:'AI 연동 설정',label:'SECURE API CONNECTION',art:'workspace',html,actions:[{text:'연결 정보 저장',fn:()=>{const url=$('aiEndpoint').value.trim().replace(/\/$/,'');if(url&&!/^https:\/\/[^\s/]+(?:\:[0-9]+)?\/api\/ai$/.test(url)){toast('https://.../api/ai 형식의 주소를 입력해 주세요.');return}const code=$('aiDemoCode').value.trim();if(url)storageWrite(AI_URL_KEY,url);else storageDelete(AI_URL_KEY);if(code)storageWrite('nova_day1_access_code',code,true);else storageDelete('nova_day1_access_code',true);toast(hasAI()?'AI 연결 정보가 저장됐어요.':'저장했어요. 서버와 접속 코드를 설정하면 실제 AI를 사용할 수 있어요.');closeModal()}},{text:'AI 코치 열기',secondary:true,fn:()=>{const url=$('aiEndpoint').value.trim().replace(/\/$/,'');if(url)storageWrite(AI_URL_KEY,url);const code=$('aiDemoCode').value.trim();if(code)storageWrite('nova_day1_access_code',code,true);showAICoach()}},{text:'설정 초기화',secondary:true,fn:()=>{storageDelete(AI_URL_KEY);storageDelete('nova_day1_access_code',true);showAISettings('AI 연결 정보가 초기화됐어요.')}}]})}
function showAICoach(){const log=S.coachLog.slice(-6),html=`<div class="featureNotice">👩🏻‍💻 나리 · AI 코치<br>처음 출근한 신입사원의 업무 방식, 협업과 AI 활용에 관한 질문을 받아요. ${hasAI()?'<b>LIVE AI 연결 정보가 설정되어 있어요.</b>':'<b>아직 미연결 상태라 질문 대신 설정 안내를 볼 수 있어요.</b>'}</div>`+
 (log.length?`<div class="featureKicker">최근 대화</div>${log.map(x=>`<div class="featureAnswer"><b>Q.</b> ${htmlEscape(x.q)}<br><b>A.</b> ${htmlEscape(x.a)}</div>`).join('')}`:'')+
 `<label class="featureKicker" for="aiQuestion">나리에게 질문하기</label><textarea id="aiQuestion" class="featureInput featureText" maxlength="700" placeholder="예: 첫 팀 회의에서 의견을 어떻게 제안하면 좋을까요?"></textarea>`;
 modal({title:'나리의 AI 코칭룸',label:'AI COACH · Q&A',art:'workspace',html,actions:[{text:'질문 보내기',fn:askAICoach},{text:'AI 연결 설정',secondary:true,fn:showAISettings}]});}
async function askAICoach(){const q=$('aiQuestion')?.value.trim()||'';if(q.length<5){toast('5자 이상 질문을 입력해 주세요.');return}if(!hasAI())return showAISettings('AI 서버 설정이 완료되어야 실제 AI 코칭을 받을 수 있어요.');modal({title:'나리가 답변을 생각하고 있어요...',label:'AI COACH · LIVE',html:`<div class="featureAnswer">${htmlEscape(q)}</div><div class="featureNotice">답변을 생성하고 있어요.</div>`,actions:[]});try{const a=await requestAI('coach',{question:q,context:`DAY 1 ${count()}/8 미션 완료; 학습자 이름 전송 안 함`});S.coachLog.push({q:q.slice(0,700),a:a.slice(0,1800)});S.coachLog=S.coachLog.slice(-8);save();showAICoach()}catch(e){modal({title:'AI 코치 연결 실패',html:`<div class="featureNotice warn">${htmlEscape(e.message)}</div><div class="featureAnswer">질문: ${htmlEscape(q)}</div>`,actions:[{text:'다시 질문하기',fn:showAICoach},{text:'연결 설정',secondary:true,fn:showAISettings}]})}}
/* Hook original quest completion into a timestamped learning log (existing progress logic remains unchanged). */
const originalFinish=finish;
finish=function(q){if(!S.complete[q.id]){S.history.push({id:q.id,at:new Date().toISOString()});S.history=S.history.slice(-60)}originalFinish(q)};
/* When a prompt is submitted in Report Lab, still use the deterministic two-error comparison exercise.
   The live model generates a separate, explicitly labeled reference draft. */
const originalSubmitReportLab=submitReportLab;
submitReportLab=async function(){const g=S.games.report;const wasGenerated=!!g.generated;const field=$('labReportPrompt');if(field)g.prompt=field.value.slice(0,1800);const valid=g.prompt.trim().length>=40;
 if(!wasGenerated&&valid&&hasAI()){labFeedback='AI에게 참고 보고서를 요청하고 있어요.';showReportLab();try{g.liveDraft=await requestAI('report',{prompt:g.prompt,source:{sessions:12,participants:84,satisfaction:4.6,previous:4.3}});g.liveMode='live';}catch(e){g.liveDraft='';g.liveMode='error';g.liveError=e.message;}save()}
 originalSubmitReportLab();};
const originalShowReportLab=showReportLab;
showReportLab=function(q=labQuest){originalShowReportLab(q);if(!S.games.report.generated)return;const box=document.querySelector('.modal .labGenerated');if(!box)return;const g=S.games.report;
 const extra=document.createElement('div');extra.className='featureNotice '+(g.liveMode==='error'?'warn':'');extra.innerHTML=g.liveDraft?`<b>🔗 LIVE AI 참고 보고서 (실제 API 생성)</b><div class="featureAnswer">${htmlEscape(g.liveDraft)}</div><small>아래 4개 문장은 별도의 오류 탐지 연습용으로, 숫자 2개가 의도적으로 틀린 문장입니다. LIVE AI 보고서의 수치도 원자료와 직접 대조해 주세요.</small>`:
 g.liveMode==='error'?`AI 참고 보고서를 가져오지 못했어요: ${htmlEscape(g.liveError||'연결 오류')}<br>기존 시뮬레이션 검증 게임은 계속 진행할 수 있어요.`:
 `ℹ 지금은 실습용 오류 탐지 게임입니다. ${hasAI()?'다음 새 프롬프트 생성부터 실제 AI가 함께 작성해요.':'AI 연결 설정에서 서버 주소와 데모 접속 코드를 등록하면 참고 보고서도 실제 AI로 생성할 수 있어요.'}`;
 box.parentNode.insertBefore(extra,box);const note=box.querySelector('h4');if(note)note.textContent='✦ 검증 퀴즈 · 의도적 오류 2개 포함 (시뮬레이션)';};
const originalShowMeetingSummary=showMeetingSummary;
showMeetingSummary=function(q=labQuest){originalShowMeetingSummary(q);const extra=S.games.minutes.liveSummary;
 if(extra){const content=$('modalContent');const d=document.createElement('div');d.className='featureAnswer';d.textContent='🔗 LIVE AI 회의록 초안\n'+extra+'\n\n※ AI 응답은 실제 회의 발언과 비교해야 해요.';content.appendChild(d)}
 const b=document.createElement('button');b.textContent='✦ 실제 AI로 회의록 생성';b.className='secondary';b.addEventListener('click',async()=>{if(!hasAI())return showAISettings('회의록을 생성하려면 AI 서버부터 연결해 주세요.');b.disabled=true;b.textContent='AI가 정리하는 중…';try{S.games.minutes.liveSummary=await requestAI('meeting',{transcript:LAB_MEETING.map(x=>({speaker:x.who,text:x.text}))});save();showMeetingSummary(q)}catch(e){toast(e.message);b.disabled=false;b.textContent='✦ 다시 시도하기'}});$('modalButtons').appendChild(b);
};
/* Sources of the three workplace AI game scenarios (external optional viewing). */
const AI_VIDEOS=[
 {id:'01',name:'첫 출근, 산더미 같은 업무',url:'https://www.youtube.com/watch?v=PaG6Bv5inWM'},
 {id:'02',name:'첫 보고서, 3시간이 30분으로',url:'https://www.youtube.com/watch?v=NXPw1YiTIuk'},
 {id:'03',name:'회의록 정리',url:'https://www.youtube.com/watch?v=Ee_t4bVzKJ8'}
];
const oldGameHub=showAiGameHub;
showAiGameHub=function(q){oldGameHub(q);const area=$('modalContent');if(!area)return;const e=document.createElement('div');e.className='featureNotice';
 e.innerHTML='<b>📺 AI 업무 게임 참고 영상</b><div class="featureBadgeSet">'+AI_VIDEOS.map(v=>`<a target="_blank" rel="noopener noreferrer" href="${v.url}" style="color:#6252ac;text-decoration:underline;font-size:12px">▶ ${v.id}. ${htmlEscape(v.name)}</a>`).join('')+'</div><small>영상은 YouTube에서 별도로 열려요. 세 게임은 영상을 참고해 새롭게 구성한 인터랙티브 체험입니다.</small>';
 area.appendChild(e);
};
/* NOVA LAB · AI Skill Lab v7 — practical tasks, evidence-first feedback, no psychometric score. */
const LABS={
 report:{icon:'📝',title:'보고서 작성 챌린지',subtitle:'AI와 함께 교육 결과를 1페이지 보고서로 정리해요',skill:'업무 요청 설계 · 결과 검증',
  objective:'팀장에게 전달할 교육 결과 보고서 초안을 AI와 함께 만들고, 원본 수치와 대조해 수정하세요.',
  facts:[['교육 대상','50명'],['수료 인원','46명'],['수료율','92% (46 ÷ 50)'],['교육 만족도','4.3 / 5.0'],['실습 시간 부족 의견','12건']],
  brief:'경영진용 1페이지 요약 보고서. 교육 성과, 확인된 개선점, 다음 조치를 포함하세요. 근거가 없는 개선 효과는 단정하지 마세요.'},
 audit:{icon:'🔎',title:'AI 결과 오류 검증',subtitle:'AI가 만든 요약의 숫자, 해석, 보안 문제를 찾아요',skill:'사실 확인 · 안전한 AI 활용',
  objective:'아래 AI 초안에서 문제가 되는 문장을 골라 원자료에 근거한 수정 이유를 작성하세요.',
  facts:[['교육 대상','50명'],['수료 인원','46명'],['교육 만족도','4.3 / 5.0'],['실습 시간 부족 의견','12건']],
  brief:'AI가 작성한 6개 문장 중 잘못된 수치, 근거 없는 원인 추정, 개인정보 위험을 구분하세요.'},
 workflow:{icon:'⚙️',title:'AI 업무 개선 설계',subtitle:'반복 업무를 안전하게 자동화하는 과정을 제안해요',skill:'업무 문제 정의 · 실행 가능성',
  objective:'교육 안내 메일 발송 업무를 AI와 자동화한다면 어떤 절차와 통제가 필요할지 제안하세요.',
  facts:[['발송 기준','교육일 D-7, D-3'],['발송 시간','한국시간 오전 9시'],['휴일 처리','주말·공휴일이면 직전 근무일'],['발송 방식','교육생별 개별 발송'],['원본 데이터','가상 LMS 명단·교육 품의안']],
  brief:'수신자별 잘못된 발송을 방지하고, 개인정보·검토·예외 처리까지 고려한 업무 개선안을 작성하세요.'}
};
const AUDIT_LINES=[
 {id:'n1',text:'① 이번 교육에는 총 60명이 참여 대상으로 선정되었다.',wrong:true,reason:'교육 대상은 50명이므로 60명은 잘못된 수치입니다.'},
 {id:'n2',text:'② 46명이 수료하여 수료율은 92%이다.',wrong:false,reason:'46 ÷ 50 = 92%로 원자료와 일치합니다.'},
 {id:'n3',text:'③ 교육 만족도는 4.8점(5점 만점)을 기록했다.',wrong:true,reason:'교육 만족도 원자료는 4.3점입니다.'},
 {id:'n4',text:'④ 실습 시간 부족 의견 12건은 직원의 AI 활용 능력이 낮아서 발생했다.',wrong:true,reason:'불만 건수만으로 원인을 AI 활용 역량으로 단정할 수 없습니다.'},
 {id:'n5',text:'⑤ 교육 효과 검증을 위해 교육생 실명 명단을 공개 AI 서비스에 업로드한다.',wrong:true,reason:'실명 명단을 승인 없이 외부 AI에 전송하면 개인정보·보안 위험이 있습니다.'},
 {id:'n6',text:'⑥ 다음 차수에는 실습 시간 확대를 검토할 수 있다.',wrong:false,reason:'불만 사항을 근거로 검토할 개선안으로는 타당합니다.'}
];
const LAB_CRITERIA={
 report:[['requirement','요구사항·대상 이해'],['prompt','프롬프트의 맥락·조건'],['verification','원자료 대조 및 검증'],['output','최종 보고서 품질']],
 audit:[['facts','수치 오류 탐지'],['interpretation','근거 없는 해석 식별'],['privacy','개인정보·보안 검토'],['correction','수정과 이유 설명']],
 workflow:[['problem','반복 업무의 문제 정의'],['design','업무 흐름 설계'],['safeguard','검토·보안·예외 처리'],['realism','도입 가능성 및 개선 검증']]
};
const freshLab=()=>({prompt:'',messages:[],finalText:'',evidence:'',issues:[],feedback:null,submittedAt:null,mode:null});
S.skillLab=S.skillLab&&typeof S.skillLab==='object'?S.skillLab:{};
for(const key of Object.keys(LABS)){
  const old=S.skillLab[key];
  S.skillLab[key]={...freshLab(),...(old&&typeof old==='object'?old:{})};
  if(!Array.isArray(S.skillLab[key].messages))S.skillLab[key].messages=[];
  if(!Array.isArray(S.skillLab[key].issues))S.skillLab[key].issues=[];
}
const labCompleted=()=>Object.values(S.skillLab||{}).filter(x=>!!x.submittedAt).length;
const labReady=()=>hasAI();
function labBase(id){if(!S.skillLab||typeof S.skillLab!=='object')S.skillLab={};if(!S.skillLab[id])S.skillLab[id]=freshLab();return S.skillLab[id]}
function labPersistDraft(id){const s=labBase(id);const prompt=$('skillPrompt'),final=$('skillFinal'),ev=$('skillEvidence');if(prompt)s.prompt=prompt.value.slice(0,1400);if(final)s.finalText=final.value.slice(0,4200);if(ev)s.evidence=ev.value.slice(0,1800);save()}
function labAlert(message){const e=$('skillNotice');if(e){e.textContent=message;e.hidden=false}else toast(message)}
function labModeBadge(){return labReady()?'<span class="skillLive">● LIVE AI 연결</span>':'<span class="skillDemo">○ 데모 체험 · API 미연결</span>'}
function labFacts(id){return `<div class="labSource"><div class="labSourceTitle">📎 제공 자료 · 가상 데이터</div><div class="labFacts">${LABS[id].facts.map(([k,v])=>`<div><span>${htmlEscape(k)}</span><b>${htmlEscape(v)}</b></div>`).join('')}</div></div>`}
function labMissionSummary(id){const m=LABS[id],s=labBase(id);return `<button type="button" class="labTile" data-skill-mission="${id}"><span class="labTileIcon">${m.icon}</span><span class="labTileText"><b>${m.title}</b><small>${m.subtitle}</small><span class="labTileTag">${m.skill}</span></span><span class="labTileState">${s.submittedAt?'✓ 실습 기록됨':s.messages.length?'이어하기':'도전하기'} →</span></button>`}
function showSkillLab(){const html=`<div class="skillLabRoot"><div class="labHero"><div class="labHeroIcon">🧠</div><div><b>AI로 업무를 해결하는 경험</b><p>퀴즈 점수가 아닌, 프롬프트와 실제 산출물, 검증 근거를 기록해요.</p>${labModeBadge()}</div></div><div class="labThree">${['업무 파악','AI 활용·검증','근거 기반 피드백'].map((x,i)=>`<span>${i+1}. ${x}</span>`).join('')}</div><div class="labHubHeading"><b>실무 미션 3개</b><small>${labCompleted()} / 3 실습 기록</small></div><div class="labTiles">${Object.keys(LABS).map(labMissionSummary).join('')}</div><div class="featureNotice">⚠ <b>학습용 시뮬레이션</b>입니다. 완료 기록이나 AI의 코멘트는 실제 직무 역량 인증 또는 인사평가 점수가 아닙니다. 실명·사내 기밀은 입력하지 마세요.</div></div>`;
 modal({title:'AI Skill Lab',label:'NOVA LAB · PRACTICE & REFLECTION',art:'workspace',html,actions:[{text:'My Skill Passport',secondary:true,fn:showPassport},{text:'AI 연결 설정',secondary:true,fn:showAISettings},{text:'온보딩으로 돌아가기',fn:closeModal}]});
 document.querySelectorAll('[data-skill-mission]').forEach(b=>b.addEventListener('click',()=>showSkillMission(b.dataset.skillMission)));
}
function labAuditPicker(){const issues=new Set(labBase('audit').issues);return `<div class="labSectionTitle">STEP 1 · 문제가 되는 문장 선택 (복수 선택 가능)</div><div class="labAuditList">${AUDIT_LINES.map(x=>`<label class="labAuditItem"><input type="checkbox" data-lab-issue="${x.id}" ${issues.has(x.id)?'checked':''}><span>${htmlEscape(x.text)}</span></label>`).join('')}</div><small class="labHint">일부 문장은 정확합니다. 틀린 것만 선택해 보세요.</small>`}
function labTranscript(id){const history=labBase(id).messages;if(!history.length)return `<div class="labEmpty">아직 AI와 대화한 기록이 없어요. 아래에서 업무 요청을 직접 작성해 보세요.</div>`;
 return `<div class="labTalk">${history.slice(-8).map(m=>`<div class="labBubble ${m.role==='assistant'?'fromAi':'fromUser'}"><span>${m.role==='assistant'?(m.mode==='live'?'🤖 실제 AI 응답':'🎬 데모 예시 응답'):'👤 내 요청'}</span><div>${htmlEscape(m.text)}</div></div>`).join('')}</div>`}
function labCheckSample(id){if(id==='report')return '참고: 실제 업무에서는 보고 대상, 목적, 제공된 수치, 요청 산출물, 검증 조건을 구체적으로 전달해 보세요.';
if(id==='workflow')return '참고: 트리거, 입력 데이터, 일정 계산, 사람의 검토, 발송 기록, 실패 시 처리 방법을 고려해 보세요.';
return '참고: 발견한 오류에 표시하고, 원자료를 근거로 수정 문장을 작성해 보세요.'}
function labFeedbackPanel(id){const s=labBase(id);if(!s.feedback)return '';
const f=s.feedback;
if(f.mode==='demo')return `<div class="labReview"><div class="labSectionTitle">📋 제출 후 체크리스트 <span class="skillDemo">규칙 기반 데모</span></div><div class="featureNotice">이 결과는 간단한 항목 확인으로 만든 피드백이며 AI의 실제 평가가 아닙니다. 오답·정답의 일부만 자동으로 검토할 수 있어요.</div>${(f.checklist||[]).map(x=>`<div class="labCriterion"><span>${x.ok?'✅':'◻️'} ${htmlEscape(x.label)}</span><small>${htmlEscape(x.note)}</small></div>`).join('')}${f.audit?`<div class="featureNotice"><b>선택한 문제 문장: ${f.audit.hit}/4개 발견</b> · 정확한 문장 오선택 ${f.audit.falsePositive}개<br>정답 설명:<div class="labTiny">${AUDIT_LINES.map(x=>`${htmlEscape(x.text)} — ${htmlEscape(x.reason)}`).join('<br><br>')}</div></div>`:''}<p class="labHint">재도전해서 새 기록으로 교체할 수 있어요. 이 체크는 AI 역량 점수가 아니에요.</p></div>`;
return `<div class="labReview"><div class="labSectionTitle">📋 실제 AI의 수행 피드백 <span class="skillLive">참고용 · 점수 아님</span></div><div class="featureNotice">${htmlEscape(f.summary||'수행 결과를 바탕으로 피드백을 제공해요.')}</div>${(f.criteria||[]).map(c=>`<div class="labCriterion"><span><b>${htmlEscape(c.name)}</b><em>${htmlEscape(c.level)}</em></span><small><b>확인 근거:</b> ${htmlEscape(c.evidence)}<br><b>개선 방향:</b> ${htmlEscape(c.next)}</small></div>`).join('')}<div class="featureNotice"><b>다음 학습 추천:</b> ${htmlEscape(f.nextAction||'원자료와 결과물을 다시 대조해 보세요.')}</div><p class="labHint">AI가 제공한 학습 피드백으로, 검증된 역량진단이나 공식 인사평가가 아닙니다.</p></div>`}
function showSkillMission(id){if(!LABS[id])return showSkillLab();const m=LABS[id],s=labBase(id);const audit=id==='audit';const html=`<div class="skillLabRoot skillMission"><div class="labJourneyTop"><span>${m.icon} ${htmlEscape(m.skill)}</span>${labModeBadge()}</div><p class="labObjective">${htmlEscape(m.objective)}</p><div class="labBrief"><b>팀장의 요청</b><p>${htmlEscape(m.brief)}</p></div>${labFacts(id)}
 ${audit?labAuditPicker():''}
 <div class="labSectionTitle">${audit?'STEP 2':'STEP 1'} · AI에게 직접 요청하기</div><p class="labHint">AI를 이용해 고민하고 개선하는 과정이 남아요. API가 없으면 고정된 예시 응답을 볼 수 있어요.</p>${labTranscript(id)}<label class="labFieldLabel" for="skillPrompt">내 프롬프트 <span>직접 작성 / 최대 1,400자</span></label><textarea class="featureInput featureText labInput" id="skillPrompt" maxlength="1400" rows="4" placeholder="예: 제공 자료만 사용해서 보고서를 작성해 줘. 수치는 ...">${htmlEscape(s.prompt)}</textarea>
 <div class="labInlineActions"><button class="featureAction" id="labAsk">${labReady()?'🤖 실제 AI에게 보내기':'🎬 데모 예시 응답 보기'}</button><button class="featureAction secondary" id="labConnect">${labReady()?'⚙ 연결 설정':'🔗 실제 AI 연결하기'}</button></div>
 <div class="labSectionTitle">${audit?'STEP 3':'STEP 2'} · 최종 산출물 작성</div><p class="labHint">AI 답변을 그대로 제출하지 말고, 원자료와 비교해 본인이 완성한 내용을 작성하세요.</p><label class="labFieldLabel" for="skillFinal">${audit?'오류 수정안':'최종 결과물'} <span>최소 50자</span></label><textarea class="featureInput featureText labInput" id="skillFinal" maxlength="4200" rows="6" placeholder="${audit?'잘못된 문장을 어떻게 수정할지 근거와 함께 작성하세요.':'AI 답변을 검토한 후 제출할 최종 보고서 또는 업무 개선안을 작성하세요.'}">${htmlEscape(s.finalText)}</textarea>
 <label class="labFieldLabel" for="skillEvidence">검증 및 판단 근거 <span>최소 15자</span></label><textarea class="featureInput featureText labInput" id="skillEvidence" maxlength="1800" rows="3" placeholder="원자료에서 무엇을 확인했고, AI 출력 중 무엇을 수정했나요?">${htmlEscape(s.evidence)}</textarea>
 <p class="labHint">${labCheckSample(id)}</p><div class="labInlineActions"><button class="featureAction" id="labSubmit">${labReady()?'📋 수행 피드백 받기 (실제 AI)':'📋 체크리스트로 자기점검'}</button><button class="featureAction secondary" id="labBack">← 실습 목록</button></div><p id="skillNotice" class="labNotice" hidden></p>${labFeedbackPanel(id)}</div>`;
 modal({title:m.title,label:'AI SKILL LAB · PRACTICAL TASK',art:'workspace',html,actions:[{text:'Skill Passport',secondary:true,fn:showPassport},{text:'실습 목록',fn:showSkillLab}]});
 const ask=$('labAsk'),submit=$('labSubmit');
 document.querySelectorAll('[data-lab-issue]').forEach(ch=>ch.addEventListener('change',()=>{const st=labBase('audit');st.issues=[...document.querySelectorAll('[data-lab-issue]:checked')].map(e=>e.dataset.labIssue);st.feedback=null;st.submittedAt=null;save()}));
 for(const el of ['skillPrompt','skillFinal','skillEvidence'])$(el).addEventListener('change',()=>labPersistDraft(id));
 ask.addEventListener('click',()=>sendSkillPrompt(id));submit.addEventListener('click',()=>submitSkillMission(id));$('labConnect').onclick=()=>{labPersistDraft(id);showAISettings()};$('labBack').onclick=()=>{labPersistDraft(id);showSkillLab()};
 // Open-ended work needs a larger dialog than the quick onboarding NPC dialogs.
 document.querySelector('.modal')?.classList.add('skillLabModal');
}
function demoSkillReply(id){if(id==='report')return '【시연용 고정 예시 · 실제 AI 호출 아님】\n교육 운영 결과 보고서 초안\n• 교육 대상 50명 중 46명 수료(수료율 92%)\n• 만족도 4.3/5.0, 실습 시간 부족 의견 12건\n• 개선 제안: 다음 차수 실습 시간을 늘리는 방안 검토\n※ 만족도 변화나 성과 향상률 등 제공되지 않은 수치는 추정하지 않았습니다.';
if(id==='audit')return '【시연용 고정 예시 · 실제 AI 호출 아님】\n원자료(대상 50명, 수료 46명, 만족도 4.3점)와 AI 초안을 줄마다 비교하세요. 특히 정확한 수치와 추정한 원인, 외부 AI에 제공할 수 없는 자료를 구별해 보세요.';
return '【시연용 고정 예시 · 실제 AI 호출 아님】\n1. 교육 일정과 수신자 목록을 가상 LMS 파일에서 읽음\n2. 한국시간 09:00 D-7/D-3 발송일을 주말·공휴일 보정하여 계산\n3. 교육 담당자가 명단/본문을 검토하고 승인\n4. 교육생별 개별 전송, 발송 이력 및 실패 알림 기록\n5. 실제 개인정보와 API 사용 권한은 별도 검토';}
async function skillRequest(task,data){const config=aiConfig();if(!labReady())throw Error('AI 연결 설정에서 Vercel 주소와 접속 코드를 등록해 주세요.');const ctl=new AbortController(), timer=setTimeout(()=>ctl.abort(),26000);
 try{const resp=await fetch(config.url,{method:'POST',headers:{'content-type':'application/json','x-demo-code':config.code},body:JSON.stringify({task,data}),signal:ctl.signal,cache:'no-store'});const j=await resp.json().catch(()=>({}));if(!resp.ok)throw Error(j.error||`AI API 응답 오류 ${resp.status}`);return j}
 catch(e){if(e.name==='AbortError')throw Error('AI 응답 시간이 초과됐어요. 다시 시도해 주세요.');throw e}finally{clearTimeout(timer)}}
async function sendSkillPrompt(id){labPersistDraft(id);const s=labBase(id),p=s.prompt.trim();if(p.length<15)return labAlert('AI에게 요청할 내용을 15자 이상 직접 작성해 주세요.');
 const btn=$('labAsk');btn.disabled=true;btn.textContent=labReady()?'AI가 응답하는 중…':'예시를 여는 중…';$('skillNotice').hidden=true;
 try{const demo=!labReady();const r=demo?{text:demoSkillReply(id)}:await skillRequest('skill_chat',{mission:id,prompt:p,history:s.messages.slice(-6).map(x=>({role:x.role,text:x.text.slice(0,1200)}))});
   s.messages.push({role:'user',text:p,mode:demo?'demo':'live',at:new Date().toISOString()},{role:'assistant',text:(r.text||'').slice(0,2600),mode:demo?'demo':'live',at:new Date().toISOString()});s.messages=s.messages.slice(-10);s.prompt='';s.feedback=null;s.submittedAt=null;save();showSkillMission(id);
 }catch(e){labAlert(e.message);btn.disabled=false;btn.textContent='다시 요청하기'}}
function demoSkillChecks(id,s){const t=s.finalText,ev=s.evidence,all=t+' '+ev;const list=[];const add=(label,ok,note)=>list.push({label,ok:!!ok,note});
 if(id==='report'){
  add('대상·수료 인원 원자료 반영',/50/.test(t)&&/46/.test(t),'50명, 46명 수치를 실제 원자료와 대조했는지 확인하세요.');
  add('만족도와 불만 사항 반영',/4[.]3/.test(t)&&/12/.test(t),'4.3점 및 실습시간 부족 12건을 포함했는지 확인하세요.');
  add('원인 추정에 대한 주의',/근거|확인|추정|원자료|단정|검증|원인/.test(all),'확인되지 않은 개선 효과나 원인을 사실로 쓰지 않도록 점검하세요.');
  add('실행할 개선안 포함',/개선|검토|확대|실습|차수|운영/.test(t),'다음 교육을 위한 구체적 조치가 제시됐는지 확인하세요.');
 }else if(id==='audit'){
  const wrong=new Set(AUDIT_LINES.filter(x=>x.wrong).map(x=>x.id));const picks=new Set(s.issues);
  add('오류 후보 선택',s.issues.length>0,'잘못된 숫자, 근거 없는 주장, 보안 문제를 선택했는지 확인하세요.');
  add('원자료를 근거로 수정',/50|4[.]3/.test(t),'수정한 문장에 확인된 숫자 또는 근거가 있는지 살펴보세요.');
  add('해석 오류 설명',/단정|원인|근거|추정|검증/.test(all),'오류의 이유와 불확실성을 설명해 보세요.');
  add('개인정보 위험 인지',/개인정보|실명|명단|보안|민감/.test(all),'AI에 자료를 전달할 때 정보 보호를 고려했는지 점검하세요.');
  return {mode:'demo',checklist:list,audit:{hit:[...picks].filter(x=>wrong.has(x)).length,falsePositive:[...picks].filter(x=>!wrong.has(x)).length}};
 }else{
  add('교육 안내 기준 반영',/D.?7|7일|일주일/.test(t)&&/D.?3|3일/.test(t),'D-7, D-3 발송 기준을 반영했는지 확인하세요.');
  add('주말·휴일과 발송시간',/휴일|주말|공휴일/.test(t)&&/9시|09:00|오전 9/.test(t),'한국시간 9시와 직전 근무일 보정을 설명했는지 확인하세요.');
  add('검토·정보 보호',/승인|검토|확인|개인정보|보안/.test(all),'사람의 검토 및 개인정보 보호 방안을 포함했는지 확인하세요.');
  add('오류·이력 관리',/기록|이력|재시도|실패|오류|로그/.test(all),'발송 실패와 사후 확인 방안을 검토해 보세요.');
 }
 return {mode:'demo',checklist:list};}
async function submitSkillMission(id){labPersistDraft(id);const s=labBase(id);if(s.finalText.trim().length<50)return labAlert('최종 산출물을 50자 이상 작성해 주세요.');if(s.evidence.trim().length<15)return labAlert('검증 근거를 15자 이상 작성해 주세요.');if(s.messages.filter(m=>m.role==='user').length===0)return labAlert('AI에게 업무를 요청하는 실습부터 해 주세요. 데모 모드에서도 진행할 수 있어요.');
 const btn=$('labSubmit');btn.disabled=true;btn.textContent=labReady()?'실습 피드백을 생성하는 중…':'체크리스트 확인 중…';$('skillNotice').hidden=true;
 try{let f;if(labReady()){
   const r=await skillRequest('skill_assess',{mission:id,promptTrail:s.messages.filter(m=>m.role==='user').map(m=>m.text).slice(-4),finalText:s.finalText,evidence:s.evidence,issues:id==='audit'?s.issues:[]});
   if(!r.assessment||!Array.isArray(r.assessment.criteria))throw Error('피드백 응답의 형식을 확인하지 못했어요. 다시 시도해 주세요.');
   f={mode:'live',...r.assessment};
 }else f=demoSkillChecks(id,s);
 s.feedback=f;s.submittedAt=new Date().toISOString();s.mode=f.mode;save();showSkillMission(id);
 }catch(e){labAlert(e.message);btn.disabled=false;btn.textContent='다시 제출하기';}}
function showLabPracticeReport(){const completed=labCompleted();const html=`<div class="featureKicker">AI SKILL LAB · PRACTICE EVIDENCE</div><div class="featureNotice"><b>실무 실습 기록 ${completed}/3</b><br>아래는 실습 완료 여부와 피드백 생성 방식만 나타냅니다. 게임 점수나 역량 인증이 아닙니다.</div><table class="miniTable"><tbody>${Object.entries(LABS).map(([id,m])=>{const x=labBase(id);return `<tr><td>${m.icon} ${htmlEscape(m.title)}</td><td>${x.submittedAt?'완료 · '+(x.mode==='live'?'AI 피드백':'자가 체크리스트'):'미완료'}</td></tr>`}).join('')}</tbody></table><button type="button" class="featureAction secondary" id="toLab">AI Skill Lab 열기</button>`;const area=$('modalContent');if(area){area.insertAdjacentHTML('beforeend',html);$('toLab').onclick=showSkillLab}}
const oldShowPassport=showPassport;showPassport=function(){oldShowPassport();showLabPracticeReport()};
const oldShowLearningReport=showLearningReport;showLearningReport=function(){oldShowLearningReport();showLabPracticeReport()};
const oldShowAnalytics=showAnalytics;showAnalytics=function(){oldShowAnalytics();showLabPracticeReport()};
const oldCreateReportText=createReportText;createReportText=function(){return oldCreateReportText()+'\n\n[AI Skill Lab · 실무 수행 기록]\n'+Object.entries(LABS).map(([id,m])=>`${m.title}: ${labBase(id).submittedAt?'실습 기록됨 ('+(labBase(id).mode==='live'?'AI 피드백':'자가 체크리스트')+')':'미완료'}`).join('\n')+'\n※ 미검증 학습 기록이며 공식 역량 인증이 아닙니다.'};
const oldShowAiGameHubLab=showAiGameHub;showAiGameHub=function(q){oldShowAiGameHubLab(q);const el=$('modalContent');if(!el)return;const block=document.createElement('div');block.className='featureNotice';block.innerHTML='<b>🧠 실전으로 이어가기</b><p>기존 Report Lab과 Meeting Lab은 첫날의 AI 기초 체험이에요. 더 깊이 연습하려면 AI Skill Lab에서 직접 결과물을 만들어 보세요.</p><button type="button" class="featureAction" id="jumpSkillLab">AI Skill Lab 도전 →</button>';el.appendChild(block);$('jumpSkillLab').onclick=showSkillLab};
const unstyledModalForLab=modal;modal=function(params){document.querySelector('.modal')?.classList.remove('skillLabModal');return unstyledModalForLab(params)};
function attachSkillLabNav(){const nav=document.querySelector('nav.nav');if(!nav||nav.querySelector('[data-feature="skilllab"]'))return;
 const b=document.createElement('button');b.type='button';b.dataset.feature='skilllab';b.className='navSkillPrimary';b.innerHTML='<span class="ico">🧠</span> AI Skill Lab <small>NEW</small>';
 b.onclick=()=>{document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');showSkillLab()};
 const passport=nav.querySelector('[data-feature="passport"]');if(passport)passport.before(b);else nav.appendChild(b);
}

attachNavV6();
attachSkillLabNav();

})();
