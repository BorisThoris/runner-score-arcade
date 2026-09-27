import musicBack from "../assets/backMusic(2).mp3";
import gameOver from "../assets/gameOver.mp3";
import PlayerMover from "../help-scripts/playerMovement";
import spriteSheethelper from "../help-scripts/loadSpriteSheets";
import imageHelper from "../help-scripts/loadImages";
import animationsHelper from "../help-scripts/animationsHelper";
import arcadeShell from "../game/arcadeShell";
import { readRecords, saveRun } from "../game/records";

export default class DodgeGame extends Phaser.Scene {
  constructor() { super({ key: 'gameScene' }); this.state = 'ready'; }
  preload() {
    new spriteSheethelper().loadSpriteSheets(this.load);
    new imageHelper().loadImages(this.load);
    this.load.audio('musicBack', musicBack); this.load.audio('gameOver', gameOver);
  }
  create() {
    this.timer=0; this.score=0; this.lives=3; this.wave=1; this.gameOver=false; this.paused=false;
    this.pending=[]; this.spawnElapsed=0; this.pickupElapsed=0; this.invulnerable=0; this.effectRemaining=0; this.state='ready';
    this.records=readRecords(window.localStorage);
    this.sound.mute=true;
    this.music=this.cache.audio.exists('musicBack') ? this.sound.add('musicBack',{loop:true,volume:.25}) : null;
    this.endSound=this.cache.audio.exists('gameOver') ? this.sound.add('gameOver',{volume:.3}) : null;
    if (!this.anims.get('walkRight')) new animationsHelper().createAnimations(this.anims);
    this.add.tileSprite(640,360,1280,720,'background');
    this.add.tileSprite(640,698,1280,96,'ground');
    const floor=this.add.rectangle(640,687,1280,74,0x1d292a,0);
    this.physics.add.existing(floor,true);
    this.shadow=this.add.ellipse(640,645,115,18,0x32281d,.2);
    this.player=this.physics.add.sprite(640,540,'flex').setScale(.64).setCollideWorldBounds(true);
    this.player.setSize(100,225,true);this.player.anims.play('flex',true);
    this.playerMovementHelper=new PlayerMover(this.player);
    this.physics.add.collider(this.player,floor);
    this.spikes=this.physics.add.group();this.powerUps=this.physics.add.group();
    this.physics.add.overlap(this.player,this.spikes,(_,spike)=>this.spikeCollision(spike));
    this.physics.add.overlap(this.player,this.powerUps,(_,pickup)=>this.powerUpCollision(pickup));
    this.cursors=this.input.keyboard.createCursorKeys();
    this.ui=arcadeShell(this);
    this.ui.primary.disabled=false;this.ui.primary.textContent='Enter the arena';
    this.ui.best.textContent=this.records.length?String(this.records[0].score).padStart(4,'0'):'—';
    this.showRecords();
    const pause=()=>this.togglePause();
    const retry=()=>{if(this.state==='over')this.startRun();};
    const blur=()=>{if(this.state==='running')this.togglePause();this.releaseInput();};
    this.input.keyboard.on('keydown_P',pause);this.input.keyboard.on('keydown_ESC',pause);this.input.keyboard.on('keydown_R',retry);
    this.game.events.on('blur',blur);this.game.events.on('hidden',blur);
    this.events.once('shutdown',()=>{
      this.game.events.off('blur',blur);this.game.events.off('hidden',blur);
      this.input.keyboard.off('keydown_P',pause);this.input.keyboard.off('keydown_ESC',pause);this.input.keyboard.off('keydown_R',retry);
      if(this.music)this.music.destroy();if(this.endSound)this.endSound.destroy();
    });
    this.physics.pause();
  }
  releaseInput() {
    Object.values(this.cursors).forEach(key=>{key.isDown=false;key.isUp=true;});
    document.querySelectorAll('.held').forEach(button=>button.classList.remove('held'));
  }
  startRun() {
    this.spikes.clear(true,true);this.powerUps.clear(true,true);this.pending.forEach(item=>item.marker.destroy());this.pending=[];
    this.timer=0;this.score=0;this.lives=3;this.wave=1;this.gameOver=false;this.paused=false;
    this.spawnElapsed=0;this.pickupElapsed=0;this.invulnerable=0;this.effectRemaining=0;this.effectName='';
    this.player.setPosition(640,540).setVelocity(0,0).setAlpha(1);this.playerMovementHelper.reset();this.releaseInput();
    this.state='running';this.ui['run-panel'].hidden=true;this.ui.pause.disabled=false;this.ui.pause.innerHTML='Pause <kbd>P</kbd>';
    this.ui.message.textContent='Amber markers warn where the next spike will fall. Stars restore hearts.';
    this.physics.resume();this.anims.resumeAll();if(this.music){this.music.stop();this.music.play();}if(this.endSound)this.endSound.stop();
    this.game.canvas.tabIndex=0;this.game.canvas.setAttribute('aria-label','Dodge arena. Use arrow keys to move, jump and duck.');this.game.canvas.focus();
    this.updateHud();
  }
  updateHud() {
    this.ui.score.textContent=String(Math.floor(this.score)).padStart(4,'0');
    this.ui.lives.textContent='♥ '.repeat(this.lives).trim() || '—';
    this.ui.lives.setAttribute('aria-label',this.lives+' hearts remaining');
    this.ui.wave.textContent='WAVE '+String(this.wave).padStart(2,'0')+' / '+Math.floor(this.timer/1000)+'s';
    this.ui.effect.textContent=this.effectRemaining>0?this.effectName+' · '+Math.ceil(this.effectRemaining/1000)+'s':'Read the warning. Find your gap.';
  }
  showRecords() {
    this.ui.records.innerHTML='';
    this.records.forEach((record,index)=>{const row=document.createElement('li');row.textContent=String(index+1).padStart(2,'0')+'   '+record.score+' points   /   '+record.seconds+'s';this.ui.records.appendChild(row);});
  }
  togglePause() {
    if(this.state!=='running'&&this.state!=='paused')return;
    this.paused=this.state==='running';this.state=this.paused?'paused':'running';this.releaseInput();
    this.ui['run-panel'].hidden=!this.paused;
    this.ui.pause.innerHTML=this.paused?'Resume <kbd>P</kbd>':'Pause <kbd>P</kbd>';
    if(this.paused){
      this.physics.pause();this.anims.pauseAll();if(this.music)this.music.pause();
      this.ui['panel-eyebrow'].textContent='TAKE A BREATHER';this.ui['panel-title'].textContent='Your run is safe.';
      this.ui['panel-copy'].textContent='The arena, pickups and timer are frozen. Pick up exactly where you left off.';
      this.ui.primary.textContent='Resume run';this.ui.rules.hidden=false;this.ui.records.hidden=true;
      this.ui['panel-note'].textContent='P or Escape also resumes. Arrow keys move, jump and duck.';this.ui.primary.focus();
    }else{this.physics.resume();this.anims.resumeAll();if(this.music)this.music.resume();this.game.canvas.focus();}
  }
  spikeCollision(spike) {
    if(this.state!=='running'||this.invulnerable>0)return;
    spike.destroy();this.lives=Math.max(0,this.lives-1);this.invulnerable=1200;
    this.ui.message.textContent=this.lives?'Hit! Brief protection gives you time to find a gap.':'Run complete.';
    this.cameras.main.flash(100,185,95,48,false);this.updateHud();
    if(this.lives===0)this.gameOverFunc();
  }
  powerUpCollision(pickup) {
    if(this.state!=='running')return;
    const type=pickup.getData('kind');pickup.destroy();
    if(type==='heart'){this.lives=Math.min(5,this.lives+1);this.score+=50;this.ui.message.textContent='Star collected · +50 points and one heart (maximum five).';}
    else{this.effectRemaining=6000;this.effectName=type==='reverse'?'REVERSED CONTROLS':'QUICK FEET';this.playerMovementHelper.updateSpeed(type==='reverse'?-500:700);this.ui.message.textContent=type==='reverse'?'Reverse pickup! Left and right swap for six seconds.':'Speed pickup! Quick feet for six seconds.';}
    this.updateHud();
  }
  addSpike() {
    const x=60+Math.random()*1160;
    const marker=this.add.text(x,25,'▼',{font:'bold 32px Arial',fill:'#a55516'}).setOrigin(.5);
    this.pending.push({x,remaining:750,marker});
  }
  addPowerUp() {
    const roll=Math.random(),kind=roll<.55?'heart':roll<.8?'speed':'reverse';
    const key=kind==='heart'?'star 0':kind==='speed'?'powerUp 700':'reverse 500';
    const item=this.powerUps.create(60+Math.random()*1160,-40,key).setDisplaySize(44,44);
    item.setData('kind',kind);item.body.setAllowGravity(false);item.setVelocityY(160);item.setSize(item.width*.8,item.height*.8,true);
  }
  gameOverFunc() {
    if(this.state==='over')return;
    this.state='over';this.gameOver=true;this.physics.pause();this.anims.pauseAll();this.releaseInput();
    if(this.music)this.music.stop();if(this.endSound)this.endSound.play();
    const result=saveRun(window.localStorage,this.score,this.timer/1000);this.records=result.records;
    this.ui.best.textContent=String(this.records[0].score).padStart(4,'0');this.ui.pause.disabled=true;
    this.ui['run-panel'].hidden=false;this.ui['panel-eyebrow'].textContent='EVERY RUN TEACHES YOU SOMETHING';
    this.ui['panel-title'].textContent=Math.floor(this.score)+' points. Nice footwork.';
    this.ui['panel-copy'].textContent='You survived '+Math.floor(this.timer/1000)+' seconds and reached wave '+this.wave+'. Read the drop markers and leave yourself an escape route.';
    this.ui.primary.textContent='One more run';this.ui.rules.hidden=true;this.ui.records.hidden=false;
    this.ui['panel-note'].textContent=result.saved?'Your five best runs · saved on this device':'Storage unavailable · records kept for this session only';
    this.showRecords();this.ui.primary.focus();
  }
  update(time,delta) {
    if(this.state!=='running')return;
    const dt=Math.min(delta,80);this.timer+=dt;this.score+=dt*.01;this.spawnElapsed+=dt;this.pickupElapsed+=dt;
    this.wave=1+Math.floor(this.timer/20000);
    this.invulnerable=Math.max(0,this.invulnerable-dt);this.player.setAlpha(this.invulnerable>0?(Math.floor(this.invulnerable/120)%2?.4:1):1);
    if(this.effectRemaining>0){this.effectRemaining-=dt;if(this.effectRemaining<=0){this.playerMovementHelper.reset();this.ui.message.textContent='Normal controls restored.';}}
    if(this.spawnElapsed>=Math.max(340,1100-(this.wave-1)*130)){this.spawnElapsed=0;this.addSpike();}
    if(this.pickupElapsed>=5500){this.pickupElapsed=0;this.addPowerUp();}
    this.pending=this.pending.filter(item=>{
      item.remaining-=dt;item.marker.setAlpha(.45+.55*Math.abs(Math.sin(item.remaining/110)));
      if(item.remaining>0)return true;
      item.marker.destroy();const spike=this.spikes.create(item.x,-38,'spike').setDisplaySize(54,54);
      spike.setCircle(spike.width*.36,spike.width*.14,spike.height*.14);spike.body.setAllowGravity(false);spike.setVelocityY(Math.min(390,245+this.wave*18));return false;
    });
    this.playerMovementHelper.playerMovment(this.cursors);
    this.shadow.x=this.player.x;this.shadow.setScale(Math.max(.45,1-(645-this.player.y-80)/300));
    this.spikes.children.entries.slice().forEach(item=>{item.angle+=dt*.06;if(item.y>780)item.destroy();});
    this.powerUps.children.entries.slice().forEach(item=>{if(item.y>780)item.destroy();});
    this.updateHud();
  }
}
