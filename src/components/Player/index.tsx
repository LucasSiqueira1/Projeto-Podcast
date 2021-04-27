import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null); //Vamos usar TS. Estou armazenando um elemento de audio do HTML

    const { episodeList, currentEpisodeIndex, isPlaying, pause, setIsPlayingState, playNext, playPrevious, hasNext, hasPrevious, isLooping, pauseLoop, isShuffling, pauseShuffle, clearPlayerState } = usePlayer();

    const episode = episodeList[currentEpisodeIndex]

    const [progress, setProgress] = useState(0); //Quando tempo o progresso ja ocorreu



    useEffect(() => {
        if (!audioRef.current) {
            return; //Se não tiver nada eu não retorno nada
        }

        if (isPlaying) {
            audioRef.current.play();
        }
        else {
            audioRef.current.pause();
        }
    }, [isPlaying]) //Vou fazer algo, toda vez que o audio for alterado (efeitos colaterais)



    //Essa função vai retornar o tempo atual do player
    function setupProgressListener() {
        audioRef.current.currentTime = 0; //Sempre que mudar de som para o outro, ira voltar o tempo do player para 0

        audioRef.current.addEventListener('timeupdate', () => {
            //Disparado sempre que o audio esta tocando
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) { //Recebe o numero da duração que a pessoa jogou a bolinha
        audioRef.current.currentTime = amount;
        setProgress(amount); //Mantém dentro o progresso que a pessoa correu
    }



    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando Agora" />
                <strong>Tocando Agora </strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={600}
                        height={360}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>

            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um Podcast para ouvir</strong>
                </div>
            )}


            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>

                    <span>{convertDurationToTimeString(progress)}</span>

                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration} //Retorna o numero de segundos do episódios
                                value={progress}
                                onChange={handleSeek} //O que acontece quando o user arrasta a bolinha
                                trackStyle={{ backgroundColor: '#04D361' }} //Muda a cor do progresso que ja aconteceu
                                railStyle={{ backgroundColor: '#FF3030' }} //Cor de fundo da barra que nao sofreu progresso
                                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}

                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}


                    </div>

                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        //Verificar se ta em loop, toca o mesmo audio
                        //onEnded={handleEpisodeEnded} // Função que executa quando o audio chega no final
                        loop={isLooping}
                        autoPlay
                        onPlay={() => setIsPlayingState(true)} //Evento que dispara automaticamente quando sai o audio, seja manual ou pelo teclado
                        onPause={() => setIsPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}//Dispara assim que o player conseguiu carregar os dados do episódio
                    />
                )}


                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length == 1} onClick={pauseShuffle} className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button type="button" className={styles.playButton} disabled={!episode} onClick={pause}>
                        {isPlaying ? <img src="/pause.svg" alt="Pausar" /> : <img src="/play.svg" alt="Tocar" />}
                    </button>

                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>

                    <button type="button" disabled={!episode} onClick={pauseLoop} className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}