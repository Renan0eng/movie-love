"use client";
import React, { useState, useRef, useEffect, use } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Switch } from "../../ui/switch";

interface MusicPlayerProps {
  musica?: File | null;
  url?: string | null;
  className?: string;
  setAutoPlay?: (value: boolean) => void;
  autoPlay?: boolean;
  handleAtualizaAutoPlay?: () => void;
  ifAultoPlay?: boolean; // Corrigido: "ifAultoPlay" está sendo utilizado
  children?: React.ReactNode;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  musica,
  url,
  className,
  autoPlay,
  setAutoPlay,
  handleAtualizaAutoPlay,
  ifAultoPlay,
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);


  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      {children}
      {(url || musica) &&
        <div
          className={cn(
            "w-full mx-auto bg-primary/10 text-white p-3 rounded-xl shadow-lg justify-center flex flex-col items-center",
            className
          )}
        >
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          >
            {musica ? (
              <source src={URL.createObjectURL(musica)} type="audio/mpeg" />
            ) : url ? (
              <source
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${url}`}
                type="audio/mpeg"
              />
            ) : null}
          </audio>
          <div className="text-3xl flex justify-center items-center">
            <Icon
              icon="fluent:skip-back-10-24-filled"
              className="hover:text-text/90"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime -=
                    audioRef.current.currentTime / 10;
                }
              }}
            />
            <div className="text-5xl hover:text-text/90">
              {isPlaying ? (
                <Icon onClick={togglePlayPause} icon="bi:pause-fill" />
              ) : (
                <Icon onClick={togglePlayPause} icon="bi:play-fill" />
              )}
            </div>
            <Icon
              icon="fluent:skip-forward-10-24-filled"
              className="hover:text-text/90"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime += audioRef.current.duration / 10;
                }
              }}
            />
          </div>
          <div className="flex justify-center items-center gap-4 text-sm w-full">
            <span>{formatTime(currentTime)}</span>
            <div className="relative w-full h-1 bg-gray-700 rounded-full group">
              <div
                className="absolute top-0 left-0 h-full bg-white group-hover:bg-primary rounded-full  flex items-center justify-end"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              >
                <div className="w-4 h-4 bg-white rounded-full -top-1 -left-1 group-hover:block hidden transition-all duration-200 transform -translate-x-[-50%]" />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                onPointerDown={() => {
                  if (isPlaying) if (audioRef.current) audioRef.current.pause();
                }}
                onPointerUp={() => {
                  if (isPlaying) if (audioRef.current) audioRef.current.play();
                }}
                className="w-full h-2 opacity-0 cursor-pointer absolute top-0 left-0"
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">
              {volume === 0 ? (
                <Icon icon="bi:volume-mute" onClick={() => setVolume(0.5)} />
              ) : (
                <Icon icon="bi:volume-up" onClick={() => setVolume(0)} />
              )}
            </span>
            <div className="relative w-20 h-1 bg-gray-700 rounded-full group">
              <div
                className="absolute top-0 left-0 h-full bg-white group-hover:bg-primary rounded-full  flex items-center justify-end"
                style={{ width: `${volume * 100}%` }}
              >
                <div className="w-4 h-4 bg-white rounded-full -top-1 -left-1 group-hover:block hidden transition-all duration-200 transform -translate-x-[-50%]" />
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 opacity-0 cursor-pointer absolute top-0 left-0"
              />
            </div>
            {setAutoPlay && autoPlay !== undefined && handleAtualizaAutoPlay && (
              <div className="flex items-center ml-4 gap-2">
                <Switch
                  className="ml-2"
                  checked={autoPlay}
                  onCheckedChange={() => {
                    setAutoPlay(!autoPlay);
                    handleAtualizaAutoPlay();
                  }}
                />
                <label>Auto Play</label>
              </div>
            )}
          </div>
        </div>}
    </>
  );
};

export default MusicPlayer;
