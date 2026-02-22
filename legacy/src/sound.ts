import { Engine } from "./engine";

export class Sound {
  private isSoundOn = false;
  private soundList: Array<HTMLAudioElement> = [];
  private soundBtn = <HTMLButtonElement>document.querySelector("button.sound")!;
  backgroundMusicEl = <HTMLAudioElement>document.querySelector("#background-music")!;
  private pointSnd = new Audio("audio/add-point.wav");

  constructor(private engine: Engine) {
    this.soundBtn.addEventListener("click", () => {
      this.toggleSound();
    });
  }

  playAddPoint() {
    if(this.isSoundOn) {
      const pointSnd = new Audio("audio/add-point.wav");
      pointSnd.play();
    }
  }

  toggleSound() {
    if (this.isSoundOn) {
      this.isSoundOn = false;
      this.stopBackgroundMusic();
      this.soundBtn.classList.remove('sound-on');
      //this.engine.dayModal.updateSoundBtnText("Sound On");
    } else {
      this.isSoundOn = true;
      //this.playBackgroundMusic();
      this.soundBtn.classList.add('sound-on');
      //Graphics.updateSoundBtnText("Sound Off");
      //engine.dayModal.updateSoundBtnText("Sound Off");
    }
  }

  playBackgroundMusic() {
    this.backgroundMusicEl.play();
  }

  stopBackgroundMusic() {
    this.backgroundMusicEl.pause();
  }

  play(sound: HTMLAudioElement) {
    // if (!this.soundList[sound]) {
    //   this.soundList[sound] = new Audio(sound);
    //   this.soundList[sound].load();
    // }
    // this.soundList[sound].cloneNode(true).play();
  }

  updateSoundBtnText(text: string) {
    this.soundBtn.textContent = text;
  }
}
