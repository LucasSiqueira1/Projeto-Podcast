import styles from './styles.module.scss';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

export function Header() {
    const dataAtual = format(new Date(), 'EEEE, d  MMMM', { locale: ptBR });
    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Logo Podcastr" />
            <p>Conhecimento é a chave, um Podcast diferenciado.</p>
            <span>{dataAtual}</span>
        </header>
    );
}