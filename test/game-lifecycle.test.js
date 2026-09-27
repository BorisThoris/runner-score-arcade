const assert=require('assert'),fs=require('fs'),vm=require('vm'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'../app/scenes/dodgeGame.js'),'utf8').replace(/^import .*;$/gm,'').replace('export default class DodgeGame','class DodgeGame')+'\nmodule.exports=DodgeGame;';
const context={module:{exports:{}},Phaser:{Scene:class{}},console,Date,Math,document:{querySelectorAll:()=>[]}};vm.runInNewContext(source,context);const Game=context.module.exports;
describe('runner lifecycle',()=>{
 it('ignores rapid repeated damage and ends on the third separated hit',()=>{
  const game=new Game();game.state='running';game.lives=3;game.invulnerable=0;game.ui={message:{}};game.cameras={main:{flash(){}}};game.updateHud=()=>{};
  let ended=0,destroyed=0;game.gameOverFunc=()=>{ended++;game.state='over';};const hazard={destroy(){destroyed++;}};
  game.spikeCollision(hazard);game.spikeCollision(hazard);assert.equal(game.lives,2);assert.equal(destroyed,1);
  game.invulnerable=0;game.spikeCollision(hazard);assert.equal(ended,0);game.invulnerable=0;game.spikeCollision(hazard);game.spikeCollision(hazard);assert.equal(ended,1);assert.equal(game.lives,0);
 });
 it('freezes simulation while paused, then resumes and releases held controls',()=>{
  const game=new Game();game.state='running';game.timer=1250;game.cursors={left:{isDown:true,isUp:false}};
  const element=()=>({focus(){}});game.ui={};['run-panel','pause','panel-eyebrow','panel-title','panel-copy','primary','rules','records','panel-note'].forEach(key=>game.ui[key]=element());
  let pauses=0,resumes=0;game.physics={pause(){pauses++;},resume(){resumes++;}};game.anims={pauseAll(){},resumeAll(){}};game.game={canvas:element()};
  game.togglePause();game.update(9000,60);assert.equal(game.timer,1250);assert.equal(game.state,'paused');assert.equal(game.cursors.left.isDown,false);game.togglePause();assert.equal(game.state,'running');assert.equal(pauses,1);assert.equal(resumes,1);
 });
});
const recordsSource=fs.readFileSync(path.join(__dirname,'../app/game/records.js'),'utf8').replace(/export function/g,'function')+'\nmodule.exports={readRecords,saveRun};';const recordsContext={module:{exports:{}},JSON,Math,Number};vm.runInNewContext(recordsSource,recordsContext);const {readRecords,saveRun}=recordsContext.module.exports;
describe('personal records',()=>{
 it('rejects malformed and invalid records instead of breaking boot',()=>{assert.equal(readRecords({getItem:()=>'{broken'}).length,0);assert.equal(readRecords({getItem:()=>'[{"score":-1,"seconds":1},{"score":70,"seconds":7}]'}).length,1);});
 it('persists only the best five real runs',()=>{let data='[]';const storage={getItem:()=>data,setItem:(key,value)=>{data=value;}};[10,80,40,30,100,60].forEach(score=>saveRun(storage,score,score/10));assert.deepEqual(JSON.parse(data).map(row=>row.score),[100,80,60,40,30]);assert.equal(readRecords(storage)[0].seconds,10);});
 it('reports unavailable storage while retaining the current result',()=>{const result=saveRun({getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},95,9.5);assert.equal(result.saved,false);assert.equal(result.records[0].score,95);});
});
