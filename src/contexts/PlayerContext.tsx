import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = { //Colocar somente as informações que eu vou usar na lista, não todas as informações
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};


//Vou criar um type para as informações que eu quero salvar dentro do meu contexto
type PlayerContextData = {
    episodeList: Episode[] //É uma lista pois tem botão de avançar e retroceder, então é mais de um episódio
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    pause: () => void;
    playNext: () => void;
    playPrevious: () => void;
    setIsPlayingState: (state: boolean) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    pauseLoop: () => void;
    isShuffling: boolean;
    pauseShuffle: () => void;
    clearPlayerState: () => void;
};


//Pode ser qualquer coisa como parâmetro, mas não é utilizado, é só pra saber o formato do tipo de dado que voce vai salvar
export const PlayerContext = createContext({} as PlayerContextData);


//Nome do componente e props no final
type PlayerContextProviderProps = {
    //Children pode ser qualquer coisa
    children: ReactNode; //Qualquer coisa que o react aceitaria
}



/* Tudo que estava dentro de app eu coloco aqui*/
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);


    //Preciso de variável de estado
    function play(episode: Episode) { //Vamos passar ts para função
        setEpisodeList([episode]); //Um único episódio apenas
        setCurrentEpisodeIndex(0); //Força a voltar para 0 caso não esteja
        setIsPlaying(true);
    }



    //Lista de episódios, para meu player saber qual episódio tem atrás
    //Vou receber um array com lista de episódios, e um index desse episódio
    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }


    //Ver se tem algum podcastr ativo, para desabilitar o botão
    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;



    //Pega o índice do episódio que ta tocando e coloca mais um, para avançar
    function playNext() {
        if (isShuffling) {
            //Gera o random do shuffle (embaralhar)
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);

        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }



    function playPrevious() {
        if (hasPrevious) { //Caso for da opção 1 para frente
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }



    function pause() {
        setIsPlaying(!isPlaying);
    }

    function pauseLoop() {
        setIsLooping(!isLooping);
    }

    //Função que embaralha os episódio do botão shuffle
    function pauseShuffle() {
        setIsShuffling(!isShuffling);
    }


    //Limpar o player, deixar ele como se ele nunca tivesse tocado um episódio
    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }


    function setIsPlayingState(state: boolean) {
        setIsPlaying(state);
    }



    //Vai pegar todo conteúdo de app de playercontextprovider, e passar para dentro dessa tag, através do children
    return (
        <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, pause, setIsPlayingState, playList, playNext, playPrevious, hasNext, hasPrevious, isLooping, pauseLoop, isShuffling, pauseShuffle, clearPlayerState }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}