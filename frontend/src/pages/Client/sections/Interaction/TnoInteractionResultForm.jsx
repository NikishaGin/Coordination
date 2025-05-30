import { useState } from 'react';
import InteractionCard from './TnoInteractionCard.jsx';
import {Container, AddButton, InteractionsList, EmptyState} from './styles.js';
import TnoInteractionForm from "./TnoInteractionForm.jsx";
import TnoInteractionCard from "./TnoInteractionCard.jsx";

const TnoInteractionResultForm = () => {
    const [interactions, setInteractions] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false); // флаг открыта ли форма
    const [editingIndex, setEditingIndex] = useState(null); // Если null значит добавляется новая запись


    const handleAddClick = () => {
        setIsFormOpen(true);
        setEditingIndex(null);
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingIndex(null);
    };

    const handleFormSubmit = (interactionData) => {
        if (editingIndex !== null) {
            const updatedInteractions = [...interactions];
            updatedInteractions[editingIndex] = interactionData;
            setInteractions(updatedInteractions);
        } else {
            setInteractions([...interactions, interactionData]);
        }
        setIsFormOpen(false);
        setEditingIndex(null);
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setIsFormOpen(true);
    };

    return (
        <Container>

            {!isFormOpen && (
                <AddButton onClick={handleAddClick}>
                    Добавить результат взаимодействия с ТНО
                </AddButton>
            )}

            {isFormOpen && (
                <TnoInteractionForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    initialData={editingIndex !== null ? interactions[editingIndex] : null}
                />
            )}
            <InteractionsList>
                {interactions.length > 0 ? (
                    interactions.map((interaction, index) => (
                        <TnoInteractionCard
                            key={index}
                            data={interaction}
                            onEdit={() => handleEdit(index)}
                        />
                    ))
                ) : (
                    !isFormOpen && (
                        <EmptyState>
                            Записи о взаимодействиях с ТНО отсутствуют. Добавьте новую запись, нажав кнопку выше.
                        </EmptyState>
                    )
                )}
            </InteractionsList>
        </Container>
    );
};

export default TnoInteractionResultForm;