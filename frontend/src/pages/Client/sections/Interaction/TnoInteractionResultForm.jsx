import { useEffect, useState } from 'react';
import InteractionCard from './TnoInteractionCard.jsx';
import {Container, AddButton, InteractionsList, EmptyState} from './styles.js';
import TnoInteractionForm from "./TnoInteractionForm.jsx";
import TnoInteractionCard from "./TnoInteractionCard.jsx";
import { fetchGetInteractions, fetchSaveInteraction } from "../../../../store/interactionsSlice.js";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ROLES } from "../../../../types.js";

const TnoInteractionResultForm = () => {
    const {inn} = useParams()
    const dispatch = useDispatch();
    const interactions = useSelector((state) => state.interactions.interactions);
    const [isFormOpen, setIsFormOpen] = useState(false); // флаг открыта ли форма
    const [editingId, setEditingId] = useState(null); // Если null значит добавляется новая запись
    const role = useSelector((state) => state.user.role)
    const isUser = role === ROLES.User

    useEffect(() => {
        dispatch(fetchGetInteractions({source: "tno", inn}))
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
        dispatch(fetchSaveInteraction({source: "tno", inn, data}));
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
                    Добавить результат взаимодействия с ТНО
                </AddButton>
            )}

            {isFormOpen && (
                <TnoInteractionForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    initialData={editingId !== null ? interactions.find(({id}) => id === editingId) : null}
                />
            )}
            <InteractionsList>
                {interactions.length > 0 ? (
                    interactions.map(interaction => (
                        <TnoInteractionCard
                            key={interaction.id}
                            data={interaction}
                            onEdit={() => handleEdit(interaction.id)}
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