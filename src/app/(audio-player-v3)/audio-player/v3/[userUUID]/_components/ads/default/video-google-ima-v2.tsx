
import React, { useEffect, useState } from "react";
import videojs from "video.js";
import "videojs-contrib-ads";
import "videojs-ima";
import "video.js/dist/video-js.css";
import canAutoPlay from "can-autoplay";

type CalculationsStateType = {
  initPlayer: boolean;
  autoplayAllowed: boolean;
  autoplayRequiresMute: boolean;
};

export default function VideoGoogleImaV2({
  url,
  onFinishHandler,
  setAdIsLoading,
}: {
  url: string;
  onFinishHandler: () => void;
  setAdIsLoading: (value: boolean) => void;
}) {
  const [calculations, setCalculations] = useState<CalculationsStateType>({
    initPlayer: false,
    autoplayAllowed: false,
    autoplayRequiresMute: false,
  });

  const isSafari = () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  };

  useEffect(() => {
    canAutoPlay
      .video({ timeout: 100, muted: true })
      .then(({ result, error }) => {
        if (!result) {
          console.log("Error occurred: ", error);
          if (isSafari()) {
            setCalculations((prev) => ({
              ...prev,
              autoplayAllowed: true,
              autoplayRequiresMute: true,
              initPlayer: true,
            }));
          }
        } else {
          setCalculations((prev) => ({
            ...prev,
            autoplayAllowed: true,
            autoplayRequiresMute: true,
            initPlayer: true,
          }));
        }
      });

    if (isSafari() && !calculations.initPlayer) {
      setCalculations((prev) => ({ ...prev, initPlayer: true }));
    }
  }, [calculations]);

  if (!calculations.initPlayer) {
    onFinishHandler();
    return null;
  }

  if (!calculations.autoplayAllowed) {
    onFinishHandler();
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <App
        adUrl={url}
        onFinishHandler={onFinishHandler}
        setAdIsLoading={setAdIsLoading}
        autoplayAllowed={calculations.autoplayAllowed}
        autoplayRequiresMute={calculations.autoplayRequiresMute}
      />
    </div>
  );
}

declare var google: any;

const App = ({
  adUrl,
  onFinishHandler,
  setAdIsLoading,
  autoplayAllowed,
  autoplayRequiresMute,
}: {
  adUrl: string;
  onFinishHandler: () => void;
  setAdIsLoading: (value: boolean) => void;
  autoplayAllowed: boolean;
  autoplayRequiresMute: boolean;
}) => {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: autoplayAllowed,
    muted: autoplayRequiresMute,

    sources: [
      {
        src: "/audio-player/v3/empty.mp4",
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
  };

  return (
    <VideoJS
      options={videoJsOptions}
      onReady={handlePlayerReady}
      url={adUrl}
      onFinishHandler={onFinishHandler}
      setAdIsLoading={setAdIsLoading}
      autoplayAllowed={autoplayAllowed}
      autoplayRequiresMute={autoplayRequiresMute}
    />
  );
};

export const VideoJS = ({
  options,
  onReady,
  url,
  onFinishHandler,
  setAdIsLoading,
  autoplayAllowed,
  autoplayRequiresMute,
}: {
  options: any;
  onReady: (player: any) => void;
  url: string;
  onFinishHandler: () => void;
  setAdIsLoading: (value: boolean) => void;
  autoplayAllowed: boolean;
  autoplayRequiresMute: boolean;
}) => {
  const videoRef = React.useRef<any>(null);
  const playerRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = document.createElement("video");
    videoElement.classList.add(
      "video-js",
      "vjs-big-play-centered",
      "max-h-[280px]",
      "max-w-[373px]"
    );
    videoElement.setAttribute("autoplay", "true");
    videoElement.setAttribute("webkit-playsinline", "true");
    videoElement.setAttribute("playsinline", "true");
    videoElement.setAttribute("muted", "true");

    videoRef.current.appendChild(videoElement);

    const player: any = (playerRef.current = videojs(
      videoElement,
      {
        ...options,
      },
      () => {
        onReady && onReady(player);
      }
    ));

    player.muted(true);

    player.ima({
      adTagUrl: url,
    });

    player.ima.initializeAdDisplayContainer();

    if (!autoplayAllowed) {
      let startEvent: string = "click";

      if (
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/Android/i)
      ) {
        startEvent = "touchend";
      }

      const initAdDisplayContainer = () => {
        player.ima.initializeAdDisplayContainer();
        player.removeEventListener(startEvent, initAdDisplayContainer);
      };

      videoElement.addEventListener(startEvent, initAdDisplayContainer);
    }

    player.on("ads-loader", (event: any) => {
      const adsLoader = event.adsLoader;
      adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        (event: any) => {
          console.log("ads-loader ad error", event);
          onFinishHandler();
        }
      );
    });

    player.on("ads-manager", (event: any) => {
      const adsManager = event.adsManager;
      adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        (event: any) => {
          onFinishHandler();
        }
      );

      adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        (event: any) => {
          setAdIsLoading(false);
        }
      );

      adsManager.addEventListener(
        google.ima.AdEvent.Type.AD_CAN_PLAY,
        (event: any) => {
          setAdIsLoading(false);
        }
      );
    });

    player.on("ended", () => {
      onFinishHandler();
    });

    player.on("error", () => {
      onFinishHandler();
    });
  }, [
    options,
    videoRef,
    onReady,
    url,
    onFinishHandler,
    setAdIsLoading,
    autoplayAllowed,
    autoplayRequiresMute,
  ]);

  React.useEffect(() => {
    const player: any = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};
