import { useEffect, useState } from 'react';
import InteractionForm from './InteractionForm.jsx';
import InteractionCard from './InteractionCard.jsx';
import {Container, AddButton, InteractionsList, EmptyState} from './styles.js';
import { useDispatch, useSelector } from "react-redux";
import { fetchGetInteractions, fetchSaveInteraction } from "../../../../store/interactionsSlice.js";
import { useParams } from "react-router";
import { ROLES } from "../../../../types.js";



const InteractionResultForm = () => {
    const {inn} = useParams()
    const dispatch = useDispatch();
    const interactions = useSelector((state) => state.interactions.interactions);
    const [isFormOpen, setIsFormOpen] = useState(false); // флаг открыта ли форма
    const [editingId, setEditingId] = useState(null); // Если null значит добавляется новая запись
    const role = useSelector((state) => state.user.role)
    const isUser = role === ROLES.User

    useEffect(() => {
        dispatch(fetchGetInteractions({ source: "gmu", inn }))
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
        dispatch(fetchSaveInteraction({ source: "gmu", inn, data }));
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