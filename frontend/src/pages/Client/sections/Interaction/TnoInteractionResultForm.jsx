import { useEffect, useState } from 'react';
import InteractionCard from './TnoInteractionCard.jsx';
import {Container, AddButton, InteractionsList, EmptyState} from './styles.js';
import TnoInteractionForm from "./TnoInteractionForm.jsx";
import TnoInteractionCard from "./TnoInteractionCard.jsx";
import { fetchGetInteractions } from "../../../../store/interactionsSlice.js";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

const TnoInteractionResultForm = () => {
    const {inn} = useParams()
    const dispatch = useDispatch();
    const interactions = useSelector((state) => state.interactions.interactions);
    const [isFormOpen, setIsFormOpen] = useState(false); // флаг открыта ли форма
    const [editingIndex, setEditingIndex] = useState(null); // Если null значит добавляется новая запись

    useEffect(() => {
        dispatch(fetchGetInteractions({source: "tno", inn}))
    }, [])

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
            setInteractions(updatedInteractions); ////////////////////////
        } else {
            setInteractions([...interactions, interactionData]); //////////////////
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