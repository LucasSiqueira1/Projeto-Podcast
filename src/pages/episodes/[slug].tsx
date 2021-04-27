import { api } from '../../services/api';
import { GetStaticPaths, GetStaticProps } from 'next/';
import { format, parseISO } from 'date-fns';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { usePlayer } from '../../contexts/PlayerContext';

import ptBR from 'date-fns/locale/pt-BR';
import styles from './episode.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';




//Lembrando que nesse arquivo é a barra episódio
type Episode = {
    //Dados do server.json
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: number;
    url: string;
    publishedAt: string; //Format formata data para string
    description: string;
}

type EpisodeProps = {
    episode: Episode;
}



export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer();
    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>

                <Image
                    width={700}
                    height={370}
                    src={episode.thumbnail}
                    objectFit="cover"
                />

                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
        </div >
    )
}



export const getStaticPaths: GetStaticPaths = async () => {
    //Obs -> Cada produto ou podcast por exemplo gera uma requisição para o server.

    //Fazer uma requisição fetch para buscar os podcasts mais acessados

    const { data } = await api.get('episodes', {
        //Gera os 2 últimos episódios de forma estática
        params: {
            _limit: 2, //Igual a requisição da home, retenho só os últimos episódios que foram gerados
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })
    return {
        paths,//Gera epi de forma dinâmica
        fallback: 'blocking'
        //O user só vai ir para a pagina quando os dados estiveram carregados
    }
}



export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params; //Episódio
    const { data } = await api.get(`/episodes/${slug}`)


    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    };
    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 //24 horas
    }
}