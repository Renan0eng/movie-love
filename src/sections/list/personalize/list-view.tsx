"use client";
import React, { useEffect } from "react";
import { ListPagination } from "@/components/list/list-pagination";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { ListItemPublic } from "@/components/personalize/list-item-public";
import { Input } from "@/components/ui/input";
import MusicPlayer from "@/components/personalize/music-player/music-player";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DatePickerDemo } from "@/components/personalize/date-picker/date-picker";

export type ListTypeWithRating = Prisma.ListGetPayload<{
  include: {
    listItems: {
      include: {
        rating: {
          include: {
            user: true
          }
        }
      }
    }
  }
}>;

type Props = {
  films: ListTypeWithRating | null
}

export default function ListView({ films }: Props) {
  const inputFile = React.useRef<HTMLInputElement>(null);
  const inputImage = React.useRef<HTMLInputElement>(null);
  const [musica, setMusica] = React.useState<Blob | null>(null);
  const [image, setImage] = React.useState<File | null>(null);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState(films?.listItems);
  const [autoPlay, setAutoPlay] = React.useState(films?.autoPlay);

  const [musicaFromDB, setMusicaFromDB] = React.useState<Blob | null>(null);
  const [imageFromDB, setImageFromDB] = React.useState<string | null>(null);

  const [copySuccess, setCopySuccess] = React.useState(false);
  const [copyText, setCopyText] = React.useState("Copy");

  const [date, setDate] = React.useState<Date | undefined>(films?.data ? new Date(films.data) : undefined);

  React.useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);


  useEffect(() => {
    const timer = setInterval(() => {
      // handleAtualizar();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAtualizar = async () => {
    const res = await fetch("/api/list", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache"
      }
    });
    const { data } = await res.json();
    if (data) {
      setData(data.listItems);
      setAutoPlay(data.autoPlay);
      if (data.music) {
        const res = await fetch(`/api/upload?file=${data?.music.replace("uploads/", "")}`);
        if (res.ok) {
          const blob = await res.blob();
          setMusica(blob);
        }
      } else {
        setMusica(null);
      }
      if (data.image) {
        setImageFromDB(data.image);
      } else {
        setImageFromDB(null);
      }
    }
  };

  const handleUpMusic = async (e: File) => {
    if (e) {
      const formData = new FormData();
      formData.append("file", e);
      const res = await fetch("/api/upload/music", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      handleAtualizar();
      return;
    }
  };

  const handleUpImage = async (e: File) => {
    if (e) {
      const formData = new FormData();
      formData.append("file", e);
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      handleAtualizar();
      return;
    }
  };

  const handleUpDate = async (e: Date) => {
    const res = await fetch("/api/personalize/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: e }),
    });
    handleAtualizar();
  }

  useEffect(() => {
    if (musica === null) {
      if (inputFile.current) {
        inputFile.current.value = "";
      }
    }
  }, [musica]);

  useEffect(() => {
    // Define o background do body quando uma imagem é selecionada
    if (image) {
      const imageUrl = URL.createObjectURL(image); // Cria uma URL temporária para a imagem
      document.body.style.backgroundImage = `url(${process.env.NEXT_PUBLIC_BASE_URL}/api/upload?file=${imageUrl.replace("uploads/", "")})`;
      document.body.style.backgroundSize = 'cover'; // Adiciona para cobrir toda a tela
      document.body.style.backgroundPosition = 'center'; // Centraliza a imageFromDBm
    } else {
      // Limpa o background se não houver imagem
      document.body.style.backgroundImage = 'none';

      // Limpa o valor do input de imagem
      if (inputImage.current) {
        inputImage.current.value = ""; // Limpa o valor do input de imagem
      }
    }

    // Limpeza do efeito ao desmontar o componente
    return () => {
      document.body.style.backgroundImage = 'none'; // Limpa o background ao desmontar
    };
  }, [image]);

  useEffect(() => {
    // Define o background do body quando uma imagem é selecionada
    if (imageFromDB) {
      document.body.style.backgroundImage = `url(${process.env.NEXT_PUBLIC_BASE_URL}/api/upload?file=${imageFromDB.replace("uploads/", "")})`;
      document.body.style.backgroundSize = 'cover'; // Adiciona para cobrir toda a tela
      document.body.style.backgroundPosition = 'center'; // Centraliza a imageFromDBm
    } else {
      // Limpa o background se não houver imageFromDBm
      document.body.style.backgroundImage = 'none';
    }

    // Limpeza do efeito ao desmontar o componente
    return () => {
      document.body.style.backgroundImage = 'none'; // Limpa o background ao desmontar
    };
  }, [imageFromDB]);



  const handlerDeleteMusic = async () => {
    const res = await fetch("/api/personalize/music", {
      method: "POST",
    });
    handleAtualizar();
  };

  const handlerDeleteImage = async () => {
    const res = await fetch("/api/personalize/image", {
      method: "POST",
    });
    handleAtualizar();
  };

  const atualizarMusica = async (data: ListTypeWithRating) => {
    const res = await fetch(`/api/upload?file=${data?.music?.replace("uploads/", "")}`);
    console.log(data.music);
    console.log(res);
    if (res.ok) {
      const blob = await res.blob();
      console.log(blob);

      setMusica(blob);
    }
  }

  useEffect(() => {
    if (films) {
      if (films.music) {
        atualizarMusica(films);
      }
      if (films.image) {
        setImageFromDB(films.image);
      }
    }
  }, [films]);

  const handleAtualizaAutoPlay = async () => {
    const res = await fetch("/api/personalize/autoPlay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ autoPlay: !autoPlay }),
    });
    handleAtualizar();
  }


  return (
    <div className="flex sm:w-[90%] w-full gap-8 justify-around flex-col rounded-xl">
      <div className="flex w-full rounded-xl shadow-xl flex-col sm:p-8 p-[4px] sm:gap-8 gap-2 py-3"
        style={{ backgroundColor: "rgba(30, 30, 30, 0.95)" }}
      >
        <div className="sm:px-4 p-3 gap-4 flex flex-col">
          {/* Input para Upload de Imagem */}
          <div className="flex gap-2 relative ">
            <div className="flex items-center justify-center w-10 h-10 text-3xl rounded-full ">
              <Icon icon="bi:camera" className=" text-primary" />
            </div>
            <Input type="file"
              ref={inputImage}
              accept=".jpg,.jpeg,.png"
              className="file:opacity-0 file:absolute file:w-full file:h-full file:cursor-pointer text-text-secondary border-primary rounded-full bg-primary/10"
              onChange={async (e) => {
                if (!e.target.files) return;
                setImage(e.target.files[0]);
                handleUpImage(e.target.files[0]);
              }}
            />
            {(image || imageFromDB) &&
              <div className="text-2xl text-text absolute w-full h-full justify-end items-center flex bg-black cursor-pointer">
                <div className="p-4">
                  <Icon icon="bi:trash" onClick={() => {
                    setImage(null);
                    handlerDeleteImage();
                  }} />
                </div>
              </div>}
          </div>
          {/* Input para Upload de Música */}
          <div className="flex gap-2 relative">
            <div className="flex items-center justify-center w-10 h-10 text-3xl rounded-full ">
              <Icon icon="bi:music-note" className=" text-primary" />
            </div>
            <Input type="file"
              ref={inputFile}
              accept=".mp3,.wav"
              className="file:opacity-0 file:absolute file:w-full file:h-full file:cursor-pointer text-text-secondary border-primary rounded-full bg-primary/10"
              onChange={async (e) => {
                if (!e.target.files) return;
                setMusica(e.target.files[0]);
                handleUpMusic(e.target.files[0]);
              }}
            />
            {(musica || musicaFromDB) &&
              <div className="text-2xl text-text absolute w-full h-full justify-end items-center flex bg-black">
                <div className="p-4">
                  <Icon icon="bi:trash" onClick={() => {
                    setMusica(null);
                    handlerDeleteMusic();
                  }} />
                </div>
              </div>}
          </div>

          {/* Input para Data */}
          <DatePickerDemo
            className="w-full justify-start text-left font-normal rounded-full "
            onSelect={(date) => {
              setDate(date);
              if (date)
                handleUpDate(date);
            }}
            selected={date}
          />

          {/* Player do áudio */}
          {musica && (
            <div className="flex flex-col gap-4 p-[8px]">
              <MusicPlayer musica={musica} setAutoPlay={setAutoPlay} autoPlay={autoPlay} handleAtualizaAutoPlay={handleAtualizaAutoPlay} />
            </div>
          )}

        </div>

        {/* Header */}
        <div className="flex justify-center w-full p-2 sm:p-0">
          <h1 className="text-primary sm:text-4xl text-xl font-semibold text-center">{films?.name}</h1>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 min-h-96 p-3">
          {data &&
            data
              .slice((page - 1) * 10, page * 10)
              .map((item) => (
                <ListItemPublic key={item.id} item={item} handleAtualizar={handleAtualizar} />
              ))
          }
        </div>

        {/* Pagination */}
        <ListPagination page={page} setPage={setPage} maxPages={data ? ((data.length > 0 ? data.length - 1 : 0) / 10) + 1 : 0} />
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <Link href="/list">
          <Button className="rounded-full gap-2 bg-primary/20" size="xl" variant="outline"><Icon icon="carbon:arrow-left" />Back</Button>
        </Link>
        <Button className="rounded-full gap-2 bg-primary/20" size="xl" variant="outline"><div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 justify-center items-center cursor-copy"
            onClick={() => {
              navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/${films?.id || ""}`);
              setCopyText("Code copied !");
              setCopySuccess(true);
            }}
          >
            <p className="text-center  text-2xl font-bold">
              Copy link
            </p> <Icon icon="carbon:link"
              className=" text-3xl" />
          </div>
        </div>
        </Button>
      </div>
      <Alert
        variant="success"
        className="flex gap-4 text-center items-center justify-center rounded-full "
        style={{ backgroundColor: "#1BC21B88" }}
        active={copySuccess}
      >
        <AlertTitle>
          <Icon icon="streamline:copy-paste" className="text-text text-xl" />
        </AlertTitle>
        <AlertDescription className="text-text">
          {copyText}
        </AlertDescription>
      </Alert>
    </div>
  );
}
