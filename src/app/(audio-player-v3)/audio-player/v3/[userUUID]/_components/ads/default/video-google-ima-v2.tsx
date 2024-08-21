"use client";
import React, { useEffect, useState } from "react";
import videojs from "video.js";
import "videojs-contrib-ads";
import "videojs-ima";
import "video.js/dist/video-js.css";
import canAutoPlay from "can-autoplay";

type CalculationsStaateType = {
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
  const [calculations, setCalculations] = useState<CalculationsStaateType>({
    initPlayer: false,
    autoplayAllowed: false,
    autoplayRequiresMute: false,
  });

  const isSafari = () => {
    return (
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    );
  };

  useEffect(() => {
    canAutoPlay
      .video({ timeout: 100, muted: true })
      .then(({ result, error }) => {
        if (!result) {
          console.log("Error occurred: ", error);
          if (isSafari()) {
            setCalculations({
              ...calculations,
              autoplayAllowed: true,
              autoplayRequiresMute: true, // Attempt to autoplay with mute on Safari
              initPlayer: true,
            });
          }
        } else {
          console.log("Result: ", result);
          setCalculations({
            ...calculations,
            autoplayAllowed: true,
            autoplayRequiresMute: true,
            initPlayer: true,
          });
        }
      });

      if (isSafari() && !calculations.initPlayer) {
        // Ensure player is initialized early for Safari
        setCalculations((prev) => ({ ...prev, initPlayer: true }));
      }
  }, [calculations]);

  console.log(`calculations: ${JSON.stringify(calculations)}`);

  if (!calculations.initPlayer) {
    console.log("initPlayer is false");
    onFinishHandler();
    return;
  }

  if (!calculations.autoplayAllowed) {
    console.log("autoplayAllowed is false");
      onFinishHandler();
      return null;
  }

  if (!calculations.autoplayRequiresMute) {
    console.log("autoplayRequiresMute is false");
    onFinishHandler();
    return;
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
        // src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: "video/mp4",
      },
    ],
  };

  console.log(`videoJsOptions: ${JSON.stringify(videoJsOptions)}`);

  const handlePlayerReady = (player: any) => {
    console.log("Ads player is ready");
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

    const videoJSID = "video-js";

    if (!playerRef.current) {
      const videoElement = document.createElement(videoJSID);
      videoElement.classList.add(
        "vjs-big-play-centered",
        "max-h-[280px]",
        "max-w-[373px]"
      );
      videoElement.setAttribute("webkit-playsinline", "");
      videoElement.setAttribute("playsinline", "");
      videoElement.setAttribute("muted", "");

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
        id: videoJSID,
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
          console.log("initAdDisplayContainer !!!!");
          player.ima.initializeAdDisplayContainer();
          player.removeEventListener(startEvent, initAdDisplayContainer);
        };

        console.log("Whatsup!");

        videoElement.addEventListener(startEvent, initAdDisplayContainer);
      }

      player.on("ads-loader", (event: any) => {
        console.log("Ads-loader is initialized");
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
            console.log("ads-manager all ads completed", event);
            onFinishHandler();
          }
        );

        adsManager.addEventListener(
          google.ima.AdEvent.Type.LOADED,
          (event: any) => {
            console.log("ads-manager ad loaded", event);
            setAdIsLoading(false);
          }
        );

        adsManager.addEventListener(
          google.ima.AdEvent.Type.AD_CAN_PLAY,
          (event: any) => {
            console.log("ads-manager ad can play", event);
            setAdIsLoading(false);
          }
        );
      });

      player.on("ended", () => {
        console.log("ended");
        videojs.log("player has ended");
        onFinishHandler();
      });

      player.on("error", () => {
        console.log("error");
        videojs.log("has error");
        onFinishHandler();
      });
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
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
