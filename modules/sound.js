export const Sound = {
  isSoundOn: false,
  soundList: [],
  backgroundMusicEl: document.querySelector("#background-music"),

  init() {
    Sound.playAddPoint();
    if (Sound.isSoundOn) {
      Sound.playBackgroundMusic();
    }
  },

  playAddPoint: function () {
    this.play("audio/add-point.wav");
  },

  toggleSound: function () {
    if (this.isSoundOn) {
      this.isSoundOn = false;
      this.stopBackgroundMusic();
      Graphics.updateSoundBtnText("Sound On");
      engine.dayModal.updateSoundBtnText("Sound On");
    } else {
      this.isSoundOn = true;
      this.playBackgroundMusic();
      Graphics.updateSoundBtnText("Sound Off");
      engine.dayModal.updateSoundBtnText("Sound Off");
    }
  },

  playBackgroundMusic: function () {
    this.backgroundMusicEl.play();
  },

  stopBackgroundMusic: function () {
    this.backgroundMusicEl.pause();
  },

  play: function (sound) {
    if (!this.soundList[sound]) {
      this.soundList[sound] = new Audio(sound);
      this.soundList[sound].load();
    }
    this.soundList[sound].cloneNode(true).play();
  },
};
