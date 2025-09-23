import { useEffect, useState } from 'react';
import InteractionForm from './InteractionForm.jsx';
import InteractionCard from './InteractionCard.jsx';
import {Container, AddButton, InteractionsList, EmptyState} from './styles.js';
import { useDispatch } from "react-redux";
import { fetchGetInteractions, useInteraction } from "../../../../store/client/clientSlice.js";
import { useRoleDetection } from "../../../../store/user/userSlice.js";
import { InteractionType } from "../../../../constants.js";



const InteractionResultForm = () => {
    const dispatch = useDispatch();
    const interactions = useInteraction();
    const { isUser } = useRoleDetection();

    const [isFormOpen, setIsFormOpen] = useState(false); // флаг открыта ли форма
    const [editingId, setEditingId] = useState(null); // Если null значит добавляется новая запись



    useEffect(() => {
        dispatch(fetchGetInteractions(InteractionType.GMU));
    }, [])

    const handleAddClick = () => {
        setIsFormOpen(true);
        setEditingId(null);
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleFormSubmit = (data) => {
        // dispatch(fetchSaveInteraction({ source: "gmu", inn, data }));
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleEdit = (id) => {
        setEditingId(id);
        setIsFormOpen(true);
    };

    return (
        <Container>
            {(!isFormOpen && !isUser) && (
                <AddButton onClick={handleAddClick}>
                    Добавить результат взаимодействия с ГМУ ФССП
                </AddButton>
            )}

            {isFormOpen && (
                <InteractionForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    initialData={editingId !== null ? interactions.find(({id}) => id === editingId) : null}
                />
            )}
            <InteractionsList>
                {interactions.length > 0 ? (
                    interactions.map(interaction => (
                        <InteractionCard
                            key={interaction.id}
                            data={interaction}
                            onEdit={() => handleEdit(interaction.id)}
                        />
                    ))
                ) : (
                    !isFormOpen && (
                        <EmptyState>
                            Записи о взаимодействиях отсутствуют. Добавьте новую запись, нажав кнопку выше.
                        </EmptyState>
                    )
                )}
            </InteractionsList>
        </Container>
    );
};

export default InteractionResultForm;