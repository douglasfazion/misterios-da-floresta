import Phaser from './phaser-runtime';
import {WalkScene} from './WalkScene';
new Phaser.Game({
 type:Phaser.AUTO,parent:'game',width:1280,height:720,
 backgroundColor:'#071019',render:{antialias:true,roundPixels:false},
 scene:[WalkScene],audio:{noAudio:true},
 scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
});
