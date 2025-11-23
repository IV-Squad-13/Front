import Button from "../button/Button";
import styles from "./Carousel.module.css";

const Carousel = ({ blocks, index, onPrev, onNext, render }) => {
    const current = blocks[index];

    return (
        <div className={styles.carousel}>
            <div className={styles.navBar}>
                <Button 
                    variant="carouselNav"
                    onClick={onPrev} 
                    disabled={index <= 0}
                >
                    {"<"}
                </Button>

                <div className={styles.dots}>
                    {blocks.map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.dot} ${i === index ? styles.activeDot : ""}`}
                        />
                    ))}
                </div>

                <Button 
                    variant="carouselNav"
                    onClick={onNext} 
                    disabled={index >= blocks.length - 1}
                >
                    {">"}
                </Button>
            </div>

            <div className={styles.carouselPanel}>
                {current 
                    ? render(current) 
                    : <div className={styles.empty}>Sem conteúdo</div>}
            </div>
        </div>
    );
};

export default Carousel;