class GarsejaAudioPlayer {
  #LOCATION_URL = window.location.href ? window.location.href : "";

  #DEFAULTS = {
    PLAYER_SIZE: {
      WIDTH: "100%",
      HEIGHT: "100%",
    },
  };

  #AUDIO_PLAYER_EVENT_ID = "garseja.audio.player.v3.events";
  #AUDIO_PLAYER_ACTIONS = {
    PLAYER_VISIBLE: "player.visible",
  };

  #AUDIO_PLAYER_SRC =
    this.#LOCATION_URL.startsWith("http://localhost:3000")
      ? "/audio-player/v3/"
      : "https://audio-player-with-ads.vercel.app/audio-player/v3/";

  #MAIN_CONTAINER_ID = "garseja-audio-player";
  #VOICE_ATTRIBUTE = "data-voice";
  #THEME_ID_ATTRIBUTE = "data-theme-id";
  #USER_UUID_ATTRIBUTE = "data-user-uuid";
  #AD_TYPE_ATTRIBUTE = "data-ad-type";
  #VIDEO_AD_URL_ATTRIBUTE = "data-video-ad-url";

  #container;
  #voice;
  #pageURL;
  #themeId;
  #userUUID;
  #adType;
  #videoAdUrl;

  #audioPlayerIframe;

  constructor() {
    this.#container = this.#initializeContainer();
    this.#voice = this.#initializeVoice();
    this.#themeId = this.#initializeThemeId();
    this.#userUUID = this.#initializeUserUUID();
    this.#pageURL = this.#LOCATION_URL;
    this.#adType = this.#initializeAdType();
    this.#videoAdUrl = this.#initializeVideoAdURL();
  }

  async initPlayer() {
    if (!this.#pageURL) {
      throw new GarsejaAudioPlayerError(
        `Player will not be initialized, because pageURL cannot be resolved`
      );
    }
    this.#initializeAudioPlayerIframe();
    this.#initAdTriggers();
  }

  #initializeAudioPlayerIframe() {
    let data = {
      pageURL: this.#pageURL,
      voice: this.#voice,
      themeId: this.#themeId,
      adType: this.#adType,
      videoAdUrl: this.#videoAdUrl,
    };

    const queryString = Object.keys(data)
      .map((key) => key + "=" + encodeURIComponent(data[key]))
      .join("&");

    this.#audioPlayerIframe = document.createElement("iframe");

    this.#audioPlayerIframe.setAttribute(
      "src",
      this.#AUDIO_PLAYER_SRC + this.#userUUID + "?" + queryString
    );

    this.#setDefaultAudioPlayerIframeSettings(this.#audioPlayerIframe);

    this.#container.appendChild(this.#audioPlayerIframe);
  }

  #initAdTriggers() {
    const self = this;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio === 1) {
            console.log(`${entry.target.id} is in view`);
            self.#sendOnPlayerVisibleEvent();
          }
        });
      },
      { threshold: [1.0] }
    );

    observer.observe(this.#container, {passive: true});
  }

  #sendOnPlayerVisibleEvent() {
    this.#audioPlayerIframe.contentWindow.postMessage(
      {
        type: this.#AUDIO_PLAYER_EVENT_ID,
        action: this.#AUDIO_PLAYER_ACTIONS.PLAYER_VISIBLE,
      }
    );
  }

  #setDefaultAudioPlayerIframeSettings(audioPlayerIframe) {
    audioPlayerIframe.setAttribute("width", this.#DEFAULTS.PLAYER_SIZE.WIDTH);
    audioPlayerIframe.setAttribute("height", this.#DEFAULTS.PLAYER_SIZE.HEIGHT);
    audioPlayerIframe.setAttribute("frameborder", "0");
    audioPlayerIframe.setAttribute("scrolling", "no");
    audioPlayerIframe.setAttribute("allowtransparency", "");
    audioPlayerIframe.setAttribute("allow", "autoplay");
    audioPlayerIframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-presentation allow-storage-access-by-user-activation allow-top-navigation allow-top-navigation-by-user-activation allow-top-navigation-to-custom-protocols");    
  }

  #initializeContainer() {
    const container = document.getElementById(this.#MAIN_CONTAINER_ID);
    if (!container) {
      throw new GarsejaAudioPlayerError(
        "div with id=" + this.#MAIN_CONTAINER_ID + " was not found"
      );
    }
    return container;
  }

  #initializeVoice() {
    const voice = this.#container.getAttribute(this.#VOICE_ATTRIBUTE);
    if (!voice) {
      throw new GarsejaAudioPlayerError(
        "div with id=garseja-audio-player does not have '" +
          this.#VOICE_ATTRIBUTE +
          "' attribute"
      );
    }
    return voice;
  }

  #initializeThemeId() {
    const themeId = this.#container.getAttribute(this.#THEME_ID_ATTRIBUTE);
    if (!themeId) {
      throw new GarsejaAudioPlayerError(
        "div with id=garseja-audio-player does not have '" +
          this.#THEME_ID_ATTRIBUTE +
          "' attribute"
      );
    }
    return themeId;
  }

  #initializeUserUUID() {
    const userUUID = this.#container.getAttribute(this.#USER_UUID_ATTRIBUTE);
    if (!userUUID) {
      throw new GarsejaAudioPlayerError(
        "div with id=garseja-audio-player does not have '" +
          this.#USER_UUID_ATTRIBUTE +
          "' attribute"
      );
    }
    return userUUID;
  }

  #initializeAdType() {
    const adType = this.#container.getAttribute(this.#AD_TYPE_ATTRIBUTE);
    if (!adType) {
      throw new GarsejaAudioPlayerError(
        "div with id=garseja-audio-player does not have '" +
          this.#AD_TYPE_ATTRIBUTE +
          "' attribute"
      );
    }
    return adType;
  }

  #initializeVideoAdURL() {
    if (this.#adType === "NONE") {
      return undefined;
    }
    const videoAdUrl = this.#container.getAttribute(
      this.#VIDEO_AD_URL_ATTRIBUTE
    );
    if (!videoAdUrl) {
      throw new GarsejaAudioPlayerError(
        "div with id=garseja-audio-player does not have '" +
          this.#VIDEO_AD_URL_ATTRIBUTE +
          "' attribute"
      );
    }
    return videoAdUrl;
  }
}

class GarsejaAudioPlayerError extends Error {
  constructor(message) {
    super(message);
    this.name = "GarsejaAudioPlayerError";
  }
}

if (document.readyState !== "loading") {
  initializeGarsejaAudioPlayer();
  console.debug(
    "GarsejaAudioPlayer initialized via document state not loading"
  );
} else {
  document.addEventListener("DOMContentLoaded", function () {
    initializeGarsejaAudioPlayer();
    console.debug("GarsejaAudioPlayer initialized via DOMContentLoaded event");
  });
}

function initializeGarsejaAudioPlayer() {
  const garsejaAudioPlayer = new GarsejaAudioPlayer();
  garsejaAudioPlayer.initPlayer();
}
