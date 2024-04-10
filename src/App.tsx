import { useCallback, useEffect, useRef } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { getLoopNumber } from "./utils/common";

const SourceMap = [
  { src: "sc.png", type: "image" },
  { src: "nc.mp4", type: "video" },
  { src: "sb.png", type: "image" },
];

function App() {
  const AUTOPLAY_INTERVAL = 5000;
  const sliderRef = useRef<Carousel>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (SourceMap[0]?.type === "image")
      timeoutRef.current = setTimeout(() => {
        const nextIndex = getLoopNumber(0, SourceMap.length, 1);
        sliderRef.current?.moveTo(nextIndex);
      }, AUTOPLAY_INTERVAL);

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleChange = useCallback((index: number) => {
    clearTimeout(timeoutRef.current);
    const prevIndex = getLoopNumber(0, SourceMap.length, index - 1);

    if (SourceMap[prevIndex].type === "video") {
      videoRefs.current[prevIndex]?.pause();
      videoRefs.current[prevIndex] &&
        (videoRefs.current[prevIndex].currentTime = 0);
    }

    if (SourceMap[index].type === "video") {
      videoRefs.current[index]?.play();
    } else {
      timeoutRef.current = setTimeout(() => {
        const nextIndex = getLoopNumber(0, SourceMap.length, index + 1);
        sliderRef.current?.moveTo(nextIndex);
      }, AUTOPLAY_INTERVAL);
    }
  }, []);

  const handleVideoEnded = useCallback((index: number) => {
    const nextIndex = getLoopNumber(0, SourceMap.length, index + 1);
    sliderRef.current?.moveTo(nextIndex);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Carousel
        ref={sliderRef}
        onChange={handleChange}
        showIndicators={false}
        stopOnHover={false}
        showThumbs={false}
      >
        {SourceMap.map((source, i) => (
          <div
            key={source.src}
            style={{
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              width: "100vw",
              height: "100vh",
            }}
          >
            {source.type === "video" && (
              <video
                ref={(r) => {
                  videoRefs.current[i] = r;
                }}
                src={source.src}
                style={{ width: "100%", objectFit: "cover" }}
                onEnded={() => handleVideoEnded(i)}
                muted // chrome 정책 때문에 mute 상태로만 auto play 됨
                autoPlay
              />
            )}
            {source.type === "image" && (
              <img
                src={source.src}
                style={{
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default App;
