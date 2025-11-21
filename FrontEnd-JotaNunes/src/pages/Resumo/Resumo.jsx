const Resumo = () => {
    return (
        <div className={styles.resumo}>
            <h2>Resumo do Empreendimento</h2>

            <div className={styles.resumoSection}>
                <p>
                    <strong>Nome:</strong> {nomeEmpreendimento}
                </p>
                <p>
                    <strong>Descrição:</strong> {descricaoEmpreendimento}
                </p>
            </div>

            <div className={styles.resumoSection}>
                <h3>Área Privativa</h3>
                <ul>
                    {areaPrivativa.length === 0 && <li>-</li>}
                    {areaPrivativa.map((linha, i) => (
                        <li key={i}>
                            {linha.Ambiente} — {linha.Item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.resumoSection}>
                <h3>Área Comum</h3>
                <ul>
                    {areaComum.length === 0 && <li>-</li>}
                    {areaComum.map((linha, i) => (
                        <li key={i}>
                            {linha.Ambiente} — {linha.Item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.resumoSection}>
                <h3>Ambientes</h3>
                {Object.keys(ambientesDetalhados).length === 0 && <p>-</p>}
                {Object.entries(ambientesDetalhados).map(([amb, itens]) => (
                    <div key={amb}>
                        <strong>{amb}</strong>
                        <ul>
                            {itens.map((it, i) => (
                                <li key={i}>
                                    {it.Item} — {it.Descrição}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className={styles.resumoSection}>
                <h3>Materiais e Marcas</h3>
                <ul>
                    {materiaisMarcas.length > 0 ? (
                        materiaisMarcas.map((item, i) => (
                            <li key={i}>
                                {item.Material} — {item.Marca}
                            </li>
                        ))
                    ) : (
                        <li>-</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Resumo;