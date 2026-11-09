const chapters = [
  ['2026.01 — 2026.11','这一年，\n我还在往前走','有些决定，说了很久。\n有些路，走到一半才知道要拐弯。',7,'walk'],
  ['一月 · 先动手','“别先看完教程，\n才开始动手。”','年初，你就这样跟朋友说。\n脑子里的新点子，总想亲手试一次。',1,'close'],
  ['二月 · 方向','“我想走未来五年\n对的路。”','你开始认真想 AI、独立开发和自己的产品。\n未来那么远，你已经有点坐不住了。',0,'still'],
  ['春天 · 下班以后','还想给自己\n多留一种可能','你折腾服务器，琢磨新的应用。\n白天有白天的事，心里还有自己的事。',2,'still'],
  ['六月 · 一点点做出来','“最近的产出，\n我觉得很有价值。”','从一个想法，到屏幕里能用的东西。\n这种时候，再忙也会有一点高兴。',1,'close'],
  ['夏天 · 普通日子','饭还是要好好吃','你会给喜欢的人做饭。\n那些聊不完的计划，也得等锅里的菜先出锅。',3,'none'],
  ['七月 · 远方','想用自己的方式，\n走一遍世界','你说，成家之前，一定要这样走一遍。\n那时它还是个愿望，你把它说得很认真。',4,'still'],
  ['八月 · 一个念头','让微信里的话，\n真的变成行动','你想把聊天接进来，让任务自己创建、执行，\n做好以后，再从微信告诉你。',2,'close'],
  ['九月 · 一起试试','有机会的时候，\n也想拉朋友一把','你补硬件产品的知识，也找朋友聊新的方向。\n有些事，一个人想过之后，还想有人一起做。',0,'still'],
  ['九月二十八日','“已提离职，望周知。”','这几个字，终于被你发了出去。\n准备了那么久，你当时是真的想往前走。',5,'walk'],
  ['国庆 · 云南','“一个人去徒步，\n真的太爽了。”','你去了丽江，也聊起茶马古道。\n暂时把事情放一放，先看看眼前的山。',4,'walk'],
  ['十月 · 生活','“我想把日子\n过好一点。”','十月八日，你跟朋友说了这句话。\n工作、住处、喜欢的人，都在你想过的以后里。',3,'none'],
  ['十月二十八日 · 雨停之前','那条路，\n没能照想象走下去','新的机会没有顺利落定，你撤回了离职。\n你说很无力，后来又说，轻松了。',6,'still'],
  ['十一月 · 再试一次','你又开始动手了','你开始用 AI 帮忙投简历。\n八月想过的微信任务，这时也真的跑了起来。',2,'close'],
  ['写给现在的自己','原来我还想继续','这一年，你兴奋过，生气过，也失望过。\n可碰到一个新想法，你还是会想试试看。',7,'walk'],
  ['未完待续','慢一点，\n也往自己想去的地方走','愿接下来的日子，有做得成的事，\n有热饭、有朋友，也有出发的时候。',7,'still']
];
const story = document.querySelector('#story');
const lineBreaks = text => text.replaceAll('\n','<br>');
chapters.forEach(([date,title,text,background,pose],index) => {
  const section = document.createElement('section');
  section.className = `chapter ${index === 0 ? 'cover' : ''} ${index === 12 ? 'rain' : ''}`;
  section.id = index === 0 ? 'opening' : `scene-${index+1}`;
  section.innerHTML = `
    <div class="scene" style="--bx:${background%2*100}%;--by:${Math.floor(background/2)*100/3}%">
      <div class="backdrop"></div>
      ${pose === 'none' ? '' : `<div class="hero ${pose}" aria-hidden="true"></div>`}
      <div class="light"></div><div class="weather"></div>
    </div>
    <div class="copy"><div class="date">${date}</div>
      <${index===0?'h1':'h2'}>${lineBreaks(title)}</${index===0?'h1':'h2'}>
      <p>${lineBreaks(text)}</p>
      ${index===0?'<button id="start">播放这一年的故事</button>':''}
      ${index===15?'<p class="note">据可读取的群聊与私聊整理至 2026.11.10。<br>人物与场景为原创 AI 动画演绎。</p>':''}
    </div>`;
  story.append(section);
});
const sections = [...document.querySelectorAll('.chapter')];
let playing = false;
let scrollPosition = 0;
let previousTime = 0;
let currentScene = 0;
function updateScene() {
  const center = scrollY + innerHeight * .5;
  sections.forEach((section,index) => {
    section.classList.toggle('visible',section.offsetTop < scrollY+innerHeight && section.offsetTop+section.offsetHeight > scrollY);
    if(section.offsetTop<=center) currentScene=index;
  });
  document.querySelector('#position').textContent = `${currentScene+1} / ${sections.length}`;
}
function setPlaying(enabled) {
  playing=enabled;
  previousTime=0;
  scrollPosition=scrollY;
  document.body.classList.toggle('paused',!enabled);
  document.querySelector('#play').textContent=enabled?'Ⅱ 暂停':'▶ 继续';
  setMusic(enabled);
}
function animate(time) {
  if(playing&&!document.hidden) {
    if(previousTime) {
      scrollPosition+=Math.min(time-previousTime,80)*innerHeight/24000;
      window.scrollTo(0,scrollPosition);
      if(scrollY>=document.documentElement.scrollHeight-innerHeight-1) setPlaying(false);
    }
    previousTime=time;
  } else previousTime=0;
  requestAnimationFrame(animate);
}
document.querySelector('#start').onclick=()=>setPlaying(true);
document.querySelector('#play').onclick=()=>{
  if(scrollY>=document.documentElement.scrollHeight-innerHeight-2) scrollTo(0,0);
  setPlaying(!playing);
};
document.querySelector('#restart').onclick=()=>{scrollTo(0,0);setPlaying(true)};
for(const eventName of ['wheel','touchstart']) addEventListener(eventName,()=>{if(playing)setPlaying(false)},{passive:true});
addEventListener('scroll',updateScene,{passive:true});
addEventListener('resize',()=>{scrollPosition=scrollY;updateScene()});
let audioContext;
let musicOn=false;
let musicTimer;
let nextBeat=0;
let beatIndex=0;
// Original 6/8 theme with a soft piano-like lead, sustained harmony and bass.
const tune=[71,74,78,76,74,71,69,71,74,73,71,69,67,71,74,78,76,74,69,73,76,74,73,69];
const chords=[[55,59,62],[50,54,57],[52,55,59],[48,52,55]];
function tone(midi,time,duration,volume,warm=false) {
  const envelope=audioContext.createGain();
  envelope.gain.setValueAtTime(.0001,time);
  envelope.gain.exponentialRampToValueAtTime(volume,time+(warm?.4:.025));
  envelope.gain.exponentialRampToValueAtTime(.0001,time+duration);
  envelope.connect(audioContext.destination);
  for(const [harmonic,weight] of [[1,1],[2,.14],[3,.045]]) {
    const oscillator=audioContext.createOscillator();
    const gain=audioContext.createGain();
    oscillator.type='sine';
    oscillator.frequency.value=440*2**((midi-69)/12)*harmonic;
    gain.gain.value=weight;
    oscillator.connect(gain);gain.connect(envelope);
    oscillator.start(time);oscillator.stop(time+duration+.1);
  }
}
function scheduleMusic() {
  if(!musicOn||document.hidden)return;
  while(nextBeat<audioContext.currentTime+.5) {
    const chord=chords[Math.floor(beatIndex/12)%4];
    tone(chord[beatIndex%3]+12,nextBeat,2.5,.018);
    if(beatIndex%2===0)tone(tune[Math.floor(beatIndex/2)%tune.length],nextBeat,3.2,.035);
    if(beatIndex%12===0) {
      chord.forEach(note=>tone(note,nextBeat,6,.012,true));
      tone(chord[0]-12,nextBeat,5.5,.022,true);
    }
    nextBeat+=.38;beatIndex++;
  }
  musicTimer=setTimeout(scheduleMusic,180);
}
async function setMusic(enabled) {
  try {
    if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();
    musicOn=enabled;clearTimeout(musicTimer);
    if(enabled){await audioContext.resume();nextBeat=audioContext.currentTime+.05;scheduleMusic()}
    else await audioContext.suspend();
    document.querySelector('#sound').textContent=enabled?'♫ 音乐开':'♫ 音乐关';
    document.querySelector('#sound').setAttribute('aria-pressed',String(enabled));
  } catch {document.querySelector('#sound').textContent='音乐暂不可用'}
}
document.querySelector('#sound').onclick=()=>setMusic(!musicOn);
document.addEventListener('visibilitychange',()=>{
  previousTime=0;
  if(!audioContext||!musicOn)return;
  clearTimeout(musicTimer);
  if(document.hidden)audioContext.suspend();
  else audioContext.resume().then(()=>{nextBeat=audioContext.currentTime+.05;scheduleMusic()});
});
updateScene();requestAnimationFrame(animate);
